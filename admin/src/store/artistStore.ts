import { create } from 'zustand';
import * as artistService from '../services/artistService';
import type { Artist } from '../services/artistService';

interface ArtistStore {
  artists: Artist[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;

  fetchArtists: (force?: boolean) => Promise<void>;
  updateArtistInStore: (id: string, updates: Partial<Artist>) => void;
  removeArtistFromStore: (id: string) => void;
  addArtistToStore: (artist: Artist) => void;
}

const CACHE_TTL = 5 * 60 * 1000;

export const useArtistStore = create<ArtistStore>((set, get) => ({
  artists: [],
  loading: false,
  error: null,
  lastFetched: null,

  fetchArtists: async (force = false) => {
    const { lastFetched, loading } = get();
    const now = Date.now();
    
    if (loading || (!force && lastFetched && (now - lastFetched < CACHE_TTL))) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const data = await artistService.getAllArtists();
      set({ 
        artists: data, 
        lastFetched: now,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch artists', 
        loading: false 
      });
    }
  },

  updateArtistInStore: (id: string, updates: Partial<Artist>) => {
    set(state => ({
      artists: state.artists.map(a => 
        a.id === id ? { ...a, ...updates } : a
      )
    }));
  },

  removeArtistFromStore: (id: string) => {
    set(state => ({
      artists: state.artists.filter(a => a.id !== id)
    }));
  },

  addArtistToStore: (artist: Artist) => {
    set(state => ({
      artists: [artist, ...state.artists]
    }));
  }
}));
