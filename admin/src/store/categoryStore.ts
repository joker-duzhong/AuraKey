import { create } from 'zustand';
import * as categoryService from '../services/categoryService';

export interface SubCategory {
  name: string;
  phrases: string[];
  items?: {
    id: string;
    name: string;
    cover?: string;
    tags: string[];
  }[];
}

export interface Category {
  id: string;
  mainCategory: string;
  subCategories: SubCategory[];
  updatedAt?: string;
}

interface CategoryStore {
  categories: Category[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;

  fetchCategories: (force?: boolean) => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  updateCategoryInStore: (id: string, updates: Partial<Category>) => void;
  removeCategoryFromStore: (id: string) => void;
  addCategoryToStore: (category: Category) => void;
}

// Cache TTL: 5 minutes
const CACHE_TTL = 5 * 60 * 1000;

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  lastFetched: null,

  fetchCategories: async (force = false) => {
    const { lastFetched, loading } = get();
    const now = Date.now();
    
    // Skip if loading or if we have fresh data and not forcing
    if (loading || (!force && lastFetched && (now - lastFetched < CACHE_TTL))) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const data = await categoryService.getCategories();
      set({ 
        categories: data, 
        lastFetched: now,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch categories', 
        loading: false 
      });
    }
  },

  getCategoryById: (id: string) => {
    return get().categories.find(c => c.id === id);
  },

  updateCategoryInStore: (id: string, updates: Partial<Category>) => {
    set(state => ({
      categories: state.categories.map(c => 
        c.id === id ? { ...c, ...updates } : c
      )
    }));
  },

  removeCategoryFromStore: (id: string) => {
    set(state => ({
      categories: state.categories.filter(c => c.id !== id)
    }));
  },

  addCategoryToStore: (category: Category) => {
    set(state => ({
      categories: [category, ...state.categories]
    }));
  }
}));
