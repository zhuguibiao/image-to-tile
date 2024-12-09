import JSZip from "jszip";
import type { Tiles } from "./CustomTileLayer";

const zip = new JSZip();

self.onmessage = async function (e: MessageEvent) {
  const { file }: { file: string } = e.data;
  const tiles: Tiles = [];

  if (file) {
    try {
      const tileSize = 256;
      // 获取并从文件创建图像位图
      const response = await fetch(file);
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);
      const imageWidth = bitmap.width;
      const imageHeight = bitmap.height;

      console.log(bitmap);
      const offscreenCanvas = new OffscreenCanvas(imageWidth, imageHeight);
      const ctx = offscreenCanvas.getContext("2d");
      ctx?.drawImage(bitmap, 0, 0);

      const tileCanvas = new OffscreenCanvas(tileSize, tileSize);
      const tileCtx = tileCanvas.getContext("2d");

      const maxZoomLevel = Math.ceil(
        Math.log2(Math.max(imageWidth, imageHeight) / tileSize)
      );

      // 循环处理每个缩放级别，生成瓦片
      for (let z = 0; z <= maxZoomLevel; z++) {
        const scale = Math.pow(2, z);
        const rows = Math.ceil(imageHeight / (tileSize * scale));
        const cols = Math.ceil(imageWidth / (tileSize * scale));

        for (let x = 0; x < cols; x++) {
          for (let y = 0; y < rows; y++) {
            tileCtx?.clearRect(0, 0, tileSize, tileSize);
            tileCtx?.drawImage(
              offscreenCanvas,
              x * tileSize * scale,
              y * tileSize * scale,
              tileSize * scale,
              tileSize * scale,
              0,
              0,
              tileSize,
              tileSize
            );

            // 准备瓦片的URL并存储在 tiles 数组中
            const zx = maxZoomLevel - z;
            if (!tiles[zx]) tiles[zx] = [];
            if (!tiles[zx][x]) tiles[zx][x] = [];

            const buffer = await tileCanvas.convertToBlob();
            zip.folder(`tiles/${zx}/${x}/`)?.file(`${y}.png`, buffer);

            const url = URL.createObjectURL(buffer);
            if (url) {
              tiles[zx][x][y] = url;
            }
          }
        }
      }

      zip.generateAsync({ type: "blob" }).then(function (content) {
        self.postMessage({ zip: content, tileData: tiles });
      });

      URL.revokeObjectURL(file);
    } catch (error) {
      console.error("Worker 错误:", error);
    }
  }
};
