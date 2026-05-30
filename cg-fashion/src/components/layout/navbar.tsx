'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Package, Menu, X } from 'lucide-react';
import { useStore } from '@/lib/store';

export const Navbar = () => {
  const router = useRouter();
  const { cart, setIsCartOpen, favorites } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.cartQuantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleCategoryClick = (categorySlug: string) => {
    setIsMobileMenuOpen(false);
    if (categorySlug === 'home') {
      router.push('/');
    } else {
      router.push(`/search?category=${encodeURIComponent(categorySlug)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-zinc-100 shadow-xs">
      {/* Top Banner Promotion */}
      <div className="bg-rose-600 text-white text-[10px] sm:text-xs text-center py-2 font-bold tracking-widest uppercase">
        USE CODE: WELCOME20 FOR 20% OFF YOUR FIRST ORDER
      </div>

      {/* Main Nav Shell */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4 md:gap-8">
          
          {/* Mobile Menu Trigger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-zinc-600 hover:text-rose-600 md:hidden p-1"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Luxury Brand Logo */}
          <div
            className="flex-shrink-0 cursor-pointer flex items-center gap-2.5"
            onClick={() => router.push('/')}
          >
            <div className="bg-rose-600 text-white px-2 py-1 font-serif font-extrabold text-lg leading-none rounded-none">
              CG
            </div>
            <span className="font-serif font-black text-xl tracking-tighter text-zinc-950 hidden xs:block">
              Fashion.
            </span>
          </div>

          {/* Centralized Search Bar (Desktop) */}
          <div className="flex-1 max-w-lg hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-zinc-400" />
              </div>
              <input
                type="text"
                placeholder="Search premium collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50/80 focus:bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all duration-200 text-xs font-medium tracking-wide rounded-none"
              />
            </form>
          </div>

          {/* User Icon Directories */}
          <div className="flex items-center gap-2 sm:gap-4.5">
            
            {/* Search toggled for mobile screens */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-[120px] xs:max-w-[160px] md:hidden">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Search className="h-3 w-3 text-zinc-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2.5 py-1.5 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-rose-500 text-[10px] rounded-none"
              />
            </form>

            <button
              onClick={() => router.push('/profile')}
              aria-label="View Account Profile"
              className="p-1.5 text-zinc-500 hover:text-rose-600 transition-colors hidden md:block"
            >
              <User className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={() => router.push('/favorites')}
              aria-label="View Saved Wishlist"
              className="p-1.5 text-zinc-500 hover:text-rose-600 transition-colors relative hidden sm:block"
            >
              <Heart className="w-4.5 h-4.5" />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-rose-600 text-white text-[8px] font-bold flex items-center justify-center rounded-full">
                  {favorites.length}
                </span>
              )}
            </button>

            <button
              onClick={() => router.push('/orders')}
              aria-label="View Order Status"
              className="p-1.5 text-zinc-500 hover:text-rose-600 transition-colors relative hidden sm:block"
            >
              <Package className="w-4.5 h-4.5" />
            </button>

            {/* Shopping Bag Drawer Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Open Shopping Bag Drawer"
              className="p-1.5 text-zinc-600 hover:text-rose-600 transition-colors relative"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-rose-600 text-white text-[8px] font-bold flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Elegant Categories Sub-Navbar (Desktop Only) */}
      <nav className="border-t border-zinc-100 hidden md:block bg-zinc-50/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-center space-x-10 h-11 text-xs font-semibold tracking-widest text-zinc-500">
            {[
              { label: 'Home', slug: 'home' },
              { label: 'Beauty', slug: 'beauty' },
              { label: 'Fragrances', slug: 'fragrances' },
              { label: 'Furniture', slug: 'furniture' },
              { label: 'Groceries', slug: 'groceries' },
              { label: 'Smartphones', slug: 'smartphones' },
              { label: 'Laptops', slug: 'laptops' },
              { label: 'Sale', slug: 'mens-watches' }
            ].map((cat, idx) => (
              <li key={idx} className="h-full">
                <button
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="h-full hover:text-rose-600 border-b-2 border-transparent hover:border-rose-600 transition-all uppercase text-[10px]"
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Drawer Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-zinc-950/40 z-50 backdrop-blur-xs animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 p-6 flex flex-col justify-between shadow-2xl animate-slide-in-left">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-zinc-100">
                <span className="font-serif font-black text-lg text-zinc-900 uppercase tracking-widest">
                  Menu
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Directories */}
              <ul className="py-6 space-y-4 text-xs font-bold uppercase tracking-widest text-zinc-600">
                <li>
                  <button
                    onClick={() => handleCategoryClick('home')}
                    className="hover:text-rose-600 w-full text-left"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryClick('beauty')}
                    className="hover:text-rose-600 w-full text-left"
                  >
                    Beauty
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryClick('fragrances')}
                    className="hover:text-rose-600 w-full text-left"
                  >
                    Fragrances
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryClick('furniture')}
                    className="hover:text-rose-600 w-full text-left"
                  >
                    Furniture
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryClick('groceries')}
                    className="hover:text-rose-600 w-full text-left"
                  >
                    Groceries
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryClick('smartphones')}
                    className="hover:text-rose-600 w-full text-left"
                  >
                    Smartphones
                  </button>
                </li>
                <li className="pt-4 border-t border-zinc-100">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.push('/profile');
                    }}
                    className="hover:text-rose-600 w-full text-left flex items-center gap-2"
                  >
                    <User className="w-4 h-4" /> My Account
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.push('/favorites');
                    }}
                    className="hover:text-rose-600 w-full text-left flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4" /> Wishlist ({favorites.length})
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.push('/orders');
                    }}
                    className="hover:text-rose-600 w-full text-left flex items-center gap-2"
                  >
                    <Package className="w-4 h-4" /> Order History
                  </button>
                </li>
              </ul>
            </div>
            <div className="text-[10px] text-zinc-400">
              © {new Date().getFullYear()} CG Fashion Inc.
            </div>
          </div>
        </>
      )}
    </header>
  );
};
export default Navbar;
