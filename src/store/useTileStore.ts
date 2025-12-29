import { create } from "zustand";
import type { Tiles } from "../ImageTileMap";
import workerPath from "../worker?worker";

const worker = new workerPath();

type TileState = {
  file: File | null;
  tiles: Tiles;
  imageSize: [number, number];
  zip: Blob | null;
  loading: boolean;
  showZip: boolean;

  setFile: (file: File | null) => void;
  generateTiles: () => void;
  sendDemo: (url: string) => void;
  downloadZip: () => void;
  reset: () => void;
};

export const useTileStore = create<TileState>((set, get) => {
  // worker 只绑定一次
  worker.onmessage = (e) => {
    const { tileData, zip, imageSize, error } = e.data;
    if (error) {
      console.error("Worker 错误:", error);
    }
    set({
      tiles: tileData ?? [],
      zip: zip ?? null,
      imageSize,
      loading: false,
      showZip: !!zip,
    });
  };

  return {
    file: null,
    tiles: [],
    imageSize: [0, 0],
    zip: null,
    loading: false,
    showZip: false,

    setFile(file) {
      set({
        file,
        tiles: [],
        zip: null,
        showZip: false,
      });
    },

    generateTiles() {
      const { file } = get();
      if (!file) return;

      set({ loading: true });

      const url = URL.createObjectURL(file);
      worker.postMessage({ file: url });
    },

    sendDemo(url) {
      set({ loading: true });
      worker.postMessage({ file: url });
    },

    downloadZip() {
      const { zip, file } = get();
      if (!zip) return;

      const url = URL.createObjectURL(zip);
      const link = document.createElement("a");

      link.href = url;
      link.download = file ? `${file.name.split(".")[0]}.zip` : "tiles.zip";

      link.click();
      URL.revokeObjectURL(url);
    },

    reset() {
      set({
        file: null,
        tiles: [],
        zip: null,
        showZip: false,
        loading: false,
      });
    },
  };
});
