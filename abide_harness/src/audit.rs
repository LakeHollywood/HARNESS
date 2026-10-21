// abide_harness/src/audit.rs — Persistent Audit Log for Sovereign Engine Events
//
// Every `EngineEvent` emitted by the quarantine state machine is appended to
// an on-disk, append-only log so that revocation decisions ("why did node X
// lose privileges at time T?") survive process restarts and are reviewable
// by operators.
//
// Integrity model:
//   * Append-only: the writer never rewrites or truncates existing records.
//   * Hash-chained: each record embeds a 64-byte SHA-512 link column binding
//     it to its predecessor (genesis links to a zero digest). The successor's
//     link is computed over `prev_hash || payload_fields` of the record it
//     covers — so the tamper-evident core of record N lives in record N+1's
//     embedded column, outside N's own line. Any edit, splice, or deletion
//     mid-file breaks the chain from that point onward, which `verify_chain`
//     detects deterministically.
//   * Canonical serialization: explicit u8 discriminants and decimal/hex
//     fields — no Rust `Debug`/serde formatting involved — so hub and
//     auditor platforms agree byte-for-byte (crate-wide determinism rule).
//
// No external crates: SHA-512 is implemented here in plain, constant-shape
// code. The log is small enough that clarity beats speed.

use crate::engine::{EngineEvent, EngineState, ExecutionPrivileges, QuarantineReason};
use std::fs::{File, OpenOptions};
use std::io::{BufRead, BufReader, Read, Write};
use std::path::{Path, PathBuf};

// ---------------------------------------------------------------------------
// SHA-512 (FIPS 180-4), minimal private implementation for the hash chain.
// ---------------------------------------------------------------------------

mod sha512 {
    const K: [u64; 80] = [
        0x428a2f98d728ae22, 0x7137449123ef65cd, 0xb5c0fbcfec4d3b2f, 0xe9b5dba58189dbbc,
        0x3956c25bf348b538, 0x59f111f1b605d019, 0x923f82a4af194f9b, 0xab1c5ed5da6d8118,
        0xd807aa1a3b74f906, 0x12835b0145706fbe, 0x243185be4ee4b28c, 0x550c7dc3d5ffb4e2,
        0x72be5d74f27b896f, 0x80deb1fe3b1696b1, 0x9bdc06a725c71235, 0xc19bf174cf692694,
        0xe49b69c19ef14ad2, 0xefbe4786384f25e3, 0x0fc19dc68b825acb, 0x240ca1cc77ac9c65,
        0x2de92c6f592b0275, 0x4a7484aa6ea6e683, 0x5cb0a9dcbd41fbd4, 0x76f988da831153b5,
        0x983e5152ee66dfab, 0xa831c66d2db43210, 0xb00327c898fb213f, 0xbf597fc7beef0ee4,
        0xc6e00bf33da88fc2, 0xd5a79147930aa725, 0x06ca6351e003826f, 0x142929670a0e6e70,
        0x27b70a8546d22ffc, 0x2e1b21385c26c926, 0x4d2c6dfc5ac42aed, 0x53380d139d89b89f,
        0x650a73548baf63de, 0x766a0abb3c77b2a8, 0x81c197fd04704a36, 0x92722c851482353b,
        0xa2bfe8a14cf10364, 0xa81a664bbc423001, 0xc24b8b70d0f89791, 0xc76c51a30654be30,
        0xd192e819d7689991, 0xd699062455fe72eb, 0xf40e35855771202a, 0x106aa07032bbd1b8,
        0x19a4c116b8d2d0c8, 0x1e376c085141ab53, 0x2748774cdf8eeb99, 0x34b0bcb5e19b48a8,
        0x391c0cb3c5c95a63, 0x4ed8aa4ae3418acb, 0x5b9cca4f7763e373, 0x682bf964d6da7f03,
        0x748f82ee5defb2fc, 0x78a5636f43172f60, 0x84c878141a9f4aec, 0x8cc702081a6439ec,
        0x90befffa3209eb4e, 0xa4506cebde82bce9, 0xbef9a3f7b2c67915, 0xc67178f2e372532b,
        0xca273eceea26619c, 0xd186b8c721c0c207, 0xeada7dd6cde0eb1e, 0xf57d4f7fee6ed178,
        0x06f067aa72176fba, 0x0a637dc5a2c898fb, 0x113f9804bef90dae, 0x1b710b35131c471b,
        0x28db77f523047d84, 0x32caab7140c1834c, 0x3c9ebe0a15c9bebc, 0x431d67c49c100d4c,
        0x4cc5d4becb3e42b6, 0x597f299cfc657e2a, 0x5fcb6fab3ad6faec, 0x6c44d7be88a46a6b,
    ];

