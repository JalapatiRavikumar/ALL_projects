// ============================================================================
// TACTICAL MAP — NEON-GREEN zone, Center-Bottom (58%)
//
// Asset dot color = ASSET TYPE (not status):
//   Patrol  → #2DCCFF  cyan
//   Rescue  → #39FF14  neon-green
//   Support → #FF9500  orange
//
// Asset status shown via:
//   • Dot SIZE   (SignalLoss = large pulsing blob)
//   • Outer RING (status color ring around type-colored dot)
//   • TRAIL dash pattern
//
// Interactions:
//   • Click dot  → select asset (drives detail panel)
//   • Hover dot  → show tooltip with name + status + signal
//   • Scroll     → zoom
//   • Drag       → pan
//   • RESET btn  → restore default view
// ============================================================================
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Radar } from 'lucide-react';
import { StatusShape } from './StatusShape';
import type { Asset, AssetType, AssetStatus } from '../types';
import { statusColor } from '../types';

interface TacticalMapProps {
  assets:          Asset[];
  selectedAssetId: string | null;
  onSelectAsset:   (id: string) => void;
}

// ── AOR bounding box (Mumbai region) ─────────────────────────────────────
const LAT_MIN = 18.90;  const LAT_MAX = 19.35;
const LON_MIN = 72.75;  const LON_MAX = 72.95;
const W = 600;          const H = 480;
const CX = W / 2;       const CY = H / 2;

function project(lat: number, lon: number): [number, number] {
  return [
    ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * W,
    H - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * H,
  ];
}

// ── TYPE color map (consistent with Roster & Detail) ─────────────────────
const TYPE_COLOR: Record<AssetType, string> = {
  Patrol:  '#2DCCFF',
  Rescue:  '#39FF14',
  Support: '#FF9500',
};

// ── STATUS ring color ─────────────────────────────────────────────────────
const STATUS_RING: Record<AssetStatus, string> = {
  Active:     '#39FF14',
  Standby:    '#2DCCFF',
  Unstable:   '#FCE83A',
  SignalLoss: '#FF3838',
};

// ── Arrow marker map ──────────────────────────────────────────────────────
const ARROW_MARKERS: Array<{ id: string; color: string }> = [
  { id:'arr-patrol',  color:'#2DCCFF' },
  { id:'arr-rescue',  color:'#39FF14' },
  { id:'arr-support', color:'#FF9500' },
];

// ── Glow filter IDs ───────────────────────────────────────────────────────
const GLOW_FILTERS: Array<{ id: string; color: string; blur: number }> = [
  { id:'gf-sweep',   color:'#39FF14', blur: 3 },
  { id:'gf-patrol',  color:'#2DCCFF', blur: 4 },
  { id:'gf-rescue',  color:'#39FF14', blur: 4 },
  { id:'gf-support', color:'#FF9500', blur: 4 },
  { id:'gf-red',     color:'#FF3838', blur: 5 },
];

type Transform = { x:number; y:number; scale:number };
type HoveredInfo = { id:string; x:number; y:number } | null;

