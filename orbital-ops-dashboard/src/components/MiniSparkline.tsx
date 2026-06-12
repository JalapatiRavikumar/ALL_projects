// ============================================================================
// MINI SPARKLINE — Inline telemetry trend chart
// Renders signal strength or battery history as a small SVG polyline.
// Color shifts: green (>60) → amber (30–60) → red (<30)
// ============================================================================
import React, { useId } from 'react';

interface MiniSparklineProps {
  data: number[];       // array of values 0–100
  width?: number;
  height?: number;
  label?: string;
}

function trendColor(latest: number): string {
  if (latest > 60) return '#56F000';
  if (latest > 30) return '#FFB302';
  return '#FF3838';
}

export const MiniSparkline: React.FC<MiniSparklineProps> = ({
  data,
  width = 80,
  height = 24,
  label,
}) => {
  // Stable unique id per instance — avoids duplicate SVG defs ids
  const uid = useId().replace(/:/g, '');
  const gradId = `sg-${uid}`;

  if (!data || data.length < 2) return null;

  const pad = 2;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;

  // Build polyline points
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * w;
    const y = pad + h - ((v - min) / range) * h;
    return { x, y };
  });

  const polylinePoints = pts.map((p) => `${p.x},${p.y}`).join(' ');

  // Area path: polyline + drop down to bottom edge
  const first = pts[0];
  const last  = pts[pts.length - 1];
  const areaPath =
    `M ${first.x},${first.y} ` +
    pts.slice(1).map((p) => `L ${p.x},${p.y}`).join(' ') +
    ` L ${last.x},${pad + h} L ${first.x},${pad + h} Z`;

  const latest = data[data.length - 1];
  const color  = trendColor(latest);

  return (
    <div className="flex flex-col items-start">
      {label && (
        <span className="text-[9px] font-mono text-neutral-500 uppercase mb-0.5">{label}</span>
      )}
      <svg
        width={width}
        height={height}
        aria-label={label ?? 'sparkline'}
        overflow="visible"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity="0.30" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Area fill under the line */}
        <path d={areaPath} fill={`url(#${gradId})`} />

        {/* The line itself */}
        <polyline
          points={polylinePoints}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* Endpoint dot */}
        <circle cx={last.x} cy={last.y} r="2" fill={color} />
      </svg>
    </div>
  );
};
