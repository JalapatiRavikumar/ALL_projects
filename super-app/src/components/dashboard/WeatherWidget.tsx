'use client';

import { useEffect, useState } from 'react';
import {
  Wind, Droplets, Thermometer, Cloud, CloudRain,
  Sun, CloudSnow, Zap,
} from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';

// ─── Weather icon selector ────────────────────────────────────────────────────
function WeatherIcon({ condition, size = 44 }: { condition: string; size?: number }) {
  const c = condition.toLowerCase();
  if (c.includes('rain') || c.includes('drizzle')) return <CloudRain size={size} />;
  if (c.includes('snow'))                           return <CloudSnow size={size} />;
  if (c.includes('thunder') || c.includes('storm')) return <Zap       size={size} />;
  if (c.includes('cloud'))                          return <Cloud      size={size} />;
  return <Sun size={size} />;
}

// ─── Live clock ───────────────────────────────────────────────────────────────
function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const date = now.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="bg-[#FF4ADE] px-6 py-3.5 flex justify-between items-center text-white font-bold text-lg shrink-0">
      <span>{date}</span>
      <span>{time}</span>
    </div>
  );
}

// ─── Weather Widget ───────────────────────────────────────────────────────────
export default function WeatherWidget() {
  const { weather, loading } = useWeather();

  if (loading) {
    return (
      <div className="rounded-3xl overflow-hidden flex flex-col h-full animate-pulse">
        <div className="h-14 bg-[#FF4ADE]/50 shrink-0" />
        <div className="flex-grow bg-[#101744]/60" />
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="rounded-3xl overflow-hidden flex flex-col shadow-xl h-full">
      {/* Pink header — live clock */}
      <LiveClock />

      {/* Dark-blue body — weather metrics */}
      <div className="bg-[#101744] flex-grow flex items-center justify-between px-6 text-white">
        {/* Condition */}
        <div className="flex flex-col items-center gap-2 w-1/3 border-r border-white/10 pr-4">
          <WeatherIcon condition={weather.condition} size={40} />
          <span className="text-xs font-medium text-center capitalize">{weather.condition}</span>
        </div>

        {/* Temp + Pressure */}
        <div className="flex flex-col items-center gap-2 w-1/3 border-r border-white/10 px-4">
          <span className="text-4xl font-semibold">{weather.temp}°C</span>
          <div className="flex items-center gap-1.5 text-xs text-gray-300">
            <Thermometer size={14} className="shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="font-medium text-white">{weather.pressure}</span>
              <span>Pressure</span>
            </div>
          </div>
        </div>

        {/* Wind + Humidity */}
        <div className="flex flex-col gap-3 w-1/3 pl-4 text-xs">
          <div className="flex items-center gap-2">
            <Wind size={18} className="text-gray-400 shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="font-medium text-white">{weather.wind}</span>
              <span className="text-gray-400">Wind</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets size={18} className="text-gray-400 shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="font-medium text-white">{weather.humidity}</span>
              <span className="text-gray-400">Humidity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
