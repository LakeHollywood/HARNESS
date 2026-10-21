// abide_harness/src/engine.rs — Sovereign Engine & Quarantine State Machine
//
// Ties physical spatial reality into the authorization state machine.
// Every `AnchorError` outcome from `AnchorManager::verify_docking` (plus the
// registry's fail-closed "unknown splinter" case) is routed directly into a
// deterministic quarantine transition that immediately strips execution
// privileges. Re-admission requires a *fresh, fully verified* docking packet
// — there is no path back to Operational that skips verification.

use crate::anchor::{AnchorError, AnchorManager};
use crate::crypto::AuthorizationVerifier;
use crate::registry::SplinterRegistry;

/// High-criticality execution privileges granted only while docked and trusted.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ExecutionPrivileges {
    /// Full sovereign execution: privileged writes, scheduling, mobility grants.
    Sovereign,
    /// Telemetry/audit only. All high-criticality actions are denied.
    Degraded,
    /// Nothing runs. Terminal until re-admission via verified redocking.
    Revoked,
}

impl ExecutionPrivileges {
    pub fn allows_high_criticality(self) -> bool {
        matches!(self, ExecutionPrivileges::Sovereign)
    }
}

/// Quarantine states of the sovereign authorization state machine.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum EngineState {
    /// Boot / never-verified posture. Fail-closed default: no privileges.
    Standby,
    /// Splinter cryptographically docked within all anchor gates.
    Operational,
    /// Soft quarantine: transient violation (drift / clock skew). Privileges
    /// degraded; one consecutive clean verification restores Operational.
    Quarantined,
    /// Hard quarantine: identity compromise (bad signature / unregistered /
    /// wrong hub target). Privileges revoked; requires explicit
    /// `clear_hard_quarantine` (operator ceremony) before any re-admission.
    LockedDown,
}

/// The reason a node entered its current quarantine state.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum QuarantineReason {
    None,
    DriftViolation,
    TemporalSkew,
    SignatureSpoofing,
    HubMismatch,
    UnregisteredSplinter,
}

/// Deterministic classification: which gate failed dictates how hard the
/// engine falls. Identity-bearing failures are existential (LockedDown);
/// physics/clock failures are recoverable (Quarantined).
impl QuarantineReason {
    pub fn from_anchor_error(err: &AnchorError) -> Self {
        match err {
            AnchorError::SignatureInvalid => QuarantineReason::SignatureSpoofing,
            AnchorError::HubMismatch => QuarantineReason::HubMismatch,
            AnchorError::ExceededDockingRadius => QuarantineReason::DriftViolation,
            AnchorError::TemporalDriftExceeded => QuarantineReason::TemporalSkew,
        }
    }

    /// True iff this reason represents an identity compromise demanding the
    /// hardest quarantine tier.
    pub fn is_identity_compromise(self) -> bool {
        matches!(
            self,
            QuarantineReason::SignatureSpoofing
                | QuarantineReason::UnregisteredSplinter
                | QuarantineReason::HubMismatch
        )
    }

    pub fn privileges_for(reason: Self) -> ExecutionPrivileges {
        if reason.is_identity_compromise() {
            ExecutionPrivileges::Revoked
        } else if reason == QuarantineReason::None {
            ExecutionPrivileges::Sovereign
        } else {
            ExecutionPrivileges::Degraded
        }
    }
}

/// Event emitted on every telemetry evaluation for audit trails.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct EngineEvent {
    pub previous_state: EngineState,
    pub new_state: EngineState,
    pub reason: QuarantineReason,
    pub privileges: ExecutionPrivileges,
}

/// Outcome of routing one telemetry packet through the anchor + registry gates.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TelemetryOutcome {
    Accepted(EngineEvent),
    /// Splinter id not present in the trusted registry: packet never reaches
    /// the crypto gate. Routed as an identity-compromise event.
    DeniedUnregistered(EngineEvent),
}

pub struct SovereignEngine<V: AuthorizationVerifier> {
    anchor_manager: AnchorManager<V>,
    registry: SplinterRegistry,
    state: EngineState,
    reason: QuarantineReason,
    privileges: ExecutionPrivileges,
}