export const TacticalMap: React.FC<TacticalMapProps> = ({ assets, selectedAssetId, onSelectAsset }) => {
  const svgRef   = useRef<SVGSVGElement>(null);
  const [xform,   setXform]   = useState<Transform>({ x:0, y:0, scale:1 });
  const [dragging,setDragging]= useState(false);
  const [hovered, setHovered] = useState<HoveredInfo>(null);
  const dragStart = useRef<{ mx:number; my:number; tx:number; ty:number }|null>(null);

  // ── Pan ──────────────────────────────────────────────────────────────
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setDragging(true);
    dragStart.current = { mx:e.clientX, my:e.clientY, tx:xform.x, ty:xform.y };
  }, [xform]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !dragStart.current) return;
    setXform((t) => ({
      ...t,
      x: dragStart.current!.tx + (e.clientX - dragStart.current!.mx),
      y: dragStart.current!.ty + (e.clientY - dragStart.current!.my),
    }));
  }, [dragging]);

  const stopDrag = useCallback(() => {
    setDragging(false);
    dragStart.current = null;
  }, []);

  // ── Zoom ─────────────────────────────────────────────────────────────
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setXform((t) => ({
      ...t,
      scale: Math.min(Math.max(t.scale * (e.deltaY > 0 ? 0.9 : 1.1), 0.3), 8),
    }));
  }, []);

  // ── Radar sweep ──────────────────────────────────────────────────────
  const [sweepAngle, setSweepAngle] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSweepAngle((a) => (a + 1.8) % 360), 28);
    return () => clearInterval(id);
  }, []);

  const SWEEP_R = Math.hypot(W, H);
  const swRad   = ((sweepAngle - 90) * Math.PI) / 180;
  const swX2    = CX + SWEEP_R * Math.cos(swRad);
  const swY2    = CY + SWEEP_R * Math.sin(swRad);

  // Tooltip data
  const hoveredAsset = hovered ? assets.find((a) => a.id === hovered.id) : null;

  return (
    <section className="zone-map flex flex-col h-full overflow-hidden select-none">

      {/* ── Header bar ─────────────────────────────────────────── */}
      <div
        className="hbar-green flex items-center justify-between px-3 py-2 flex-shrink-0"
        style={{ background:'#060a06', borderBottom:'1px solid rgba(57,255,20,0.12)' }}
      >
        <h2 className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em]">
          <Radar className="iglow-green h-4 w-4 text-[#39FF14] animate-spin-slow" aria-hidden="true" />
          <span className="tglow-green text-[#39FF14]">TACTICAL MAP</span>
        </h2>

        <div className="flex items-center gap-4">
          {/* Type legend */}
          {(Object.entries(TYPE_COLOR) as [AssetType, string][]).map(([type, col]) => (
            <span key={type} className="flex items-center gap-1 text-[9px] font-mono" style={{ color: col + 'cc' }}>
              <span style={{ color: col, filter:`drop-shadow(0 0 3px ${col})` }}>●</span>
              {type}
            </span>
          ))}

          <button
            onClick={() => setXform({ x:0, y:0, scale:1 })}
            className="text-[8px] font-mono px-2 py-0.5 rounded transition-all"
            style={{ color:'#555', border:'1px solid #1a1a1a', background:'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.color='#39FF14'; e.currentTarget.style.border='1px solid rgba(57,255,20,0.30)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color='#555';    e.currentTarget.style.border='1px solid #1a1a1a'; }}
            aria-label="Reset map view"
          >
            RESET
          </button>
        </div>
      </div>

      {/* ── SVG canvas ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden relative">
        <svg
          ref={svgRef}
          className={`w-full h-full ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={() => { stopDrag(); setHovered(null); }}
          onWheel={onWheel}
          role="img"
          aria-label="Tactical map showing asset positions"
        >
          <defs>
            {/* Glow filters */}
            {GLOW_FILTERS.map(({ id, color, blur }) => (
              <filter key={id} id={id} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation={blur} result="b" />
                <feFlood floodColor={color} floodOpacity="0.7" result="c" />
                <feComposite in="c" in2="b" operator="in" result="gc" />
                <feMerge><feMergeNode in="gc"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            ))}

            {/* Arrow markers — one per type */}
            {ARROW_MARKERS.map(({ id, color }) => (
              <marker key={id} id={id} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <polygon points="0,0 7,3.5 0,7" fill={color} opacity="0.85" />
              </marker>
            ))}

            {/* Clip */}
            <clipPath id="map-clip"><rect width={W} height={H} /></clipPath>

            {/* Pulse animations */}
            <style>{`
              @keyframes pulse-ring {
                0%   { r: 8; opacity: 1; }
                100% { r: 26; opacity: 0; }
              }
              @keyframes pulse-loss {
                0%,100% { opacity: 0.8; }
                50%     { opacity: 0.2; }
              }
              .ring-pulse  { animation: pulse-ring 1.8s ease-out infinite; }
              .loss-pulse  { animation: pulse-loss 0.8s ease-in-out infinite; }
            `}</style>
          </defs>

          {/* ── Background ────────────────────────────────────── */}
          <rect width={W} height={H} fill="#050a05" />

          {/* ── Fixed: grid ───────────────────────────────────── */}
          {Array.from({length:7}).map((_,i)=>(
            <line key={`h${i}`} x1={0} y1={(H/6)*i} x2={W} y2={(H/6)*i} stroke="#0e1a0e" strokeWidth="0.5" />
          ))}
          {Array.from({length:9}).map((_,i)=>(
            <line key={`v${i}`} x1={(W/8)*i} y1={0} x2={(W/8)*i} y2={H} stroke="#0e1a0e" strokeWidth="0.5" />
          ))}

          {/* ── Fixed: radar rings ────────────────────────────── */}
          {[70,140,210,280,350].map((r)=>(
            <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke="#122012" strokeWidth="0.75" />
          ))}
          {/* Ring labels */}
          {[70,140,210,280].map((r,i)=>(
            <text key={r} x={CX+4} y={CY-r-3} fontSize="6" fill="#1a3a1a" fontFamily="monospace">
              {(i+1)*25}km
            </text>
          ))}

          {/* ── Fixed: sweep ──────────────────────────────────── */}
          <g clipPath="url(#map-clip)">
            {/* Fade trail */}
            {Array.from({length:28}).map((_,i)=>{
              const ang = ((sweepAngle - 90 - i*3 + 720) % 360);
              const r2  = (ang * Math.PI) / 180;
              return (
                <line key={i}
                  x1={CX} y1={CY}
                  x2={CX + SWEEP_R*Math.cos(r2)}
                  y2={CY + SWEEP_R*Math.sin(r2)}
                  stroke="#39FF14" strokeWidth="0.5"
                  opacity={(1 - i/28) * 0.25}
                />
              );
            })}
            {/* Main sweep line */}
            <line x1={CX} y1={CY} x2={swX2} y2={swY2}
              stroke="#39FF14" strokeWidth="1.5" opacity="0.75"
              filter="url(#gf-sweep)" />
          </g>

          {/* ── Fixed: crosshair ──────────────────────────────── */}
          <line x1={CX-10} y1={CY} x2={CX+10} y2={CY} stroke="#163016" strokeWidth="1" />
          <line x1={CX} y1={CY-10} x2={CX} y2={CY+10} stroke="#163016" strokeWidth="1" />

          {/* ══ Pannable / Zoomable asset layer ═══════════════════ */}
          <g transform={`translate(${xform.x},${xform.y}) scale(${xform.scale})`}
             clipPath="url(#map-clip)">

            {/* Position trails — colored by asset TYPE */}
            {assets.map((a) => {
              const trail = a.positionHistory;
              if (trail.length < 2) return null;
              const pts = trail.map(([la,lo]) => {
                const [px,py] = project(la,lo);
                return `${px},${py}`;
              }).join(' ');
              return (
                <polyline key={`trail-${a.id}`}
                  points={pts} fill="none"
                  stroke={TYPE_COLOR[a.type]}
                  strokeWidth="0.7" strokeDasharray="3 4" opacity="0.25"
                />
              );
            })}

            {/* Asset dots */}
            {assets.map((asset) => {
              const [ax, ay]   = project(asset.lat, asset.lon);
              const typeColor  = TYPE_COLOR[asset.type];
              const statusRing = STATUS_RING[asset.status];
              const isSelected = selectedAssetId === asset.id;
              const isLoss     = asset.status === 'SignalLoss';
              const glowId     = asset.type === 'Patrol'
                ? 'gf-patrol' : asset.type === 'Rescue'
                ? 'gf-rescue' : 'gf-support';
              const arrowId    = asset.type === 'Patrol'
                ? 'arr-patrol' : asset.type === 'Rescue'
                ? 'arr-rescue' : 'arr-support';

              // Bearing vector (type-colored arrow)
              const bRad     = ((asset.bearing - 90) * Math.PI) / 180;
              const arrowLen = 20 / xform.scale;
              const bx2 = ax + arrowLen * Math.cos(bRad);
              const by2 = ay + arrowLen * Math.sin(bRad);

              return (
                <g
                  key={asset.id}
                  transform={`translate(${ax},${ay})`}
                  onClick={(e) => { e.stopPropagation(); onSelectAsset(asset.id); }}
                  onMouseEnter={() => setHovered({ id:asset.id, x:ax, y:ay })}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor:'pointer' }}
                  role="button"
                  aria-label={`${asset.name} ${asset.status}`}
                >
                  {/* SignalLoss: large pulsing red blob */}
                  {isLoss && (
                    <circle className="loss-pulse" r="12"
                      fill={statusRing} opacity="0.15"
                      filter="url(#gf-red)" />
                  )}

                  {/* Status ring (outer) */}
                  <circle r={isLoss ? 9 : 8}
                    fill="none"
                    stroke={statusRing}
                    strokeWidth={isLoss ? 1.8 : 1.2}
                    opacity={isLoss ? 0.9 : 0.55}
                  />

                  {/* Type-colored filled dot */}
                  <circle r={isLoss ? 5.5 : 4.5}
                    fill={typeColor}
                    opacity={isLoss ? 0.4 : 0.90}
                    filter={`url(#${glowId})`}
                  />

                  {/* Selection: animated pulse ring */}
                  {isSelected && (
                    <circle className="ring-pulse"
                      r="8" fill="none"
                      stroke={typeColor}
                      strokeWidth="1.5"
                      opacity="0.9"
                    />
                  )}

                  {/* Selection: static outer ring */}
                  {isSelected && (
                    <circle r="16" fill="none"
                      stroke={typeColor}
                      strokeWidth="0.8"
                      strokeDasharray="4 3"
                      opacity="0.45"
                    />
                  )}

                  {/* Bearing arrow — type color */}
                  {asset.velocity > 0 && (
                    <line
                      x1={0} y1={0}
                      x2={bx2-ax} y2={by2-ay}
                      stroke={typeColor}
                      strokeWidth={1.4 / xform.scale}
                      opacity="0.75"
                      markerEnd={`url(#${arrowId})`}
                    />
                  )}

                  {/* Name label — always visible for selected, hover otherwise handled by tooltip */}
                  {isSelected && (
                    <text
                      x={10} y={-12}
                      fontSize={9 / xform.scale}
                      fill={typeColor}
                      fontFamily="monospace"
                      fontWeight="bold"
                      style={{ pointerEvents:'none',
                               filter:`drop-shadow(0 0 3px ${typeColor}88)` }}
                    >
                      {asset.name}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* ── Hover tooltip (SVG overlay, fixed coords) ─────── */}
          {hoveredAsset && hovered && !selectedAssetId && (() => {
            const typeCol   = TYPE_COLOR[hoveredAsset.type];
            const statusCol = STATUS_RING[hoveredAsset.status];
            // Convert asset SVG coords → tooltip position
            const tx = Math.min(hovered.x * xform.scale + xform.x + 14, W - 120);
            const ty = Math.max(hovered.y * xform.scale + xform.y - 40, 6);
            return (
              <g transform={`translate(${tx},${ty})`} style={{pointerEvents:'none'}}>
                <rect x={0} y={0} width={110} height={46} rx={4}
                  fill="#0a0e0a" stroke={typeCol} strokeWidth="0.8" opacity="0.95"
                  style={{ filter:`drop-shadow(0 0 6px ${typeCol}55)` }}
                />
                <text x={6} y={13} fontSize="9" fill={typeCol} fontFamily="monospace" fontWeight="bold">
                  {hoveredAsset.name}
                </text>
                <text x={6} y={24} fontSize="7.5" fill={statusCol} fontFamily="monospace">
                  {hoveredAsset.status} · {hoveredAsset.signalStrength}% sig
                </text>
                <text x={6} y={34} fontSize="7" fill="#555" fontFamily="monospace">
                  {hoveredAsset.type} · {hoveredAsset.velocity.toFixed(0)} km/h
                </text>
                <text x={6} y={43} fontSize="6.5" fill="#333" fontFamily="monospace">
                  {hoveredAsset.lat.toFixed(3)}, {hoveredAsset.lon.toFixed(3)}
                </text>
              </g>
            );
          })()}

          {/* ── Zoom level ────────────────────────────────────── */}
          <text x={W-6} y={H-6} fontSize="7" fill="#163016" textAnchor="end" fontFamily="monospace">
            ×{xform.scale.toFixed(1)}
          </text>
        </svg>
      </div>

      {/* ── Status legend strip ────────────────────────────────── */}
      <div
        className="flex-shrink-0 px-3 py-1.5 flex items-center gap-5"
        style={{ background:'#060a06', borderTop:'1px solid rgba(57,255,20,0.08)' }}
      >
        {/* Status ring legend */}
        {(['Normal','Caution','Critical','Standby'] as const).map((s) => (
          <span key={s} className="flex items-center gap-1 text-[8px] font-mono text-neutral-600">
            <StatusShape status={s} size={8} />
            {s.toUpperCase()}
          </span>
        ))}
        <span className="ml-auto text-[8px] font-mono" style={{ color:'rgba(57,255,20,0.30)' }}>
          MUMBAI AOR · GRID
        </span>
      </div>
    </section>
  );
};
