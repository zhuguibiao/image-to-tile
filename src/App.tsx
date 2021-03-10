import React from "react";
import { Map, TileLayer, Circle, ImageOverlay } from "react-leaflet";
var Leaflet = require("leaflet");

function App() {
  return (
    <Map
      animate={true}
      crs={Leaflet.CRS.Simple}
      center={[0, 0]}
      bounds={[
        [10, 10], [0, 50]
      ]}
      zoom={6}
      style={{ height: "100vh" }}
      maxBounds={[
        [-110, 165],
        [0, 0],
      ]}
    >
      <TileLayer url="http://localhost:8080/2222/{z}/{y}/{x}.png" />
      <ImageOverlay
        bounds={[
          [-10, 15],
          [0, 0],
        ]}
        zIndex={12}
        url="http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg"
      />
      <Circle center={[-10, 40]} fillColor="blue" radius={2} />
    </Map>
  );
}
export default App;
