'use client';

import { ChevronUp, ChevronDown } from 'lucide-react';
import { useTimer } from '@/hooks/useTimer';

// ─── Individual H/M/S spinner ─────────────────────────────────────────────────
interface SpinnerProps {
  value: number;
  onInc: () => void;
  onDec: () => void;
  disabled: boolean;
}
function Spinner({ value, onInc, onDec, disabled }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        onClick={onInc}
        disabled={disabled}
        aria-label="Increase"
        className={`text-gray-400 hover:text-white transition-colors ${disabled ? 'opacity-0 pointer-events-none' : ''}`}
      >
        <ChevronUp size={32} />
      </button>
      <span className="text-5xl font-light text-white tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <button
        onClick={onDec}
        disabled={disabled}
        aria-label="Decrease"
        className={`text-gray-400 hover:text-white transition-colors ${disabled ? 'opacity-0 pointer-events-none' : ''}`}
      >
        <ChevronDown size={32} />
      </button>
    </div>
  );
}

// ─── Timer Widget ─────────────────────────────────────────────────────────────
export default function TimerWidget() {
  const {
    time, totalSeconds, initialSeconds, isRunning,
    setHours, setMinutes, setSeconds, toggle, reset,
  } = useTimer();

  // SVG ring progress
  const radius        = 62;
  const circumference = 2 * Math.PI * radius;
  const progress      = initialSeconds > 0 ? totalSeconds / initialSeconds : 0;
  const dashOffset    = circumference * (1 - progress);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="bg-[#1E1E2F] rounded-3xl p-5 flex flex-col md:flex-row items-center gap-6 h-full shadow-xl">

      {/* ── SVG Progress Ring ── */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg className="-rotate-90 w-40 h-40" viewBox="0 0 136 136">
          {/* Track */}
          <circle cx="68" cy="68" r={radius} stroke="#1a1a3e" strokeWidth="6" fill="transparent" />
          {/* Progress */}
          <circle
            cx="68" cy="68" r={radius}
            stroke="#FF4ADE" strokeWidth="6" fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        {/* Centre countdown display */}
        <div className="absolute text-[1.35rem] text-white font-medium tracking-wider tabular-nums">
          {pad(Math.floor(totalSeconds / 3600))}:{pad(Math.floor((totalSeconds % 3600) / 60))}:{pad(totalSeconds % 60)}
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="flex flex-col flex-1 items-center w-full gap-3">
        {/* Labels */}
        <div className="flex justify-between w-full text-gray-400 text-sm font-medium px-2">
          {['Hours', 'Minutes', 'Seconds'].map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>

        {/* H : M : S spinners */}
        <div className="flex items-center justify-between w-full gap-1">
          <Spinner
            value={time.hours}
            onInc={() => setHours(time.hours + 1)}
            onDec={() => setHours(time.hours - 1)}
            disabled={isRunning}
          />
          <span className="text-3xl text-gray-400 pb-1">:</span>
          <Spinner
            value={time.minutes}
            onInc={() => setMinutes(time.minutes + 1)}
            onDec={() => setMinutes(time.minutes - 1)}
            disabled={isRunning}
          />
          <span className="text-3xl text-gray-400 pb-1">:</span>
          <Spinner
            value={time.seconds}
            onInc={() => setSeconds(time.seconds + 1)}
            onDec={() => setSeconds(time.seconds - 1)}
            disabled={isRunning}
          />
        </div>

        {/* Start / Pause button */}
        <button
          id="timer-toggle-btn"
          onClick={toggle}
          className="w-full bg-[#FF4ADE] hover:opacity-90 text-white py-3 rounded-full font-bold text-xl tracking-wide transition-all shadow-lg shadow-pink-900/30 active:scale-95"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>

        {/* Reset */}
        {(totalSeconds > 0 || isRunning) && (
          <button
            onClick={reset}
            className="text-gray-500 hover:text-white text-sm transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
