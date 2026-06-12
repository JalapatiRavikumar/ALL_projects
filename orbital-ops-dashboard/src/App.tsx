// ============================================================================
// COGNITIVE OPERATIONS COCKPIT — Root Application
// Endsley 3-Level SA: Perception → Comprehension → Projection
// Layout: GlobalStatusBar (top) + 3-column body
//   Col 1 (25%): AlertFeed
//   Col 2 (50%): AssetRoster (top) + TacticalMap (bottom)
//   Col 3 (25%): AssetDetailPanel
//
// Live simulation: every SimSpeed seconds, telemetry nudges, new alerts
// can spawn, assets can degrade or recover.
// ============================================================================
import { useState, useEffect, useCallback, useRef } from 'react';

import { GlobalStatusBar }   from './components/GlobalStatusBar';
import { AlertFeed }         from './components/AlertFeed';
import { AssetRoster }       from './components/AssetRoster';
import { TacticalMap }       from './components/TacticalMap';
import { AssetDetailPanel }  from './components/AssetDetailPanel';

import { initialAssets, initialAlerts } from './mockData';
import type { Asset, Alert, AlertFilter, SimSpeed } from './types';

// ── Helpers ────────────────────────────────────────────────────────────────

function utcClock(): string {
  return new Date().toUTCString().slice(17, 25); // HH:MM:SS
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function randomDelta(range: number): number {
  return (Math.random() - 0.5) * 2 * range;
}

/** Nudge an asset's telemetry to simulate live data */
function tickAsset(asset: Asset): Asset {
  // Nudge signal & battery
  let sig  = clamp(asset.signalStrength + randomDelta(4), 0, 100);
  let bat  = clamp(asset.batteryLevel   + randomDelta(1), 0, 100);

  // Nudge position slightly along bearing
  const bearRad = (asset.bearing * Math.PI) / 180;
  const speed   = asset.velocity / 111_000; // rough lat°/s at ~1s tick
  const newLat  = asset.velocity > 0 ? asset.lat + Math.cos(bearRad) * speed * 0.05 : asset.lat;
  const newLon  = asset.velocity > 0 ? asset.lon + Math.sin(bearRad) * speed * 0.05 : asset.lon;

  // Rolling history (keep last 5)
  const sigHist  = [...asset.signalHistory.slice(-4),  Math.round(sig)];
  const batHist  = [...asset.batteryHistory.slice(-4), Math.round(bat)];
  const posHist  = asset.velocity > 0
    ? [...asset.positionHistory.slice(-4), [newLat, newLon] as [number, number]]
    : asset.positionHistory;

  // Derive status from signal
  let status = asset.status;
  if (sig === 0)        status = 'SignalLoss';
  else if (sig < 20)    status = 'Unstable';
  else if (status === 'SignalLoss' || status === 'Unstable') {
    if (sig >= 20) status = sig > 50 ? 'Active' : 'Unstable';
  }

  return {
    ...asset,
    signalStrength: Math.round(sig),
    batteryLevel:   Math.round(bat),
    lat: newLat,
    lon: newLon,
    signalHistory:  sigHist,
    batteryHistory: batHist,
    positionHistory: posHist,
    status,
  };
}

// ── App ────────────────────────────────────────────────────────────────────

export default function App() {
  const [assets,          setAssets]          = useState<Asset[]>(initialAssets);
  const [alerts,          setAlerts]          = useState<Alert[]>(initialAlerts);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [alertFilter,     setAlertFilter]     = useState<AlertFilter>('All');
  const [searchQuery,     setSearchQuery]     = useState('');
  const [simSpeed,        setSimSpeed]        = useState<SimSpeed>(1);
  const [simRunning,      setSimRunning]      = useState(true);
  const [utcTime,         setUtcTime]         = useState(utcClock());
  const alertIdRef = useRef(initialAlerts.length + 1);

  // ── UTC clock ─────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setUtcTime(utcClock()), 1000);
    return () => clearInterval(id);
  }, []);

  // ── Simulation tick ───────────────────────────────────────────────────
  useEffect(() => {
    if (!simRunning) return;
    const intervalMs = (1000 / simSpeed) * 3; // ~3s base period

    const id = setInterval(() => {
      setAssets((prev) => prev.map(tickAsset));

      // Occasionally spawn a new low/medium alert for a random asset
      if (Math.random() < 0.08) {
        setAssets((prevAssets) => {
          const candidate = prevAssets[Math.floor(Math.random() * prevAssets.length)];
          const newAlert: Alert = {
            id: `ALT-${String(alertIdRef.current++).padStart(3, '0')}`,
            linkedAssetId: candidate.id,
            priority: Math.random() < 0.3 ? 'High' : Math.random() < 0.6 ? 'Medium' : 'Low',
            message: `Telemetry anomaly detected on ${candidate.name}. Auto-diagnostics running.`,
            timestamp: utcClock(),
            acknowledged: false,
          };
          setAlerts((prev) => [newAlert, ...prev]);
          return prevAssets; // no change to assets themselves here
        });
      }
    }, intervalMs);

    return () => clearInterval(id);
  }, [simRunning, simSpeed]);

  // ── Acknowledge handler ───────────────────────────────────────────────
  const handleAcknowledge = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((al) => (al.id === alertId ? { ...al, acknowledged: true } : al))
    );
  }, []);

  // ── Derived KPIs ──────────────────────────────────────────────────────
  const onlineCount        = assets.filter((a) => a.status === 'Active').length;
  const unresolvedAlertsCount = alerts.filter((a) => !a.acknowledged).length;
  const selectedAsset      = assets.find((a) => a.id === selectedAssetId) ?? null;
  const linkedAlerts       = selectedAsset
    ? alerts.filter((al) => al.linkedAssetId === selectedAsset.id)
    : [];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0a0a0a] text-[#E0E0E0]">

      {/* ── Global Status Bar ──────────────────────────────────────── */}
      <GlobalStatusBar
        onlineAssetsCount={onlineCount}
        totalAssetsCount={assets.length}
        unresolvedAlertsCount={unresolvedAlertsCount}
        utcTime={utcTime}
      />

      {/* ── Sim Controls ─────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 px-6 py-1.5 bg-[#0f0f0f] border-b border-[#1e1e1e] flex-shrink-0">
        <span className="text-[9px] font-mono text-neutral-700 uppercase tracking-widest">Simulation</span>
        <button
          onClick={() => setSimRunning((r) => !r)}
          className={`text-[9px] font-mono px-3 py-1 rounded border transition-all ${
            simRunning
              ? 'btn-glow-green bg-[#0a1a0a] text-[#56F000] border-[#56F000]/30 hover:border-[#56F000]/50'
              : 'btn-glow-red   bg-[#1a0808] text-[#FF3838] border-[#FF3838]/30 hover:border-[#FF3838]/50'
          }`}
          aria-pressed={simRunning}
          aria-label={simRunning ? 'Pause simulation' : 'Resume simulation'}
        >
          {simRunning ? '▶ LIVE' : '⏸ PAUSED'}
        </button>
        {([1, 2, 5] as SimSpeed[]).map((s) => (
          <button
            key={s}
            onClick={() => setSimSpeed(s)}
            aria-pressed={simSpeed === s}
            className={`text-[9px] font-mono px-2 py-1 rounded border transition-all ${
              simSpeed === s
                ? 'btn-glow-cyan bg-[#081520] text-[#2DCCFF] border-[#2DCCFF]/35'
                : 'bg-[#111] text-neutral-700 border-[#1e1e1e] hover:text-neutral-400 hover:border-[#2a2a2a]'
            }`}
          >
            ×{s}
          </button>
        ))}
      </div>

      {/* ── 3-Column Body ─────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Column 1: Alert Feed (25%) ─────────────────────────── */}
        <AlertFeed
          alerts={alerts}
          assets={assets}
          selectedAssetId={selectedAssetId}
          alertFilter={alertFilter}
          searchQuery={searchQuery}
          onSelectAsset={setSelectedAssetId}
          onAcknowledge={handleAcknowledge}
          onFilterChange={setAlertFilter}
          onSearchChange={setSearchQuery}
        />

        {/* ── Column 2: Roster (top) + Map (bottom) (50%) ─────────── */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ borderRight:'1px solid rgba(57,255,20,0.10)' }}>

          {/* Roster — top ~40% */}
          <div className="h-[42%] overflow-hidden" style={{ borderBottom:'1px solid rgba(45,204,255,0.10)' }}>
            <AssetRoster
              assets={assets}
              selectedAssetId={selectedAssetId}
              onSelectAsset={setSelectedAssetId}
            />
          </div>

          {/* Tactical Map — bottom ~58% */}
          <div className="flex-1 overflow-hidden">
            <TacticalMap
              assets={assets}
              selectedAssetId={selectedAssetId}
              onSelectAsset={setSelectedAssetId}
            />
          </div>
        </div>

        {/* ── Column 3: Asset Detail (25%) ──────────────────────── */}
        <AssetDetailPanel
          asset={selectedAsset}
          linkedAlerts={linkedAlerts}
        />
      </div>
    </div>
  );
}