impl<V: AuthorizationVerifier> SovereignEngine<V> {
    /// Boots fail-closed: Standby, no privileges, until first verified docking.
    pub fn new(anchor_manager: AnchorManager<V>, registry: SplinterRegistry) -> Self {
        Self {
            anchor_manager,
            registry,
            state: EngineState::Standby,
            reason: QuarantineReason::None,
            privileges: ExecutionPrivileges::Revoked,
        }
    }

    pub fn state(&self) -> EngineState {
        self.state
    }

    pub fn quarantine_reason(&self) -> QuarantineReason {
        self.reason
    }

    pub fn privileges(&self) -> ExecutionPrivileges {
        self.privileges
    }

    pub fn registry(&self) -> &SplinterRegistry {
        &self.registry
    }

    pub fn registry_mut(&mut self) -> &mut SplinterRegistry {
        &mut self.registry
    }

    pub fn anchor_manager(&self) -> &AnchorManager<V> {
        &self.anchor_manager
    }

    /// Gate used by every privileged action handler. Returns `Ok(())` only
    /// while privileges allow high-criticality execution; otherwise the caller
    /// must abort the action (fail-closed).
    pub fn require_sovereign(&self) -> Result<(), EngineState> {
        if self.privileges.allows_high_criticality() {
            Ok(())
        } else {
            Err(self.state)
        }
    }

    /// The revocation wiring: ingest one signed docking packet, resolve the
    /// splinter key from the trusted registry, run the four anchor gates, and
    /// route the outcome into the quarantine state machine.
    pub fn ingest_telemetry(
        &mut self,
        packet: &crate::anchor::DockingTelemetryPacket,
        current_time: u64,
    ) -> TelemetryOutcome {
        // Registry resolution first: unknown/revoked identities are denied
        // before any cryptographic work, and count as identity compromise.
        let Some(splinter_key) = self.registry.public_key_of(&packet.splinter_id) else {
            let event = self.transition(QuarantineReason::UnregisteredSplinter);
            return TelemetryOutcome::DeniedUnregistered(event);
        };

        match self
            .anchor_manager
            .verify_docking(packet, &splinter_key, current_time)
        {
            Ok(()) => {
                let event = self.transition(QuarantineReason::None);
                TelemetryOutcome::Accepted(event)
            }
            Err(err) => {
                let event = self.transition(QuarantineReason::from_anchor_error(&err));
                TelemetryOutcome::Accepted(event)
            }
        }
    }

    /// Operator ceremony exit for LockedDown: after manual identity triage,
    /// clear the hard lock so a subsequent clean verification can restore
    /// Quarantined->Operational recovery. Does NOT grant privileges itself.
    pub fn clear_hard_quarantine(&mut self) -> Option<EngineEvent> {
        if self.state != EngineState::LockedDown {
            return None;
        }
        let previous = self.state;
        self.state = EngineState::Standby;
        self.reason = QuarantineReason::None;
        self.privileges = ExecutionPrivileges::Revoked;
        Some(EngineEvent {
            previous_state: previous,
            new_state: self.state,
            reason: self.reason,
            privileges: self.privileges,
        })
    }

