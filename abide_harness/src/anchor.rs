// abide_harness/src/anchor.rs — Spatial Anchors & Docking Verification
//
// Architectural bridge between the 1101 Bel Air Place Zero Node Hub and the
// 3500 Splinter mobile edge anchor. Fail-closed by construction: identity
// binding is checked first (cheapest gate), then cryptography, temporal
// window, and spatial boundary. Any single failure short-circuits Ok.

use crate::crypto::AuthorizationVerifier;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum AnchorNodeType {
    ZeroNodeHub,  // 1101 Bel Air Place
    SplinterNode, // 3500 Splinter Anchor
}

/// Fixed-point spatial coordinates to ensure absolute cross-platform determinism
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct SpatialCoordinates {
    pub latitude_fixed: i64,  // Degrees * 10^7
    pub longitude_fixed: i64, // Degrees * 10^7
    pub altitude_mm: i32,     // Millimeters above reference ellipsoid
}

impl SpatialCoordinates {
    pub const fn new(lat: i64, lon: i64, alt: i32) -> Self {
        Self {
            latitude_fixed: lat,
            longitude_fixed: lon,
            altitude_mm: alt,
        }
    }

    /// Computes bounded Manhattan distance in millimeters for deterministic boundary checks.
    ///
    /// NOTE: components have mixed units (lat/lon are degrees*10^7, altitude is raw
    /// millimeters), so this is a deterministic bounding metric, not physical distance.
    /// `max_docking_radius_mm` must be calibrated against this metric.
    ///
    /// Uses saturating arithmetic so extreme fixed-point inputs can never wrap or
    /// panic — consistent with the fail-closed doctrine (a bogus coordinate yields a
    /// huge distance, which fails the radius gate rather than crashing the engine).
    pub fn delta_mm(&self, other: &SpatialCoordinates) -> u64 {
        let d_lat = self
            .latitude_fixed
            .checked_sub(other.latitude_fixed)
            .map(i64::unsigned_abs)
            .unwrap_or(u64::MAX);
        let d_lon = self
            .longitude_fixed
            .checked_sub(other.longitude_fixed)
            .map(i64::unsigned_abs)
            .unwrap_or(u64::MAX);
        let d_alt = self
            .altitude_mm
            .checked_sub(other.altitude_mm)
            .map(i32::unsigned_abs)
            .unwrap_or(u32::MAX) as u64;
        d_lat.saturating_add(d_lon).saturating_add(d_alt)
    }
}

/// Anchor definition binding physical coordinates to cryptographic identity
#[derive(Debug, Clone)]
pub struct SpatialAnchorIdentity {
    pub node_type: AnchorNodeType,
    pub node_id: [u8; 16],
    pub registered_coordinates: SpatialCoordinates,
    pub public_key: [u8; 32],
}

/// Cryptographically signed docking and telemetry packet emitted by the Splinter node
#[derive(Debug, Clone)]
pub struct DockingTelemetryPacket {
    pub splinter_id: [u8; 16],
    pub target_hub_id: [u8; 16],
    pub observed_coordinates: SpatialCoordinates,
    pub timestamp: u64,
    pub signature: [u8; 64],
}

impl DockingTelemetryPacket {
    pub fn signing_bytes(&self) -> Vec<u8> {
        let mut bytes = Vec::new();
        bytes.extend_from_slice(&self.splinter_id);
        bytes.extend_from_slice(&self.target_hub_id);
        bytes.extend_from_slice(&self.observed_coordinates.latitude_fixed.to_le_bytes());
        bytes.extend_from_slice(&self.observed_coordinates.longitude_fixed.to_le_bytes());
        bytes.extend_from_slice(&self.observed_coordinates.altitude_mm.to_le_bytes());
        bytes.extend_from_slice(&self.timestamp.to_le_bytes());
        bytes
    }
}

#[derive(Debug, PartialEq, Eq)]
pub enum AnchorError {
    SignatureInvalid,
    HubMismatch,
    ExceededDockingRadius,
    TemporalDriftExceeded,
}

pub struct AnchorManager<V: AuthorizationVerifier> {
    verifier: V,
    zero_node_hub: SpatialAnchorIdentity,
    max_docking_radius_mm: u64,
    max_drift_seconds: u64,
}