    const H0: [u64; 8] = [
        0x6a09e667f3bcc908,
        0xbb67ae8584caa73b,
        0x3c6ef372fe94f82b,
        0xa54ff53a5f1d36f1,
        0x510e527fade682d1,
        0x9b05688c2b3e6c1f,
        0x1f83d9abfb41bd6b,
        0x5be0cd19137e2179,
    ];

    pub fn hash(message: &[u8]) -> [u8; 64] {
        // Padding: 0x80, zeros, then 128-bit big-endian bit length.
        let bit_len = (message.len() as u128) * 8;
        let mut data = message.to_vec();
        data.push(0x80);
        // If the byte 0x80 already landed at position 112 of its block, the
        // 128-bit length field does not fit: roll into a fresh block.
        if data.len() % 128 == 112 {
            data.extend_from_slice(&[0u8; 128]);
        }
        while data.len() % 128 != 112 {
            data.push(0);
        }
        data.extend_from_slice(&bit_len.to_be_bytes());

        let mut h = H0;
        for block in data.chunks_exact(128) {
            let mut w = [0u64; 80];
            for i in 0..16 {
                w[i] = u64::from_be_bytes(block[i * 8..i * 8 + 8].try_into().unwrap());
            }
            for i in 16..80 {
                // FIPS 180-4 6.4.1 / Table 4:
                //   W[t] = theta1(W[t-2]) + W[t-7] + theta0(W[t-15]) + W[t-16]
                // where theta0 uses ROTR(1)^ROTR(8)^SHR(7) and theta1 uses
                // ROTR(19)^ROTR(61)^SHR(6). The two shifts are SHR — logical
                // right shifts that fill with zeros — not rotations.
                let x = w[i - 15];
                let theta0 =
                    x.rotate_right(1) ^ x.rotate_right(8) ^ (x >> 7);
                let y = w[i - 2];
                let theta1 =
                    y.rotate_right(19) ^ y.rotate_right(61) ^ (y >> 6);
                w[i] = theta1
                    .wrapping_add(w[i - 7])
                    .wrapping_add(theta0)
                    .wrapping_add(w[i - 16]);
            }
            let (mut a, mut b, mut c, mut d, mut e, mut f, mut g, mut hh) =
                (h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7]);
            for i in 0..80 {
                // FIPS 180-4 6.4.2: Sigma1/Sigma0 use ROTATE (not SHR), so
                // every bit of the word participates in both rotations.
                let big_s1 = e.rotate_right(14) ^ e.rotate_right(18) ^ e.rotate_right(41);
                let ch = (e & f) ^ ((!e) & g);
                // Sigma-0 and Maj use the PRE-ROUND values of a/b/c: capture
                // them before any register is rotated.
                let big_s0 = a.rotate_right(28) ^ a.rotate_right(34) ^ a.rotate_right(39);
                let maj = (a & b) ^ (a & c) ^ (b & c);
                let t1 = hh
                    .wrapping_add(big_s1)
                    .wrapping_add(ch)
                    .wrapping_add(K[i])
                    .wrapping_add(w[i]);
                let t2 = big_s0.wrapping_add(maj);
                let new_a = t1.wrapping_add(t2);
                // Full register rotation per FIPS 180-4 6.4.2 step 13:
                // h<-g, g<-f, f<-e, e<-d+t1, d<-c, c<-b, b<-a, a<-T1+T2.
                hh = g;
                g = f;
                f = e;
                e = d.wrapping_add(t1);
                d = c;
                c = b;
                b = a;
                a = new_a;
            }
            // Davies-Meyer feedforward against the BLOCK's initial vector,
            // not the running state (FIPS 180-4 6.4.2 step 3): snapshot the
            // round inputs before compressing, add them back afterwards.
            let (v0, v1, v2, v3, v4, v5, v6, v7) = (h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7]);
            h[0] = v0.wrapping_add(a);
            h[1] = v1.wrapping_add(b);
            h[2] = v2.wrapping_add(c);
            h[3] = v3.wrapping_add(d);
            h[4] = v4.wrapping_add(e);
            h[5] = v5.wrapping_add(f);
            h[6] = v6.wrapping_add(g);
            h[7] = v7.wrapping_add(hh);
        }

        let mut out = [0u8; 64];
        for i in 0..8 {
            out[i * 8..i * 8 + 8].copy_from_slice(&h[i].to_be_bytes());
        }
        out
    }
}

