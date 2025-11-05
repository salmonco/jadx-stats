import { ScaleLine, Zoom, ZoomSlider } from "ol/control";
import { useMemo } from "react";
import { jejuMapConfig, koreaMapConfig, MapType, worldMapConfig } from "~/maps/constants/gisConstants";
import useEventManager from "~/maps/hooks/useEventManager";
import useLayerManager from "~/maps/hooks/useLayerManager";
import useOLMap, { UseOLMapOptions } from "~/maps/hooks/useOLMap";

const useSetupOL = (mapId: string, zoom: number = 11, region?: MapType, zoomController = true, scaleLineController = true) => {
  let config: UseOLMapOptions;
  if (region === "rest") {
    config = { ...koreaMapConfig, zoom: zoom };
  } else if (region === "jeju") {
    config = { ...jejuMapConfig, zoom: zoom };
  } else {
    config = { ...worldMapConfig, zoom: zoom };
  }

  const map = useOLMap(mapId, config);
  const layerManager = useLayerManager(map);
  const eventManager = useEventManager(map);
  const ready = useMemo(() => !!(map && layerManager), [map, layerManager]);

  // zoom slider
  if (map && ready && zoomController) {
    map.addControl(new Zoom());
    map.addControl(new ZoomSlider());
  }

  /**
   * scale line
   * @see https://openlayers.org/en/latest/examples/scale-line.html
   */
  if (map && ready && scaleLineController) {
    const scaleLineControl = new ScaleLine({
      units: "metric",
      bar: false,
      steps: 4,
      text: true,
      minWidth: 60,
    });
    map.addControl(scaleLineControl);
  }

  return { map, layerManager, eventManager, ready };
};

export default useSetupOL;
