import { apiRequest } from "./api";

export enum RegionEnum {
  z0 = "z0",
  z1 = "z1",
  z2 = "z2",
  na0 = "na0",
  as0 = "as0",
  cnEast2 = "cn-east-2",
}

export type AssetToken = {
  token: string;
  region: RegionEnum;
  bucket: string;
  domain: string;
};

export interface AssetInfo {
  id: string;
  name: string;
  format: string;
  size: number;
  creator: string; // 根据用户token自动写入
  created: number;
  status: AssetStatus; //  默认值  AssetStatus.Default
  url: string;
  owner?: any; // UserInfo;
  thumbnail?: string; // 缩略图， 图像特有
  remark?: string;
  prompt?: string;
}

export enum AssetStatus {
  Default = 0,
  Wicked = 1,
  Public = 2,
}

export const getCategoryById = async (id: string): Promise<Category> => {
  const response = await apiRequest(`/categories`);
  const category = response.data.find((c: Category) => c.id === id);
  if (!category) throw new Error("Category not found");
  return category;
};
