'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, User } from 'lucide-react';
import { useSuperStore } from '@/store/useSuperStore';
import { MOVIES_DB, CATEGORIES } from '@/constants/data';
import MovieRow   from '@/components/movies/MovieRow';
import MovieModal from '@/components/movies/MovieModal';
import type { Movie } from '@/types';

export default function MoviesPage() {
  const router      = useRouter();
  const user        = useSuperStore((s) => s.user);
  const categoryIds = useSuperStore((s) => s.categoryIds);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Guard — redirect if not registered
  useEffect(() => {
    if (!user.isRegistered) router.replace('/');
  }, [user.isRegistered, router]);

  if (!user.isRegistered) return null;

  // Build genre rows based on selected category IDs
  const rows = categoryIds
    .map((id) => {
      const cat    = CATEGORIES.find((c) => c.id === id);
      const movies = (MOVIES_DB[id] ?? []) as Movie[];
      return { id, label: cat?.name ?? id, movies };
    })
    .filter((r) => r.movies.length > 0);

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || 'User'}&style=circle`;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 lg:px-10 py-5 border-b border-white/5 animate-fade-in">
        <div className="flex items-center gap-4">
          <p className="font-pacifico text-3xl neon-green">Super app</p>
        </div>

        {/* User avatar */}
        <button
          id="user-avatar-btn"
          onClick={() => router.push('/dashboard')}
          className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#72DB73] shadow-lg shadow-green-900/30 hover:scale-110 transition-transform active:scale-95"
          aria-label="Back to dashboard"
        >
          <Image
            src={avatarUrl}
            alt={user.name}
            width={44}
            height={44}
            className="object-cover bg-white w-full h-full"
            unoptimized
          />
        </button>
      </header>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <main className="flex-1 px-6 lg:px-10 py-8 flex flex-col gap-8 custom-scroll overflow-y-auto">
        {/* Sub-headline */}
        <p className="text-white font-semibold text-xl animate-fade-in" style={{ animationDelay: '80ms' }}>
          Entertainment according to your choice
        </p>

        {/* Movie rows — one per selected genre */}
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-6 text-center animate-fade-in-up">
            <div className="text-6xl">🎬</div>
            <p className="text-gray-400 text-lg">No genres selected yet.</p>
            <button
              onClick={() => router.push('/onboarding')}
              className="flex items-center gap-2 bg-[#72DB73] text-black font-bold px-6 py-3 rounded-full hover:bg-[#5bbc5c] transition-all hover:scale-105 active:scale-95"
            >
              <ArrowLeft size={16} />
              Pick Categories
            </button>
          </div>
        ) : (
          rows.map((row, i) => (
            <div
              key={row.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <MovieRow
                genre={row.label}
                movies={row.movies}
                onMovieClick={setSelectedMovie}
              />
            </div>
          ))
        )}
      </main>

      {/* ── Movie detail modal ──────────────────────────────────────────── */}
      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  );
}
