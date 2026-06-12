// ============================================================================
// ASTRO UXDS STATUS SHAPE SYSTEM
// Each status level maps to a distinct geometric shape + color token.
// Dual-coded (color + shape) for full colorblind accessibility (WCAG 2.1 AA).
// ============================================================================
import React from 'react';
import type { AstroStatus } from '../types';

interface StatusShapeProps {
  status: AstroStatus;
  size?: number;
  className?: string;
}

interface ShapeStyle {
  stroke: string;
  fill: string;
}

function getShapeStyle(status: AstroStatus): ShapeStyle {
  switch (status) {
    case 'Critical': return { stroke: '#FF3838', fill: 'rgba(255,56,56,0.15)' };
    case 'Serious':  return { stroke: '#FFB302', fill: 'rgba(255,179,2,0.15)' };
    case 'Caution':  return { stroke: '#FCE83A', fill: 'rgba(252,232,58,0.15)' };
    case 'Normal':   return { stroke: '#56F000', fill: 'rgba(86,240,0,0.15)' };
    case 'Standby':  return { stroke: '#2DCCFF', fill: 'rgba(45,204,255,0.15)' };
    case 'Off':
    default:         return { stroke: '#9EA7AD', fill: 'rgba(158,167,173,0.15)' };
  }
}

export const StatusShape: React.FC<StatusShapeProps> = ({
  status,
  size = 16,
  className = '',
}) => {
  const { stroke, fill } = getShapeStyle(status);
  const sw = 10; // strokeWidth in 100-unit viewBox

  switch (status) {
    // ── Critical: Square ───────────────────────────────────────────
    case 'Critical':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Critical">
          <rect x="12" y="12" width="76" height="76" rx="4"
            stroke={stroke} strokeWidth={sw} fill={fill} />
        </svg>
      );

    // ── Serious: Triangle ──────────────────────────────────────────
    case 'Serious':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Serious">
          <polygon points="50,10 90,85 10,85"
            stroke={stroke} strokeWidth={sw} strokeLinejoin="round" fill={fill} />
        </svg>
      );

    // ── Caution: Diamond ───────────────────────────────────────────
    case 'Caution':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Caution">
          <polygon points="50,10 90,50 50,90 10,50"
            stroke={stroke} strokeWidth={sw} strokeLinejoin="round" fill={fill} />
        </svg>
      );

    // ── Normal: Circle ─────────────────────────────────────────────
    case 'Normal':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Normal">
          <circle cx="50" cy="50" r="40"
            stroke={stroke} strokeWidth={sw} fill={fill} />
        </svg>
      );

    // ── Standby: Rounded Rectangle ─────────────────────────────────
    case 'Standby':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Standby">
          <rect x="10" y="25" width="80" height="50" rx="16"
            stroke={stroke} strokeWidth={sw} fill={fill} />
        </svg>
      );

    // ── Off: Hexagon ───────────────────────────────────────────────
    case 'Off':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-label="Off">
          <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
            stroke={stroke} strokeWidth={sw} strokeLinejoin="round" fill={fill} />
        </svg>
      );
  }
};
