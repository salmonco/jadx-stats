import { Feature } from "ol";
import VectorSource from "ol/source/Vector";
import { Geometry } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import { Style, Stroke } from "ol/style";
import BaseLayer from "~/maps/layers/BaseLayer";

class InterectionLayer extends BaseLayer {
  constructor() {
    const vectorSource = new VectorSource();

    const vectorLayerOptions = {
      layerType: "vector",
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: "rgba(255, 0, 0, 1)",
          width: 2,
        }),
      }),
    } as const;

    super(vectorLayerOptions, "측정 레이어");

    this.getLayer().set("ignoreClick", true);
    this.getLayer().set("isMeasurement", true);
  }

  getSource(): VectorSource<Feature<Geometry>> {
    if (this.layer instanceof VectorLayer) {
      return this.layer.getSource();
    }
    throw new Error("Source is not available for non-vector layers");
  }
}

export default InterectionLayer;
