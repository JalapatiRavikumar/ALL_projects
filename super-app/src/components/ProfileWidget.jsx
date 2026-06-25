import React from 'react';
import { useStore } from '../store/useStore';
import { CATEGORIES } from '../constants/categories';

export default function ProfileWidget() {
  const user        = useStore(s => s.user);
  const categoryIds = useStore(s => s.categoryIds);

  return (
    <div className="bg-[#5746EA] rounded-3xl p-6 flex items-stretch gap-8 h-full shadow-lg overflow-hidden">
      {/* Avatar */}
      <div className="w-[45%] bg-indigo-300 rounded-[2rem] overflow-hidden shrink-0 shadow-lg relative border-4 border-white/10">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || 'User'}&style=circle`}
          alt="avatar"
          className="w-full h-full object-cover bg-white absolute inset-0"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col text-white w-[55%] py-2 justify-between">
        <div className="flex flex-col">
          <h3 className="text-xl mb-1 truncate">{user.name || 'KK Vinay'}</h3>
          <p className="text-lg opacity-90 mb-1 truncate">{user.email || 'Vinay090@gmail.com'}</p>
          <h1 className="text-4xl font-black mb-4 tracking-wide truncate">{user.username || 'vinay060'}</h1>
        </div>
        {/* Category pills */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          {categoryIds.slice(0, 4).map(catId => {
            const cat = CATEGORIES.find(c => c.id === catId);
            return (
              <span
                key={catId}
                className="bg-[#8E7BFF] text-white px-3 py-2 rounded-full text-sm text-center font-medium truncate shadow-sm"
              >
                {cat?.name || catId}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
