// abide_harness/src/crypto.rs
//
// Minimal trait surface required by anchor.rs. No external crates: the
// production Ed25519 verifier plugs in behind this same trait, so the
// spatial/docking logic stays dependency-free and deterministic.

/// Layer-1 cryptographic parity hook consumed by `AnchorManager`.
pub trait AuthorizationVerifier {
    /// Returns true iff `signature` is a valid authentication of `message`
    /// under `public_key`. Implementations MUST be fail-closed: any parse
    /// failure, malformed input, or internal error resolves to `false`.
    fn verify(&self, public_key: &[u8; 32], message: &[u8], signature: &[u8; 64]) -> bool;
}
