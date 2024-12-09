import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

/**
 * 定义瓦片数据的类型
 * `tiles` 是一个三层嵌套数组，分别按 `zoom` , `x`, `y` 组织。
 */
export type Tiles = string[][][];

class CustomTileLayer extends L.TileLayer {
  tiles: Tiles;
  constructor(tiles: Tiles, options: L.TileLayerOptions = {}) {
    const layerOptions = {
      ...options,
    };
    super("", layerOptions);
    this.tiles = tiles;
  }

  getTileUrl(coords: L.Coords): string {
    const { x, y, z } = coords;
    const tileUrl = this.tiles[z]?.[x]?.[y]; // 获取瓦片 URL
    if (tileUrl) {
      return tileUrl;
    }
    // 如果没有找到瓦片，返回透明占位符图像
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wIAAgMBAJG9AwAAAABJRU5ErkJggg==";
  }
}

function clearUrl(arr: Tiles) {
  if (arr && !arr.length) {
    return;
  }
  const stack = [...arr];
  while (stack.length) {
    const item: unknown = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...(item as []));
    } else {
      URL.revokeObjectURL(item as string);
    }
  }
}
/**
 * React 组件封装的自定义 TileLayer
 * @param tiles
 */
const CustomTileLayerComponent: React.FC<{ tiles: Tiles }> = ({ tiles }) => {
  const map = useMap();

  useEffect(() => {
    const layer = new CustomTileLayer(tiles, {
      maxNativeZoom: Object.keys(tiles).length - 1,
    });

    map.addLayer(layer);
    map.setView([0, 0], 0);
    return () => {
      map.removeLayer(layer);
      clearUrl(tiles);
    };
  }, [map, tiles]);

  return null;
};

export default CustomTileLayerComponent;
