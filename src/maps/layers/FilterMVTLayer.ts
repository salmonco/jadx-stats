import MVT from "ol/format/MVT";
import TileGrid from "ol/tilegrid/TileGrid";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import { StyleLike } from "ol/style/Style";
import { get as getProjection } from "ol/proj";
import BaseLayer, { VectorTileLayerOptions } from "~/maps/layers/BaseLayer";

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

export function loadFeaturesXhrWith204(url, format, extent, resolution, projection, success, failure) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", typeof url === "function" ? url(extent, resolution, projection) : url, true);
  if (format.getType() === "arraybuffer") {
    xhr.responseType = "arraybuffer";
  }

  xhr.withCredentials = WITH_CREDS;

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
  xhr.send();
}

class FilterMVTSource extends VectorTileSource {
  public setErrorOn204: boolean = false;

  constructor(queryParams: Record<string, any> = {}, setErrorOn204: boolean = false) {
    const query = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => query.append(key, v));
      } else {
        query.set(key, String(value));
      }
    });

    const args: VectorTileOptions = {
      format: new MVT(),
      projection: getProjection(PROJECTION),
      tileGrid: new TileGrid({
        extent: EXTENT,
        resolutions: RESOLUTIONS,
        tileSize: TILE_SIZE,
      }),
      url: `${baseUrl}/api/common/v0/gis/farmfield/mvt/{z}/{x}/{y}?${query.toString()}`,
      wrapX: false,
    };

    if (setErrorOn204) {
      args.tileLoadFunction = customLoadFunction;
    }

    super(args);
    this.setErrorOn204 = setErrorOn204;
  }

  updateQueryParams(queryParams: Record<string, any>) {
    const query = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => query.append(key, v));
      } else {
        query.set(key, String(value));
      }
    });

    const newUrl = `${baseUrl}/api/common/v0/gis/farmfield/mvt/{z}/{x}/{y}?${query.toString()}`;

    this.setTileUrlFunction((tileCoord) => {
      const [z, x, y] = tileCoord;
      return newUrl.replace("{z}", String(z)).replace("{x}", String(x)).replace("{y}", String(y));
    });
  }
}

class FilterMVTLayer extends BaseLayer {
  private _source: FilterMVTSource;

  constructor(key: string, queryParams: Record<string, any>, style?: StyleLike) {
    const source = new FilterMVTSource(queryParams);

    const vectorTileLayer = new VectorTileLayer({ source, style }); // style 직접 주입
    let options: VectorTileLayerOptions = { layerType: "vectorTile", source: vectorTileLayer.getSource() };

    if (style) {
      options = { ...options, style };
    }
    if (source.setErrorOn204) {
      options = { ...options, useInterimTilesOnError: true };
    }

    super(options, key);
    this._source = source;
  }

  getSource(): FilterMVTSource {
    return this._source;
  }

  updateQueryParams(queryParams: Record<string, any>) {
    this._source.updateQueryParams(queryParams);
  }
}

export default FilterMVTLayer;
