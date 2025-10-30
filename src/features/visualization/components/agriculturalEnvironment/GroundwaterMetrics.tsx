import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Feature, Map, Overlay } from "ol";
import { GeoJSON } from "ol/format";
import { Fill, Icon, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { Coordinate } from "ol/coordinate";
import { Pixel } from "ol/pixel";
import { baseUrl, getRequest } from "~/maps/services/MapDataService";
import { LayerManager } from "~/maps/hooks/useLayerManager";
import { interpolateTurbo, interpolateYlOrBr, interpolateYlGn, scaleSequential } from "d3";
import { Tooltip } from "antd";
// @ts-ignore
import throttle from "lodash.throttle";

export type Metrics = "nitrogen" | "ph" | "chlorine";

// pH 스타일 생성 함수
const createPhStyle = (() => {
  const styleCache: { [key: string]: Style } = {};

  // pH 값에 따른 색상 스케일 설정 (범위 4 ~ 10)
  const colorScale = scaleSequential(interpolateTurbo).domain([4, 10]);

  return (ph: number) => {
    const cacheKey = ph.toFixed(1);
    if (styleCache[cacheKey]) return styleCache[cacheKey];

    const fillColor = colorScale(ph);

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

    styleCache[cacheKey] = style;
    return style;
  };
})();

// nitrogen 스타일 생성 함수
const createNitrogenStyle = (() => {
  const styleCache: { [key: string]: Style } = {};

  // nitrogen 값에 따른 색상 스케일 설정 (범위 0.08 ~ 95)
  const colorScale = scaleSequential(interpolateYlOrBr).domain([0.08, 95]);

  return (nitrogen: number) => {
    const height = Math.max(10, Math.min(50, (nitrogen / 95) * 30));
    const cacheKey = nitrogen.toFixed(2) + height.toFixed(0);
    if (styleCache[cacheKey]) return styleCache[cacheKey];

    const fillColor = colorScale(nitrogen);

    const style = new Style({
      image: new Icon({
        src: createTriangleIcon(height, fillColor),
      }),
    });

    styleCache[cacheKey] = style;
    return style;
  };
})();

// chlorine 스타일 생성 함수
const createChlorineStyle = (() => {
  const styleCache: { [key: string]: Style } = {};

  // chlorine 값에 따른 색상 스케일 설정 (범위 1 ~ 900)
  const colorScale = scaleSequential(interpolateYlGn).domain([1, 900]);

  return (chlorine: number) => {
    const height = Math.max(10, Math.min(50, (chlorine / 95) * 30));
    const cacheKey = chlorine.toFixed(2) + height.toFixed(0);
    if (styleCache[cacheKey]) return styleCache[cacheKey];

    const fillColor = colorScale(chlorine);

    const style = new Style({
      image: new Icon({
        src: createTriangleIcon(height, fillColor),
      }),
    });

    styleCache[cacheKey] = style;
    return style;
  };
})();

const createTriangleIcon = (height: number, fillColor: string) => {
  const width = 5;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = width * 2;
  canvas.height = height;

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.moveTo(width, 0); // 삼각형 꼭대기
  context.lineTo(0, height); // 좌측 하단
  context.lineTo(width * 2, height); // 우측 하단
  context.closePath();

  context.fillStyle = fillColor; // 전달된 색상 적용
  context.fill();

  context.strokeStyle = "rgba(0, 0, 0, 0.2)";
  context.lineWidth = 1;
  context.stroke();

  return canvas.toDataURL();
};

export const createGetStyle = (selectedMetrics: Metrics) => {
  return (feature: Feature) => {
    const metrics = feature.get(selectedMetrics);

    if (selectedMetrics === "ph") {
      return createPhStyle(metrics);
    } else if (selectedMetrics === "nitrogen") {
      return createNitrogenStyle(metrics);
    } else {
      return createChlorineStyle(metrics);
    }
  };
};

export const useGroundwaterMetrics = (layerManager: LayerManager, ready: boolean, map: Map, selectedVisType?: string) => {
  const [selectedMetrics, setSelectedMetrics] = useState<Metrics>("nitrogen");

  useEffect(() => {
    if (!ready || !map || selectedVisType !== "metrics") return;

    const fetchFeature = getRequest(`${baseUrl}/groundwater-data/well_locations.geojson`).then((data) => new GeoJSON().readFeatures(data)) as Promise<Feature[]>;

    layerManager.removeLayer("groundwaterLayer");
    layerManager.addOrReplaceLayer("groundwaterLayer", fetchFeature, { style: createGetStyle(selectedMetrics) }, "지하수");

    const tooltipContainer = document.createElement("div");
    document.body.appendChild(tooltipContainer);

    const overlay = new Overlay({
      element: tooltipContainer,
      offset: [-1, -4],
      positioning: "bottom-left",
    });
    map.addOverlay(overlay);

    const root = createRoot(tooltipContainer);
    let lastFeature: Feature | null = null;

    // 마우스 hover에 따른 툴팁 처리
    map.on(
      "pointermove",
      throttle((evt: { pixel: Pixel; coordinate: Coordinate }) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, (feat) => feat) as Feature | null;

        if (feature !== lastFeature) {
          lastFeature = feature;
          if (feature) {
            const metricsValue = feature.get(selectedMetrics);
            const address = feature.get("address");

            map.getViewport().style.cursor = "pointer";

            if (metricsValue !== undefined && address) {
              const tooltipContent = `${address}`;
              overlay.setPosition(evt.coordinate);
              root.render(<Tooltip title={tooltipContent} open={true} color="white" overlayInnerStyle={{ color: "black" }} />);
            } else {
              root.render(<Tooltip title="" open={false} />);
            }
          } else {
            root.render(<Tooltip title="" open={false} />);
          }
        } else {
          map.getViewport().style.cursor = "";
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
  }, [layerManager, ready, selectedMetrics, map, selectedVisType]);

  return {
    selectedMetrics,
    setSelectedMetrics,
  };
};
