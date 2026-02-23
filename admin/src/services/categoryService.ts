import { apiRequest } from './api';

export interface SubCategory {
  name: string;
  phrases: string[]; // Keep for compatibility if needed
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
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await apiRequest('/categories');
  return response.data;
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const response = await apiRequest(`/categories`);
  const category = response.data.find((c: Category) => c.id === id);
  if (!category) throw new Error('Category not found');
  return category;
};

export const deleteCategory = async (id: string): Promise<any> => {
  return apiRequest(`/categories/${id}`, { method: 'DELETE' });
};

export const createCategory = async (data: Partial<Category>): Promise<Category> => {
  const response = await apiRequest('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data;
};

export const updateCategory = async (id: string, data: Partial<Category>): Promise<Category> => {
  const response = await apiRequest(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.data;
};

export const updateSubCategoryItems = async (id: string, subName: string, items: any[]): Promise<Category> => {
  const response = await apiRequest(`/categories/${id}/subcategories/${subName}/items`, {
    method: 'PUT',
    body: JSON.stringify({ items }),
  });
  return response.data;
};

export const searchCategories = async (keyword: string): Promise<Category[]> => {
  const response = await apiRequest(`/categories/search?keyword=${encodeURIComponent(keyword)}`);
  return response.data;
};
