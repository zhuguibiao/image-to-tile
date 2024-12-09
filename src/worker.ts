import JSZip from "jszip";
import type { Tiles } from "./CustomTileLayer";

// 初始化一个 JSZip 实例
const zip = new JSZip();

self.onmessage = async function (e: MessageEvent) {
  const { file }: { file: string } = e.data; // 类型化从主线程传来的文件
  const tiles: Tiles = []; // 用来存储瓦片的 URL 数据

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
      // 创建一个离屏画布来绘制整个图像
      const offscreenCanvas = new OffscreenCanvas(imageWidth, imageHeight);
      const ctx = offscreenCanvas.getContext("2d");
      ctx?.drawImage(bitmap, 0, 0);

      // 创建一个瓦片画布，用于绘制每个瓦片
      const tileCanvas = new OffscreenCanvas(tileSize, tileSize);
      const tileCtx = tileCanvas.getContext("2d");

      // 计算最大缩放级别，基于图像的尺寸
      const maxZoomLevel = Math.ceil(
        Math.log2(Math.max(imageWidth, imageHeight) / tileSize)
      );

      // 循环处理每个缩放级别，生成瓦片
      for (let z = 0; z <= maxZoomLevel; z++) {
        const scale = Math.pow(2, z); // 计算当前缩放级别的比例
        const rows = Math.ceil(imageHeight / (tileSize * scale)); // 行数
        const cols = Math.ceil(imageWidth / (tileSize * scale)); // 列数

        // 初始化当前缩放级别的瓦片数组
        for (let x = 0; x < cols; x++) {
          for (let y = 0; y < rows; y++) {
            tileCtx?.clearRect(0, 0, tileSize, tileSize); // 清除瓦片画布

            // 从原图像中切割出一部分并绘制到瓦片画布上
            tileCtx?.drawImage(
              offscreenCanvas,
              x * tileSize * scale,
              y * tileSize * scale,
              tileSize * scale,
              tileSize * scale, // 从原图像中切割的区域
              0,
              0,
              tileSize,
              tileSize // 将切割的部分绘制到瓦片画布上
            );

            // 准备瓦片的URL并存储在 tiles 数组中
            const zx = maxZoomLevel - z;
            if (!tiles[zx]) tiles[zx] = []; // 如果当前缩放级别没有瓦片数据，则初始化
            if (!tiles[zx][x]) tiles[zx][x] = []; // 如果当前列没有瓦片数据，则初始化

            // 将瓦片画布转换为 Blob，并添加到 zip 文件夹中
            const buffer = await tileCanvas.convertToBlob();
            zip.folder(`tiles/${zx}/${x}/`)?.file(`${y}.png`, buffer);

            // 为瓦片创建一个 URL 并存储
            const url = URL.createObjectURL(buffer);
            if (url) {
              tiles[zx][x][y] = url; // 存储瓦片的 URL
            }
          }
        }
      }

      // 异步生成 zip 文件并返回结果
      zip.generateAsync({ type: "blob" }).then(function (content) {
        self.postMessage({ zip: content, tileData: tiles });
      });

      // 释放临时资源，避免内存泄漏
      URL.revokeObjectURL(file);
    } catch (error) {
      console.error("Worker 错误:", error); // 错误处理
    }
  }
};
