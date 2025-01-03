import React, { useRef, useState } from "react";
import workerPath from "./worker?worker";
import { MapContainer } from "react-leaflet";
import type { Tiles } from "./CustomTileLayer";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import CustomTileLayer from "./CustomTileLayer";
import Caption from "./Caption";
const worker = new workerPath();

const App: React.FC = () => {
  const [tiles, setTiles] = useState<Tiles>([]);
  const [showZip, setShowZip] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const zipRef = useRef<Blob | null>(null);

  const clear = () => {
    zipRef.current = null;
  };
  const toTile = () => {
    if (!fileRef.current?.files?.length) {
      return;
    }
    clear();
    const file = fileRef.current!.files[0];
    setLoading(true);
    if (file) {
      const url = URL.createObjectURL(file);

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
    let name = `tiles.zip`;
    if (fileRef.current?.files?.[0]) {
      name = fileRef.current?.files[0].name.split(".")[0];
    }
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <h1>image-to-tile demo</h1>
      <div className="opt">
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
          to tile images
        </button>
        {loading && (
          <div style={{ width: 120 }}>
            Generating<span className="dots"></span>
          </div>
        )}
        {showZip && (
          <button onClick={dowloadZip} style={{ marginLeft: 20 }}>
            dowload tiles（ZIP）
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
