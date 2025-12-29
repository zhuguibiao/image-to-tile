import { MapContainer, useMap } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect } from "react";

const GRAY_211x211 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAzCAYAAABoQMrKAAAAF0lEQVR42mP8z/CfAQQYGf4zMAAxSgASAAAKRABXHn1DUQAAAABJRU5ErkJggg==";
type Props = {
  tiles: Tiles;
  imageSize: [number, number];
};

/**
 * Tiles 结构说明：
 * tiles[zoom][x][y] => tileUrl
 */
export type Tiles = string[][][];

/**
 * 自定义 TileLayer
 * - 使用内存 / blob / dataURL 作为瓦片源
 */
class CustomTileLayer extends L.TileLayer {
  tiles: Tiles;

  constructor(tiles: Tiles, options: L.TileLayerOptions = {}) {
    super("", {
      tileSize: 256,
      ...options,
    });
    this.tiles = tiles;
  }

  /**
   * Leaflet 在请求瓦片时会调用
   */
  getTileUrl(coords: L.Coords): string {
    const { x, y, z } = coords;
    const tileUrl = this.tiles[z]?.[x]?.[y];

    // 找不到瓦片时返回 GRAY_211x211
    return tileUrl ?? GRAY_211x211;
  }
}

/**
 * RasterCoords
 * 用于在「像素坐标 <-> LatLng」之间转换
 * 适用于 L.CRS.Simple + 大图瓦片
 */
class RasterCoords {
  map: L.Map;
  width: number;
  height: number;
  tilesize: number;
  zoom: number;

  constructor(
    map: L.Map,
    imgsize: [number, number],
    tilesize = 256,
    setMaxBounds = true
  ) {
    this.map = map;
    this.width = imgsize[0];
    this.height = imgsize[1];
    this.tilesize = tilesize;
    this.zoom = this.calcZoomLevel();

    if (setMaxBounds && this.width && this.height) {
      this.setMaxBounds();
    }
  }

  /**
   * 计算图片所需的最大 zoom
   */
  private calcZoomLevel(): number {
    return Math.ceil(
      Math.log(Math.max(this.width, this.height) / this.tilesize) / Math.log(2)
    );
  }

  /**
   * 像素坐标 -> 地图坐标
   */
  unproject([x, y]: [number, number]): L.LatLng {
    return this.map.unproject(L.point(x, y), this.zoom);
  }

  /**
   * 地图坐标 -> 像素坐标
   */
  project(latlng: L.LatLng): L.Point {
    return this.map.project(latlng, this.zoom);
  }

  /**
   * 整张图片的边界
   */
  getMaxBounds(): L.LatLngBounds {
    const southWest = this.unproject([0, this.height]);
    const northEast = this.unproject([this.width, 0]);
    return L.latLngBounds(southWest, northEast);
  }

  setMaxBounds(): void {
    this.map.setMaxBounds(this.getMaxBounds());
  }
}

/**
 * 回收 tiles 中的 blob URL
 */
function revokeTileUrls(tiles: Tiles) {
  if (!tiles?.length) return;

  const stack: unknown[] = [...tiles];
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...item);
    } else if (typeof item === "string") {
      URL.revokeObjectURL(item);
    }
  }
}

/**
 * React 封装组件
 */
const TilesLayer: React.FC<{
  tiles: Tiles;
  imageSize: [number, number];
}> = ({ tiles, imageSize }) => {
  const map = useMap();

  useEffect(() => {
    if (!tiles?.length || !imageSize?.length) return;

    /**
     * 创建 TileLayer
     */
    const tileLayer = new CustomTileLayer(tiles, {
      maxNativeZoom: tiles.length - 1,
      noWrap: true,
    });

    /**
     * 像素坐标转换器
     */
    const rc = new RasterCoords(map, imageSize);
    // L.control
    //   .layers(
    //     {},
    //     {
    //       // Polygon: layerPolygon(map, rc),
    //       // Bounds: layerBounds(map, rc, img),
    //     }
    //   )
    //   .addTo(map);

    /**
     * 初始化地图视角（图片中心）
     */
    const center = rc.unproject([imageSize[0] / 2, imageSize[1] / 2]);

    map.addLayer(tileLayer);
    map.setView(center, 2, { animate: false });

    /**
     * 辅助图层（调试坐标用）
     */
    const debugLayer = createDebugLayer(map, rc, imageSize);

    return () => {
      map.removeLayer(tileLayer);
      map.removeLayer(debugLayer);
      revokeTileUrls(tiles);
    };
  }, [map, tiles, imageSize]);

  return null;
};

/**
 * 调试辅助图层：
 * - 显示左上 / 右下
 * - 点击显示像素坐标
 */
function createDebugLayer(
  map: L.Map,
  rc: RasterCoords,
  imgSize: [number, number]
) {
  const layer = L.layerGroup([
    L.marker(rc.unproject([0, 0])).bindPopup("[0,0]"),
    L.marker(rc.unproject(imgSize)).bindPopup(JSON.stringify(imgSize)),
  ]);

  const onClick = (e: L.LeafletMouseEvent) => {
    const coord = rc.project(e.latlng);
    L.marker(e.latlng)
      .addTo(layer)
      .bindPopup(`[${Math.floor(coord.x)}, ${Math.floor(coord.y)}]`)
      .openPopup();
  };

  map.addLayer(layer);
  map.on("click", onClick);

  // 清理
  layer.on("remove", () => {
    map.off("click", onClick);
  });

  return layer;
}

export default function ImageTileMap({ tiles, imageSize }: Props) {
  return (
    <MapContainer crs={L.CRS.Simple} zoom={1} className="h-full w-full">
      <TilesLayer tiles={tiles} imageSize={imageSize} />
    </MapContainer>
  );
}
