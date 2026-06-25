'use client';

import MovieCard from './MovieCard';
import type { Movie } from '@/types';

interface MovieRowProps {
  genre: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

export default function MovieRow({ genre, movies, onMovieClick }: MovieRowProps) {
  if (movies.length === 0) return null;

  return (
    <section aria-label={`${genre} movies`} className="flex flex-col gap-4">
      <h3 className="text-xl font-medium text-gray-400 capitalize tracking-wide">{genre}</h3>

      <div className="flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory"
           style={{ scrollbarWidth: 'none' }}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
        ))}
      </div>
    </section>
  );
}
