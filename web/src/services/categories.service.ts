import { apiGet } from './api';
import { categoriesData } from '../mock/categories';

export interface Category {
  mainCategory: string;
  subCategories: SubCategory[];
}

export interface SubCategory {
  name: string;
  phrases: string[];
}

/**
 * 获取所有提示词分类
 * @returns 分类列表
 */
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiGet<Category[]>('/categories');
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch categories from API, using local mock data:', error);
    // 如果API不可用，使用本地mock数据作为降级方案
    return categoriesData.categories;
  }
};

/**
 * 按名称获取单个分类
 * @param name - 分类名称
 * @returns 分类详情
 */
export const getCategoryByName = async (name: string): Promise<Category | null> => {
  try {
    const response = await apiGet<Category>(`/categories/${encodeURIComponent(name)}`);
    return response.data || null;
  } catch (error) {
    console.error(`Failed to fetch category ${name}:`, error);
    return null;
  }
};

/**
 * 搜索提示词短语
 * @param keyword - 搜索关键词
 * @returns 包含匹配短语的分类列表
 */
export const searchPhrases = async (keyword: string): Promise<Category[]> => {
  try {
    const response = await apiGet<Category[]>(`/categories/search/phrases?keyword=${encodeURIComponent(keyword)}`);
    return response.data || [];
  } catch (error) {
    console.error(`Failed to search phrases for ${keyword}:`, error);
    return [];
  }
};
