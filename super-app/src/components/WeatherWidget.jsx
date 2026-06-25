import React, { useEffect, useState } from 'react';
import { Wind, Droplets, Thermometer, Cloud, CloudRain, Sun, CloudSnow, Zap } from 'lucide-react';
import { mockWeatherAPI } from '../services/apiServices';

// Map condition string → Lucide icon
function WeatherIcon({ condition, size = 46 }) {
  const c = (condition || '').toLowerCase();
  if (c.includes('rain') || c.includes('drizzle')) return <CloudRain size={size} />;
  if (c.includes('snow'))                           return <CloudSnow size={size} />;
  if (c.includes('thunder') || c.includes('storm')) return <Zap       size={size} />;
  if (c.includes('cloud'))                          return <Cloud      size={size} />;
  return <Sun size={size} />;
}

// Live clock — updates every second
function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const date = now.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="bg-[#FF4ADE] px-8 py-4 flex justify-between items-center text-white text-xl font-bold shrink-0">
      <span>{date}</span>
      <span>{time}</span>
    </div>
  );
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    mockWeatherAPI().then(setWeather);
  }, []);

  if (!weather) {
    return (
      <div className="rounded-3xl overflow-hidden flex flex-col h-full animate-pulse">
        <div className="h-14 bg-[#FF4ADE]/60 shrink-0" />
        <div className="flex-grow bg-[#101744]" />
      </div>
    );
  }

  return (
    <div className="rounded-3xl overflow-hidden flex flex-col shadow-lg h-full">

      {/* ── Pink header: live date + time ── */}
      <LiveClock />

      {/* ── Dark blue body: weather metrics ── */}
      <div className="bg-[#101744] flex-grow flex items-center justify-between px-6 text-white">

        {/* Condition icon */}
        <div className="flex flex-col items-center gap-2 w-1/3 border-r border-white/10 pr-4">
          <WeatherIcon condition={weather.condition} size={46} />
          <span className="text-sm font-medium text-center capitalize">
            {weather.condition}
          </span>
        </div>

        {/* Temperature + Pressure */}
        <div className="flex flex-col items-center gap-2 w-1/3 border-r border-white/10 px-4">
          <span className="text-4xl font-semibold">{weather.temp}°C</span>
          <div className="flex items-center gap-2 text-xs">
            <Thermometer size={16} className="text-gray-400 shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="font-medium">{weather.pressure}</span>
              <span className="text-gray-400">Pressure</span>
            </div>
          </div>
        </div>

        {/* Wind + Humidity */}
        <div className="flex flex-col gap-3 w-1/3 pl-4 text-sm">
          <div className="flex items-center gap-2">
            <Wind size={20} className="text-gray-400 shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="font-medium">{weather.wind}</span>
              <span className="text-gray-400">Wind</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets size={20} className="text-gray-400 shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="font-medium">{weather.humidity}</span>
              <span className="text-gray-400">Humidity</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
