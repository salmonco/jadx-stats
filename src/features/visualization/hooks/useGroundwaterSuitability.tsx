import { useEffect } from "react";
import { Feature, Map, Overlay } from "ol";
import { GeoJSON } from "ol/format";
import { Fill, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { Coordinate } from "ol/coordinate";
import { Pixel } from "ol/pixel";
import { LayerManager } from "~/maps/hooks/useLayerManager";
import { createRoot } from "react-dom/client";
import { throttle } from "~/utils/common";
import { Tooltip } from "antd";
import visualizationApi from "~/services/apis/visualizationApi";

const createStyle = (() => {
  const styleCache: { [key: string]: Style } = {};

  // 하나라도 부적합시 빨간색 표시로 수정
  const colorMap = {
    // 0: "#D32F2F", // 0 -> 레드
    // 1: "#F57C00", // 1 -> 오렌지
    // 2: "#FBC02D", // 2 -> 옐로우
    // 3: "#388E3C", // 3 -> 그린
    0: "#D11B1B",
    1: "#D11B1B",
    2: "#D11B1B",
    3: "rgba(245, 245, 245, 0.5)",
  };

  return (feature: Feature) => {
    // feature.get을 통해 직접 quality_metric 값을 가져옴
    const qualityValue = feature.get("qlty_scr");

    // quality_metric가 존재하지 않으면 기본 색상 설정
    const cacheKey = qualityValue !== undefined ? qualityValue.toString() : "default";

    if (styleCache[cacheKey]) return styleCache[cacheKey];

    // quality_metric 값에 따른 색상 선택
    const fillColor = colorMap[qualityValue] || "#808080";

    const style = new Style({
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({ color: fillColor }),
        stroke: new Stroke({
          color: "black",
          width: 1,
        }),
      }),
    });

    styleCache[cacheKey] = style; // 스타일 캐싱
    return style;
  };
})();

const useGroundwaterSuitability = (layerManager: LayerManager, ready: boolean, map: Map) => {
  useEffect(() => {
    if (!ready || !map) return;

    const fetchFeature = visualizationApi
      .getVisualizationData("agrclt_gwt_wtrqlty.file.well", { level: "groundwater" })
      .then((data) => new GeoJSON().readFeatures(data)) as Promise<Feature[]>;

    layerManager.removeLayer("groundwaterLayer");
    layerManager.addOrReplaceLayer("groundwaterLayer", fetchFeature, { style: createStyle }, "지하수");

    const tooltipContainer = document.createElement("div");
    document.body.appendChild(tooltipContainer);

    const overlay = new Overlay({
      element: tooltipContainer,
      offset: [10, 0],
      positioning: "bottom-left",
    });
    map.addOverlay(overlay);

    const root = createRoot(tooltipContainer);
    let lastFeature = null;
    map.on(
      "pointermove",
      throttle((evt: { pixel: Pixel; coordinate: Coordinate }) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, (feat) => feat);
        if (feature !== lastFeature) {
          lastFeature = feature;
          if (feature) {
            const address = feature.get("addr");
            if (address) {
              overlay.setPosition(evt.coordinate);
              root.render(<Tooltip title={address} open={true} color="white" overlayInnerStyle={{ color: "black" }} />);
            } else {
              root.render(<Tooltip title="" open={false} />);
            }
          } else {
            root.render(<Tooltip title="" open={false} />);
          }
        }
      }, 200)
    );

    map.getViewport().addEventListener("mouseout", () => {
      root.render(<Tooltip title="" open={false} />);
    });

    return () => {
      map.removeOverlay(overlay);
      if (tooltipContainer.parentNode === document.body) document.body.removeChild(tooltipContainer);
    };
  }, [layerManager, ready, map]);

  return null;
};

export default useGroundwaterSuitability;
