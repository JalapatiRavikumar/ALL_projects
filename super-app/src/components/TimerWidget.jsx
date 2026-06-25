import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const TimeInput = ({ value, onInc, onDec, disabled }) => (
  <div className="flex flex-col items-center gap-1">
    <button
      onClick={onInc}
      disabled={disabled}
      className={`text-gray-400 hover:text-white transition-opacity ${disabled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <ChevronUp size={36} />
    </button>
    <span className="text-5xl font-light px-2 text-white">{String(value).padStart(2, '0')}</span>
    <button
      onClick={onDec}
      disabled={disabled}
      className={`text-gray-400 hover:text-white transition-opacity ${disabled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <ChevronDown size={36} />
    </button>
  </div>
);

export default function TimerWidget() {
  const [time,           setTime]           = useState({ h: 5, m: 9, s: 0 });
  const [isActive,       setIsActive]       = useState(false);
  const [totalSeconds,   setTotalSeconds]   = useState(5 * 3600 + 9 * 60);
  const [initialSeconds, setInitialSeconds] = useState(5 * 3600 + 9 * 60);

  // Countdown tick
  useEffect(() => {
    if (!isActive) return;
    if (totalSeconds === 0) { setIsActive(false); return; }

    const id = setInterval(() => setTotalSeconds(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [isActive, totalSeconds]);

  // Sync display time while running
  useEffect(() => {
    if (isActive) {
      setTime({
        h: Math.floor(totalSeconds / 3600),
        m: Math.floor((totalSeconds % 3600) / 60),
        s: totalSeconds % 60,
      });
    }
  }, [totalSeconds, isActive]);

  const handleStart = () => {
    if (!isActive && totalSeconds === 0) {
      const secs = time.h * 3600 + time.m * 60 + time.s;
      if (secs > 0) {
        setTotalSeconds(secs);
        setInitialSeconds(secs);
        setIsActive(true);
      }
    } else {
      setIsActive(prev => !prev);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setTime({ h: 0, m: 0, s: 0 });
    setTotalSeconds(0);
    setInitialSeconds(0);
  };

  const adjust = (unit, max, delta) => {
    if (isActive) return;
    setTime(prev => {
      const newVal = (prev[unit] + delta + max + 1) % (max + 1);
      return { ...prev, [unit]: newVal };
    });
  };

  const pad = (n) => String(n).padStart(2, '0');

  // SVG circle progress
  const radius        = 65;
  const circumference = 2 * Math.PI * radius;
  const progress      = initialSeconds > 0 ? totalSeconds / initialSeconds : 0;
  const strokeDash    = circumference - progress * circumference;

  return (
    <div className="bg-[#1E1E2F] rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 h-full shadow-lg">
      {/* ── Circle ── */}
      <div className="relative flex items-center justify-center shrink-0 ml-2">
        <svg className="-rotate-90 w-44 h-44 drop-shadow-2xl" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={radius} stroke="#101744"  strokeWidth="6" fill="transparent" />
          <circle
            cx="70" cy="70" r={radius}
            stroke="#FF4ADE" strokeWidth="6" fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDash}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute text-3xl text-white font-medium tracking-wider">
          {pad(Math.floor(totalSeconds / 3600))}:{pad(Math.floor((totalSeconds % 3600) / 60))}:{pad(totalSeconds % 60)}
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="flex flex-col flex-grow items-center w-full pr-2">
        {/* Labels */}
        <div className="flex justify-between w-full text-gray-400 font-medium mb-1 px-4">
          {['Hours', 'Minutes', 'Seconds'].map(l => (
            <span key={l} className="text-lg">{l}</span>
          ))}
        </div>

        {/* H : M : S pickers */}
        <div className="flex items-center justify-between w-full mb-5 gap-2">
          <TimeInput value={time.h} onInc={() => adjust('h', 99,  1)} onDec={() => adjust('h', 99, -1)} disabled={isActive} />
          <span className="text-4xl text-gray-300 pb-1">:</span>
          <TimeInput value={time.m} onInc={() => adjust('m', 59,  1)} onDec={() => adjust('m', 59, -1)} disabled={isActive} />
          <span className="text-4xl text-gray-300 pb-1">:</span>
          <TimeInput value={time.s} onInc={() => adjust('s', 59,  1)} onDec={() => adjust('s', 59, -1)} disabled={isActive} />
        </div>

        {/* Start / Pause button */}
        <button
          onClick={handleStart}
          className="w-full bg-[#FF4ADE] text-white py-3 rounded-full font-bold text-2xl tracking-wide hover:opacity-90 transition-all shadow-lg"
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
      </div>
    </div>
  );
}
