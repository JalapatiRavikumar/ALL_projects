// ============================================================================
// ALERT TRIAGE FEED  — RED zone, Column 1 (25%)
// HIGH  → red glow card
// MED   → amber/orange glow card
// LOW   → yellow glow card
// Selected card → cyan glow ring
// ============================================================================
import React from 'react';
import { Bell, CheckCircle, CheckCheck } from 'lucide-react';
import { StatusShape } from './StatusShape';
import type { Alert, AlertFilter, AstroStatus } from '../types';

interface AlertFeedProps {
  alerts:          Alert[];
  assets:          unknown[];   // kept for API compat, not used
  selectedAssetId: string | null;
  alertFilter:     AlertFilter;
  searchQuery:     string;
  onSelectAsset:   (id: string) => void;
  onAcknowledge:   (id: string) => void;
  onFilterChange:  (f: AlertFilter) => void;
  onSearchChange:  (q: string) => void;
}

function priorityToAstro(p: Alert['priority']): AstroStatus {
  switch (p) {
    case 'High':   return 'Critical';
    case 'Medium': return 'Serious';
    case 'Low':    return 'Caution';
  }
}

// Per-priority visual tokens
const P: Record<Alert['priority'], {
  cardBg: string; cardBorder: string; cardGlow: string;
  accentColor: string; tagBg: string; tagBorder: string;
  filterActiveBg: string; filterGlow: string;
}> = {
  High: {
    cardBg:         '#130707',
    cardBorder:     'rgba(255,56,56,0.22)',
    cardGlow:       'cglow-red',
    accentColor:    '#FF3838',
    tagBg:          '#1e0808',
    tagBorder:      'rgba(255,56,56,0.35)',
    filterActiveBg: '#1e0808',
    filterGlow:     'bglow-red',
  },
  Medium: {
    cardBg:         '#130e06',
    cardBorder:     'rgba(255,149,0,0.20)',
    cardGlow:       'cglow-amber',
    accentColor:    '#FF9500',
    tagBg:          '#1e1406',
    tagBorder:      'rgba(255,149,0,0.35)',
    filterActiveBg: '#1e1406',
    filterGlow:     'bglow-amber',
  },
  Low: {
    cardBg:         '#111108',
    cardBorder:     'rgba(252,232,58,0.16)',
    cardGlow:       'cglow-yellow',
    accentColor:    '#FCE83A',
    tagBg:          '#1a1a06',
    tagBorder:      'rgba(252,232,58,0.30)',
    filterActiveBg: '#1a1a06',
    filterGlow:     'bglow-amber',
  },
};

