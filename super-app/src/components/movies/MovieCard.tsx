'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import type { Movie } from '@/types';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <button
      id={`movie-${movie.id}`}
      onClick={() => onClick(movie)}
      className="relative group shrink-0 w-64 h-40 rounded-2xl overflow-hidden cursor-pointer snap-start
        shadow-xl shadow-black/50 transition-all duration-300
        hover:scale-105 hover:shadow-[0_0_28px_rgba(114,219,115,0.2)]
        focus:outline-none focus:ring-2 focus:ring-[#72DB73]"
      aria-label={`View details for ${movie.title}`}
    >
      {/* Poster */}
      <Image
        src={movie.image}
        alt={movie.title}
        fill
        className="object-cover"
        unoptimized
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src =
            `https://picsum.photos/seed/${movie.id}/400/240`;
        }}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-300
        flex flex-col justify-end p-4">
        <p className="text-white font-bold text-sm leading-snug">{movie.title}</p>
        <div className="flex items-center gap-1 mt-1">
          <Star size={12} fill="#facc15" className="text-yellow-400" />
          <span className="text-yellow-400 text-xs font-semibold">{movie.rating}</span>
          <span className="text-gray-400 text-xs ml-2">{movie.year}</span>
        </div>
      </div>
    </button>
  );
}
