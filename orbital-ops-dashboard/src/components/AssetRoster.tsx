// ============================================================================
// ASSET ROSTER — CYAN zone, Center-Top (42%)
// Patrol  = #2DCCFF cyan    (consistent across ALL panels)
// Rescue  = #39FF14 neon-green
// Support = #FF9500 orange
// Selected row glows cyan with left accent bar.
// ============================================================================
import React, { useState } from 'react';
import { Database, ChevronUp, ChevronDown } from 'lucide-react';
import { StatusShape } from './StatusShape';
import type { Asset, AssetType, AssetStatus } from '../types';
import { toAstroStatus } from '../types';

interface AssetRosterProps {
  assets: Asset[];
  selectedAssetId: string | null;
  onSelectAsset: (id: string) => void;
}

type SortKey = 'name' | 'type' | 'status' | 'signal' | 'battery' | 'velocity';
type SortDir = 'asc' | 'desc';

const TYPE_FILTERS: Array<'All' | AssetType>   = ['All', 'Patrol', 'Rescue', 'Support'];
const STATUS_FILTERS: Array<'All' | AssetStatus> = ['All', 'Active', 'Standby', 'Unstable', 'SignalLoss'];

// ── Per-type color tokens ─────────────────────────────────────────────────
const TYPE_COLOR: Record<AssetType, { text: string; bg: string; border: string }> = {
  Patrol:  { text:'#2DCCFF', bg:'rgba(45,204,255,0.08)',  border:'rgba(45,204,255,0.28)' },
  Rescue:  { text:'#39FF14', bg:'rgba(57,255,20,0.08)',   border:'rgba(57,255,20,0.28)'  },
  Support: { text:'#FF9500', bg:'rgba(255,149,0,0.08)',   border:'rgba(255,149,0,0.28)'  },
};

// ── Per-status badge styles ────────────────────────────────────────────────
const STATUS_STYLE: Record<AssetStatus, { text: string; bg: string; border: string }> = {
  Active:     { text:'#39FF14', bg:'rgba(57,255,20,0.07)',   border:'rgba(57,255,20,0.25)'   },
  Standby:    { text:'#2DCCFF', bg:'rgba(45,204,255,0.07)',  border:'rgba(45,204,255,0.25)'  },
  Unstable:   { text:'#FCE83A', bg:'rgba(252,232,58,0.07)',  border:'rgba(252,232,58,0.25)'  },
  SignalLoss: { text:'#FF3838', bg:'rgba(255,56,56,0.10)',   border:'rgba(255,56,56,0.30)'   },
};

function signalBarColor(v: number): string {
  if (v > 60) return '#39FF14';
  if (v > 30) return '#FFB302';
  return '#FF3838';
}

const statusRank: Record<AssetStatus, number> = { SignalLoss:4, Unstable:3, Standby:2, Active:1 };

