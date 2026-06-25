import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileWidget from '../components/ProfileWidget';
import WeatherWidget from '../components/WeatherWidget';
import NotesWidget   from '../components/NotesWidget';
import TimerWidget   from '../components/TimerWidget';
import NewsWidget    from '../components/NewsWidget';

/**
 * Dashboard Page — 3-column grid layout
 *
 * Column 1: ProfileWidget + WeatherWidget
 * Column 2: NotesWidget   + TimerWidget
 * Column 3: NewsWidget (full height, spans both rows)
 */
export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center"
         style={{ padding: '32px 40px' }}>

      <div
        className="grid w-full gap-8"
        style={{
          maxWidth: '1400px',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: 'auto auto',
        }}
      >
        {/* ── Column 1, Row 1: Profile ── */}
        <div style={{ height: '320px' }}>
          <ProfileWidget />
        </div>

        {/* ── Column 2, Row 1: Notes ── */}
        <div style={{ height: '320px' }}>
          <NotesWidget />
        </div>

        {/* ── Column 3, Rows 1+2: News (full height) ── */}
        <div style={{ gridRow: '1 / 3', height: '580px' }}>
          <NewsWidget />
        </div>

        {/* ── Column 1, Row 2: Weather ── */}
        <div style={{ height: '230px' }}>
          <WeatherWidget />
        </div>

        {/* ── Column 2, Row 2: Timer ── */}
        <div style={{ height: '230px' }}>
          <TimerWidget />
        </div>
      </div>

      {/* Browse button */}
      <div className="flex justify-end mt-8 w-full" style={{ maxWidth: '1400px' }}>
        <button
          id="browse-btn"
          onClick={() => navigate('/movies')}
          className="bg-[#148A08] hover:bg-green-600 text-white font-bold
            px-12 py-3 rounded-full text-xl tracking-wider transition-colors shadow-lg"
        >
          Browse
        </button>
      </div>

    </div>
  );
}
