import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  author: string;
  avatar: string;
  likes: number;
  width: number;
  height: number;
  category: string;
  prompt: string;
  model: string;
  ratio: string;
  resolution: string;
  refImages?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateGalleryItemInput {
  url: string;
  title: string;
  author: string;
  avatar: string;
  width: number;
  height: number;
  category: string;
  prompt: string;
  model: string;
  ratio: string;
  resolution: string;
  refImages?: string[];
}

/**
 * 获取所有画廊项目
 * @param category - 可选的分类过滤
 * @returns 画廊项目列表
 */
export const getAllGalleryItems = async (category?: string): Promise<GalleryItem[]> => {
  try {
    const endpoint = category ? `/gallery?category=${category}` : "/gallery";
    const response = await apiGet<GalleryItem[]>(endpoint);
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch gallery items:", error);
    throw error;
  }
};

/**
 * 获取单个画廊项目
 * @param id - 画廊项目ID
 * @returns 画廊项目详情
 */
export const getGalleryItemById = async (id: string): Promise<GalleryItem> => {
  try {
    const response = await apiGet<GalleryItem>(`/gallery/${id}`);
    if (!response.data) {
      throw new Error("Gallery item not found");
    }
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch gallery item ${id}:`, error);
    throw error;
  }
};

/**
 * 创建新的画廊项目
 * @param data - 画廊项目数据
 * @returns 创建的画廊项目
 */
export const createGalleryItem = async (data: CreateGalleryItemInput): Promise<GalleryItem> => {
  try {
    const response = await apiPost<GalleryItem>("/gallery", data);
    if (!response.data) {
      throw new Error("Failed to create gallery item");
    }
    return response.data;
  } catch (error) {
    console.error("Failed to create gallery item:", error);
    throw error;
  }
};

/**
 * 更新画廊项目
 * @param id - 画廊项目ID
 * @param data - 更新数据
 * @returns 更新后的画廊项目
 */
export const updateGalleryItem = async (id: string, data: Partial<CreateGalleryItemInput>): Promise<GalleryItem> => {
  try {
    const response = await apiPut<GalleryItem>(`/gallery/${id}`, data);
    if (!response.data) {
      throw new Error("Failed to update gallery item");
    }
    return response.data;
  } catch (error) {
    console.error(`Failed to update gallery item ${id}:`, error);
    throw error;
  }
};

/**
 * 删除画廊项目
 * @param id - 画廊项目ID
 */
export const deleteGalleryItem = async (id: string): Promise<void> => {
  try {
    await apiDelete(`/gallery/${id}`);
  } catch (error) {
    console.error(`Failed to delete gallery item ${id}:`, error);
    throw error;
  }
};

/**
 * 点赞画廊项目
 * @param id - 画廊项目ID
 * @returns 更新后的画廊项目（likes 已增加）
 */
export const likeGalleryItem = async (id: string): Promise<GalleryItem> => {
  try {
    const response = await apiPost<GalleryItem>(`/gallery/${id}/like`, {});
    if (!response.data) {
      throw new Error("Failed to like gallery item");
    }
    return response.data;
  } catch (error) {
    console.error(`Failed to like gallery item ${id}:`, error);
    throw error;
  }
};
