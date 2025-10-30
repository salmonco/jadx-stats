import { useEffect } from "react";
import { Feature } from "ol";
import { Point } from "ol/geom";
import VectorSource from "ol/source/Vector";
import { Icon, Style } from "ol/style";
import BaseLayer from "~/maps/layers/BaseLayer";
import mapMarker from "~/assets/map-marker-red.png";
import { LayerManager } from "~/maps/hooks/useLayerManager";
import { ExtendedOLMap } from "~/maps/hooks/useOLMap";

interface Props {
  layerManager: LayerManager;
  map?: ExtendedOLMap;
  coordinates: [number, number];
  zoomLevel?: number;
}

const useMapMarkerLayer = ({ layerManager, coordinates, map, zoomLevel }: Props) => {
  useEffect(() => {
    if (!layerManager || !coordinates) return;

    const pointFeature = new Feature({
      geometry: new Point(coordinates),
    });
    const vectorSource = new VectorSource({
      features: [pointFeature],
    });
    const style = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: mapMarker,
        scale: 0.13,
      }),
    });
    const pointLayer = new BaseLayer({ style, layerType: "vector", source: vectorSource }, "pointLayer");
    layerManager.addLayer(pointLayer, "pointLayer", 100);

    if (map && zoomLevel !== undefined) {
      const view = map.getView();
      view.setCenter(coordinates);
      view.setZoom(zoomLevel);
    }
  }, [layerManager, coordinates, map, zoomLevel]);
};

export default useMapMarkerLayer;
