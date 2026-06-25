import React, { useEffect, useState } from 'react';
import { mockNewsAPI } from '../services/apiServices';

export default function NewsWidget() {
  const [newsList, setNewsList] = useState([]);
  const [index,    setIndex]    = useState(0);

  useEffect(() => {
    mockNewsAPI().then(setNewsList);
  }, []);

  // Auto-rotate every 2 seconds
  useEffect(() => {
    if (newsList.length === 0) return;
    const id = setInterval(() => {
      setIndex(prev => (prev + 1) % newsList.length);
    }, 2000);
    return () => clearInterval(id); // cleanup on unmount
  }, [newsList]);

  if (newsList.length === 0) {
    return <div className="bg-white rounded-3xl h-full animate-pulse" />;
  }

  const current = newsList[index];

  return (
    <div className="bg-white rounded-3xl overflow-hidden h-full flex flex-col shadow-lg">
      {/* Top 50% — image with text overlay */}
      <div className="h-1/2 w-full relative shrink-0">
        <img
          src={current.image}
          alt={current.title}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-sm p-6 text-white border-t border-white/10">
          <h3 className="text-[1.35rem] font-bold mb-2 leading-snug">{current.title}</h3>
          <p className="text-sm font-medium text-gray-300">2-20-2023 | 07:35 PM</p>
        </div>
      </div>

      {/* Bottom 50% — description */}
      <div className="p-8 bg-white flex-grow text-black overflow-y-auto custom-scrollbar">
        <p className="text-[1.05rem] leading-loose text-gray-800 font-medium">{current.content}</p>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 py-3 bg-white">
        {newsList.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${i === index ? 'bg-black' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
}
