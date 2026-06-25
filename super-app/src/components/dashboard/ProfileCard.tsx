'use client';

import Image from 'next/image';
import { useSuperStore } from '@/store/useSuperStore';
import { CATEGORIES } from '@/constants/data';

export default function ProfileCard() {
  const user        = useSuperStore((s) => s.user);
  const categoryIds = useSuperStore((s) => s.categoryIds);

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || 'User'}&style=circle`;

  return (
    <div
      className="rounded-3xl p-5 lg:p-6 flex items-stretch gap-5 shadow-2xl overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #5746EA 0%, #7358FF 100%)' }}
    >
      {/* Decorative glow orb */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#FF4ADE]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-[#72DB73]/15 blur-3xl pointer-events-none" />

      {/* Avatar column */}
      <div className="w-[38%] md:w-[42%] bg-indigo-200/30 rounded-[1.5rem] overflow-hidden shrink-0 relative border-2 border-white/20 shadow-xl">
        <Image
          src={avatarUrl}
          alt={`${user.name || 'User'} avatar`}
          fill
          className="object-cover bg-white"
          unoptimized
        />
      </div>

      {/* Info column */}
      <div className="flex flex-col text-white flex-1 justify-between min-w-0 py-1">
        <div className="flex flex-col gap-0.5">
          <p className="text-base font-medium opacity-90 truncate leading-tight">
            {user.name || 'KK Vinay'}
          </p>
          <p className="text-sm opacity-70 truncate leading-tight">
            {user.email || 'Vinay090@gmail.com'}
          </p>
          <h2 className="text-2xl lg:text-3xl font-black tracking-wide mt-1 truncate">
            {user.username || 'vinay060'}
          </h2>
        </div>

        {/* Category pills — max 4, 2-column grid */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          {categoryIds.slice(0, 4).map((catId) => {
            const cat = CATEGORIES.find((c) => c.id === catId);
            return (
              <span
                key={catId}
                className="bg-white/15 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm text-center font-medium truncate border border-white/10 hover:bg-white/25 transition-colors"
              >
                {cat?.name ?? catId}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
