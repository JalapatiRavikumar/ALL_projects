// ============================================================================
// STRICT TYPE DEFINITIONS — ORBITAL OPS SITUATIONAL AWARENESS COCKPIT
// Aligned with Astro UXDS Status System & Endsley Three-Level SA Model
// ============================================================================

export type AssetType = 'Patrol' | 'Rescue' | 'Support';

export type AssetStatus = 'Active' | 'Standby' | 'Unstable' | 'SignalLoss';

export type AlertPriority = 'High' | 'Medium' | 'Low';

export type AstroStatus =
  | 'Critical'   // Square   — #FF3838 — Signal loss, active error
  | 'Serious'    // Triangle — #FFB302 — High-priority warning
  | 'Caution'    // Diamond  — #FCE83A — Minor anomaly
  | 'Normal'     // Circle   — #56F000 — Online / heartbeat
  | 'Standby'    // RoundRect— #2DCCFF — Acknowledged / standby
  | 'Off';       // Hexagon  — #9EA7AD — Decommissioned / passive

/** Maps operational AssetStatus to Astro UXDS canonical status label */
export function toAstroStatus(status: AssetStatus): AstroStatus {
  switch (status) {
    case 'SignalLoss': return 'Critical';
    case 'Unstable':  return 'Caution';
    case 'Standby':   return 'Standby';
    case 'Active':    return 'Normal';
    default:          return 'Off';
  }
}

/** Astro UXDS color token for a given status */
export function statusColor(status: AssetStatus | AstroStatus): string {
  switch (status) {
    case 'SignalLoss':
    case 'Critical':   return '#FF3838';
    case 'Serious':    return '#FFB302';
    case 'Unstable':
    case 'Caution':    return '#FCE83A';
    case 'Active':
    case 'Normal':     return '#56F000';
    case 'Standby':    return '#2DCCFF';
    case 'Off':
    default:           return '#9EA7AD';
  }
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  lat: number;
  lon: number;
  bearing: number;        // degrees 0-359
  velocity: number;       // km/h
  signalStrength: number; // 0-100 %
  batteryLevel: number;   // 0-100 %
  assignedOperator: string | null;
  lastPingTimestamp: string;
  // Level-3 SA projection data
  signalHistory: number[];
  batteryHistory: number[];
  positionHistory: Array<[number, number]>;
}

export interface Alert {
  id: string;
  linkedAssetId: string;
  priority: AlertPriority;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export type SimSpeed = 1 | 2 | 5;

export type AlertFilter = 'All' | 'High' | 'Medium' | 'Low';
