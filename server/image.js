import sharp from 'sharp'
// 创建一个 8000x8000 的图片
const width = 12800;
const height = 12800;

// 创建一个 Buffer 来保存图像数据
const buffer = Buffer.alloc(width * height * 3); // RGB 图像，每个像素 3 字节

// 图案配置
const squareSize = 500; // 每个图案块的尺寸

// 生成交替颜色的格子图案
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const offset = (y * width + x) * 3;

    // 判断当前像素是否属于一个交替色块
    const isOddRow = Math.floor(y / squareSize) % 2 === 0;
    const isOddCol = Math.floor(x / squareSize) % 2 === 0;

    // 如果是交替区域，给不同的区域设置不同的颜色
    if (isOddRow === isOddCol) {
      // 选定颜色1
      buffer[offset] = 255; // R
      buffer[offset + 1] = 0; // G
      buffer[offset + 2] = 0; // B (红色)
    } else {
      // 选定颜色2
      buffer[offset] = 0; // R
      buffer[offset + 1] = 255; // G
      buffer[offset + 2] = 0; // B (绿色)
    }
  }
}

// 使用 sharp 处理图像数据
sharp(buffer, { raw: { width, height, channels: 3 } }).toFile(
  `${width}-${height}.png`,
  (err, info) => {
    if (err) {
      console.error("Error creating image:", err);
    } else {
      console.log("Image created successfully:", info);
    }
  }
);
