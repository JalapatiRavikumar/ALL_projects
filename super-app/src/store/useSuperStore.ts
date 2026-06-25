'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SuperStoreState, UserProfile } from '@/types';

const defaultUser: UserProfile = {
  name: '',
  username: '',
  email: '',
  mobile: '',
  isRegistered: false,
};

export const useSuperStore = create<SuperStoreState>()(
  persist(
    (set) => ({
      // ── State ──────────────────────────────────────────────────────────────
      user: defaultUser,
      categoryIds: [] as string[],
      notes: '',

      // ── Actions ────────────────────────────────────────────────────────────
      setUser: (user: UserProfile) => set({ user }),

      setCategoryIds: (ids: string[]) => set({ categoryIds: ids }),

      setNotes: (text: string) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('superapp_notes', text);
        }
        set({ notes: text });
      },

      resetStore: () =>
        set({ user: defaultUser, categoryIds: [], notes: '' }),
    }),
    {
      name: 'superapp-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        categoryIds: state.categoryIds,
        notes: state.notes,
      }),
    }
  )
);
