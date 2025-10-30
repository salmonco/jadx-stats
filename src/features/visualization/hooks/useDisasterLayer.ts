import { useEffect, useRef } from "react";
import { Feature } from "ol";
import VectorSource from "ol/source/Vector";
import ClusterSource from "ol/source/Cluster";
import HeatmapLayer from "ol/layer/Heatmap";
import VectorLayer from "ol/layer/Vector";
import { createEmpty, extend, getHeight, getWidth } from "ol/extent";
import { Style, Circle as CircleStyle, Fill, Stroke, Text } from "ol/style";
import BaseLayer from "~/maps/layers/BaseLayer";
import { LayerManager } from "~/maps/hooks/useLayerManager";

const extentFeatures = (features: Feature[], resolution: number) => {
  const extent = createEmpty();
  for (const f of features) extend(extent, f.getGeometry().getExtent());
  return Math.round(0.18 * (getWidth(extent) + getHeight(extent))) / resolution;
};

const colorBlob = (size: number, disasterType: string) => {
  const minAlpha = 0.2;
  const maxAlpha = 0.8;

  const alpha = Math.max(minAlpha, Math.min(maxAlpha, minAlpha + ((maxAlpha - minAlpha) * Math.log(size)) / Math.log(1000)));
  const colorMap = {
    wind: [255, 153, 0],
    cold: [0, 153, 255],
    rain: [0, 204, 102],
  };
  const color = colorMap[disasterType] || colorMap.wind;
  return `rgba(${color.join()}, ${alpha})`;
};

const useDisasterLayer = (layerManager: LayerManager, ready: boolean, features: Feature[] | null, settings: any, disasterType: string) => {
  // @ts-ignore
  const clusterLayerRef = useRef<VectorLayer | null>(null);
  // @ts-ignore
  const heatmapLayerRef = useRef<HeatmapLayer | null>(null);

  useEffect(() => {
    if (!ready || !features || features.length === 0) return;

    if (settings.selectedVis === "cluster") {
      const vectorSource = new VectorSource({ features });
      const clusterSource = new ClusterSource({ distance: settings.distance, source: vectorSource });

      layerManager.removeLayer("클러스터");

      clusterLayerRef.current = new VectorLayer({
        source: clusterSource,
        style: (feature, resolution) => {
          const size = feature.get("features").length;
          const radius = size > 1 ? extentFeatures(feature.get("features"), resolution) : 1;

          return new Style({
            image: new CircleStyle({
              radius: Math.max(radius, 1),
              fill: new Fill({ color: colorBlob(size, disasterType) }),
            }),
            text:
              size > 1
                ? new Text({
                    text: `${size}개소`,
                    font: "12px sans-serif",
                    fill: new Fill({ color: "#fff" }),
                    stroke: new Stroke({ color: "rgba(0, 0, 0, 0.6)", width: 3 }),
                  })
                : undefined,
          });
        },
      });

      const clusterLayer = new BaseLayer({ layerType: "custom", layer: clusterLayerRef.current });
      layerManager.addLayer(clusterLayer, "클러스터", 999);

      return () => {
        layerManager.removeLayer("클러스터");
        clusterLayerRef.current = null;
      };
    }
  }, [ready, features, settings.distance, settings.selectedVis, disasterType]);

  useEffect(() => {
    if (!ready || !features || features.length === 0) return;

    if (settings.selectedVis === "heatmap") {
      const gradientMap = {
        wind: ["#fff5e6", "#ffd966", "#ffb84d", "#ff8000", "#cc3300"],
        cold: ["#e6f7ff", "#66ccff", "#3399ff", "#0066cc", "#003366"],
        rain: ["#e6ffe6", "#66ff66", "#33cc33", "#009900", "#006600"],
      };

      const gradient = gradientMap[disasterType];

      if (!heatmapLayerRef.current) {
        const vectorSource = new VectorSource({ features });
        heatmapLayerRef.current = new HeatmapLayer({
          source: vectorSource,
          blur: settings.blur,
          radius: settings.radius,
          opacity: settings.opacity,
          gradient,
        });
        heatmapLayerRef.current.setZIndex(999);

        const heatmapLayer = new BaseLayer({ layerType: "custom", layer: heatmapLayerRef.current });
        layerManager.addLayer(heatmapLayer, "히트맵");
      } else {
        heatmapLayerRef.current.getSource().clear();
        requestAnimationFrame(() => {
          heatmapLayerRef.current.getSource().addFeatures(features);
          heatmapLayerRef.current.setGradient(gradient);
        });
      }

      return () => {
        layerManager.removeLayer("히트맵");
        heatmapLayerRef.current = null;
      };
    }
  }, [ready, features, disasterType, settings.selectedVis, settings.blur, settings.radius, settings.opacity]);

  useEffect(() => {
    if (ready && settings.selectedVis === "heatmap" && heatmapLayerRef.current) {
      heatmapLayerRef.current.setBlur(settings.blur);
      heatmapLayerRef.current.setRadius(settings.radius);
      heatmapLayerRef.current.setOpacity(settings.opacity);
    }
  }, [ready, settings.blur, settings.radius, settings.opacity, settings.selectedVis]);
};

export default useDisasterLayer;