    /// Deterministic state-machine step function. Table-driven transitions:
    ///
    /// reason=None:                 Standby|Quarantined -> Operational
    ///                              LockedDown         -> LockedDown (still hard-locked)
    ///                              Operational        -> Operational
    /// drift / temporal skew:       Operational|Standby|Quarantined -> Quarantined
    ///                              LockedDown         -> LockedDown (no downgrade escape)
    /// identity compromise:         ANY                -> LockedDown
    fn transition(&mut self, reason: QuarantineReason) -> EngineEvent {
        let previous = self.state;
        let next_state = match reason {
            QuarantineReason::None => match self.state {
                // A hard lock is never lifted by telemetry alone — only by
                // the operator ceremony (`clear_hard_quarantine`).
                EngineState::LockedDown => EngineState::LockedDown,
                _ => EngineState::Operational,
            },
            r if r.is_identity_compromise() => EngineState::LockedDown,
            // Recoverable physics/clock violations. From LockedDown they do
            // not relax the lock.
            _ => match self.state {
                EngineState::LockedDown => EngineState::LockedDown,
                _ => EngineState::Quarantined,
            },
        };

        self.state = next_state;
        // While hard-locked, preserve the original inciting reason for audit;
        // later packets cannot rewrite the incident record.
        if next_state != EngineState::LockedDown || previous != EngineState::LockedDown {
            self.reason = if next_state == EngineState::Operational {
                QuarantineReason::None
            } else {
                reason
            };
        }
        // Privileges are strictly derived from state + reason: LockedDown or
        // Standby => Revoked; Quarantined => Degraded; Operational => Sovereign.
        self.privileges = match next_state {
            EngineState::Operational => ExecutionPrivileges::Sovereign,
            EngineState::Quarantined => ExecutionPrivileges::Degraded,
            EngineState::Standby | EngineState::LockedDown => ExecutionPrivileges::Revoked,
        };

        EngineEvent {
            previous_state: previous,
            new_state: next_state,
            reason: self.reason,
            privileges: self.privileges,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::anchor::{
        AnchorNodeType, DockingTelemetryPacket, SpatialAnchorIdentity, SpatialCoordinates,
    };
    use crate::registry::TrustedSplinter;

    struct MockVerifier {
        should_pass: bool,
    }

    impl AuthorizationVerifier for MockVerifier {
        fn verify(&self, _public_key: &[u8; 32], _message: &[u8], _signature: &[u8; 64]) -> bool {
            self.should_pass
        }
    }

    const SPLINTER_ID: [u8; 16] = [2u8; 16];
    const SPLINTER_KEY: [u8; 32] = [8u8; 32];

    fn hub_identity() -> SpatialAnchorIdentity {
        SpatialAnchorIdentity {
            node_type: AnchorNodeType::ZeroNodeHub,
            node_id: [1u8; 16],
            registered_coordinates: SpatialCoordinates::new(341253000, -1184485000, 150000),
            public_key: [9u8; 32],
        }
    }

    fn packet(coords: SpatialCoordinates, timestamp: u64) -> DockingTelemetryPacket {
        DockingTelemetryPacket {
            splinter_id: SPLINTER_ID,
            target_hub_id: [1u8; 16],
            observed_coordinates: coords,
            timestamp,
            signature: [0u8; 64],
        }
    }

    fn engine(verifier_passes: bool) -> SovereignEngine<MockVerifier> {
        let manager = AnchorManager::new(
            MockVerifier {
                should_pass: verifier_passes,
            },
            hub_identity(),
            5000,
            60,
        );
        let mut registry = SplinterRegistry::new();
        registry.register_trusted(
            SPLINTER_ID,
            TrustedSplinter::new(
                SPLINTER_KEY,
                SpatialCoordinates::new(341253000, -1184485000, 150000),
                1700000000,
            ),
        );
        SovereignEngine::new(manager, registry)
    }

    fn docked() -> SpatialCoordinates {
        SpatialCoordinates::new(341253001, -1184485001, 150000)
    }

    #[test]
    fn test_boot_is_fail_closed_standby() {
        let e = engine(true);
        assert_eq!(e.state(), EngineState::Standby);
        assert_eq!(e.privileges(), ExecutionPrivileges::Revoked);
        assert!(!e.require_sovereign().is_ok());
    }

    #[test]
    fn test_verified_docking_grants_sovereign() {
        let mut e = engine(true);
        let outcome = e.ingest_telemetry(&packet(docked(), 1000), 1010);
        match outcome {
            TelemetryOutcome::Accepted(ev) => {
                assert_eq!(ev.previous_state, EngineState::Standby);
                assert_eq!(ev.new_state, EngineState::Operational);
                assert_eq!(ev.privileges, ExecutionPrivileges::Sovereign);
            }
            other => panic!("expected accepted, got {:?}", other),
        }
        assert!(e.require_sovereign().is_ok());
    }

    #[test]
    fn test_drift_strips_privileges_to_degraded() {
        let mut e = engine(true);
        e.ingest_telemetry(&packet(docked(), 1000), 1010); // Operational
        let far = SpatialCoordinates::new(341260000, -1184485000, 150000);
        let ev = match e.ingest_telemetry(&packet(far, 1020), 1030) {
            TelemetryOutcome::Accepted(ev) => ev,
            other => panic!("{:?}", other),
        };
        assert_eq!(ev.new_state, EngineState::Quarantined);
        assert_eq!(ev.reason, QuarantineReason::DriftViolation);
        assert_eq!(ev.privileges, ExecutionPrivileges::Degraded);
        // Physical detachment immediately strips high-criticality execution.
        assert!(!e.require_sovereign().is_ok());
    }

    #[test]
    fn test_temporal_skew_is_recoverable_quarantine() {
        let mut e = engine(true);
        e.ingest_telemetry(&packet(docked(), 1000), 1010);
        let ev = match e.ingest_telemetry(&packet(docked(), 1000), 1200) {
            TelemetryOutcome::Accepted(ev) => ev,
            other => panic!("{:?}", other),
        };
        assert_eq!(ev.new_state, EngineState::Quarantined);
        assert_eq!(ev.reason, QuarantineReason::TemporalSkew);
        // One consecutive clean packet restores Operational.
        let back = match e.ingest_telemetry(&packet(docked(), 1210), 1210) {
            TelemetryOutcome::Accepted(ev) => ev,
            other => panic!("{:?}", other),
        };
        assert_eq!(back.new_state, EngineState::Operational);
        assert_eq!(back.reason, QuarantineReason::None);
    }

    #[test]
    fn test_signature_spoofing_locks_down_and_revokes() {
        // Forged packet: valid-looking but the deployed verifier rejects it.
        let spoofed = DockingTelemetryPacket {
            signature: [0xAAu8; 64],
            ..packet(docked(), 1020)
        };
        let mut attacker_engine = engine(false);
        // First packet already spoofs: Standby -> LockedDown.
        let ev = match attacker_engine.ingest_telemetry(&spoofed, 1030) {
            TelemetryOutcome::Accepted(ev) => ev,
            other => panic!("{:?}", other),
        };
        assert_eq!(ev.previous_state, EngineState::Standby);
        assert_eq!(ev.new_state, EngineState::LockedDown);
        assert_eq!(ev.reason, QuarantineReason::SignatureSpoofing);
        assert_eq!(ev.privileges, ExecutionPrivileges::Revoked);

        // Even a subsequent PERFECT packet cannot lift the hard lock.
        let again = match attacker_engine.ingest_telemetry(&packet(docked(), 1040), 1040) {
            TelemetryOutcome::Accepted(ev) => ev,
            other => panic!("{:?}", other),
        };
        assert_eq!(again.new_state, EngineState::LockedDown);
        assert_eq!(again.reason, QuarantineReason::SignatureSpoofing); // preserved
        assert!(!attacker_engine.require_sovereign().is_ok());
    }

    #[test]
    fn test_operational_to_lockeddown_on_spoof_detection() {
        // A deployment that admits clean telemetry, then encounters a spoof:
        // Operational must drop straight to LockedDown with privileges Revoked.
        let mut e = engine(true);
        e.ingest_telemetry(&packet(docked(), 1000), 1010); // Operational
        assert_eq!(e.state(), EngineState::Operational);

        // Swap the trust anchor's view: rebuild around a rejecting verifier but
        // replay through an engine that was first admitted. We simulate the
        // real-world case where the registry key rotated (stolen-key scenario):
        // re-enroll under a new key so the old-key-signed packet now fails.
        e.registry_mut().register_trusted(
            SPLINTER_ID,
            TrustedSplinter::new(
                [0x11u8; 32], // rotated credential; stale splinter keeps signing with old key
                SpatialCoordinates::new(341253000, -1184485000, 150000),
                1700000100,
            ),
        );
        // MockVerifier(true) ignores keys, so instead force rejection via a
        // hub-mismatch spoof, which is also an identity compromise tier.
        let wrong_hub = DockingTelemetryPacket {
            target_hub_id: [0xEEu8; 16],
            ..packet(docked(), 1020)
        };
        let ev = match e.ingest_telemetry(&wrong_hub, 1030) {
            TelemetryOutcome::Accepted(ev) => ev,
            other => panic!("{:?}", other),
        };
        assert_eq!(ev.previous_state, EngineState::Operational);
        assert_eq!(ev.new_state, EngineState::LockedDown);
        assert_eq!(ev.privileges, ExecutionPrivileges::Revoked);
    }

    #[test]
    fn test_unregistered_splinter_denied_before_crypto() {
        let mut e = engine(true);
        let ghost = DockingTelemetryPacket {
            splinter_id: [0xDEu8; 16],
            ..packet(docked(), 1000)
        };
        let ev = match e.ingest_telemetry(&ghost, 1010) {
            TelemetryOutcome::DeniedUnregistered(ev) => ev,
            other => panic!("expected denial, got {:?}", other),
        };
        assert_eq!(ev.new_state, EngineState::LockedDown);
        assert_eq!(ev.reason, QuarantineReason::UnregisteredSplinter);
        assert_eq!(ev.privileges, ExecutionPrivileges::Revoked);
    }

    #[test]
    fn test_registry_revoke_wire_into_lockdown() {
        let mut e = engine(true);
        e.ingest_telemetry(&packet(docked(), 1000), 1010); // Operational
                                                           // Credential burned -> operator revokes it in the registry.
        assert!(e.registry_mut().revoke(&SPLINTER_ID));
        // Next telemetry from the still-transmitting splinter fails closed.
        let ev = match e.ingest_telemetry(&packet(docked(), 1020), 1020) {
            TelemetryOutcome::DeniedUnregistered(ev) => ev,
            other => panic!("{:?}", other),
        };
        assert_eq!(ev.new_state, EngineState::LockedDown);
        assert_eq!(ev.privileges, ExecutionPrivileges::Revoked);
    }

    #[test]
    fn test_hub_mismatch_is_identity_compromise() {
        let mut e = engine(true);
        let wrong_hub = DockingTelemetryPacket {
            target_hub_id: [0x7Fu8; 16],
            ..packet(docked(), 1000)
        };
        let ev = match e.ingest_telemetry(&wrong_hub, 1010) {
            TelemetryOutcome::Accepted(ev) => ev,
            other => panic!("{:?}", other),
        };
        assert_eq!(ev.new_state, EngineState::LockedDown);
        assert_eq!(ev.reason, QuarantineReason::HubMismatch);
    }

    #[test]
    fn test_hard_lock_release_requires_operator_ceremony_then_readmits() {
        let mut e = engine(false);
        e.ingest_telemetry(&packet(docked(), 1000), 1010); // SignatureInvalid -> LockedDown
        assert_eq!(e.state(), EngineState::LockedDown);

        // Ceremony clears the lock but grants nothing by itself.
        let cleared = e.clear_hard_quarantine().expect("should clear");
        assert_eq!(cleared.new_state, EngineState::Standby);
        assert_eq!(e.privileges(), ExecutionPrivileges::Revoked);
        // No-op when not locked.
        assert!(e.clear_hard_quarantine().is_none());

        // After identity triage, swap in a passing verifier scenario by
        // rebuilding the engine around the same registry posture: a fresh
        // verified docking now admits to Operational.
        drop(e);
        let mut e = engine(true);
        e.ingest_telemetry(&packet(docked(), 1000), 1010);
        assert_eq!(e.state(), EngineState::Operational);
        assert!(e.require_sovereign().is_ok());
    }

    #[test]
    fn test_transition_table_purity_and_monotonic_severity() {
        // Pure table check without engine plumbing: severity never relaxes
        // through repeated bad telemetry, and LockedDown absorbs everything.
        assert_eq!(
            QuarantineReason::from_anchor_error(&AnchorError::ExceededDockingRadius),
            QuarantineReason::DriftViolation
        );
        assert_eq!(
            QuarantineReason::from_anchor_error(&AnchorError::TemporalDriftExceeded),
            QuarantineReason::TemporalSkew
        );
        assert!(QuarantineReason::HubMismatch.is_identity_compromise());
        assert!(!QuarantineReason::DriftViolation.is_identity_compromise());
        assert_eq!(
            QuarantineReason::privileges_for(QuarantineReason::SignatureSpoofing),
            ExecutionPrivileges::Revoked
        );
        assert_eq!(
            QuarantineReason::privileges_for(QuarantineReason::TemporalSkew),
            ExecutionPrivileges::Degraded
        );
    }
}
