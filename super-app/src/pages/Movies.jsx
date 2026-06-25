import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { CATEGORIES } from '../constants/categories';
import { mockMoviesAPI } from '../services/apiServices';
import MovieModal from '../components/MovieModal';

// ── Robust image with auto-fallback chain ──────────────────────────────────────
function MovieImg({ src, fallback, alt, className }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [triedFallback, setTriedFallback] = useState(false);

  // Reset when src prop changes
  useEffect(() => {
    setImgSrc(src);
    setTriedFallback(false);
  }, [src]);

  const handleError = () => {
    if (!triedFallback && fallback && imgSrc !== fallback) {
      setImgSrc(fallback);
      setTriedFallback(true);
    } else {
      // Final fallback — seeded picsum so it's always unique per movie
      const seed = alt?.replace(/\s+/g, '-').toLowerCase() || 'movie';
      setImgSrc(`https://picsum.photos/seed/${seed}/500/280`);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={handleError}
    />
  );
}

// ── Movies Page ───────────────────────────────────────────────────────────────
export default function Movies() {
  const navigate    = useNavigate();
  const user        = useStore(s => s.user);
  const categoryIds = useStore(s => s.categoryIds);

  const [moviesByCat,   setMoviesByCat]   = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const results = {};
      for (const catId of categoryIds) {
        results[catId] = await mockMoviesAPI(catId);
      }
      setMoviesByCat(results);
      setLoading(false);
    };
    if (categoryIds.length > 0) fetchAll();
    else setLoading(false);
  }, [categoryIds]);

  const avatarSrc = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || 'User'}&style=circle`;

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12">

      {/* ── Header ── */}
      <header className="flex justify-between items-center mb-12 max-w-[1400px] mx-auto">
        <h2 className="text-[#72DB73] text-4xl font-pacifico">Super app</h2>
        <div
          className="w-14 h-14 bg-indigo-200 rounded-full overflow-hidden border-2 border-[#72DB73] cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-green-900/30"
          onClick={() => navigate('/dashboard')}
          title="Back to dashboard"
        >
          <MovieImg
            src={avatarSrc}
            fallback={`https://picsum.photos/seed/${user.username || 'user'}/56/56`}
            alt="avatar"
            className="w-full h-full bg-white object-cover"
          />
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-[1.8rem] font-bold mb-10 tracking-wide text-gray-100">
          Entertainment according to your choice
        </h1>

        {/* Loading skeleton */}
        {loading && (
          <div className="flex flex-col gap-10">
            {[1, 2, 3].map(n => (
              <div key={n} className="flex flex-col gap-4">
                <div className="h-6 w-32 rounded-lg bg-white/10 animate-pulse" />
                <div className="flex gap-5">
                  {[1, 2, 3, 4].map(m => (
                    <div
                      key={m}
                      className="shrink-0 w-72 h-44 rounded-2xl bg-white/10 animate-pulse"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Movie rows */}
        {!loading && (
          <div className="flex flex-col gap-10 pb-20">
            {categoryIds.map((catId, rowIdx) => {
              const catName = CATEGORIES.find(c => c.id === catId)?.name || catId;
              const movies  = moviesByCat[catId] || [];

              return (
                <div
                  key={catId}
                  className="flex flex-col gap-4"
                  style={{ animationDelay: `${rowIdx * 80}ms` }}
                >
                  <h3 className="text-xl font-medium text-gray-400 capitalize tracking-wide">
                    {catName}
                  </h3>

                  <div
                    className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none' }}
                  >
                    {movies.map(movie => (
                      <div
                        key={movie.id}
                        onClick={() => setSelectedMovie(movie)}
                        className="relative group shrink-0 w-72 h-44 rounded-2xl overflow-hidden cursor-pointer snap-start
                          shadow-xl shadow-black/50 transition-all duration-300
                          hover:scale-105 hover:shadow-[0_0_28px_rgba(114,219,115,0.25)]"
                        role="button"
                        tabIndex={0}
                        aria-label={`View ${movie.title}`}
                        onKeyDown={e => e.key === 'Enter' && setSelectedMovie(movie)}
                      >
                        {/* Movie poster with full fallback chain */}
                        <MovieImg
                          src={movie.image}
                          fallback={movie.fallback}
                          alt={movie.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* Permanent bottom gradient with title */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Title always visible at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-white font-semibold text-sm leading-snug line-clamp-1 drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {movie.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-yellow-400 text-xs font-bold">★ {movie.rating}</span>
                            <span className="text-gray-400 text-xs">{movie.year}</span>
                          </div>
                        </div>

                        {/* Always-visible subtle title for non-hover */}
                        <div className="absolute top-2 left-2 right-2 group-hover:opacity-0 transition-opacity duration-300">
                          <span className="text-white/0 text-xs" aria-hidden="true">{movie.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Empty state */}
            {categoryIds.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <div className="text-6xl">🎬</div>
                <p className="text-gray-400 text-lg">No genres selected.</p>
                <button
                  onClick={() => navigate('/onboarding')}
                  className="mt-2 bg-[#72DB73] text-black font-bold px-6 py-3 rounded-full hover:bg-[#5bbc5c] transition-all hover:scale-105"
                >
                  Pick Categories
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Movie Modal ── */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}