/// Chain-root digest for the first record ever written.
pub const GENESIS_PREV_HASH: [u8; 64] = [0u8; 64];

// ---------------------------------------------------------------------------
// Canonical record encoding
// ---------------------------------------------------------------------------

fn state_discriminant(s: EngineState) -> u8 {
    match s {
        EngineState::Standby => 0,
        EngineState::Operational => 1,
        EngineState::Quarantined => 2,
        EngineState::LockedDown => 3,
    }
}

fn reason_discriminant(r: QuarantineReason) -> u8 {
    match r {
        QuarantineReason::None => 0,
        QuarantineReason::DriftViolation => 1,
        QuarantineReason::TemporalSkew => 2,
        QuarantineReason::SignatureSpoofing => 3,
        QuarantineReason::HubMismatch => 4,
        QuarantineReason::UnregisteredSplinter => 5,
        QuarantineReason::AuditFailure => 6,
    }
}

fn privileges_discriminant(p: ExecutionPrivileges) -> u8 {
    match p {
        ExecutionPrivileges::Sovereign => 0,
        ExecutionPrivileges::Degraded => 1,
        ExecutionPrivileges::Revoked => 2,
    }
}

impl EngineEvent {
    /// Deterministic 4-byte canonical body (explicit discriminants, stable
    /// across Rust versions and platforms — required for cross-checksumming).
    pub fn canonical_bytes(&self) -> [u8; 4] {
        [
            state_discriminant(self.previous_state),
            state_discriminant(self.new_state),
            reason_discriminant(self.reason),
            privileges_discriminant(self.privileges),
        ]
    }
}

/// One line in the audit log: sequence number, wall-clock epoch seconds, the
/// event payload, the splinter identity under evaluation (when known), and
/// the chaining digest over everything before it.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AuditRecord {
    pub seq: u64,
    pub timestamp_epoch_seconds: u64,
    pub splinter_id: Option<[u8; 16]>,
    pub event: EngineEvent,
    /// SHA-512 of the previous record's canonical line bytes (or genesis).
    pub prev_hash: [u8; 64],
}

impl AuditRecord {
    /// Canonical single-line encoding used both for persistence and hashing:
    /// `seq|ts|splinter_hex_or_dash|prev_state|new_state|reason|privileges|prev_hash_hex`
    /// followed by the trailing newline that terminates the line on disk.
    pub fn line_bytes(&self) -> Vec<u8> {
        let splinter = match self.splinter_id {
            Some(id) => hex_encode(&id),
            None => "-".to_string(),
        };
        format!(
            "{}|{}|{}|{}|{}|{}|{}|{}\n",
            self.seq,
            self.timestamp_epoch_seconds,
            splinter,
            state_discriminant(self.event.previous_state),
            state_discriminant(self.event.new_state),
            reason_discriminant(self.event.reason),
            privileges_discriminant(self.event.privileges),
            hex_encode(&self.prev_hash),
        )
        .into_bytes()
    }

    /// Digest binding the NEXT record to this one: SHA-512 over
    /// `this.prev_hash || this.payload_fields()`. The writer computes it
    /// after appending and stores it as the NEXT record's embedded
    /// `prev_hash` column. Because that column lives OUTSIDE this record's
    /// own line, an attacker who edits any field of this record cannot fix
    /// the linkage by rewriting this line alone — the next record's embedded
    /// digest will no longer match, and `verify_chain` flags the successor.
    fn chaining_digest(&self) -> [u8; 64] {
        let mut buf = Vec::with_capacity(64 + 128);
        buf.extend_from_slice(&self.prev_hash);
        buf.extend_from_slice(&self.payload_fields());
        sha512::hash(&buf)
    }

