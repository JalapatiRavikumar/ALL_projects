import React from 'react';
import { X, Star, Clock, Tag, Users, Film } from 'lucide-react';

export default function MovieModal({ movie, onClose }) {
  if (!movie) return null;

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1A1A2E] rounded-2xl w-full max-w-3xl flex flex-col md:flex-row overflow-hidden shadow-2xl border border-white/10 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full transition-colors z-10"
        >
          <X size={22} />
        </button>

        {/* Poster */}
        <div className="w-full md:w-[40%] h-[300px] md:h-auto shrink-0 bg-gray-900">
          <img
            src={movie.poster || movie.image}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={e => {
              const tried = e.currentTarget.dataset.tried || '';
              if (!tried.includes('fallback') && movie.fallback) {
                e.currentTarget.dataset.tried = 'fallback';
                e.currentTarget.src = movie.fallback;
              } else if (!tried.includes('picsum')) {
                e.currentTarget.dataset.tried += 'picsum';
                const seed = movie.title?.replace(/\s+/g,'-').toLowerCase() || 'movie';
                e.currentTarget.src = `https://picsum.photos/seed/${seed}-poster/400/600`;
              }
            }}
          />
        </div>

        {/* Info */}
        <div className="w-full md:w-[60%] p-8 flex flex-col gap-4 overflow-y-auto max-h-[80vh] custom-scrollbar">
          <h2 className="text-3xl font-bold text-white leading-tight pr-8">{movie.title}</h2>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {movie.year && (
              <span className="bg-white/10 text-white px-3 py-1 rounded-md font-semibold">{movie.year}</span>
            )}
            <div className="flex items-center gap-1 text-yellow-400">
              <Star size={16} fill="currentColor" />
              <span className="text-white font-semibold">{movie.rating}/10</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Clock size={16} />
              <span>{movie.runtime}</span>
            </div>
          </div>

          {/* Genre */}
          <div className="flex items-center gap-2 text-[#72DB73]">
            <Tag size={16} />
            <span className="font-semibold capitalize">{movie.genre}</span>
          </div>

          {/* Plot */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-gray-400 mb-2 text-sm font-semibold uppercase tracking-wider">
              <Film size={14} />
              <span>Plot</span>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm">{movie.plot}</p>
          </div>

          {/* Cast */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-gray-400 mb-2 text-sm font-semibold uppercase tracking-wider">
              <Users size={14} />
              <span>Cast</span>
            </div>
            <p className="text-gray-300 text-sm">{movie.cast}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
