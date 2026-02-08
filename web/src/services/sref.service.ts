import { apiGet, apiPost, apiPut, apiDelete } from './api';
import { SrefData } from '../mock/categories';

export interface Sref {
  id: string;
  code: string;
  previewUrl: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateSrefInput {
  code: string;
  previewUrl: string;
  tags?: string[];
}

/**
 * 获取所有Sref风格码
 * @returns Sref列表
 */
export const getAllSrefs = async (): Promise<Sref[]> => {
  try {
    const response = await apiGet<Sref[]>('/srefs');
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch srefs from API, using local mock data:', error);
    // 如果API不可用，使用本地mock数据作为降级方案
    return SrefData.map(sref => ({
      ...sref,
      createdAt: new Date().toISOString(),
    }));
  }
};

/**
 * 获取单个Sref
 * @param id - Sref ID
 * @returns Sref详情
 */
export const getSrefById = async (id: string): Promise<Sref> => {
  try {
    const response = await apiGet<Sref>(`/srefs/${id}`);
    if (!response.data) {
      throw new Error('Sref not found');
    }
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch sref ${id}:`, error);
    throw error;
  }
};

/**
 * 根据标签搜索Sref
 * @param tag - 标签
 * @returns Sref列表
 */
export const getSrefsByTag = async (tag: string): Promise<Sref[]> => {
  try {
    const response = await apiGet<Sref[]>(`/srefs/search/by-tag?tag=${tag}`);
    return response.data || [];
  } catch (error) {
    console.error(`Failed to fetch srefs by tag ${tag}:`, error);
    throw error;
  }
};

/**
 * 创建新的Sref
 * @param data - Sref数据
 * @returns 创建的Sref
 */
export const createSref = async (data: CreateSrefInput): Promise<Sref> => {
  try {
    const response = await apiPost<Sref>('/srefs', data);
    if (!response.data) {
      throw new Error('Failed to create sref');
    }
    return response.data;
  } catch (error) {
    console.error('Failed to create sref:', error);
    throw error;
  }
};

/**
 * 更新Sref
 * @param id - Sref ID
 * @param data - 更新数据
 * @returns 更新后的Sref
 */
export const updateSref = async (id: string, data: Partial<CreateSrefInput>): Promise<Sref> => {
  try {
    const response = await apiPut<Sref>(`/srefs/${id}`, data);
    if (!response.data) {
      throw new Error('Failed to update sref');
    }
    return response.data;
  } catch (error) {
    console.error(`Failed to update sref ${id}:`, error);
    throw error;
  }
};

/**
 * 删除Sref
 * @param id - Sref ID
 */
export const deleteSref = async (id: string): Promise<void> => {
  try {
    await apiDelete(`/srefs/${id}`);
  } catch (error) {
    console.error(`Failed to delete sref ${id}:`, error);
    throw error;
  }
};