export const AlertFeed: React.FC<AlertFeedProps> = ({
  alerts,
  selectedAssetId,
  alertFilter,
  searchQuery,
  onSelectAsset,
  onAcknowledge,
  onFilterChange,
  onSearchChange,
}) => {
  const filtered = alerts
    .filter((al) => {
      if (al.acknowledged) return false;
      const q = searchQuery.toLowerCase();
      const hit = al.id.toLowerCase().includes(q)
               || al.message.toLowerCase().includes(q)
               || al.linkedAssetId.toLowerCase().includes(q);
      if (!hit) return false;
      return alertFilter === 'All' || al.priority === alertFilter;
    })
    .sort((a, b) => {
      const rank: Record<Alert['priority'], number> = { High: 3, Medium: 2, Low: 1 };
      return rank[b.priority] - rank[a.priority] || b.timestamp.localeCompare(a.timestamp);
    });

  const tabs: AlertFilter[] = ['All', 'High', 'Medium', 'Low'];

  const tabStyle = (f: AlertFilter): React.CSSProperties => {
    if (alertFilter !== f) return {};
    if (f === 'All') return { background:'#1e1e1e', border:'1px solid #333', color:'#fff' };
    const tok = P[f as Alert['priority']];
    return {
      background: tok.filterActiveBg,
      border:     `1px solid ${tok.accentColor}55`,
      color:      tok.accentColor,
    };
  };

  return (
    <section
      className="zone-alert w-[25%] min-w-[260px] max-w-[380px] flex flex-col overflow-hidden flex-shrink-0"
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div
        className="hbar-red p-4 flex-shrink-0 space-y-3"
        style={{ background:'#0e0808', borderBottom:'1px solid rgba(255,56,56,0.15)' }}
      >
        <div className="flex justify-between items-center">
          <h2 className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em]">
            <Bell className="iglow-red h-4 w-4 text-[#FF3838]" aria-hidden="true" />
            <span className="tglow-red text-[#FF4040]">ALERTS TRIAGE</span>
          </h2>
          <span
            className="text-[9px] font-mono font-bold px-2 py-0.5 rounded"
            style={{ background:'#1e0808', border:'1px solid rgba(255,56,56,0.28)', color:'#FF3838',
                     boxShadow:'0 0 8px rgba(255,56,56,0.25)' }}
          >
            LIVE
          </span>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search ID, asset, message…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full text-xs font-mono px-3 py-1.5 rounded transition-all focus:outline-none"
          style={{
            background: '#0a0a0a',
            border: '1px solid #222',
            color: '#ddd',
          }}
          onFocus={(e) => (e.currentTarget.style.border = '1px solid rgba(45,204,255,0.45)')}
          onBlur={(e)  => (e.currentTarget.style.border = '1px solid #222')}
          aria-label="Search alerts"
        />

        {/* Priority tabs */}
        <div className="grid grid-cols-4 gap-1">
          {tabs.map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              aria-pressed={alertFilter === f}
              className="py-1 text-[9px] font-mono rounded text-center transition-all"
              style={alertFilter === f
                ? tabStyle(f)
                : { color:'#555', background:'transparent' }
              }
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ── Feed ───────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2"
        style={{ background:'#0a0606' }}
        role="list"
        aria-label="Active alerts"
      >
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-44 rounded-lg"
            style={{ border:'1px dashed #1e1e1e' }}
          >
            <CheckCircle className="iglow-green h-8 w-8 text-[#39FF14] mb-2 opacity-60" aria-hidden="true" />
            <span className="text-[11px] font-mono text-neutral-400">SYSTEM OPTIMAL</span>
            <span className="text-[9px] text-neutral-600 font-mono mt-1">0 ACTIVE ALERTS</span>
          </div>
        ) : (
          filtered.map((al) => {
            const tok = P[al.priority];
            const isSelected = selectedAssetId === al.linkedAssetId;
            return (
              <div
                key={al.id}
                role="listitem"
                onClick={() => onSelectAsset(al.linkedAssetId)}
                className={`p-3 rounded-lg cursor-pointer flex flex-col transition-all ${tok.cardGlow} ${isSelected ? 'cglow-selected' : ''}`}
                style={{
                  background: tok.cardBg,
                  borderLeft:  `3px solid ${tok.accentColor}`,
                  border:      `1px solid ${tok.cardBorder}`,
                  borderLeftWidth: '3px',
                  borderLeftColor: tok.accentColor,
                }}
              >
                {/* Top row */}
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <StatusShape status={priorityToAstro(al.priority)} size={12} />
                    <span className="font-mono text-[10px] font-bold text-neutral-200">{al.id}</span>
                    <span
                      className="text-[9px] font-mono"
                      style={{ color: tok.accentColor + '99' }}
                    >
                      {al.linkedAssetId}
                    </span>
                  </div>
                  <span
                    className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded"
                    style={{ color: tok.accentColor, background: tok.tagBg, border:`1px solid ${tok.tagBorder}` }}
                  >
                    {al.priority.toUpperCase()}
                  </span>
                </div>

                {/* Message */}
                <p className="text-[10px] text-neutral-300 leading-relaxed mb-2.5">
                  {al.message}
                </p>

                {/* Footer */}
                <div
                  className="flex justify-between items-center pt-2"
                  style={{ borderTop:'1px solid #1e1e1e' }}
                >
                  <span className="text-[8px] font-mono text-neutral-600">{al.timestamp} UTC</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onAcknowledge(al.id); }}
                    className="flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded transition-all"
                    style={{ background:'#131313', border:'1px solid #252525', color:'#666' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color  = '#39FF14';
                      e.currentTarget.style.border = '1px solid rgba(57,255,20,0.35)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color  = '#666';
                      e.currentTarget.style.border = '1px solid #252525';
                    }}
                    aria-label={`Acknowledge ${al.id}`}
                  >
                    <CheckCheck className="h-2.5 w-2.5" aria-hidden="true" />
                    ACK
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
