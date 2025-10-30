import TileLayer from "ol/layer/Tile";
import TileGrid from "ol/tilegrid/TileGrid";
import { get as getProjection } from "ol/proj";
import XYZ from "ol/source/XYZ";
import BaseLayer from "~/maps/layers/BaseLayer";

const TRACESTRACK_API_KEY = "0c57150a5a8945086c0e6f2044022098";
const PROJECTION = "EPSG:3857";
const EXTENT = [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244];
const RESOLUTIONS = Array.from({ length: 22 }, (_, z) => 156543.03392804097 / Math.pow(2, z));
const TILE_SIZE = 256;

class TracestrackTileSource extends XYZ {
  constructor() {
    super({
      projection: getProjection(PROJECTION),
      tileGrid: new TileGrid({
        extent: EXTENT,
        resolutions: RESOLUTIONS,
        tileSize: TILE_SIZE,
      }),
      tileUrlFunction: (tileCoord) => {
        const [z, x, y] = tileCoord;
        return `https://tile.tracestrack.com/topo__/${z}/${x}/${y}.png?key=${TRACESTRACK_API_KEY}`;
      },
    });
  }
}

class TracestrackTileLayer extends BaseLayer {
  constructor() {
    const layerType = "tile";
    const source = new TracestrackTileSource();
    const layer = new TileLayer({ source: source });
    super({ layerType, source: layer.getSource() }, "배경지도");
  }
}

export default TracestrackTileLayer;
