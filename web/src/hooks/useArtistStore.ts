import { create } from 'zustand';
import { getAllArtists, getArtistById, getArtistByName, type Artist } from '../services/artist.service';

interface ArtistStore {
  artists: Artist[];
  selectedArtist: Artist | null;
  loading: boolean;
  error: string | null;

  // 获取所有艺术家
  fetchArtists: (force?: boolean) => Promise<void>;

  // 获取单个艺术家
  fetchArtistById: (id: string) => Promise<void>;

  // 按名称搜索艺术家
  searchArtistByName: (name: string) => Promise<void>;

  // 设置选中的艺术家
  setSelectedArtist: (artist: Artist | null) => void;

  // 重置状态
  reset: () => void;
}

export const useArtistStore = create<ArtistStore>((set, get) => ({
  artists: [],
  selectedArtist: null,
  loading: false,
  error: null,

  fetchArtists: async (force = false) => {
    if (!force && (get().artists.length > 0 || get().loading)) return;

    set({ loading: true, error: null });
    try {
      const artists = await getAllArtists();
      set({ artists });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch artists';
      set({ error: message, artists: [] });
    } finally {
      set({ loading: false });
    }
  },

  fetchArtistById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const artist = await getArtistById(id);
      set({ selectedArtist: artist });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch artist';
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  searchArtistByName: async (name: string) => {
    set({ loading: true, error: null });
    try {
      const artist = await getArtistByName(name);
      set({ selectedArtist: artist });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Artist not found';
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  setSelectedArtist: (artist: Artist | null) => {
    set({ selectedArtist: artist });
  },

  reset: () => {
    set({
      artists: [],
      selectedArtist: null,
      loading: false,
      error: null,
    });
  },
}));
