'use client';

import { useSuperStore } from '@/store/useSuperStore';
import { useEffect, useState } from 'react';

export default function NotesWidget() {
  const storeNotes = useSuperStore((s) => s.notes);
  const setNotes   = useSuperStore((s) => s.setNotes);
  const [local, setLocal] = useState(storeNotes);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('superapp_notes');
    if (saved !== null) setLocal(saved);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setLocal(val);
    setNotes(val);
  };

  return (
    <div className="bg-[#F1C75B] rounded-3xl p-7 h-full flex flex-col shadow-xl">
      <h2 className="text-black font-bold text-2xl mb-5">All notes</h2>
      <textarea
        id="notes-textarea"
        value={local}
        onChange={handleChange}
        placeholder="Type your notes here..."
        aria-label="Notes"
        className="flex-grow bg-transparent text-black font-medium outline-none resize-none text-base leading-relaxed placeholder-yellow-700/60"
        style={{ scrollbarWidth: 'thin' }}
      />
    </div>
  );
}
