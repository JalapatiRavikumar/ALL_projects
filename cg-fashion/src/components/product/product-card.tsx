'use client';

import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, setIsCartOpen, favorites, toggleFavorite } = useStore();
  const isFavorite = favorites.some((fav) => fav.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setIsCartOpen(true);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product);
  };

  return (
    <div className="group flex flex-col bg-white border border-transparent hover:border-zinc-100 overflow-hidden hover:shadow-xl transition-all duration-300 rounded-sm">
      <div className="relative aspect-[3/4] bg-zinc-50 overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        {product.discountPercentage > 10 && (
          <div className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-none shadow-sm">
            -{Math.round(product.discountPercentage)}% OFF
          </div>
        )}

        {/* Favorite Toggle Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-xs rounded-full shadow-sm hover:bg-white hover:scale-110 transition-all duration-200 z-10 border border-zinc-100"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-rose-600 text-rose-600' : 'text-zinc-400 hover:text-rose-600'
            }`}
          />
        </button>

        {/* Quick Add Overlay (Visible on hover on desktops) */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden sm:block">
          <button
            onClick={handleAddToCart}
            className="w-full bg-zinc-950/95 backdrop-blur-xs text-white hover:bg-rose-600 py-3 text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-md flex items-center justify-center gap-2 border border-transparent hover:border-rose-600"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Bag
          </button>
        </div>
      </div>

      <div className="py-5 px-3 flex flex-col flex-1 text-center">
        <span className="text-[10px] text-rose-600 font-bold uppercase tracking-widest mb-1.5">
          {product.category.replace('-', ' ')}
        </span>
        <h3
          className="font-medium text-zinc-900 line-clamp-1 flex-1 mb-2 font-serif text-base hover:text-rose-600 transition-colors"
          title={product.title}
        >
          {product.title}
        </h3>

        <div className="flex items-center justify-center gap-2 mt-auto">
          <span className="text-base font-bold text-zinc-900">
            {formatPrice(product.price)}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-xs text-zinc-400 line-through">
              {formatPrice(product.price / (1 - product.discountPercentage / 100))}
            </span>
          )}
        </div>

        {/* Mobile-only Quick Add Button (Permanent visible for touch screens) */}
        <button
          onClick={handleAddToCart}
          className="mt-3 w-full bg-zinc-900 text-white py-2 text-xs font-semibold uppercase tracking-widest sm:hidden flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-3 h-3" /> Add to Bag
        </button>
      </div>
    </div>
  );
};
export default ProductCard;
