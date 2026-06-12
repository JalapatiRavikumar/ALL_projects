// ============================================================================
// ASSET DETAIL PANEL — Right Panel (25%)
// Zone color CHANGES dynamically based on selected asset status.
// Type color used for header accent (consistent with Roster + Map).
// ============================================================================
import React from 'react';
import { Activity, Radio, Zap, Navigation, User, Clock, TrendingUp, Target } from 'lucide-react';
import { StatusShape } from './StatusShape';
import { MiniSparkline } from './MiniSparkline';
import type { Asset, Alert, AssetType, AssetStatus } from '../types';
import { toAstroStatus } from '../types';

interface AssetDetailPanelProps {
  asset:        Asset | null;
  linkedAlerts: Alert[];
}

// ── Consistent type colors (same as Roster + Map) ────────────────────────
const TYPE_COLOR: Record<AssetType, { text:string; glow:string }> = {
  Patrol:  { text:'#2DCCFF', glow:'drop-shadow(0 0 5px rgba(45,204,255,0.8))'  },
  Rescue:  { text:'#39FF14', glow:'drop-shadow(0 0 5px rgba(57,255,20,0.8))'   },
  Support: { text:'#FF9500', glow:'drop-shadow(0 0 5px rgba(255,149,0,0.8))'   },
};

// ── Status zone class mapping ─────────────────────────────────────────────
const STATUS_ZONE: Record<AssetStatus, string> = {
  Active:     'zone-detail-active',
  Standby:    'zone-detail-standby',
  Unstable:   'zone-detail-unstable',
  SignalLoss: 'zone-detail-signalloss',
};

// ── Status label + color ──────────────────────────────────────────────────
const STATUS_DISPLAY: Record<AssetStatus, { label:string; color:string }> = {
  Active:     { label:'OPERATIONAL', color:'#39FF14' },
  Standby:    { label:'STANDBY',     color:'#2DCCFF' },
  Unstable:   { label:'DEGRADED',    color:'#FCE83A' },
  SignalLoss: { label:'SIGNAL LOSS', color:'#FF3838' },
};