    /// The tamper-evident core of the record: everything except the embedded
    /// prev_hash column itself.
    fn payload_fields(&self) -> Vec<u8> {
        let splinter = match self.splinter_id {
            Some(id) => hex_encode(&id),
            None => "-".to_string(),
        };
        format!(
            "{}|{}|{}|{}|{}|{}|{}",
            self.seq,
            self.timestamp_epoch_seconds,
            splinter,
            state_discriminant(self.event.previous_state),
            state_discriminant(self.event.new_state),
            reason_discriminant(self.event.reason),
            privileges_discriminant(self.event.privileges),
        )
        .into_bytes()
    }
}

fn hex_encode(bytes: &[u8]) -> String {
    const DIGITS: &[u8; 16] = b"0123456789abcdef";
    let mut s = String::with_capacity(bytes.len() * 2);
    for b in bytes {
        s.push(DIGITS[(b >> 4) as usize] as char);
        s.push(DIGITS[(b & 0x0f) as usize] as char);
    }
    s
}

/// Verdict from `AuditLog::verify_chain`.
#[derive(Debug, PartialEq, Eq)]
pub enum ChainVerdict {
    /// Every record's embedded prev_hash matches the recomputed chain.
    Intact { records: u64 },
    /// Record index `at` (0-based) does not link to its predecessor.
    BrokenAt { at: u64, expected: u64 },
}

// ---------------------------------------------------------------------------
// The persistent sink
// ---------------------------------------------------------------------------

/// Append-only, hash-chained audit log persisted at a filesystem path.
///
/// `open` creates the file if missing; reopening an existing log resumes the
/// chain from its tail without rewriting anything already durable.
pub struct AuditLog {
    path: PathBuf,
    file: File,
    next_seq: u64,
    head_hash: [u8; 64],
}

impl AuditLog {
    pub fn open<P: AsRef<Path>>(path: P) -> std::io::Result<Self> {
        let path = path.as_ref().to_path_buf();
        // Touch the file first so a fresh log exists on disk (append-only fd
        // cannot create); replay below then sees exactly what is durable.
        if !path.exists() {
            if let Some(parent) = path.parent() {
                if !parent.as_os_str().is_empty() {
                    std::fs::create_dir_all(parent)?;
                }
            }
            File::create(&path)?.sync_all()?;
        }
        let file = OpenOptions::new().read(true).append(true).open(&path)?;

        let mut next_seq = 0u64;
        let mut head_hash = GENESIS_PREV_HASH;

        {
            // Replay the tail to recover chain state. We read via a separate
            // handle because the main one is append-only positioned at EOF.
            let mut reader = File::open(&path)?;
            let mut contents = String::new();
            reader.read_to_string(&mut contents)?;
            for line in BufReader::new(contents.as_bytes()).lines() {
                let line = line?;
                if line.is_empty() {
                    continue;
                }
                let rec = parse_line(&line).ok_or_else(|| {
                    std::io::Error::new(
                        std::io::ErrorKind::InvalidData,
                        format!("corrupt audit line: {line}"),
                    )
                })?;
                // Validate linkage as we replay: refuse to append onto a
                // broken chain rather than silently extending tampered data.
                if rec.prev_hash != head_hash {
                    return Err(std::io::Error::new(
                        std::io::ErrorKind::InvalidData,
                        "audit chain broken: refusing to append to tampered log",
                    ));
                }
                head_hash = rec.chaining_digest();
                next_seq = rec.seq + 1;
            }
        }

        Ok(Self {
            path,
            file,
            next_seq,
            head_hash,
        })
    }

