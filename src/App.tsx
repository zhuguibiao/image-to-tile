import React, { useRef, useState } from "react";
import workerPath from "./worker?worker";
import { MapContainer } from "react-leaflet";
import type { Tiles } from "./CustomTileLayer";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import CustomTileLayer from "./CustomTileLayer";
import Caption from "./Caption";

const App: React.FC = () => {
  const [tiles, setTiles] = useState<Tiles>([]);
  const [showZip, setShowZip] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const zipRef = useRef<Blob | null>(null);

  const toTile = () => {
    if (!fileRef.current?.files?.length) {
      return;
    }
    const file = fileRef.current!.files[0];
    setLoading(true);
    if (file) {
      const url = URL.createObjectURL(file);
      const worker = new workerPath();
      worker.postMessage({ file: url });
      worker.onmessage = function (e) {
        const { tileData, zip } = e.data;
        console.log("Received data:", e.data);
        if (zip) {
          zipRef.current = zip;
          setShowZip(true);
        }
        if (tileData) {
          setTiles(tileData);
          setLoading(false);
        }
      };
    }
  };

  const dowloadZip = () => {
    const link = document.createElement("a");
    const url = URL.createObjectURL(zipRef.current as Blob);
    link.href = url;
    link.download = "tiles.zip";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <h1>image-to-tile demo</h1>
      <div style={{ display: "flex" }}>
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          ref={fileRef}
          onChange={() => {
            setShowZip(false);
          }}
        />
        <button onClick={toTile} disabled={loading}>
          生成瓦片图
        </button>
        {loading && (
          <div style={{ width: 120 }}>
            正在生成中<span className="dots"></span>
          </div>
        )}
        {showZip && (
          <button onClick={dowloadZip} style={{ marginLeft: 20 }}>
            下载生成的瓦片图（ZIP）
          </button>
        )}
      </div>
      <Caption />
      <MapContainer id="map" crs={L.CRS.Simple} zoom={1} center={[0, 0]}>
        <CustomTileLayer tiles={tiles}></CustomTileLayer>
      </MapContainer>
    </div>
  );
};

export default App;
