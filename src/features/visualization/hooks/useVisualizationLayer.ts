import { useEffect } from "react";

interface Params {
  ready: boolean;
  features: any;
  layerManager: any;
  layerName: string;
  createLayer: (features: any, visualizationSetting: any) => Promise<any>;
  map: any;
  updateProps?: Record<string, any>;
}

export const useVisualizationLayer = ({ ready, features, layerManager, layerName, createLayer, map, updateProps }: Params) => {
  useEffect(() => {
    if (!ready || !features) return;

    const layerWrapper = layerManager.getLayer(layerName);

    if (layerWrapper) {
      const existingLayer = layerWrapper.getLayer();
      if (typeof (existingLayer as any).updateFeatures === "function") {
        (existingLayer as any).updateFeatures(features);
      }
      if (typeof (existingLayer as any).updateVisualizationSetting === "function") {
        (existingLayer as any).updateVisualizationSetting(map.visualizationSetting);
      }
      if (updateProps) {
        Object.entries(updateProps).forEach(([key, value]) => {
          const updaterMethodName = `update${key.charAt(0).toUpperCase() + key.slice(1)}`;
          if (typeof (layerWrapper as any)[updaterMethodName] === "function") {
            (layerWrapper as any)[updaterMethodName](value);
          }
        });
      }
      existingLayer.changed();
    } else {
      createLayer(features, map.visualizationSetting)
        .then((layer) => {
          layerManager.addLayer(layer, layerName, 1);
        })
        .catch((error) => {
          console.error(`useVisualizationLayer [${layerName}]: 레이어 생성 실패`, error);
        });
    }
  }, [ready, features, map.getSnapshot()]);
};
