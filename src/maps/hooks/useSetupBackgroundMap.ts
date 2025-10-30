import { useEffect } from "react";
import { LayerManager } from "~/maps/hooks/useLayerManager";
import VworldLayer from "~/maps/layers/VworldTileLayer";

const useSetupBackgroundMap = (layerManager: LayerManager, ready: boolean) => {
  useEffect(() => {
    if (!ready) return;
    const vworldSatelliteLayer = new VworldLayer("Satellite");
    layerManager.addLayer(vworldSatelliteLayer, "tile");
    return () => {
      layerManager.removeLayer("tile");
    };
  }, [layerManager, ready]);
};

export default useSetupBackgroundMap;
