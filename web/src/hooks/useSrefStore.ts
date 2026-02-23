import { create } from 'zustand';
import { getAllSrefs, getSrefsByTag, type Sref } from '../services/sref.service';

interface SrefStore {
  srefs: Sref[];
  loading: boolean;
  error: string | null;

  // 获取所有Sref
  fetchSrefs: (force?: boolean) => Promise<void>;

  // 按标签搜索Sref
  searchSrefsByTag: (tag: string) => Promise<void>;

  // 重置状态
  reset: () => void;
}

export const useSrefStore = create<SrefStore>((set, get) => ({
  srefs: [],
  loading: false,
  error: null,

  fetchSrefs: async (force = false) => {
    if (!force && (get().srefs.length > 0 || get().loading)) return;

    set({ loading: true, error: null });
    try {
      const srefs = await getAllSrefs();
      set({ srefs });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch srefs';
      set({ error: message, srefs: [] });
    } finally {
      set({ loading: false });
    }
  },

  searchSrefsByTag: async (tag: string) => {
    set({ loading: true, error: null });
    try {
      const srefs = await getSrefsByTag(tag);
      set({ srefs });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to search srefs';
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  reset: () => {
    set({
      srefs: [],
      loading: false,
      error: null,
    });
  },
}));
