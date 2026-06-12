// ============================================================================
// GLOBAL STATUS BAR  — RED zone
// Brand glows red. Active-assets KPI glows neon-green. Alert KPI pulses red.
// UTC clock glows cyan.
// ============================================================================
import React from 'react';
import { Activity, Wifi, Bell, Clock } from 'lucide-react';

interface GlobalStatusBarProps {
  onlineAssetsCount:    number;
  totalAssetsCount:     number;
  unresolvedAlertsCount: number;
  utcTime:              string;
}

export const GlobalStatusBar: React.FC<GlobalStatusBarProps> = ({
  onlineAssetsCount,
  totalAssetsCount,
  unresolvedAlertsCount,
  utcTime,
}) => {
  const hasAlerts = unresolvedAlertsCount > 0;

  return (
    <header className="zone-header flex items-center justify-between px-6 h-[60px] z-20 flex-shrink-0">

      {/* ── Brand ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        {/* Logo box */}
        <div
          className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg,#2a0606,#180404)',
            boxShadow: '0 0 14px rgba(255,56,56,0.55), inset 0 0 8px rgba(255,56,56,0.12)',
            border: '1px solid rgba(255,56,56,0.35)',
          }}
        >
          <Activity className="iglow-red h-5 w-5 text-[#FF3838]" aria-hidden="true" />
        </div>

        <div>
          <h1 className="tglow-red text-[#FF5050] text-[13px] font-bold tracking-[0.18em] leading-none">
            COGNITIVE OPERATIONS COCKPIT
          </h1>
          <p className="mt-0.5 text-[9px] text-neutral-600 font-mono tracking-[0.14em]">
            MISSION SA PROTOCOL v4.11 · AIRBUS DARK PARADIGM
          </p>
        </div>
      </div>

      {/* ── KPIs ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">

        {/* Active assets — neon-green */}
        <div
          className="kpi-green flex items-center gap-3 px-3 py-1.5 rounded"
          style={{ background:'#081208', border:'1px solid rgba(57,255,20,0.22)' }}
        >
          <Wifi className="iglow-green h-3.5 w-3.5 text-[#39FF14]" aria-hidden="true" />
          <span className="text-[10px] font-mono text-neutral-500 tracking-widest">ACTIVE ASSETS</span>
          <span className="tglow-green text-[#39FF14] font-mono text-sm font-bold">
            {onlineAssetsCount}<span className="text-neutral-600">/{totalAssetsCount}</span>
          </span>
        </div>

        {/* Unresolved alerts — red */}
        <div
          className={`flex items-center gap-3 px-3 py-1.5 rounded transition-all duration-300 ${
            hasAlerts ? 'kpi-red animate-pulse' : ''
          }`}
          style={{
            background: hasAlerts ? '#160606' : '#0e0e0e',
            border: `1px solid ${hasAlerts ? 'rgba(255,56,56,0.35)' : '#1e1e1e'}`,
          }}
        >
          <Bell className={`h-3.5 w-3.5 ${hasAlerts ? 'iglow-red text-[#FF3838]' : 'text-neutral-700'}`} aria-hidden="true" />
          <span className="text-[10px] font-mono text-neutral-500 tracking-widest">ALERTS</span>
          <span className={`font-mono text-sm font-bold ${hasAlerts ? 'tglow-red text-[#FF3838]' : 'text-neutral-700'}`}>
            {unresolvedAlertsCount}
          </span>
        </div>

        {/* UTC clock — cyan */}
        <div className="hidden lg:flex flex-col items-end">
          <div className="flex items-center gap-1.5">
            <Clock className="iglow-cyan h-3 w-3 text-[#2DCCFF]" aria-hidden="true" />
            <span className="tglow-cyan text-[#2DCCFF] font-mono font-semibold text-[13px]">{utcTime}</span>
          </div>
          <span className="text-[8px] text-neutral-700 font-mono tracking-widest mt-0.5">UTC / ZULU</span>
        </div>
      </div>
    </header>
  );
};
