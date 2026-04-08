import { apiPost } from "./api";

export interface ImageGenerationParams {
  prompt: string;
  model?: string;
  ratio?: string;
  num?: number;
  size?: string;
}

export interface ImageGenerationResponse {
  images: string[];
  taskId?: string;
}

/**
 * 生成图片接口
 * 基于第三方文档：https://www.zaiwenai.com/dev/desc/app
 * @param params 生成参数
 * @returns 生成的图片列表
 */
export const generateImage = async (params: ImageGenerationParams): Promise<ImageGenerationResponse> => {
  try {
    // 根据通用第三方 AI 接口规范推测的端点
    const response = await apiPost<ImageGenerationResponse>("https://back.zaiwenai.com/api/v1/ai/images/generations", {
      prompt: params.prompt,
      model: params.model || "Seedream4.0",
      ratio: params.ratio || "1:1",
      num: params.num || 1,
      size: params.size || "1024x1024",
    });

    if (!response.data) {
      throw new Error(response.message || "图片生成失败");
    }

    return response.data;
  } catch (error) {
    console.error("Failed to generate image:", error);
    throw error;
  }
};