function compassLabel(deg: number): string {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

const Row: React.FC<{ label:string; value:React.ReactNode; icon?:React.ReactNode }> = ({label,value,icon}) => (
  <div className="flex items-center justify-between py-1.5" style={{ borderBottom:'1px solid #111' }}>
    <div className="flex items-center gap-1.5 text-neutral-600">
      {icon}
      <span className="text-[9px] font-mono uppercase tracking-wider">{label}</span>
    </div>
    <span className="text-[10px] font-mono font-semibold text-neutral-300">{value}</span>
  </div>
);

// ── Empty state ───────────────────────────────────────────────────────────
const EmptyState: React.FC = () => (
  <aside className="zone-detail-empty w-[25%] min-w-[260px] max-w-[380px] flex items-center justify-center flex-shrink-0">
    <div className="text-center p-8">
      <Target className="h-10 w-10 mx-auto mb-3 text-neutral-800" aria-hidden="true" />
      <p className="text-[10px] font-mono text-neutral-600">SELECT AN ASSET</p>
      <p className="text-[9px] text-neutral-800 mt-1 font-mono">FOR DETAIL READOUT</p>
    </div>
  </aside>
);

export const AssetDetailPanel: React.FC<AssetDetailPanelProps> = ({ asset, linkedAlerts }) => {
  if (!asset) return <EmptyState />;

  const astro        = toAstroStatus(asset.status);
  const zoneClass    = STATUS_ZONE[asset.status];
  const statusDisp   = STATUS_DISPLAY[asset.status];
  const typeDisp     = TYPE_COLOR[asset.type];
  const activeAlerts = linkedAlerts.filter((a) => !a.acknowledged);

  const sigTrend  = asset.signalHistory.length >= 2
    ? asset.signalHistory.at(-1)! - asset.signalHistory[0] : 0;
  const battTrend = asset.batteryHistory.length >= 2
    ? asset.batteryHistory.at(-1)! - asset.batteryHistory[0] : 0;
  const riskHigh   = asset.signalStrength < 30 || asset.batteryLevel < 25;
  const riskMed    = !riskHigh && (asset.signalStrength < 60 || asset.batteryLevel < 50);

  return (
    <aside className={`${zoneClass} w-[25%] min-w-[260px] max-w-[380px] flex flex-col overflow-hidden flex-shrink-0 transition-all duration-500`}>

      {/* ── Identity header ────────────────────────────────── */}
      <div
        className="p-4 flex-shrink-0"
        style={{
          background: `linear-gradient(135deg, #0e0e0e 0%, ${statusDisp.color}08 100%)`,
          borderBottom: `1px solid ${statusDisp.color}22`,
        }}
      >
        {/* Name + status badge row */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <StatusShape status={astro} size={22} />
            <div>
              <h2
                className="text-[13px] font-bold font-mono tracking-wide"
                style={{ color: typeDisp.text, filter: typeDisp.glow }}
              >
                {asset.name}
              </h2>
              <span className="text-[8px] font-mono text-neutral-600">{asset.id}</span>
            </div>
          </div>
          <span
            className="text-[8px] font-mono font-bold px-2 py-0.5 rounded flex-shrink-0"
            style={{
              color: statusDisp.color,
              background: `${statusDisp.color}12`,
              border: `1px solid ${statusDisp.color}40`,
              boxShadow: `0 0 8px ${statusDisp.color}30`,
            }}
          >
            {statusDisp.label}
          </span>
        </div>

        {/* Type + operator */}
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded"
            style={{
              color: typeDisp.text,
              background: `${typeDisp.text}10`,
              border: `1px solid ${typeDisp.text}30`,
            }}
          >
            {asset.type.toUpperCase()}
          </span>
          {asset.assignedOperator ? (
            <span className="flex items-center gap-1 text-[9px] font-mono" style={{ color:'#2DCCFF99' }}>
              <User className="h-2.5 w-2.5" />
              {asset.assignedOperator}
            </span>
          ) : (
            <span className="text-[9px] font-mono text-neutral-700 italic">Unassigned</span>
          )}
        </div>
      </div>

      {/* ── Scrollable body ────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">

        {/* Active alert banners */}
        {activeAlerts.length > 0 && (
          <div
            className="rounded p-2.5 space-y-1"
            style={{ background:'rgba(255,56,56,0.06)', border:'1px solid rgba(255,56,56,0.20)' }}
          >
            <p className="text-[8px] font-mono font-bold text-[#FF3838] tracking-widest">
              ⚠ ACTIVE ALERTS ({activeAlerts.length})
            </p>
            {activeAlerts.map((al) => (
              <p key={al.id} className="text-[9px] text-neutral-400 font-mono leading-snug">
                [{al.priority}] {al.message}
              </p>
            ))}
          </div>
        )}

        {/* ── Telemetry ─────────────────────────────────────── */}
        <div>
          <p className="text-[8px] font-mono font-bold tracking-widest text-neutral-600 uppercase mb-1.5">
            TELEMETRY
          </p>
          <div className="rounded px-3 py-1" style={{ background:'#090909', border:'1px solid #141414' }}>
            <Row label="Signal" icon={<Radio className="h-3 w-3" />}
              value={<span style={{ color: asset.signalStrength>60 ? '#39FF14' : asset.signalStrength>30 ? '#FFB302' : '#FF3838' }}>
                {asset.signalStrength}%
              </span>} />
            <Row label="Battery" icon={<Zap className="h-3 w-3" />}
              value={<span style={{ color: asset.batteryLevel>50 ? '#39FF14' : asset.batteryLevel>25 ? '#FFB302' : '#FF3838' }}>
                {asset.batteryLevel}%
              </span>} />
            <Row label="Velocity" icon={<Activity className="h-3 w-3" />}
              value={`${asset.velocity.toFixed(1)} km/h`} />
            <Row label="Bearing" icon={<Navigation className="h-3 w-3" />}
              value={`${asset.bearing}° ${compassLabel(asset.bearing)}`} />
            <Row label="Last Ping" icon={<Clock className="h-3 w-3" />}
              value={asset.lastPingTimestamp} />
          </div>
        </div>

        {/* ── Sparklines ────────────────────────────────────── */}
        <div>
          <p className="text-[8px] font-mono font-bold tracking-widest text-neutral-600 uppercase mb-1.5 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" aria-hidden="true" />
            TRENDS
          </p>
          <div className="rounded p-3 flex justify-between" style={{ background:'#090909', border:'1px solid #141414' }}>
            <MiniSparkline data={asset.signalHistory}  width={108} height={40} label="Signal"  />
            <MiniSparkline data={asset.batteryHistory} width={108} height={40} label="Battery" />
          </div>
        </div>

        {/* ── Position ──────────────────────────────────────── */}
        <div>
          <p className="text-[8px] font-mono font-bold tracking-widest text-neutral-600 uppercase mb-1.5">
            POSITION
          </p>
          <div className="rounded px-3 py-2 space-y-1" style={{ background:'#090909', border:'1px solid #141414' }}>
            <div className="flex justify-between">
              <span className="text-[9px] font-mono text-neutral-600">LAT</span>
              <span className="text-[9px] font-mono text-neutral-300">{asset.lat.toFixed(4)}° N</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[9px] font-mono text-neutral-600">LON</span>
              <span className="text-[9px] font-mono text-neutral-300">{asset.lon.toFixed(4)}° E</span>
            </div>
            <div className="mt-1.5 pt-1.5" style={{ borderTop:'1px solid #111' }}>
              <p className="text-[7px] font-mono text-neutral-700 uppercase mb-1">History</p>
              {[...asset.positionHistory].reverse().map(([la,lo],i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-[7px] font-mono text-neutral-700">T-{i}</span>
                  <span className="text-[7px] font-mono text-neutral-600">{la.toFixed(4)}, {lo.toFixed(4)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SA L3 Projection ──────────────────────────────── */}
        <div>
          <p className="text-[8px] font-mono font-bold tracking-widest text-neutral-600 uppercase mb-1.5">
            PROJECTION · SA L3
          </p>
          <div
            className="rounded px-3 py-2 space-y-1.5"
            style={{
              background: `${statusDisp.color}06`,
              border: `1px solid ${statusDisp.color}18`,
            }}
          >
            <div className="flex justify-between">
              <span className="text-[8px] font-mono text-neutral-600">Signal Δ</span>
              <span className="text-[8px] font-mono font-bold" style={{ color: sigTrend>=0?'#39FF14':'#FF3838' }}>
                {sigTrend>=0?'+':''}{sigTrend}% / window
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[8px] font-mono text-neutral-600">Battery Δ</span>
              <span className="text-[8px] font-mono font-bold" style={{ color: battTrend>=0?'#39FF14':'#FFB302' }}>
                {battTrend>=0?'+':''}{battTrend}% / window
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[8px] font-mono text-neutral-600">Risk Index</span>
              <span
                className="text-[8px] font-mono font-bold"
                style={{ color: riskHigh?'#FF3838':riskMed?'#FFB302':'#39FF14' }}
              >
                {riskHigh?'HIGH':riskMed?'MEDIUM':'LOW'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
};