    /// Append one engine event. `timestamp_epoch_seconds` is injected by the
    /// caller (hub clock) instead of read internally — keeps tests fully
    /// deterministic and lets the hub stamp events with its trusted time.
    pub fn append(
        &mut self,
        event: &EngineEvent,
        splinter_id: Option<[u8; 16]>,
        timestamp_epoch_seconds: u64,
    ) -> std::io::Result<AuditRecord> {
        let record = AuditRecord {
            seq: self.next_seq,
            timestamp_epoch_seconds,
            splinter_id,
            event: *event,
            prev_hash: self.head_hash,
        };
        // Single write of the full line; append-mode fd guarantees atomic
        // positioning at EOF on POSIX. fsync per record: durability before
        // the caller acts on the event (fail-closed philosophy).
        self.file.write_all(&record.line_bytes())?;
        self.file.flush()?;
        self.file.sync_all()?;
        self.head_hash = record.chaining_digest();
        self.next_seq += 1;
        Ok(record)
    }

    /// Re-read the whole file and verify the hash chain end-to-end. Detects
    /// edits, deletions, splices, and reordering of any historical record.
    pub fn verify_chain<P: AsRef<Path>>(path: P) -> std::io::Result<ChainVerdict> {
        let mut reader = File::open(path)?;
        let mut contents = String::new();
        reader.read_to_string(&mut contents)?;

        let mut expected_prev = GENESIS_PREV_HASH;
        let mut expected_seq = 0u64;
        let mut count = 0u64;
        for line in BufReader::new(contents.as_bytes()).lines() {
            let line = line?;
            if line.is_empty() {
                continue;
            }
            let Some(rec) = parse_line(&line) else {
                return Ok(ChainVerdict::BrokenAt {
                    at: count,
                    expected: expected_seq,
                });
            };
            if rec.seq != expected_seq || rec.prev_hash != expected_prev {
                return Ok(ChainVerdict::BrokenAt {
                    at: count,
                    expected: expected_seq,
                });
            }
            expected_prev = rec.chaining_digest();
            expected_seq += 1;
            count += 1;
        }
        Ok(ChainVerdict::Intact { records: count })
    }

    pub fn path(&self) -> &Path {
        &self.path
    }

    pub fn next_seq(&self) -> u64 {
        self.next_seq
    }
}

/// Parse one canonical line back into a full record, including the embedded
/// prev_hash column (needed for chain verification and replay).
fn parse_line(line: &str) -> Option<AuditRecord> {
    let line = line.strip_suffix('\n').unwrap_or(line);
    let parts: Vec<&str> = line.split('|').collect();
    if parts.len() != 8 {
        return None;
    }
    let seq = parts[0].parse().ok()?;
    let ts = parts[1].parse().ok()?;
    let splinter_id = if parts[2] == "-" {
        None
    } else {
        let raw = hex_decode(parts[2])?;
        if raw.len() != 16 {
            return None;
        }
        let mut id = [0u8; 16];
        id.copy_from_slice(&raw);
        Some(id)
    };
    let previous_state = state_from_discriminant(parts[3].parse().ok()?)?;
    let new_state = state_from_discriminant(parts[4].parse().ok()?)?;
    let reason = reason_from_discriminant(parts[5].parse().ok()?)?;
    let privileges = privileges_from_discriminant(parts[6].parse().ok()?)?;
    let prev_raw = hex_decode(parts[7])?;
    if prev_raw.len() != 64 {
        return None;
    }
    let mut prev_hash = [0u8; 64];
    prev_hash.copy_from_slice(&prev_raw);
    Some(AuditRecord {
        seq,
        timestamp_epoch_seconds: ts,
        splinter_id,
        event: EngineEvent {
            previous_state,
            new_state,
            reason,
            privileges,
        },
        prev_hash,
    })
}

fn hex_decode(s: &str) -> Option<Vec<u8>> {
    if s.len() % 2 != 0 {
        return None;
    }
    let bytes = s.as_bytes();
    let mut out = Vec::with_capacity(bytes.len() / 2);
    for pair in bytes.chunks(2) {
        let hi = (pair[0] as char).to_digit(16)?;
        let lo = (pair[1] as char).to_digit(16)?;
        out.push(((hi << 4) | lo) as u8);
    }
    Some(out)
}

