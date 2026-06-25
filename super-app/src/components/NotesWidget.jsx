import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export default function NotesWidget() {
  const storeNotes = useStore(s => s.notes);
  const setNotes   = useStore(s => s.setNotes);

  const [localNotes, setLocalNotes] = useState(storeNotes);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('superapp_notes');
    if (saved !== null) setLocalNotes(saved);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalNotes(val);
    setNotes(val); // also syncs to localStorage via store
  };

  return (
    <div className="bg-[#F1C75B] rounded-3xl p-8 h-full flex flex-col shadow-lg">
      <h3 className="text-black font-bold text-3xl mb-6">All notes</h3>
      <textarea
        value={localNotes}
        onChange={handleChange}
        placeholder="Type your notes here..."
        className="flex-grow bg-transparent text-black font-medium outline-none resize-none custom-scrollbar text-lg leading-relaxed placeholder-yellow-700"
      />
    </div>
  );
}
