import { Feature } from "ol";
import { Vector as SourceVector } from "ol/source";
import { StyleLike } from "ol/style/Style";
import BaseLayer, { VectorLayerOptions } from "~/maps/layers/BaseLayer";

export interface VectorBaseLayerOptions {
  style?: StyleLike;
}

class AsyncVectorLayerFactory {
  static async createLayer(featurePromise: Promise<Feature[]>, options: VectorBaseLayerOptions = {}, verboseName: string | null = null): Promise<BaseLayer> {
    try {
      const features = await featurePromise;
      const vectorSource = new SourceVector({
        features,
      });
      const args: VectorLayerOptions = { ...options, layerType: "vector", source: vectorSource };

      const baseLayer = new BaseLayer(args, verboseName);
      return baseLayer;
    } catch (error) {
      throw new Error("Failed to create Vector layer: " + error.message);
    }
  }
}

export default AsyncVectorLayerFactory;
