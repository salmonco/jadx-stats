import { useEffect, useMemo } from "react";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Fill, Icon, Stroke, Style } from "ol/style";
import Polygon from "ol/geom/Polygon";
import { getBottomLeft, getBottomRight, getCenter, getTopLeft, getTopRight } from "ol/extent";
import { Translate } from "ol/interaction";
import { ExtendedOLMap } from "~/maps/hooks/useOLMap";
import useSetupOL from "~/maps/hooks/useSetupOL";
import useSetupBackgroundMap from "~/maps/hooks/useSetupBackgroundMap";
import BaseLayer from "~/maps/layers/BaseLayer";
import { cn } from "~/utils/common";
import { v4 as uuidv4 } from "uuid";
import redMapMarker from "~/assets/map-marker-red.png";
import greenMapMarker from "~/assets/map-marker-green.png";

const MAP_ID = uuidv4();

interface Props {
  mainMap?: ExtendedOLMap | null;
  layers?: BaseLayer[];
}

export const usePointLayer = (lonLat: [number, number], color: "red" | "green" = "red", scale = 0.09) => {
  const pointLayer = useMemo(() => {
    const pointFeature = new Feature({
      geometry: new Point(fromLonLat(lonLat)),
    });
    const vectorSource = new VectorSource({
      features: [pointFeature],
    });

    const mapMarker = color === "red" ? redMapMarker : greenMapMarker;

    const style = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: mapMarker,
        scale: scale,
      }),
    });

    return new BaseLayer({ style, layerType: "vector", source: vectorSource }, "pointLayer");
  }, [lonLat, color, scale]);

  return pointLayer;
};

const MiniMap = ({ mainMap, layers }: Props) => {
  const { layerManager, map, ready } = useSetupOL(MAP_ID, 8.8, "jeju", false, false);
  useSetupBackgroundMap(layerManager!, ready);

  useEffect(() => {
    if (layers?.length > 0 && ready) {
      layers.forEach((layer) => {
        layerManager.addLayer(layer, layer.verboseName);
      });
    }
  }, [ready, layers]);

  useEffect(() => {
    if (!mainMap || !ready) return;

    const mainView = mainMap.getView();

    map.getInteractions().clear();

    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: "red",
          width: 2,
        }),
        fill: new Fill({
          color: "rgba(255, 255, 255, 0)",
        }),
      }),
    });
    map.addLayer(vectorLayer);

    // 메인 맵의 현재 범위에 맞게 박스 생성
    const updateBox = () => {
      const extent = mainView.calculateExtent();

      // extent를 Polygon 좌표 배열로 변환
      const coordinates = [getBottomLeft(extent), getBottomRight(extent), getTopRight(extent), getTopLeft(extent), getBottomLeft(extent)];

      const polygon = new Polygon([coordinates]);
      vectorSource.clear();
      vectorSource.addFeature(new Feature(polygon));
    };

    updateBox();

    mainView.on("change:center", updateBox);
    mainView.on("change:resolution", updateBox);

    const translateInteraction = new Translate({
      features: vectorSource.getFeaturesCollection(),
    });
    map.addInteraction(translateInteraction);

    translateInteraction.on("translating", (event) => {
      const feature = event.features.getArray()[0];
      if (feature) {
        const polygon = feature.getGeometry() as Polygon;
        const newCenter = getCenter(polygon.getExtent());
        mainView.setCenter(newCenter);
      }
    });

    return () => {
      mainView.un("change:center", updateBox);
      mainView.un("change:resolution", updateBox);
      map.removeLayer(vectorLayer);
      map.removeInteraction(translateInteraction);
    };
  }, [mainMap, map]);

  return (
    <div id={MAP_ID} className={cn("right-[12px] top-[16px] z-[998] h-[170px] w-[300px] border border-gray-300 shadow-lg", mainMap ? "absolute" : "h-full w-full")} />
  );
};

export default MiniMap;
