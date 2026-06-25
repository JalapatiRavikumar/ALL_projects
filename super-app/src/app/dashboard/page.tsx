'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Compass } from 'lucide-react';
import { useSuperStore } from '@/store/useSuperStore';
import ProfileCard   from '@/components/dashboard/ProfileCard';
import NotesWidget   from '@/components/dashboard/NotesWidget';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import TimerWidget   from '@/components/dashboard/TimerWidget';
import NewsFeed      from '@/components/dashboard/NewsFeed';

export default function DashboardPage() {
  const router = useRouter();
  const user   = useSuperStore((s) => s.user);

  // Guard — redirect to register if not logged in
  useEffect(() => {
    if (!user.isRegistered) {
      router.replace('/');
    }
  }, [user.isRegistered, router]);

  if (!user.isRegistered) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 lg:px-10 py-4 border-b border-white/5 animate-fade-in">
        <p className="font-pacifico text-2xl neon-green">Super app</p>

        {/* Username chip */}
        <div className="flex items-center gap-2 glass px-4 py-1.5 rounded-full animate-slide-in-right">
          <Compass size={16} className="text-[#72DB73]" />
          <span className="text-sm font-semibold tracking-wide text-white uppercase">
            {user.username || user.name}
          </span>
        </div>
      </header>

      {/* ── Main grid ───────────────────────────────────────────────────── */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-5 p-6 lg:p-10 auto-rows-auto">

        {/* Row 1 */}

        {/* Col 1-2: Profile + Weather stacked */}
        <div className="md:col-span-2 grid grid-rows-[auto_auto] gap-5">

          {/* Profile Card */}
          <div className="animate-fade-in-up" style={{ animationDelay: '50ms' }}>
            <ProfileCard />
          </div>

          {/* Weather Widget */}
          <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <WeatherWidget />
          </div>
        </div>

        {/* Col 3: News Feed — spans 2 rows */}
        <div className="md:row-span-2 animate-slide-in-right" style={{ animationDelay: '100ms', minHeight: '480px' }}>
          <NewsFeed />
        </div>

        {/* Row 2 */}

        {/* Col 1-2: Notes + Timer */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Notes Widget */}
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms', minHeight: '260px' }}>
            <NotesWidget />
          </div>

          {/* Timer Widget */}
          <div className="animate-fade-in-up" style={{ animationDelay: '250ms', minHeight: '260px' }}>
            <TimerWidget />
          </div>
        </div>
      </main>

      {/* ── Footer — Browse button ───────────────────────────────────────── */}
      <footer className="flex justify-end px-6 lg:px-10 pb-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
        <button
          id="browse-movies-btn"
          onClick={() => router.push('/movies')}
          className="flex items-center gap-2.5 bg-[#72DB73] hover:bg-[#5bbc5c] text-black font-bold px-8 py-3 rounded-full transition-all duration-300 shadow-lg shadow-green-900/30 hover:scale-105 active:scale-95 text-base"
        >
          Browse
          <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </footer>
    </div>
  );
}
