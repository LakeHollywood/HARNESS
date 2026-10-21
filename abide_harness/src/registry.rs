// abide_harness/src/registry.rs — Trusted Splinter Registry
//
// Maps splinter_id byte arrays to their verified Ed25519 public-key
// credentials. This is the caller-side resolver that closes the loop on
// `AnchorManager::verify_docking`: docking telemetry must prove *splinter*
// ownership, so the hub resolves `packet.splinter_id -> public_key` here
// before invoking the crypto gate.
//
// Fail-closed doctrine: an unregistered identity yields `None`, which the
// engine converts into a hard denial (`EngineEvent::DeniedUnregistered`).
// Only identities introduced through `register_trusted` — i.e. provisioned
// out-of-band and already cryptographically vetted — ever resolve.

use std::collections::BTreeMap;

/// A single vetted splinter credential bound to its physical anchor home.
#[derive(Debug, Clone)]
pub struct TrustedSplinter {
    /// The splinter's registered Ed25519 verification key (32 bytes).
    pub public_key: [u8; 32],
    /// Last known-good coordinates recorded at provisioning / redocking time.
    pub home_coordinates: crate::anchor::SpatialCoordinates,
    /// Provisioning epoch (unix seconds) for audit ordering.
    pub enrolled_at: u64,
}

impl TrustedSplinter {
    pub fn new(
        public_key: [u8; 32],
        home_coordinates: crate::anchor::SpatialCoordinates,
        enrolled_at: u64,
    ) -> Self {
        Self {
            public_key,
            home_coordinates,
            enrolled_at,
        }
    }
}

/// Deterministic, trusted lookup table from splinter identity to credential.
///
/// Uses `BTreeMap` rather than `HashMap` so iteration order is stable across
/// platforms — consistent with the crate-wide determinism requirement.
#[derive(Debug, Clone, Default)]
pub struct SplinterRegistry {
    entries: BTreeMap<[u8; 16], TrustedSplinter>,
}

impl SplinterRegistry {
    pub fn new() -> Self {
        Self::default()
    }

    /// Inserts or replaces a trusted credential for `splinter_id`.
    ///
    /// Re-enrollment atomically overwrites the prior key: this doubles as the
    /// key-rotation path. Callers MUST verify the new credential's provenance
    /// before invoking this (the registry itself performs no crypto checks —
    /// trust is established upstream by the provisioning ceremony).
    pub fn register_trusted(&mut self, splinter_id: [u8; 16], splinter: TrustedSplinter) {
        self.entries.insert(splinter_id, splinter);
    }

    /// Hard-revokes a splinter credential. Subsequent lookups return `None`,
    /// forcing every future docking attempt down the fail-closed path even if
    /// the physical node still emits perfectly signed telemetry.
    pub fn revoke(&mut self, splinter_id: &[u8; 16]) -> bool {
        self.entries.remove(splinter_id).is_some()
    }

    /// Trusted resolution of `splinter_id` to its verified credential.
    /// `None` means "not provisioned (or revoked)" — callers must treat this
    /// as denial, never as a default.
    pub fn lookup(&self, splinter_id: &[u8; 16]) -> Option<&TrustedSplinter> {
        self.entries.get(splinter_id)
    }

    /// Convenience: resolve straight to the verification key.
    pub fn public_key_of(&self, splinter_id: &[u8; 16]) -> Option<[u8; 32]> {
        self.lookup(splinter_id).map(|t| t.public_key)
    }

    pub fn len(&self) -> usize {
        self.entries.len()
    }

    pub fn is_empty(&self) -> bool {
        self.entries.is_empty()
    }

    /// Deterministic (ascending id) iteration for audit snapshots.
    pub fn audit_snapshot(&self) -> Vec<([u8; 16], [u8; 32])> {
        self.entries
            .iter()
            .map(|(id, t)| (*id, t.public_key))
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::anchor::SpatialCoordinates;

    fn splinter(id: u8) -> TrustedSplinter {
        TrustedSplinter::new(
            [id; 32],
            SpatialCoordinates::new(341253000, -1184485000, 150000),
            1700000000,
        )
    }

    #[test]
    fn test_lookup_resolves_registered_credential() {
        let mut reg = SplinterRegistry::new();
        reg.register_trusted([2u8; 16], splinter(8));

        assert_eq!(reg.public_key_of(&[2u8; 16]), Some([8u8; 32]));
        let t = reg.lookup(&[2u8; 16]).unwrap();
        assert_eq!(t.enrolled_at, 1700000000);
        assert_eq!(
            t.home_coordinates
                .delta_mm(&SpatialCoordinates::new(341253000, -1184485000, 150000)),
            0
        );
    }

    #[test]
    fn test_unregistered_identity_fails_closed() {
        let reg = SplinterRegistry::new();
        assert!(reg.lookup(&[0u8; 16]).is_none());
        assert!(reg.public_key_of(&[0u8; 16]).is_none());
    }

    #[test]
    fn test_revoke_forces_denial_even_with_valid_keys() {
        let mut reg = SplinterRegistry::new();
        reg.register_trusted([2u8; 16], splinter(8));
        assert!(reg.revoke(&[2u8; 16]));
        assert!(reg.lookup(&[2u8; 16]).is_none());
        // Double revocation is idempotent but reports nothing was removed.
        assert!(!reg.revoke(&[2u8; 16]));
    }

    #[test]
    fn test_re_enrollment_rotates_key_atomically() {
        let mut reg = SplinterRegistry::new();
        reg.register_trusted([2u8; 16], splinter(8));
        reg.register_trusted([2u8; 16], splinter(9)); // rotate
        assert_eq!(reg.public_key_of(&[2u8; 16]), Some([9u8; 32]));
        assert_eq!(reg.len(), 1);
    }

    #[test]
    fn test_audit_snapshot_is_deterministically_ordered() {
        let mut reg = SplinterRegistry::new();
        reg.register_trusted([3u8; 16], splinter(3));
        reg.register_trusted([1u8; 16], splinter(1));
        reg.register_trusted([2u8; 16], splinter(2));
        let snap = reg.audit_snapshot();
        assert_eq!(
            snap.iter().map(|(id, _)| id[0]).collect::<Vec<_>>(),
            vec![1, 2, 3]
        );
    }
}
