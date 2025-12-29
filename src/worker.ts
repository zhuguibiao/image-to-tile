import JSZip from "jszip";
import type { Tiles } from "./ImageTileMap";

const zip = new JSZip();

self.onmessage = async function (e: MessageEvent) {
  const { file }: { file: string } = e.data;
  const tiles: Tiles = [];
  zip.remove("tiles/");
  if (file) {
    try {
      const tileSize = 256;
      // 获取并从文件创建图像位图
      const response = await fetch(file);
      let blob: Blob | null = await response.blob();
      let bitmap: ImageBitmap | null = await createImageBitmap(blob);
      const imageWidth = bitmap.width;
      const imageHeight = bitmap.height;

      console.log(bitmap);
      let offscreenCanvas: OffscreenCanvas | null = new OffscreenCanvas(
        imageWidth,
        imageHeight
      );

      let ctx = offscreenCanvas?.getContext("2d");
      ctx?.drawImage(bitmap, 0, 0);

      let tileCanvas: OffscreenCanvas | null = new OffscreenCanvas(
        tileSize,
        tileSize
      );
      let tileCtx = tileCanvas.getContext("2d");

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

            let buffer: Blob | null = await tileCanvas.convertToBlob();
            zip.folder(`tiles/${zx}/${x}/`)?.file(`${y}.png`, buffer);

            const url = URL.createObjectURL(buffer);
            buffer = null;
            if (url) {
              tiles[zx][x][y] = url;
            }
          }
        }
      }

      zip.generateAsync({ type: "blob" }).then(function (content) {
        self.postMessage({
          zip: content,
          tileData: tiles,
          imageSize: [imageWidth, imageHeight],
        });
      });

      // clear
      URL.revokeObjectURL(file);

      blob = null;

      bitmap.close?.();
      bitmap = null;

      offscreenCanvas.width = offscreenCanvas.height = 0;
      offscreenCanvas = null;

      tileCanvas.width = tileCanvas.height = 0;
      tileCanvas = null;

      ctx = null;
      tileCtx = null;
    } catch (error) {
      // console.error("Worker 错误:", error);
      self.postMessage({ error: error});
    }
  }
};
