import { apiGet, apiPost, apiPut, apiDelete } from './api';

export interface Artist {
  id: string;
  name: string;
  previewUrl: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateArtistInput {
  name: string;
  previewUrl: string;
  tags?: string[];
}

/**
 * 获取所有艺术家
 * @returns 艺术家列表
 */
export const getAllArtists = async (): Promise<Artist[]> => {
  try {
    const response = await apiGet<Artist[]>('/artists');
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch artists:', error);
    throw error;
  }
};

/**
 * 获取单个艺术家
 * @param id - 艺术家ID
 * @returns 艺术家详情
 */
export const getArtistById = async (id: string): Promise<Artist> => {
  try {
    const response = await apiGet<Artist>(`/artists/${id}`);
    if (!response.data) {
      throw new Error('Artist not found');
    }
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch artist ${id}:`, error);
    throw error;
  }
};

/**
 * 按名称搜索艺术家
 * @param name - 艺术家名称
 * @returns 艺术家详情
 */
export const getArtistByName = async (name: string): Promise<Artist> => {
  try {
    const response = await apiGet<Artist>(`/artists/search/by-name?name=${encodeURIComponent(name)}`);
    if (!response.data) {
      throw new Error('Artist not found');
    }
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch artist by name ${name}:`, error);
    throw error;
  }
};

/**
 * 创建新的艺术家
 * @param data - 艺术家数据
 * @returns 创建的艺术家
 */
export const createArtist = async (data: CreateArtistInput): Promise<Artist> => {
  try {
    const response = await apiPost<Artist>('/artists', data);
    if (!response.data) {
      throw new Error('Failed to create artist');
    }
    return response.data;
  } catch (error) {
    console.error('Failed to create artist:', error);
    throw error;
  }
};

/**
 * 更新艺术家信息
 * @param id - 艺术家ID
 * @param data - 更新数据
 * @returns 更新后的艺术家
 */
export const updateArtist = async (
  id: string,
  data: Partial<CreateArtistInput>
): Promise<Artist> => {
  try {
    const response = await apiPut<Artist>(`/artists/${id}`, data);
    if (!response.data) {
      throw new Error('Failed to update artist');
    }
    return response.data;
  } catch (error) {
    console.error(`Failed to update artist ${id}:`, error);
    throw error;
  }
};

/**
 * 删除艺术家
 * @param id - 艺术家ID
 */
export const deleteArtist = async (id: string): Promise<void> => {
  try {
    await apiDelete(`/artists/${id}`);
  } catch (error) {
    console.error(`Failed to delete artist ${id}:`, error);
    throw error;
  }
};
