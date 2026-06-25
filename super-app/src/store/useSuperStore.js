import { create } from 'zustand';

/**
 * useSuperStore — Global Zustand store for the Super App.
 *
 * State slices:
 *  • user        — Registration data (name, username, email, mobile)
 *  • categoryIds — Array of selected genre IDs, e.g. ['action', 'horror']
 *  • notes       — Free-text notes, persisted to localStorage
 */
export const useSuperStore = create((set) => ({
  // ── User profile ──────────────────────────────────────────────────────────
  user: {
    name:     '',
    username: '',
    email:    '',
    mobile:   '',
  },

  // ── Selected categories ───────────────────────────────────────────────────
  categoryIds: [],

  // ── Notes (hydrated from localStorage on store creation) ──────────────────
  notes: localStorage.getItem('superapp_notes') || '',

  // ── Actions ───────────────────────────────────────────────────────────────
  setUser: (userData) => set({ user: userData }),

  setCategoryIds: (ids) => set({ categoryIds: ids }),

  setNotes: (text) => {
    localStorage.setItem('superapp_notes', text);
    set({ notes: text });
  },

  resetStore: () => set({
    user:        { name: '', username: '', email: '', mobile: '' },
    categoryIds: [],
    notes:       '',
  }),
}));
