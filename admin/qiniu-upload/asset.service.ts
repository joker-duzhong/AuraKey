import { AssetInfo, AssetToken } from "@/models/asset";
import { BaseServices } from "./base.services";
import { Method, Uri, config } from "./config";

class AssetService extends BaseServices {

  private uriPrefix: string = 'asset/'
  private static _ins: AssetService = new AssetService();
  public static get ins(): AssetService {
    return this._ins ? this._ins : (this._ins = new AssetService());
  }

  /** 获取上传所需配置 */
  public getConfig(): Promise<void> {
    const url = config.versionV1 + this.uriPrefix + 'config';
    const data = {};
    return new Promise((resolve) => {
      return this.request<AssetToken>(url, data, 'GET')
        .then((res) => {
          localStorage.setItem('assetToken', JSON.stringify(res.data));
          resolve();
        }).catch(() => {
          resolve();
        });
    });
  }
  /** 保存七牛云文件到数据库  */
  public add(name: string, format: string, size: number, owner: string, url_id: string, thumbnail?: string, remark?: string): Promise<AssetInfo> {
    const url = config.versionV1 + this.uriPrefix + Method.Add;
    const data = { name, format, size, owner, url: url_id, thumbnail, remark };
    return new Promise((resolve, reject) => {
      return this.request<AssetInfo>(url, data)
        .then((res) => {
          resolve(res.data);
        }).catch((err) => {
          reject(err);
        })
    });
  }



}

export const assetService: AssetService = AssetService.ins;

