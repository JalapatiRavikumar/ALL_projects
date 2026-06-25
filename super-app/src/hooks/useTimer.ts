'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
}

interface UseTimerReturn {
  time: TimerState;
  totalSeconds: number;
  initialSeconds: number;
  isRunning: boolean;
  setHours: (h: number) => void;
  setMinutes: (m: number) => void;
  setSeconds: (s: number) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  toggle: () => void;
}

export function useTimer(): UseTimerReturn {
  const [time, setTime]                   = useState<TimerState>({ hours: 5, minutes: 9, seconds: 0 });
  const [isRunning, setIsRunning]         = useState(false);
  const [totalSeconds, setTotalSeconds]   = useState(5 * 3600 + 9 * 60);
  const [initialSeconds, setInitialSeconds] = useState(5 * 3600 + 9 * 60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick every second when running
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // Keep display time in sync with totalSeconds while running
  useEffect(() => {
    if (isRunning) {
      setTime({
        hours:   Math.floor(totalSeconds / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
      });
    }
  }, [totalSeconds, isRunning]);

  const setHours = useCallback((h: number) => {
    if (isRunning) return;
    setTime((prev) => ({ ...prev, hours: Math.max(0, Math.min(99, h)) }));
  }, [isRunning]);

  const setMinutes = useCallback((m: number) => {
    if (isRunning) return;
    setTime((prev) => ({ ...prev, minutes: Math.max(0, Math.min(59, m)) }));
  }, [isRunning]);

  const setSeconds = useCallback((s: number) => {
    if (isRunning) return;
    setTime((prev) => ({ ...prev, seconds: Math.max(0, Math.min(59, s)) }));
  }, [isRunning]);

  const start = useCallback(() => {
    const secs = time.hours * 3600 + time.minutes * 60 + time.seconds;
    if (secs === 0) return;
    setTotalSeconds(secs);
    setInitialSeconds(secs);
    setIsRunning(true);
  }, [time]);

  const pause  = useCallback(() => setIsRunning(false), []);
  const toggle = useCallback(() => {
    if (isRunning) {
      pause();
    } else {
      if (totalSeconds === 0) {
        start();
      } else {
        setIsRunning(true);
      }
    }
  }, [isRunning, totalSeconds, start, pause]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTime({ hours: 0, minutes: 0, seconds: 0 });
    setTotalSeconds(0);
    setInitialSeconds(0);
  }, []);

  return { time, totalSeconds, initialSeconds, isRunning, setHours, setMinutes, setSeconds, start, pause, reset, toggle };
}
