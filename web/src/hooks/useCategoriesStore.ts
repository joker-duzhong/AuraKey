import { create } from 'zustand';
import { getAllCategories, searchPhrases, type Category } from '../services/categories.service';

interface CategoriesStore {
  categories: Category[];
  loading: boolean;
  error: string | null;

  // 获取所有分类
  fetchCategories: (force?: boolean) => Promise<void>;

  // 搜索提示词短语
  searchPhrases: (keyword: string) => Promise<Category[]>;

  // 重置状态
  reset: () => void;
}

export const useCategoriesStore = create<CategoriesStore>((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async (force = false) => {
    // 如果不是强制刷新且已经有数据或正在加载，则不重复请求
    if (!force && (get().categories.length > 0 || get().loading)) return;

    set({ loading: true, error: null });
    try {
      const categories = await getAllCategories();
      set({ categories });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch categories';
      set({ error: message, categories: [] });
    } finally {
      set({ loading: false });
    }
  },

  searchPhrases: async (keyword: string) => {
    try {
      const results = await searchPhrases(keyword);
      return results;
    } catch (error) {
      console.error('Failed to search phrases:', error);
      return [];
    }
  },

  reset: () => {
    set({
      categories: [],
      loading: false,
      error: null,
    });
  },
}));
