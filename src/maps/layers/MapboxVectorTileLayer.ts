import MVT from "ol/format/MVT";
import TileGrid from "ol/tilegrid/TileGrid";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import { StyleLike } from "ol/style/Style";
import { get as getProjection } from "ol/proj";
import VectorTile from "ol/VectorTile";
import BaseLayer from "~/maps/layers/BaseLayer";
import { FlatStyleLike } from "ol/style/flat";

type VectorTileOptions = ConstructorParameters<typeof VectorTileSource>[0];

const baseUrl = import.meta.env.VITE_API_URL;

const PROJECTION = "EPSG:3857";
const EXTENT = [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244];
const RESOLUTIONS = Array.from({ length: 18 }, (_, z) => {
  return 156543.03392804097 / Math.pow(2, z);
});
const TILE_SIZE = 256;

let WITH_CREDS = false;

export function customLoadFunction(tile, url) {
  tile.setLoader(function (extent, resolution, projection) {
    loadFeaturesXhrWith204(url, tile.getFormat(), extent, resolution, projection, tile.onLoad.bind(tile), tile.onError.bind(tile));
  });
}

export function loadFeaturesXhrWith204(url, format, extent, resolution, projection, success, failure, method: "GET" | "POST" = "GET", body: any = null) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, typeof url === "function" ? url(extent, resolution, projection) : url, true);

  if (format.getType() === "arraybuffer") {
    xhr.responseType = "arraybuffer";
  }

  xhr.withCredentials = WITH_CREDS;

  if (method === "POST" && body) {
    xhr.setRequestHeader("Content-Type", "application/json");
  }

  xhr.onload = function () {
    // OL의 원래 코드에서는 0 또는 (200-299)이 "성공". 204는 오류로 처리됨.
    if (!xhr.status || (xhr.status >= 200 && xhr.status < 300)) {
      if (xhr.status === 204) {
        failure();
        return;
      }

      const type = format.getType();
      let source;
      if (type === "json") {
        source = JSON.parse(xhr.responseText);
      } else if (type === "text") {
        source = xhr.responseText;
      } else if (type === "xml") {
        source = xhr.responseXML;
        if (!source) {
          source = new DOMParser().parseFromString(xhr.responseText, "application/xml");
        }
      } else if (type === "arraybuffer") {
        source = /** @type {ArrayBuffer} */ xhr.response;
      }

      if (source) {
        success(
          format.readFeatures(source, {
            extent,
            featureProjection: projection,
          }),
          format.readProjection(source)
        );
      } else {
        failure();
      }
    } else {
      failure();
    }
  };

  xhr.onerror = failure;

  if (method === "POST" && body) {
    xhr.send(JSON.stringify(body));
  } else {
    xhr.send();
  }
}

class MapboxVectorTileSource extends VectorTileSource {
  public setErrorOn204: boolean = false;
  constructor(layerName: string, url?: string, body: any = null, setErrorOn204: boolean = false) {
    const args: VectorTileOptions = {
      format: new MVT(),
      projection: getProjection(PROJECTION),
      tileGrid: new TileGrid({
        extent: EXTENT,
        resolutions: RESOLUTIONS,
        tileSize: TILE_SIZE,
      }),
      url: url || `${baseUrl}/api/common/v0/gis/mvt/{z}/{x}/{y}?layer_name=${layerName}`,
      wrapX: false,
    };

    if (body) {
      args.tileLoadFunction = function (tile: VectorTile & any, urlStr: string) {
        tile.setLoader((extent, resolution, projection) =>
          loadFeaturesXhrWith204(urlStr, tile.getFormat(), extent, resolution, projection, tile.onLoad.bind(tile), tile.onError.bind(tile), "POST", body)
        );
      };
    } else if (setErrorOn204) {
      args.tileLoadFunction = customLoadFunction;
    }

    super(args);
    this.setErrorOn204 = setErrorOn204;
  }
}

class MapboxVectorTileLayer extends BaseLayer {
  private inner: VectorTileLayer<any>;

  constructor(layerName: string, displayName?: string, style?: StyleLike, url?: string, body?: any, ignoreClick: boolean = false) {
    const source = new MapboxVectorTileSource(layerName, url, body);
    const realLayer = new VectorTileLayer({
      source,
      style,
      useInterimTilesOnError: source.setErrorOn204,
    });
    realLayer.set("ignoreClick", ignoreClick);

    super({ layerType: "custom", layer: realLayer }, displayName ?? layerName);

    this.inner = realLayer;
  }

  public setStyle(style: StyleLike) {
    this.inner.setStyle(style);
  }
  public getStyle(): StyleLike | FlatStyleLike | undefined {
    return this.inner.getStyle();
  }
}

export default MapboxVectorTileLayer;
