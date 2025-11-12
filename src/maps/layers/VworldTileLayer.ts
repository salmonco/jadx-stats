import TileLayer from "ol/layer/Tile";
import { get as getProjection } from "ol/proj";
import XYZ from "ol/source/XYZ";
import TileGrid from "ol/tilegrid/TileGrid";
import BaseLayer from "~/maps/layers/BaseLayer";

// const SERVICE_KEY = "8E314157-3E85-3ADD-BA14-E8FF65EDCEE4";
// const SERVICE_KEY = "C6963F7E-3A47-3831-90FF-1456020C20D9";
const SERVICE_KEY = "5C007965-7E1D-34BB-96D1-E5D3AB697EEE";
const PROJECTION = "EPSG:3857"; // Vworld가 사용하는 좌표계

const EXTENT = [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244];
const RESOLUTIONS = Array.from({ length: 22 }, (_, z) => 156543.03392804097 / Math.pow(2, z));
const TILE_SIZE = 256;

class VworldTileSource extends XYZ {
  constructor(mapType: string) {
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
        const tileMatrix = z;
        const tileRow = y;
        const tileCol = x;
        const extension = mapType === "Satellite" ? "jpeg" : "png";

        return `https://api.vworld.kr/req/wmts/1.0.0/${SERVICE_KEY}/${mapType}/${tileMatrix}/${tileRow}/${tileCol}.${extension}`;
      },
      wrapX: false,
    });
  }
}

class VworldLayer extends BaseLayer {
  constructor(mapType: string) {
    const layerType = "tile";
    const source = new VworldTileSource(mapType);
    const layer = new TileLayer({ source: source });
    super({ layerType, source: layer.getSource() }, "배경지도");
  }
}

export default VworldLayer;
