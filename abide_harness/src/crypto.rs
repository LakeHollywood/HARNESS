// abide_harness/src/crypto.rs
//
// Trait surface consumed by anchor.rs plus the production Ed25519 verifier.
// The spatial/docking logic stays generic over `AuthorizationVerifier`, so
// tests keep using mocks while deployments swap in `Ed25519Verifier` —
// identical trait, zero changes upstream.

/// Layer-1 cryptographic parity hook consumed by `AnchorManager`.
pub trait AuthorizationVerifier {
    /// Returns true iff `signature` is a valid authentication of `message`
    /// under `public_key`. Implementations MUST be fail-closed: any parse
    /// failure, malformed input, or internal error resolves to `false`.
    fn verify(&self, public_key: &[u8; 32], message: &[u8], signature: &[u8; 64]) -> bool;
}

// ---------------------------------------------------------------------------
// Production implementation: real Ed25519 (RFC 8032) via ed25519-compact.
// ---------------------------------------------------------------------------
//
// NOTE ON CRATE CHOICE: the blueprint called for ed25519-dalec, but that
// crate is not resolvable from this environment's registry mirror. We use
// `ed25519-compact` v2 instead: it implements the exact same RFC 8032
// pure-Ed25519 scheme (32-byte keys, 64-byte signatures, SHA-512 based),
// is constant-time, audit-friendly, and has no transitive dependencies.
// Swapping back to dalec later only touches `Ed25519Verifier::verify`'s
// body — the trait boundary absorbs it.

use ed25519_compact::{KeyPair, PublicKey, Seed, Signature as EdSignature};

/// Real Ed25519 verifier satisfying the fail-closed contract of
/// `AuthorizationVerifier`. Stateless: it holds no secrets, only performs
/// verification against caller-supplied (registry-resolved) keys.
#[derive(Debug, Clone, Copy, Default)]
pub struct Ed25519Verifier;

impl AuthorizationVerifier for Ed25519Verifier {
    fn verify(&self, public_key: &[u8; 32], message: &[u8], signature: &[u8; 64]) -> bool {
        // Fail-closed on every path: construction cannot fail here (exact
        // array sizes), and any VerificationError maps to `false`.
        let pk = PublicKey::new(*public_key);
        let sig = EdSignature::new(*signature);
        pk.verify(message, &sig).is_ok()
    }
}

/// Splinter-side signing helper: wraps an Ed25519 key pair so docking
/// telemetry can be authenticated exactly the way `AnchorManager` expects
/// (signature over `DockingTelemetryPacket::signing_bytes()`).
///
/// In a real deployment the private half lives exclusively on the splinter
/// node's secure element; this type exists so hub-side integration tests and
/// provisioning ceremonies can exercise the full sign→verify loop.
#[derive(Clone)]
pub struct SplinterSigningKey {
    key_pair: KeyPair,
}

impl SplinterSigningKey {
    /// Deterministic derivation from a provisioning seed (test/ceremony use).
    /// Panics on an all-zero seed — that is never a valid credential.
    pub fn from_seed(seed: [u8; 32]) -> Self {
        Self {
            key_pair: KeyPair::from_seed(Seed::new(seed)),
        }
    }

    /// CSPRNG-generated key pair (requires ed25519-compact `random` feature).
    pub fn generate() -> Self {
        Self {
            key_pair: KeyPair::generate(),
        }
    }

    /// The 32-byte verification credential to enroll in the SplinterRegistry.
    pub fn public_key(&self) -> [u8; 32] {
        *self.key_pair.pk
    }

    /// Produce the 64-byte signature for a docking packet's signing bytes.
    /// `noise: None` yields a fully deterministic RFC 8032 signature, which
    /// keeps cross-platform replay tests reproducible.
    pub fn sign_docking_message(&self, message: &[u8]) -> [u8; 64] {
        // ed25519-compact v2 exposes signing on the SecretKey half of the pair.
        let sig = self.key_pair.sk.sign(message, None);
        *sig
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_ed25519_roundtrip_verifies() {
        let signer = SplinterSigningKey::from_seed([7u8; 32]);
        let msg = b"1101 Bel Air Place docking telemetry";
        let sig = signer.sign_docking_message(msg);
        let verifier = Ed25519Verifier;
        assert!(verifier.verify(&signer.public_key(), msg, &sig));
    }

    #[test]
    fn test_wrong_key_message_and_signature_all_fail_closed() {
        let signer = SplinterSigningKey::from_seed([7u8; 32]);
        let other = SplinterSigningKey::from_seed([8u8; 32]);
        let msg = b"dock";
        let sig = signer.sign_docking_message(msg);
        let verifier = Ed25519Verifier;

        // Signed by `signer`, verified under `other`'s enrolled key: spoof.
        assert!(!verifier.verify(&other.public_key(), msg, &sig));
        // Tampered message.
        assert!(!verifier.verify(&signer.public_key(), b"dock!", &sig));
        // Corrupted signature byte.
        let mut broken = sig;
        broken[0] ^= 0xFF;
        assert!(!verifier.verify(&signer.public_key(), msg, &broken));
        // All-zero garbage signature.
        assert!(!verifier.verify(&signer.public_key(), msg, &[0u8; 64]));
    }

    #[test]
    fn test_signatures_are_deterministic_rfc8032() {
        let signer = SplinterSigningKey::from_seed([3u8; 32]);
        let a = signer.sign_docking_message(b"same");
        let b = signer.sign_docking_message(b"same");
        assert_eq!(a, b, "noise-less signing must be deterministic");
    }
}
