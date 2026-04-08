import { apiRequest } from "./api";

const ASSET_API_BASE_URL = "https://bak.zaiwenai.com/api/v1";

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

const assetApiRequest = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<{ code: number; msg: string; data: T }> => {
  const url = `${ASSET_API_BASE_URL}${endpoint}`;
  return apiRequest(url, options);
};

export const assetService = {
  /** 获取上传所需配置 */
  getConfig: async (): Promise<void> => {
    try {
      const response = await assetApiRequest<AssetToken>("/asset/config", { method: "GET" });
      if (response && response.code === 0 && response.data) {
        localStorage.setItem("assetToken", JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Failed to get asset config", error);
    }
  },

  /** 保存七牛云文件到数据库  */
  add: async (
    name: string,
    format: string,
    size: number,
    owner: string,
    url_id: string,
    thumbnail?: string,
    remark?: string
  ): Promise<AssetInfo> => {
    const data = { name, format, size, owner, url: url_id, thumbnail, remark };
    const response = await assetApiRequest<AssetInfo>("/asset/add", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  },
};

export const getCategoryById = async (id: string): Promise<any> => {
  const response = await apiRequest(`/categories`);
  const category = response.data.find((c: any) => c.id === id);
  if (!category) throw new Error("Category not found");
  return category;
};