impl<V: AuthorizationVerifier> AnchorManager<V> {
    pub fn new(
        verifier: V,
        zero_node_hub: SpatialAnchorIdentity,
        max_docking_radius_mm: u64,
        max_drift_seconds: u64,
    ) -> Self {
        Self {
            verifier,
            zero_node_hub,
            max_docking_radius_mm,
            max_drift_seconds,
        }
    }

    /// Immutable view of the Zero Node baseline (1101 Bel Air Place).
    pub fn hub_identity(&self) -> &SpatialAnchorIdentity {
        &self.zero_node_hub
    }

    /// Verifies that the 3500 Splinter anchor is correctly docked and verified within
    /// the 1101 Bel Air Hub perimeter.
    ///
    /// The splinter's registered Ed25519 public key is passed in explicitly (the
    /// caller resolves it from the splinter registry via `packet.splinter_id`), so
    /// the packet provably demonstrates splinter cryptographic ownership — closing
    /// the blueprint's open note where verification was pinned to the hub key.
    pub fn verify_docking(
        &self,
        packet: &DockingTelemetryPacket,
        splinter_public_key: &[u8; 32],
        current_time: u64,
    ) -> Result<(), AnchorError> {
        // 1. Verify hub target binding
        if packet.target_hub_id != self.zero_node_hub.node_id {
            return Err(AnchorError::HubMismatch);
        }

        // 2. Cryptographic signature check (Layer 1 parity)
        let message = packet.signing_bytes();
        let is_valid = self
            .verifier
            .verify(splinter_public_key, &message, &packet.signature);
        if !is_valid {
            return Err(AnchorError::SignatureInvalid);
        }

        // 3. Temporal window check (Layer 2 STS parity).
        // Saturating symmetric delta: immune to u64 underflow at clock extremes.
        let time_delta = current_time
            .saturating_sub(packet.timestamp)
            .max(packet.timestamp.saturating_sub(current_time));
        if time_delta > self.max_drift_seconds {
            return Err(AnchorError::TemporalDriftExceeded);
        }

        // 4. Spatial boundary check (Proximity to 1101 Bel Air Place zero node)
        let distance = packet
            .observed_coordinates
            .delta_mm(&self.zero_node_hub.registered_coordinates);
        if distance > self.max_docking_radius_mm {
            return Err(AnchorError::ExceededDockingRadius);
        }

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    struct MockVerifier {
        should_pass: bool,
    }

    impl AuthorizationVerifier for MockVerifier {
        fn verify(&self, _public_key: &[u8; 32], _message: &[u8], _signature: &[u8; 64]) -> bool {
            self.should_pass
        }
    }

    fn hub_identity() -> SpatialAnchorIdentity {
        let hub_coords = SpatialCoordinates::new(341253000, -1184485000, 150000); // 1101 Bel Air Place reference
        SpatialAnchorIdentity {
            node_type: AnchorNodeType::ZeroNodeHub,
            node_id: [1u8; 16],
            registered_coordinates: hub_coords,
            public_key: [9u8; 32],
        }
    }

    fn manager(should_pass: bool) -> AnchorManager<MockVerifier> {
        AnchorManager::new(MockVerifier { should_pass }, hub_identity(), 5000, 60)
    }

    #[test]
    fn test_successful_docking() {
        let hub_coords = SpatialCoordinates::new(341253000, -1184485000, 150000);
        let manager = manager(true);

        let packet = DockingTelemetryPacket {
            splinter_id: [2u8; 16],
            target_hub_id: [1u8; 16],
            observed_coordinates: SpatialCoordinates::new(341253001, -1184485001, 150000),
            timestamp: 1000,
            signature: [0u8; 64],
        };

        let result = manager.verify_docking(&packet, &[8u8; 32], 1010);
        assert_eq!(result, Ok(()));
        // Sanity: delta for the 1-unit drifts above is 1 + 1 + 0 = 2 <= 5000
        assert_eq!(hub_coords.delta_mm(&packet.observed_coordinates), 2);
    }

    #[test]
    fn test_hub_mismatch() {
        let hub_coords = SpatialCoordinates::new(341253000, -1184485000, 150000);
        let manager = manager(true);

        let packet = DockingTelemetryPacket {
            splinter_id: [2u8; 16],
            target_hub_id: [99u8; 16], // Mismatched Hub ID
            observed_coordinates: hub_coords,
            timestamp: 1000,
            signature: [0u8; 64],
        };

        let result = manager.verify_docking(&packet, &[8u8; 32], 1010);
        assert_eq!(result, Err(AnchorError::HubMismatch));
    }

    #[test]
    fn test_exceeded_docking_radius() {
        let manager = manager(true);

        let packet = DockingTelemetryPacket {
            splinter_id: [2u8; 16],
            target_hub_id: [1u8; 16],
            observed_coordinates: SpatialCoordinates::new(341260000, -1184485000, 150000), // Out of bounds
            timestamp: 1000,
            signature: [0u8; 64],
        };

        let result = manager.verify_docking(&packet, &[8u8; 32], 1010);
        assert_eq!(result, Err(AnchorError::ExceededDockingRadius));
    }

    #[test]
    fn test_temporal_drift_exceeded() {
        let hub_coords = SpatialCoordinates::new(341253000, -1184485000, 150000);
        let manager = manager(true);

        let packet = DockingTelemetryPacket {
            splinter_id: [2u8; 16],
            target_hub_id: [1u8; 16],
            observed_coordinates: hub_coords,
            timestamp: 1000,
            signature: [0u8; 64],
        };

        let result = manager.verify_docking(&packet, &[8u8; 32], 1200); // Exceeds 60s window
        assert_eq!(result, Err(AnchorError::TemporalDriftExceeded));

        // Future-dated packets beyond the window are equally denied.
        let future = DockingTelemetryPacket {
            timestamp: 1200,
            ..packet.clone()
        };
        assert_eq!(
            manager.verify_docking(&future, &[8u8; 32], 1000),
            Err(AnchorError::TemporalDriftExceeded)
        );

        // Exactly on the boundary passes.
        assert_eq!(manager.verify_docking(&packet, &[8u8; 32], 1060), Ok(()));
    }

    #[test]
    fn test_signature_invalid_denies_docking() {
        let hub_coords = SpatialCoordinates::new(341253000, -1184485000, 150000);
        let manager = manager(false); // verifier rejects everything

        let packet = DockingTelemetryPacket {
            splinter_id: [2u8; 16],
            target_hub_id: [1u8; 16],
            observed_coordinates: hub_coords,
            timestamp: 1000,
            signature: [0u8; 64],
        };

        assert_eq!(
            manager.verify_docking(&packet, &[8u8; 32], 1010),
            Err(AnchorError::SignatureInvalid)
        );
    }

    #[test]
    fn test_hub_mismatch_short_circuits_before_crypto() {
        // Even with a rejecting verifier, a mismatched hub reports HubMismatch first.
        let manager = manager(false);
        let hub_coords = SpatialCoordinates::new(341253000, -1184485000, 150000);

        let packet = DockingTelemetryPacket {
            splinter_id: [2u8; 16],
            target_hub_id: [0u8; 16],
            observed_coordinates: hub_coords,
            timestamp: 1000,
            signature: [0u8; 64],
        };

        assert_eq!(
            manager.verify_docking(&packet, &[8u8; 32], 1000),
            Err(AnchorError::HubMismatch)
        );
    }

    #[test]
    fn test_signing_bytes_deterministic_and_complete() {
        let hub_coords = SpatialCoordinates::new(341253000, -1184485000, 150000);
        let packet = DockingTelemetryPacket {
            splinter_id: [2u8; 16],
            target_hub_id: [1u8; 16],
            observed_coordinates: hub_coords,
            timestamp: 1000,
            signature: [0u8; 64],
        };
        let bytes = packet.signing_bytes();
        // 16 + 16 + 8 + 8 + 4 + 8 = 60 bytes; signature intentionally excluded.
        assert_eq!(bytes.len(), 60);
        assert_eq!(bytes, packet.signing_bytes());
    }

    #[test]
    fn test_delta_mm_symmetry_zero_and_overflow_hardened() {
        let a = SpatialCoordinates::new(10, -20, 300);
        let b = SpatialCoordinates::new(13, -24, 100);
        assert_eq!(a.delta_mm(&b), b.delta_mm(&a));
        assert_eq!(a.delta_mm(&a), 0);
        assert_eq!(a.delta_mm(&b), 3 + 4 + 200);

        // Extreme fixed-point inputs must saturate, never wrap or panic.
        let worst = SpatialCoordinates::new(i64::MIN, i64::MIN, i32::MIN);
        let best = SpatialCoordinates::new(i64::MAX, i64::MAX, i32::MAX);
        assert_eq!(worst.delta_mm(&best), u64::MAX);
    }
}
