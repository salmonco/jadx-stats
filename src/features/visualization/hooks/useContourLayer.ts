import { useEffect } from "react";
import { LayerManager } from "~/maps/hooks/useLayerManager";
import { ExtendedOLMap } from "~/maps/hooks/useOLMap";
import { VectorBaseLayerOptions } from "~/maps/classes/AsyncVectorLayerFactory";
import contourGeoJson from "~/assets/geojson/contour_100m_200m.geojson?url";

import GeoJSON from "ol/format/GeoJSON";
import { Feature } from "ol";
import { Stroke, Style } from "ol/style";

interface Props {
  layerManager: LayerManager;
  ready: boolean;
  map: ExtendedOLMap;
}

const useContourLayer = ({ layerManager, ready, map }: Props) => {
  useEffect(() => {
    if (!ready || !map || !layerManager) return;

    const loadGeoJson = async () => {
      const response = await fetch(contourGeoJson);
      const geojson = await response.json();

      const format = new GeoJSON();
      const features: Feature[] = format.readFeatures(geojson, {
        featureProjection: "EPSG:3857",
      });

      const styleFn = (feature: Feature) => {
        const elev = feature.get("ELEV");

        const color = elev === 100 ? "#FFA500" : elev === 200 ? "#FF4C4C" : "#ccc";

        return new Style({
          stroke: new Stroke({
            color,
            width: 1.5,
          }),
        });
      };

      const layerOptions: VectorBaseLayerOptions = { style: styleFn };

      await layerManager.addOrReplaceLayer("contourLayer", features, layerOptions, "등고선");

      const layer = layerManager.getLayer("contourLayer");
      if (layer) layer.getLayer().set("ignoreClick", true);
    };

    loadGeoJson();
  }, [layerManager, ready, map]);
};

export default useContourLayer;
