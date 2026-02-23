import { create } from 'zustand';
import * as srefService from '../services/srefService';
import type { Sref } from '../services/srefService';

interface SrefStore {
  srefs: Sref[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;

  fetchSrefs: (force?: boolean) => Promise<void>;
  updateSrefInStore: (id: string, updates: Partial<Sref>) => void;
  removeSrefFromStore: (id: string) => void;
  addSrefToStore: (sref: Sref) => void;
}

const CACHE_TTL = 5 * 60 * 1000;

export const useSrefStore = create<SrefStore>((set, get) => ({
  srefs: [],
  loading: false,
  error: null,
  lastFetched: null,

  fetchSrefs: async (force = false) => {
    const { lastFetched, loading } = get();
    const now = Date.now();
    
    if (loading || (!force && lastFetched && (now - lastFetched < CACHE_TTL))) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const data = await srefService.getAllSrefs();
      set({ 
        srefs: data, 
        lastFetched: now,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch srefs', 
        loading: false 
      });
    }
  },

  updateSrefInStore: (id: string, updates: Partial<Sref>) => {
    set(state => ({
      srefs: state.srefs.map(s => 
        s.id === id ? { ...s, ...updates } : s
      )
    }));
  },

  removeSrefFromStore: (id: string) => {
    set(state => ({
      srefs: state.srefs.filter(s => s.id !== id)
    }));
  },

  addSrefToStore: (sref: Sref) => {
    set(state => ({
      srefs: [sref, ...state.srefs]
    }));
  }
}));