export const AssetRoster: React.FC<AssetRosterProps> = ({ assets, selectedAssetId, onSelectAsset }) => {
  const [typeFilter,   setTypeFilter]   = useState<'All'|AssetType>('All');
  const [statusFilter, setStatusFilter] = useState<'All'|AssetStatus>('All');
  const [sortKey,      setSortKey]      = useState<SortKey>('status');
  const [sortDir,      setSortDir]      = useState<SortDir>('asc');

  const handleSort = (k: SortKey) => {
    setSortKey(k);
    setSortDir(k === sortKey ? (sortDir === 'asc' ? 'desc' : 'asc') : 'asc');
  };

  const filtered = assets
    .filter((a) => typeFilter   === 'All' || a.type   === typeFilter)
    .filter((a) => statusFilter === 'All' || a.status === statusFilter)
    .sort((a, b) => {
      let cmp = 0;
      if      (sortKey === 'name')     cmp = a.name.localeCompare(b.name);
      else if (sortKey === 'type')     cmp = a.type.localeCompare(b.type);
      else if (sortKey === 'status')   cmp = statusRank[b.status] - statusRank[a.status];
      else if (sortKey === 'signal')   cmp = a.signalStrength - b.signalStrength;
      else if (sortKey === 'battery')  cmp = a.batteryLevel   - b.batteryLevel;
      else if (sortKey === 'velocity') cmp = a.velocity       - b.velocity;
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey !== col
      ? <ChevronUp className="h-2.5 w-2.5 opacity-20" />
      : sortDir === 'asc'
        ? <ChevronUp   className="h-2.5 w-2.5 text-[#2DCCFF]" />
        : <ChevronDown className="h-2.5 w-2.5 text-[#2DCCFF]" />;

  const ColHdr = ({ label, col, right=false }: { label:string; col:SortKey; right?:boolean }) => (
    <th
      className={`px-2 py-2 text-[8px] font-mono font-bold tracking-widest text-neutral-600 uppercase cursor-pointer hover:text-neutral-300 select-none ${right?'text-right':''}`}
      onClick={() => handleSort(col)}
    >
      <span className={`flex items-center gap-0.5 ${right?'justify-end':''}`}>
        {label}<SortIcon col={col} />
      </span>
    </th>
  );

  return (
    <section className="zone-roster flex flex-col h-full overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div
        className="hbar-cyan p-3 flex-shrink-0 space-y-2"
        style={{ background:'#080c10', borderBottom:'1px solid rgba(45,204,255,0.12)' }}
      >
        <div className="flex justify-between items-center">
          <h2 className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em]">
            <Database className="iglow-cyan h-4 w-4 text-[#2DCCFF]" aria-hidden="true" />
            <span className="tglow-cyan text-[#2DCCFF]">ASSET ROSTER</span>
          </h2>
          <span className="text-[9px] font-mono text-neutral-600">{filtered.length}/{assets.length}</span>
        </div>

        {/* Type chips */}
        <div className="flex flex-wrap gap-1">
          {TYPE_FILTERS.map((f) => {
            const active = typeFilter === f;
            const tok = f !== 'All' ? TYPE_COLOR[f] : null;
            return (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                aria-pressed={active}
                className="text-[8px] font-mono px-2 py-0.5 rounded transition-all"
                style={active && tok
                  ? { color:tok.text, background:tok.bg, border:`1px solid ${tok.border}` }
                  : active
                  ? { color:'#fff', background:'#1e1e1e', border:'1px solid #333' }
                  : { color:'#444', background:'transparent', border:'1px solid #1a1a1a' }
                }
              >
                {f.toUpperCase()}
              </button>
            );
          })}

          <span className="text-neutral-700 text-[9px] self-center mx-0.5">|</span>

          {/* Status chips */}
          {STATUS_FILTERS.map((f) => {
            const active = statusFilter === f;
            const tok = f !== 'All' ? STATUS_STYLE[f] : null;
            return (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                aria-pressed={active}
                className="text-[8px] font-mono px-2 py-0.5 rounded transition-all"
                style={active && tok
                  ? { color:tok.text, background:tok.bg, border:`1px solid ${tok.border}` }
                  : active
                  ? { color:'#fff', background:'#1e1e1e', border:'1px solid #333' }
                  : { color:'#444', background:'transparent', border:'1px solid #1a1a1a' }
                }
              >
                {f === 'SignalLoss' ? 'LOSS' : f.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-xs border-collapse">
          <thead
            className="sticky top-0 z-10"
            style={{ background:'#0b0e12', borderBottom:'1px solid #1a1a1a' }}
          >
            <tr>
              <th className="px-2 py-2 w-7" />
              <ColHdr label="Asset"  col="name" />
              <ColHdr label="Type"   col="type" />
              <ColHdr label="Status" col="status" />
              <ColHdr label="Sig"    col="signal"   right />
              <ColHdr label="Bat"    col="battery"  right />
              <ColHdr label="km/h"   col="velocity" right />
            </tr>
          </thead>
          <tbody>
            {filtered.map((asset) => {
              const sel   = selectedAssetId === asset.id;
              const astro = toAstroStatus(asset.status);
              const typeTok   = TYPE_COLOR[asset.type];
              const statusTok = STATUS_STYLE[asset.status];

              return (
                <tr
                  key={asset.id}
                  onClick={() => onSelectAsset(asset.id)}
                  className={`cursor-pointer transition-all group ${sel ? 'row-sel' : ''}`}
                  style={{
                    borderBottom: '1px solid #111',
                    background: sel ? '#090e14' : undefined,
                  }}
                  onMouseEnter={(e) => { if (!sel) (e.currentTarget as HTMLElement).style.background='#0d1117'; }}
                  onMouseLeave={(e) => { if (!sel) (e.currentTarget as HTMLElement).style.background=''; }}
                  aria-selected={sel}
                >
                  {/* Status shape */}
                  <td className="px-2 py-2 text-center">
                    <StatusShape status={astro} size={11} />
                  </td>

                  {/* Name + ID */}
                  <td className="px-2 py-2">
                    <div className="flex flex-col">
                      <span
                        className="font-mono font-semibold text-[11px] transition-all"
                        style={{ color: sel ? '#2DCCFF' : '#ccc' }}
                      >
                        {asset.name}
                      </span>
                      <span className="text-[8px] text-neutral-700 font-mono">{asset.id}</span>
                    </div>
                  </td>

                  {/* Type badge — distinct per type */}
                  <td className="px-2 py-2">
                    <span
                      className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded"
                      style={{ color:typeTok.text, background:typeTok.bg, border:`1px solid ${typeTok.border}` }}
                    >
                      {asset.type.toUpperCase()}
                    </span>
                  </td>

                  {/* Status badge */}
                  <td className="px-2 py-2">
                    <span
                      className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded"
                      style={{ color:statusTok.text, background:statusTok.bg, border:`1px solid ${statusTok.border}` }}
                    >
                      {asset.status === 'SignalLoss' ? 'LOSS' : asset.status.toUpperCase()}
                    </span>
                  </td>

                  {/* Signal bar */}
                  <td className="px-2 py-2">
                    <div className="flex items-center justify-end gap-1">
                      <div className="w-9 h-1 rounded overflow-hidden" style={{ background:'#1a1a1a' }}>
                        <div
                          className="h-full rounded transition-all duration-700"
                          style={{
                            width:`${asset.signalStrength}%`,
                            background: signalBarColor(asset.signalStrength),
                            boxShadow:`0 0 4px ${signalBarColor(asset.signalStrength)}88`,
                          }}
                        />
                      </div>
                      <span className="font-mono text-[8px] text-neutral-500 w-5 text-right">
                        {asset.signalStrength}
                      </span>
                    </div>
                  </td>

                  {/* Battery */}
                  <td className="px-2 py-2 text-right">
                    <span
                      className="font-mono text-[10px] font-semibold"
                      style={{
                        color: asset.batteryLevel > 50 ? '#39FF14'
                             : asset.batteryLevel > 25 ? '#FFB302' : '#FF3838',
                      }}
                    >
                      {asset.batteryLevel}%
                    </span>
                  </td>

                  {/* Velocity */}
                  <td className="px-2 py-2 text-right">
                    <span className="font-mono text-[10px] text-neutral-500">
                      {asset.velocity.toFixed(1)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-28 text-neutral-700 text-[10px] font-mono">
            NO ASSETS MATCH FILTERS
          </div>
        )}
      </div>
    </section>
  );
};
