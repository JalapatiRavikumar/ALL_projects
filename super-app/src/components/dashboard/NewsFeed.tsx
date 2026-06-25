'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { NEWS_DATA } from '@/constants/data';

export default function NewsFeed() {
  const [index,    setIndex]    = useState(0);
  const [visible,  setVisible]  = useState(true);

  // Auto-rotate every 2 s with a fade transition
  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % NEWS_DATA.length);
        setVisible(true);
      }, 300);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const current = NEWS_DATA[index];

  return (
    <article className="bg-white rounded-3xl overflow-hidden h-full flex flex-col shadow-xl">
      {/* Top — image + headline overlay */}
      <div className="relative h-1/2 shrink-0">
        <div
          className="w-full h-full transition-opacity duration-300"
          style={{ opacity: visible ? 1 : 0 }}
        >
          <Image
            src={current.image}
            alt={current.title}
            fill
            className="object-cover"
            unoptimized
            priority
          />
        </div>

        {/* Gradient overlay + text */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5">
          <h3
            className="text-white font-bold text-lg leading-snug mb-1 transition-opacity duration-300"
            style={{ opacity: visible ? 1 : 0 }}
          >
            {current.title}
          </h3>
          <p className="text-gray-300 text-xs font-medium">{current.date}</p>
        </div>
      </div>

      {/* Bottom — article body */}
      <div
        className="p-6 flex-grow overflow-y-auto text-black transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0, scrollbarWidth: 'thin' }}
      >
        <p className="text-sm leading-7 text-gray-700 font-medium">{current.content}</p>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 py-3 bg-white shrink-0">
        {NEWS_DATA.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to article ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-colors ${i === index ? 'bg-gray-800' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </article>
  );
}
