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
      /**
       * NOTE: "Tainted canvases may not be exported." 오류를 해결하기 위해 crossOrigin anonymous 설정
       * - 지도 export 기능을 구현할 때, 브라우저가 CORS 정책으로 이미지를 요청하게 되며,
       * - 타일 서버가 적절한 Access-Control-Allow-Origin 헤더로 응답하면
       * - 이미지는 "오염되지 않은" 것으로 간주되어 toDataURL() 메서드를 안전하게 실행할 수 있음
       */
      crossOrigin: "anonymous",
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
