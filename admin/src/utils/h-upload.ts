import * as qiniu from "qiniu-js";
import { assetService } from "../services/assetService";
import type { AssetToken } from "../services/assetService";
import { ProportionalCompression, getImageEl, getUuid } from "../utils/common";

type UploadInfo = {
  type: string;
  name: string;
  format: string;
  md5?: string;
  url: File;
  small?: File;
  snapshot?: File;
  size?: number;
};

/** 上传文件 */
export async function HUpload(files: File[]): Promise<string[]> {
  if (!files?.length) {
    console.error("请先选择文件");
    return [];
  }

  await assetService.getConfig();
  const smallMax = 1024; // 最长边限制

  const uploadPromises = files.map(async (file) => {
    const temp = {} as UploadInfo;
    temp.url = file;
    temp.type = temp.format = file.type;
    temp.name = file.name;
    temp.size = file.size;

    if (file.type?.includes("image/")) {
      const tempUrl = URL.createObjectURL(file);
      const img = await getImageEl(tempUrl);
      if (img?.width) {
        const { width, height } = img;
        const compressed = await ProportionalCompression(img, width, height, smallMax);
        if (compressed) {
          temp.small = compressed;
        }
      }
      URL.revokeObjectURL(tempUrl);
    }

    try {
      return await Uploading(temp);
    } catch (error) {
      console.error("上传失败", error);
      throw error;
    }
  });

  try {
    const results = await Promise.all(uploadPromises);
    return results.filter((url): url is string => !!url);
  } catch (error) {
    console.error("部分或全部上传失败", error);
    throw error;
  }
}

/** 将处理完成的文件上传至七牛云 */
async function Uploading(fileInfo: UploadInfo): Promise<string> {
  try {
    const uploadedSmall = fileInfo.small ? await upload(fileInfo.small) : await upload(fileInfo.url);

    const tokenStr = localStorage.getItem("assetToken");
    const assetToken: AssetToken = tokenStr ? JSON.parse(tokenStr) : {};
    const domain = assetToken.domain || "https://oss.zaiwen.top";

    // 构建完整 URL
    const finalUrl = domain.endsWith("/") ? `${domain}${uploadedSmall.key}` : `${domain}/${uploadedSmall.key}`;

    // 同时保存到数据库（后台记录）
    // const owner = "";
    // await assetService.add(
    //   fileInfo.name,
    //   fileInfo.format || fileInfo.type || "*",
    //   fileInfo.size || 0,
    //   owner,
    //   uploadedFile.key,
    //   uploadedSmall?.key || uploadedFile.key
    // );

    return finalUrl;
  } catch (error) {
    throw error;
  }
}

/** 上传文件到七牛云 */
async function upload(file: File): Promise<any> {
  const tokenStr = localStorage.getItem("assetToken");
  if (!tokenStr) throw new Error("未获取到上传配置");

  const assetToken: AssetToken = JSON.parse(tokenStr);
  const { token, region, domain } = assetToken;

  const config = { useCdnDomain: !!domain, region };
  const putExtra = {
    fname: file.name || getUuid(),
    params: {},
    mimeType: undefined,
  };

  const suffix = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase() : "";
  const key = getUuid() + suffix;

  return new Promise((resolve, reject) => {
    const observable = qiniu.upload(file, key, token, putExtra, config);
    observable.subscribe({
      next(res: any) {
        // 可以用于进度显示
        console.log("upload progress", res.total.percent);
      },
      error(err: any) {
        reject(err);
      },
      complete(res: any) {
        resolve(res);
      },
    });
  });
}
