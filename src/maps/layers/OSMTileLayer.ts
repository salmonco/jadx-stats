import XYZ from "ol/source/XYZ";
import TileGrid from "ol/tilegrid/TileGrid";
import { get as getProjection } from "ol/proj";
import BaseLayer from "./BaseLayer";
import TileLayer from "ol/layer/Tile";

const PROJECTION = "EPSG:3857"; // OSM은 Web Mercator 좌표계 사용
const EXTENT = [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244];
const RESOLUTIONS = Array.from({ length: 22 }, (_, z) => 156543.03392804097 / Math.pow(2, z));
const TILE_SIZE = 256;

class OSMTileSource extends XYZ {
  constructor() {
    super({
      crossOrigin: "anonymous",
      projection: getProjection(PROJECTION),
      tileGrid: new TileGrid({
        extent: EXTENT,
        resolutions: RESOLUTIONS,
        tileSize: TILE_SIZE,
      }),
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      wrapX: true,
    });
  }
}

class OSMTileLayer extends BaseLayer {
  constructor() {
    const layerType = "tile";
    const source = new OSMTileSource();
    const layer = new TileLayer({ source: source });
    super({ layerType, source: layer.getSource() }, "배경지도");
  }
}

export default OSMTileLayer;
