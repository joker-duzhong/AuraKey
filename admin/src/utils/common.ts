
/** 生成随机 UUID */
export function getUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** 获取图片元素 */
export async function getImageEl(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
  });
}

/** 等比缩放图片 */
export async function ProportionalCompression(
  img: HTMLImageElement,
  width: number,
  height: number,
  maxSide: number
): Promise<File | null> {
  let targetWidth = width;
  let targetHeight = height;

  if (width > height) {
    if (width > maxSide) {
      targetWidth = maxSide;
      targetHeight = (height * maxSide) / width;
    }
  } else {
    if (height > maxSide) {
      targetHeight = maxSide;
      targetWidth = (width * maxSide) / height;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], "thumbnail.png", { type: "image/png" }));
      } else {
        resolve(null);
      }
    }, "image/png", 0.8);
  });
}
