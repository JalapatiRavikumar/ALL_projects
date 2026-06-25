import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { CATEGORIES } from '../constants/categories';

export default function Categories() {
  const navigate       = useNavigate();
  const setCategoryIds = useStore(s => s.setCategoryIds);
  const savedIds       = useStore(s => s.categoryIds);

  const [selected, setSelected] = useState(savedIds);
  const [error,    setError]    = useState('');

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
    if (error) setError('');
  };

  const remove = (id) =>
    setSelected(prev => prev.filter(c => c !== id));

  const handleNext = () => {
    if (selected.length < 3) {
      setError('Minimum 3 category required');
      return;
    }
    setCategoryIds(selected);
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black overflow-hidden"
         style={{ padding: '40px 56px', gap: '48px' }}>

      {/* ── Left Pane ── */}
      <div className="lg:w-[38%] flex flex-col justify-center shrink-0">

        {/* Logo */}
        <div
          className="mb-12 text-5xl"
          style={{ fontFamily: 'Pacifico, cursive', color: '#72DB73' }}
        >
          Super app
        </div>

        {/* Heading */}
        <h1 className="font-bold text-white leading-tight mb-10"
            style={{ fontSize: '3.2rem' }}>
          Choose your<br />entertainment<br />category
        </h1>

        {/* Selected pills */}
        <div className="flex flex-wrap gap-3 mb-4 min-h-[44px]">
          {selected.map(catId => {
            const cat = CATEGORIES.find(c => c.id === catId);
            return (
              <div
                key={catId}
                className="flex items-center gap-3 px-5 py-2 rounded-full text-white font-semibold text-base"
                style={{ background: '#148A08' }}
              >
                {cat?.name}
                <button
                  id={`remove-${catId}`}
                  onClick={() => remove(catId)}
                  className="font-black text-sm hover:text-red-200 transition-colors leading-none"
                  style={{ color: '#0A4A04' }}
                >
                  X
                </button>
              </div>
            );
          })}
        </div>

        {/* Validation error */}
        {error && (
          <div className="flex items-center gap-2 font-semibold text-[#FF0000] text-lg mt-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* ── Right Pane — 3×3 Grid ── */}
      <div className="lg:w-[62%] flex flex-col justify-center relative">
        <div className="grid grid-cols-3 gap-5 pb-20">
          {CATEGORIES.map(cat => {
            const isSelected = selected.includes(cat.id);
            return (
              <div
                key={cat.id}
                id={`cat-${cat.id}`}
                onClick={() => toggle(cat.id)}
                className={`rounded-3xl p-4 cursor-pointer flex flex-col transition-all duration-200
                  ${isSelected ? 'ring-4 ring-white ring-offset-2 ring-offset-black scale-95'
                               : 'hover:scale-105 hover:brightness-110'}`}
                style={{ backgroundColor: cat.color, height: '190px' }}
              >
                <span className="font-bold text-white text-2xl mb-2 ml-1 drop-shadow-md">
                  {cat.name}
                </span>
                <div className="flex-grow rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={e => {
                      e.target.src = `https://picsum.photos/seed/${cat.id}/300/160`;
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Next Page button */}
        <div className="absolute bottom-6 right-0">
          <button
            id="next-page-btn"
            onClick={handleNext}
            className="bg-[#148A08] hover:bg-green-600 text-white font-bold
              px-10 py-3 rounded-full text-xl tracking-wider transition-colors shadow-lg"
          >
            Next Page
          </button>
        </div>
      </div>

    </div>
  );
}
