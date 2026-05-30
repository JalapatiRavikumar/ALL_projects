'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { useStore } from '@/lib/store';
import { ProductCard } from '@/components/product/product-card';

export default function FavoritesPage() {
  const router = useRouter();
  const { favorites } = useStore();

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="border-b border-zinc-100 pb-6 mb-10">
        <h1 className="text-3xl font-serif text-zinc-950 tracking-tight font-black uppercase">
          Your Wishlist
        </h1>
        <p className="text-xs text-zinc-400 font-semibold tracking-wider uppercase mt-1">
          Keep track of your favorite luxury items and curated picks.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="py-24 text-center border border-zinc-100 bg-zinc-50/50 flex flex-col items-center">
          <div className="bg-white p-6 rounded-full border border-zinc-100 mb-5">
            <Heart className="w-10 h-10 text-zinc-300" />
          </div>
          <h2 className="text-lg font-serif font-bold text-zinc-950 mb-2">No favorites yet</h2>
          <p className="text-xs text-zinc-500 max-w-sm mb-6 leading-relaxed">
            Bookmark products you love while shopping to save them here for later reviews and quick checkouts.
          </p>
          <button
            onClick={() => router.push('/search')}
            className="px-8 py-3.5 bg-zinc-950 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-widest transition-colors duration-300 rounded-none shadow-sm"
          >
            Discover Trends
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 animate-fade-in">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
