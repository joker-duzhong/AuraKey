import { create } from 'zustand';
import { getAllGalleryItems, getGalleryItemById, likeGalleryItem, type GalleryItem } from '../services/gallery.service';

interface GalleryStore {
  items: GalleryItem[];
  selectedItem: GalleryItem | null;
  loading: boolean;
  error: string | null;

  // 获取画廊项目
  fetchGalleryItems: (category?: string) => Promise<void>;
  
  // 获取单个画廊项目
  fetchGalleryItemById: (id: string) => Promise<void>;

  // 点赞项目
  likeItem: (id: string) => Promise<void>;

  // 设置选中项
  setSelectedItem: (item: GalleryItem | null) => void;

  // 重置状态
  reset: () => void;
}

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  items: [],
  selectedItem: null,
  loading: false,
  error: null,

  fetchGalleryItems: async (category?: string) => {
    set({ loading: true, error: null });
    try {
      const items = await getAllGalleryItems(category);
      set({ items });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch gallery items';
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  fetchGalleryItemById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const item = await getGalleryItemById(id);
      set({ selectedItem: item });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch gallery item';
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  likeItem: async (id: string) => {
    try {
      const updatedItem = await likeGalleryItem(id);
      
      // 更新列表中的项目
      const items = get().items.map(item =>
        item.id === id ? updatedItem : item
      );
      set({ items });

      // 如果有选中的项目，也更新它
      const selectedItem = get().selectedItem;
      if (selectedItem && selectedItem.id === id) {
        set({ selectedItem: updatedItem });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to like item';
      set({ error: message });
    }
  },

  setSelectedItem: (item: GalleryItem | null) => {
    set({ selectedItem: item });
  },

  reset: () => {
    set({
      items: [],
      selectedItem: null,
      loading: false,
      error: null,
    });
  },
}));
