import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Draw } from "ol/interaction";
import { LineString, Point, Polygon, Circle } from "ol/geom";
import { getLength, getArea } from "ol/sphere";
import VectorLayer from "ol/layer/Vector";
import { Feature } from "ol";
import Geometry from "ol/geom/Geometry";
import VectorSource from "ol/source/Vector";
import { Style, Stroke, Fill, Text } from "ol/style";
import { LayerManager } from "~/maps/hooks/useLayerManager";
import { ExtendedOLMap } from "~/maps/hooks/useOLMap";
import InterectionLayer from "~/maps/layers/InterectionLayer";
import CircleStyle from "ol/style/Circle";

const useMapTools = (
  layerManager: LayerManager,
  map: ExtendedOLMap,
  setSelectedFeature: Dispatch<SetStateAction<Feature | null>>,
  setHighlightEnabled: Dispatch<SetStateAction<boolean>>
) => {
  const drawInteractionsRef = useRef<Record<string, Draw>>({});

  const [activeTool, setActiveTool] = useState<string | null>(null);

  const toggleTool = async (tool: string | null) => {
    if (tool === "reset") {
      reset();
      layerManager.removeAllExceptTileLayer();
      setSelectedFeature(null);
      return;
    }

    if (tool === "zoomIn") {
      const view = map.getView();
      const currentZoom = view.getZoom() ?? 10;
      view.animate({
        zoom: currentZoom + 1,
        duration: 300,
      });
      return;
    }

    if (tool === "zoomOut") {
      const view = map.getView();
      const currentZoom = view.getZoom() ?? 10;
      view.animate({
        zoom: currentZoom - 1,
        duration: 300,
      });
      return;
    }

    if (!layerManager.getLayer("측정 레이어")) {
      const measurementLayer = new InterectionLayer();
      await layerManager.addLayer(measurementLayer, "측정 레이어");
    }

    active(tool);
  };

  const active = (tool: string | null) => {
    setHighlightEnabled(!tool);

    if (activeTool && drawInteractionsRef.current[activeTool]) {
      drawInteractionsRef.current[activeTool].setActive(false);
    }

    if (!tool || activeTool === tool) {
      setActiveTool(null);
      return;
    }

    setActiveTool(tool);

    const layer = layerManager.getLayer("측정 레이어")!.getLayer() as VectorLayer<Feature<Geometry>>;
    const source = layer.getSource() as VectorSource<Feature<Geometry>>;

    let interaction = drawInteractionsRef.current[tool];
    if (interaction) {
      interaction.setActive(true);
      return;
    }

    if (tool === "point") {
      const pointStyle = new Style({
        image: new CircleStyle({
          radius: 5.5,
          fill: new Fill({ color: "#ff0000" }),
          stroke: new Stroke({ color: "#fff", width: 1 }),
        }),
      });

      interaction = new Draw({ source, type: "Point" });
      interaction.on("drawend", (evt) => {
        evt.feature.setStyle(pointStyle);
      });
    } else if (tool === "distance") {
      interaction = new Draw({ source, type: "LineString" });
      interaction.on("drawend", (evt) => {
        const geom = evt.feature.getGeometry() as LineString;
        const length = getLength(geom);
        const output = length > 1000 ? `${(length / 1000).toFixed(2)} km` : `${length.toFixed(2)} m`;
        const midPoint = geom.getCoordinateAt(0.5);
        addTextFeature(midPoint, output, source);
      });
    } else if (tool === "area") {
      interaction = new Draw({ source, type: "Polygon" });
      interaction.on("drawend", (evt) => {
        const geom = evt.feature.getGeometry() as Polygon;
        const area = getArea(geom);
        const output = area > 10000 ? `${(area / 1000000).toFixed(2)} km²` : `${area.toFixed(2)} m²`;
        const center = geom.getInteriorPoint().getCoordinates();
        addTextFeature(center, output, source);
      });
    } else if (tool === "radius") {
      interaction = new Draw({ source, type: "Circle" });
      interaction.on("drawend", (evt) => {
        const geom = evt.feature.getGeometry() as Circle;
        const radius = geom.getRadius();
        const area = Math.PI * Math.pow(radius, 2);

        const radiusOutput = radius > 1000 ? `${(radius / 1000).toFixed(2)} km` : `${radius.toFixed(2)} m`;
        const areaOutput = area > 1000000 ? `${(area / 1000000).toFixed(2)} km²` : `${area.toFixed(2)} m²`;

        const center = geom.getCenter();
        const edgeCoord = geom.getLastCoordinate();
        addRadiusLine(center, edgeCoord, source);

        const midPoint = [(center[0] + edgeCoord[0]) / 2, (center[1] + edgeCoord[1]) / 2];
        addTextFeature(midPoint, radiusOutput, source, 15);
        addTextFeature(center, areaOutput, source);
      });
    }

    interaction.setActive(true); // 기본 활성화
    map.addInteraction(interaction); // 최초 한 번만 add
    drawInteractionsRef.current[tool] = interaction;
  };

  // 반지름 선을 추가하는 함수
  const addRadiusLine = (center: number[], edge: number[], source: VectorSource<Feature>) => {
    const radiusLine = new Feature({
      geometry: new LineString([center, edge]),
    });

    radiusLine.setStyle(
      new Style({
        stroke: new Stroke({
          color: "#ff0000",
          width: 2,
        }),
      })
    );

    source.addFeature(radiusLine);
  };

  // 텍스트 피처 추가 함수
  const addTextFeature = (coordinate: number[], text: string, source: VectorSource<Feature>, offsetY: number = -15) => {
    const textFeature = new Feature({
      geometry: new Point(coordinate),
    });

    textFeature.setStyle(
      new Style({
        text: new Text({
          text: text,
          font: "bold 14px Arial",
          fill: new Fill({ color: "#000" }),
          stroke: new Stroke({ color: "#fff", width: 2 }),
          offsetY: offsetY,
        }),
      })
    );

    source.addFeature(textFeature);
  };

  // 초기화 함수
  const reset = () => {
    // 피처 삭제
    const layer = layerManager.getLayer("측정 레이어")!.getLayer() as VectorLayer<Feature<Geometry>>;
    const source = layer.getSource();
    if (source instanceof VectorSource) {
      source.clear();
    }

    // 모든 interaction 제거
    Object.values(drawInteractionsRef.current).forEach((interaction) => {
      map.removeInteraction(interaction);
    });

    drawInteractionsRef.current = {};
    setActiveTool(null);
    setHighlightEnabled(true);
  };

  return { toggleTool };
};

export default useMapTools;
