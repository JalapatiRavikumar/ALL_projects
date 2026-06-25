'use client';

import { useState, useEffect } from 'react';
import type { WeatherData } from '@/types';
import { WEATHER_DATA } from '@/constants/data';

interface UseWeatherReturn {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}

export function useWeather(): UseWeatherReturn {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    // Simulate async fetch with mock data (swap for real OpenWeatherMap call below)
    const timer = setTimeout(() => {
      try {
        setWeather(WEATHER_DATA);
        setLoading(false);
      } catch {
        setError('Failed to load weather data');
        setLoading(false);
      }
    }, 600);

    return () => clearTimeout(timer);

    /* ── Real API usage (uncomment and set NEXT_PUBLIC_WEATHER_API_KEY) ──────
    const fetchWeather = async () => {
      try {
        const key  = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
        const city = 'London';
        const res  = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`
        );
        if (!res.ok) throw new Error('Weather API error');
        const data = await res.json();
        setWeather({
          condition: data.weather[0].description,
          temp:      Math.round(data.main.temp),
          pressure:  `${data.main.pressure} mbar`,
          wind:      `${data.wind.speed} km/h`,
          humidity:  `${data.main.humidity}%`,
          icon:      data.weather[0].icon,
        });
      } catch (err) {
        setError('Failed to load weather');
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
    ─────────────────────────────────────────────────────────────────────── */
  }, []);

  return { weather, loading, error };
}
