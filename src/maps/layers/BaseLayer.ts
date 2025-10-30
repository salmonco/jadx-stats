import { Feature } from "ol";
import { Layer, Tile as TileLayer, Vector as VectorLayer, Image as ImageLayer, VectorTile as VectorTileLayer } from "ol/layer";
import { Tile as TileSource, Vector as VectorSource, Image as ImageSource, VectorTile as VectorTileSource } from "ol/source";
import Style, { StyleLike } from "ol/style/Style";

export interface TileLayerOptions {
  layerType: "tile";
  source: TileSource;
  style?: StyleLike;
}

export interface VectorLayerOptions {
  layerType: "vector";
  source: VectorSource;
  style?: StyleLike;
  ignoreClick?: boolean;
}

export interface ImageLayerOptions {
  layerType: "image";
  source: ImageSource;
  style?: StyleLike;
}

export interface CustomLayerOptions {
  layerType: "custom";
  layer: Layer;
}

export interface VectorTileLayerOptions {
  layerType: "vectorTile";
  source: VectorTileSource;
  style?: StyleLike;
  useInterimTilesOnError?: boolean;
  ignoreClick?: boolean;
}

type BaseLayerOptions = TileLayerOptions | VectorLayerOptions | ImageLayerOptions | VectorTileLayerOptions | CustomLayerOptions;

class BaseLayer {
  layer: Layer;
  verboseName: string | null = null;

  constructor(options: BaseLayerOptions, verboseName: string | null = null) {
    this.layer = this.setupLayer(options);
    this.verboseName = verboseName;
  }

  setupLayer(options: BaseLayerOptions): Layer {
    const layerType = options.layerType;
    delete options.layerType;

    switch (layerType) {
      case "tile":
        return new TileLayer({ ...options });
      case "vector":
        const vectorLayer = new VectorLayer({ ...options });
        vectorLayer.set("ignoreClick", options.ignoreClick ?? false);
        return vectorLayer;
      case "image":
        return new ImageLayer({ ...options });
      case "vectorTile":
        const vectorTileLayer = new VectorTileLayer({ ...options });
        vectorTileLayer.set("ignoreClick", options.ignoreClick ?? false);
        return vectorTileLayer;
      case "custom":
        return options.layer;
      default:
        throw new Error("Unsupported layer type");
    }
  }

  getLayer(): Layer {
    return this.layer;
  }

  toggleVisibility() {
    if (this.layer) {
      const currentVisibility = this.layer.getVisible();
      this.layer.setVisible(!currentVisibility);
    }
  }

  setVisibility(visible: boolean) {
    if (this.layer) {
      this.layer.setVisible(visible);
    }
  }

  addFeature(feature: Feature) {
    if (this.layer instanceof VectorLayer) {
      this.layer.getSource()?.addFeature(feature);
    } else {
      throw new Error("addFeature is only applicable for vector layers");
    }
  }

  removeFeature(feature: Feature) {
    if (this.layer instanceof VectorLayer) {
      this.layer.getSource()?.removeFeature(feature);
    } else {
      throw new Error("removeFeature is only applicable for vector layers");
    }
  }

  setStyle(style: Style | Style[] | ((feature: any) => Style | Style[])) {
    if (this.layer instanceof VectorLayer) {
      this.layer.setStyle(style);
    } else {
      throw new Error("setStyle is only applicable for vector layers");
    }
  }
}

export default BaseLayer;
