// src/stores/statsStore.ts - Version complétée
import { create } from 'zustand';

interface StatsStore {
  sugar: number;
  caffeine: number;
  isLoading: boolean;
  error: string | null;
  setStats: (stats: { sugar: number; caffeine: number }) => void;
  fetchStats: () => Promise<void>;
  clearError: () => void;
  setError: (error: string) => void;
}

export const useStatsStore = create<StatsStore>((set) => ({
  sugar: 0,
  caffeine: 0,
  isLoading: false,
  error: null,
  
  setStats: (stats) => set({ ...stats }),
  
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      // Logique de fetch
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  clearError: () => set({ error: null }),
  setError: (error) => set({ error }),
}));