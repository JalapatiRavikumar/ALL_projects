'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Check, AlertTriangle, ArrowRight } from 'lucide-react';
import { useSuperStore } from '@/store/useSuperStore';
import { CATEGORIES } from '@/constants/data';

export default function OnboardingPage() {
  const router        = useRouter();
  const user          = useSuperStore((s) => s.user);
  const categoryIds   = useSuperStore((s) => s.categoryIds);
  const setCategoryIds = useSuperStore((s) => s.setCategoryIds);

  const [showWarning, setShowWarning] = useState(false);

  const toggleCategory = (id: string) => {
    const next = categoryIds.includes(id)
      ? categoryIds.filter((c) => c !== id)
      : [...categoryIds, id];
    setCategoryIds(next);
    if (next.length >= 3) setShowWarning(false);
  };

  const handleNext = () => {
    if (categoryIds.length < 3) {
      setShowWarning(true);
      return;
    }
    router.push('/dashboard');
  };

  const canProceed = categoryIds.length >= 3;

  return (
    <main className="min-h-screen bg-black flex overflow-hidden">

      {/* ── Left sidebar ──────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col justify-between w-[320px] xl:w-[360px] shrink-0 p-10 border-r border-white/5">
        <div>
          {/* Logo */}
          <p className="font-pacifico text-3xl neon-green mb-12 animate-fade-in">
            Super app
          </p>

          {/* Headline */}
          <h1 className="text-white font-black text-4xl xl:text-5xl leading-tight mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Choose your<br />
            entertainment<br />
            category
          </h1>

          {/* Welcome message */}
          <p className="text-gray-400 text-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
            Hey <span className="text-[#72DB73] font-semibold">{user.name || 'there'}</span>! Pick at least 3 genres you love.
          </p>
        </div>

        {/* Selected pills */}
        <div className="flex flex-col gap-4">
          {categoryIds.length > 0 && (
            <div className="flex flex-wrap gap-2 animate-fade-in">
              {categoryIds.map((id) => {
                const cat = CATEGORIES.find((c) => c.id === id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleCategory(id)}
                    className="flex items-center gap-1.5 bg-[#72DB73] text-black text-sm font-bold px-4 py-1.5 rounded-full hover:bg-[#5bbc5c] transition-all active:scale-95"
                  >
                    {cat?.name ?? id}
                    <span className="text-black/60 font-black ml-0.5">×</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Warning banner */}
          {showWarning && (
            <div className="flex items-center gap-2 text-red-500 text-sm animate-scale-in">
              <AlertTriangle size={16} className="shrink-0" />
              <span>Minimum 3 categories required</span>
            </div>
          )}

          {/* Count indicator */}
          <p className="text-gray-500 text-xs">
            {categoryIds.length}/3 minimum selected
          </p>
        </div>
      </aside>

      {/* ── Right — Grid + controls ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col p-6 lg:p-10 overflow-y-auto custom-scroll">

        {/* Mobile header */}
        <div className="lg:hidden mb-6">
          <p className="font-pacifico text-2xl neon-green mb-2">Super app</p>
          <h1 className="text-white font-black text-3xl leading-tight">Choose your entertainment category</h1>
          {user.name && (
            <p className="text-gray-400 text-sm mt-2">Welcome, <span className="text-[#72DB73] font-semibold">{user.name}</span>!</p>
          )}
        </div>

        {/* 3×3 Category Grid */}
        <div className="grid grid-cols-3 gap-4 flex-1">
          {CATEGORIES.map((cat, i) => {
            const isActive = categoryIds.includes(cat.id);
            return (
              <button
                key={cat.id}
                id={`category-${cat.id}`}
                onClick={() => toggleCategory(cat.id)}
                className={`
                  relative group rounded-2xl overflow-hidden cursor-pointer
                  transition-all duration-300 ease-out
                  animate-scale-in
                  ${isActive
                    ? 'tile-active animate-pulse-glow scale-[1.02]'
                    : 'hover:scale-[1.03] hover:shadow-2xl'
                  }
                `}
                style={{
                  aspectRatio: '4/3',
                  animationDelay: `${i * 60}ms`,
                  backgroundColor: cat.color,
                }}
                aria-pressed={isActive}
                aria-label={`${isActive ? 'Deselect' : 'Select'} ${cat.name}`}
              >
                {/* Category image */}
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized
                />

                {/* Color overlay */}
                <div
                  className="absolute inset-0 opacity-60 transition-opacity duration-300 group-hover:opacity-40"
                  style={{ backgroundColor: cat.color }}
                />

                {/* Bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Category name */}
                <span className="absolute top-3 left-3 text-white font-bold text-base lg:text-lg drop-shadow-lg z-10">
                  {cat.name}
                </span>

                {/* Active check icon */}
                {isActive && (
                  <div className="absolute top-3 right-3 z-10 bg-[#72DB73] rounded-full p-1 shadow-lg animate-scale-in">
                    <Check size={16} className="text-black" strokeWidth={3} />
                  </div>
                )}

                {/* Active border glow overlay */}
                {isActive && (
                  <div className="absolute inset-0 border-4 border-[#72DB73] rounded-2xl pointer-events-none z-10" />
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile selected pills + warning */}
        <div className="lg:hidden mt-4 flex flex-col gap-2">
          {categoryIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categoryIds.map((id) => {
                const cat = CATEGORIES.find((c) => c.id === id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleCategory(id)}
                    className="flex items-center gap-1.5 bg-[#72DB73] text-black text-sm font-bold px-4 py-1.5 rounded-full hover:bg-[#5bbc5c] transition-all"
                  >
                    {cat?.name ?? id}
                    <span className="text-black/60 font-black ml-0.5">×</span>
                  </button>
                );
              })}
            </div>
          )}
          {showWarning && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertTriangle size={16} className="shrink-0" />
              <span>Minimum 3 categories required</span>
            </div>
          )}
        </div>

        {/* Next Page button */}
        <div className="flex justify-end mt-6">
          <button
            id="onboarding-next-btn"
            onClick={handleNext}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-full font-bold text-base transition-all duration-300
              ${canProceed
                ? 'bg-[#72DB73] text-black hover:bg-[#5bbc5c] shadow-lg shadow-green-900/40 hover:scale-105 active:scale-95'
                : 'bg-[#72DB73]/40 text-black/50 cursor-not-allowed opacity-60'
              }
            `}
            aria-disabled={!canProceed}
          >
            Next Page
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </main>
  );
}
