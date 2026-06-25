'use client';

import Image from 'next/image';
import { Star, Clock, Tag, Users, Film } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import type { Movie } from '@/types';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  return (
    <Modal isOpen={!!movie} onClose={onClose} title={movie?.title}>
      {movie && (
        <div className="flex flex-col md:flex-row overflow-hidden max-h-[85vh]">
          {/* Poster */}
          <div className="relative w-full md:w-[38%] h-64 md:h-auto shrink-0">
            <Image
              src={movie.poster || movie.image}
              alt={movie.title}
              fill
              className="object-cover"
              unoptimized
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  `https://picsum.photos/seed/${movie.id}/400/600`;
              }}
            />
          </div>

          {/* Details */}
          <div className="flex-1 p-7 overflow-y-auto flex flex-col gap-4" style={{ scrollbarWidth: 'thin' }}>
            <h2 className="text-2xl font-bold text-white leading-snug pr-8">{movie.title}</h2>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {movie.year && (
                <span className="bg-white/10 text-white px-3 py-1 rounded-md font-semibold">
                  {movie.year}
                </span>
              )}
              <div className="flex items-center gap-1 text-yellow-400">
                <Star size={14} fill="currentColor" />
                <span className="text-white font-semibold">{movie.rating}/10</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Clock size={14} />
                <span>{movie.runtime}</span>
              </div>
            </div>

            {/* Genre */}
            <div className="flex items-center gap-2 text-[#72DB73] text-sm">
              <Tag size={14} />
              <span className="font-semibold capitalize">{movie.genre}</span>
            </div>

            {/* Plot */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-gray-400 mb-2 text-xs font-semibold uppercase tracking-widest">
                <Film size={12} />
                <span>Plot</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{movie.plot}</p>
            </div>

            {/* Cast */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-gray-400 mb-2 text-xs font-semibold uppercase tracking-widest">
                <Users size={12} />
                <span>Cast</span>
              </div>
              <p className="text-gray-300 text-sm">{movie.cast}</p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