fn state_from_discriminant(d: u8) -> Option<EngineState> {
    Some(match d {
        0 => EngineState::Standby,
        1 => EngineState::Operational,
        2 => EngineState::Quarantined,
        3 => EngineState::LockedDown,
        _ => return None,
    })
}

fn reason_from_discriminant(d: u8) -> Option<QuarantineReason> {
    Some(match d {
        0 => QuarantineReason::None,
        1 => QuarantineReason::DriftViolation,
        2 => QuarantineReason::TemporalSkew,
        3 => QuarantineReason::SignatureSpoofing,
        4 => QuarantineReason::HubMismatch,
        5 => QuarantineReason::UnregisteredSplinter,
        6 => QuarantineReason::AuditFailure,
        _ => return None,
    })
}

fn privileges_from_discriminant(d: u8) -> Option<ExecutionPrivileges> {
    Some(match d {
        0 => ExecutionPrivileges::Sovereign,
        1 => ExecutionPrivileges::Degraded,
        2 => ExecutionPrivileges::Revoked,
        _ => return None,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::engine::{EngineState, ExecutionPrivileges, QuarantineReason};

    fn sample_event() -> EngineEvent {
        EngineEvent {
            previous_state: EngineState::Operational,
            new_state: EngineState::LockedDown,
            reason: QuarantineReason::SignatureSpoofing,
            privileges: ExecutionPrivileges::Revoked,
        }
    }

    fn temp_path(tag: &str) -> PathBuf {
        let mut p = std::env::temp_dir();
        p.push(format!(
            "abide_audit_{}_{}_{}",
            tag,
            std::process::id(),
            uuid_like_seed()
        ));
        p
    }

    fn uuid_like_seed() -> u64 {
        // Cheap uniqueness: nanos since epoch XOR pid. Tests clean up anyway.
        use std::time::{SystemTime, UNIX_EPOCH};
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos() as u64
            ^ ((std::process::id() as u64) << 32)
    }

    #[test]
    fn test_sha512_known_vectors() {
        // FIPS 180-4 sanity: empty string and "abc".
        let empty = sha512::hash(b"");
        assert_eq!(
            hex_encode(&empty),
            "cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce\
             47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e"
        );
        let abc = sha512::hash(b"abc");
        assert_eq!(
            hex_encode(&abc),
            "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a\
             2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f"
        );
    }

    #[test]
    fn test_append_and_verify_intact_chain() {
        let path = temp_path("intact");
        {
            let mut log = AuditLog::open(&path).unwrap();
            let e = sample_event();
            log.append(&e, Some([2u8; 16]), 1700000000).unwrap();
            log.append(&e, None, 1700000001).unwrap();
            log.append(&e, Some([3u8; 16]), 1700000002).unwrap();
            assert_eq!(log.next_seq(), 3);
        }
        assert_eq!(
            AuditLog::verify_chain(&path).unwrap(),
            ChainVerdict::Intact { records: 3 }
        );
        std::fs::remove_file(&path).ok();
    }

    #[test]
    fn test_reopen_resumes_chain_without_rewrite() {
        let path = temp_path("reopen");
        {
            let mut log = AuditLog::open(&path).unwrap();
            log.append(&sample_event(), Some([1u8; 16]), 100).unwrap();
        }
        {
            let mut log = AuditLog::open(&path).unwrap();
            assert_eq!(log.next_seq(), 1);
            log.append(&sample_event(), Some([1u8; 16]), 101).unwrap();
        }
        assert_eq!(
            AuditLog::verify_chain(&path).unwrap(),
            ChainVerdict::Intact { records: 2 }
        );
        std::fs::remove_file(&path).ok();
    }

    #[test]
    fn test_tampered_record_breaks_chain_detection() {
        let path = temp_path("tamper");
        {
            let mut log = AuditLog::open(&path).unwrap();
            log.append(&sample_event(), Some([1u8; 16]), 100).unwrap();
            log.append(&sample_event(), Some([1u8; 16]), 101).unwrap();
            log.append(&sample_event(), Some([1u8; 16]), 102).unwrap();
        }
        // Attacker rewrites record 1's payload (flip LockedDown->Operational
        // discriminant in the new_state column).
        let contents = std::fs::read_to_string(&path).unwrap();
        let lines: Vec<&str> = contents.lines().collect();
        let forged = lines[1].replace("|1|3|", "|1|1|");
        assert_ne!(forged, lines[1], "fixture must actually change");
        std::fs::write(&path, format!("{}\n{}\n{}\n", lines[0], forged, lines[2])).unwrap();

        // The forged payload changes record 1's chaining digest, which is
        // embedded in record 2's prev_hash column: detection lands at index 2.
        assert_eq!(
            AuditLog::verify_chain(&path).unwrap(),
            ChainVerdict::BrokenAt { at: 2, expected: 2 }
        );
        // Fail-closed append: reopening a tampered log refuses writes.
        assert!(AuditLog::open(&path).is_err());
        std::fs::remove_file(&path).ok();
    }

    #[test]
    fn test_relink_around_edit_attack_detected() {
        // Stronger adversary: edits record 1 AND rewrites its own prev_hash
        // column to relink it to record 0. Because the chaining digest covers
        // the payload (not just the relinkable column), record 2's embedded
        // prev_hash no longer matches — chain still breaks at index 2.
        let path = temp_path("relink");
        {
            let mut log = AuditLog::open(&path).unwrap();
            for t in 0..3u64 {
                log.append(&sample_event(), Some([1u8; 16]), 300 + t).unwrap();
            }
        }
        let contents = std::fs::read_to_string(&path).unwrap();
        let lines: Vec<&str> = contents.lines().collect();
        // Forged line: flipped state columns + prev_hash column copied from
        // line 1's own embedded digest (= record 0's chaining digest), i.e.
        // relinked straight onto record 0. The payload columns are the ones
        // an auditor would read, so those are what we forge.
        let payload: Vec<&str> = lines[1].split('|').collect();
        let forged = format!(
            "{}|{}|{}|{}|{}|{}|{}|{}",
            payload[0],
            payload[1],
            payload[2],
            payload[3],
            1, // Operational instead of LockedDown
            payload[5],
            0, // Sovereign instead of Revoked
            payload[7],
        );
        std::fs::write(&path, format!("{}\n{}\n{}\n", lines[0], forged, lines[2])).unwrap();

        assert_eq!(
            AuditLog::verify_chain(&path).unwrap(),
            ChainVerdict::BrokenAt { at: 2, expected: 2 }
        );
        std::fs::remove_file(&path).ok();
    }

    #[test]
    fn test_deleted_middle_record_detected() {
        let path = temp_path("splice");
        {
            let mut log = AuditLog::open(&path).unwrap();
            for t in 0..4u64 {
                log.append(&sample_event(), Some([t as u8; 16]), 200 + t).unwrap();
            }
        }
        let contents = std::fs::read_to_string(&path).unwrap();
        let lines: Vec<&str> = contents.lines().collect();
        // Drop record 2 entirely.
        std::fs::write(
            &path,
            format!("{}\n{}\n{}\n", lines[0], lines[1], lines[3]),
        )
        .unwrap();
        assert!(matches!(
            AuditLog::verify_chain(&path).unwrap(),
            ChainVerdict::BrokenAt { at: 2, .. }
        ));
        std::fs::remove_file(&path).ok();
    }

    #[test]
    fn test_canonical_encoding_roundtrip_via_parse() {
        let rec = AuditRecord {
            seq: 7,
            timestamp_epoch_seconds: 999,
            splinter_id: Some([0xABu8; 16]),
            event: sample_event(),
            prev_hash: GENESIS_PREV_HASH,
        };
        let line = String::from_utf8(rec.line_bytes()).unwrap();
        let back = parse_line(&line).unwrap();
        assert_eq!(back.seq, 7);
        assert_eq!(back.timestamp_epoch_seconds, 999);
        assert_eq!(back.splinter_id, Some([0xABu8; 16]));
        assert_eq!(back.event, sample_event());
        // Unknown-splinter sentinel round-trips too.
        let none_rec = AuditRecord {
            splinter_id: None,
            ..rec.clone()
        };
        let parsed =
            parse_line(&String::from_utf8(none_rec.line_bytes()).unwrap()).unwrap();
        assert_eq!(parsed.splinter_id, None);
    }
}
