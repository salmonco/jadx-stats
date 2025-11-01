import { useCallback, useEffect, useState } from "react";

import OSMTileLayer from "~/maps/layers/OSMTileLayer";
import TracestrackTileLayer from "~/maps/layers/TracestrackTileLayer";
import VworldTileLayer from "~/maps/layers/VworldTileLayer";

import useLayerExport from "~/maps/hooks/useLayerExportTools";
import { LayerManager } from "~/maps/hooks/useLayerManager";
import useMapTools from "~/maps/hooks/useMapTools";
import { ExtendedOLMap } from "~/maps/hooks/useOLMap";

// import LayerSwitcher from "~/maps/components/LayerSwitcher";
import LayerConfigModal from "~/maps/components/LayerConfigModal";
import LayerControlDrawer from "~/maps/components/LayerControlDrawer";
import MapToolsController from "~/maps/components/MapToolsController";
import MiniMap from "~/maps/components/MiniMap";

import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import MapTypeSwitcher from "~/maps/components/MapTypeSwitcher";
import { BackgroundMapType } from "~/maps/constants/backgroundMapType";
import "~/maps/styles/map.css";
import { cn } from "~/utils/common";
import { useEventHandlers } from "../hooks/useEventHandlers";
import { EventManager } from "../hooks/useEventManager";
import { useHighlightLayer } from "../hooks/useHighlightLayer";
import FarmfieldInfoWindow from "./FarmfieldInfoWindow";
import LayerSwitcher from "./LayerSwitcher";

interface BackgroundMapProps {
  layerManager: LayerManager;
  eventManager?: EventManager;
  ready: boolean;
  map?: ExtendedOLMap;
  mapId: string;
  mapOptions?: MapOptions;
  children?: React.ReactNode;
}

export interface MapOptions {
  type?: BackgroundMapType;
  layerSwitcher?: boolean;
  mapTypeSwitcher?: boolean;
  mapToolsController?: boolean;
  toggleWindow?: (windowName: string) => void;
  roundCorners?: boolean;
  miniMap?: boolean;
  layerControlDrawer?: boolean;
  className?: string;
}

const DEFAULT_MAP_OPTIONS: MapOptions = {
  type: "Satellite",
  layerSwitcher: true,
  mapTypeSwitcher: true,
  mapToolsController: false,
  roundCorners: false,
  miniMap: false,
  layerControlDrawer: false,
  className: "",
};

const MapLoadingOverlay = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
    <Spin indicator={<LoadingOutlined style={{ fontSize: 120 }} spin />} />
  </div>
);

const BackgroundMap = ({ layerManager, eventManager, ready, mapId, map, mapOptions = {} as MapOptions, children }: BackgroundMapProps) => {
  const mergedMapOptions = { ...DEFAULT_MAP_OPTIONS, ...mapOptions };

  const [mapType, setMapType] = useState<BackgroundMapType>(mergedMapOptions.type);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [layersTrigger, setLayersTrigger] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [highlightEnabled, setHighlightEnabled] = useState<boolean>(true);

  // 배경지도 레이어 추가
  useEffect(() => {
    if (!ready) return;

    const tileLayer = mapType === "Terrain" ? new TracestrackTileLayer() : mapType === "world" ? new OSMTileLayer() : new VworldTileLayer(mapType);
    layerManager.addLayer(tileLayer, "tile");

    return () => {
      layerManager.removeLayer("tile");
    };
  }, [ready, mapType, layerManager]);

  // 피칭 이벤트 핸들러
  const { selectedFeature, setSelectedFeature, onFeatureClick } = useHighlightLayer(layerManager, ready && highlightEnabled);
  useEventHandlers(eventManager, ready && highlightEnabled, onFeatureClick);

  // 툴 토글
  const { toggleTool } = useMapTools(layerManager, map, setSelectedFeature, setHighlightEnabled);
  const { toggleExport, contextHolder, isCreatingLayer } = useLayerExport({ layerManager, map, setLayersTrigger });

  // 레이어 컨트롤 드로어 토글
  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
  }, []);

  return (
    <div className={cn("relative h-full w-full border border-[#43516D]", mergedMapOptions?.roundCorners && "overflow-clip rounded-lg", mergedMapOptions?.className)}>
      <div className="h-full w-full" id={mapId} />
      {ready && (
        <>
          {mergedMapOptions?.miniMap && <MiniMap mainMap={map} />}
          {!isCreatingLayer && (
            <>
              {mergedMapOptions?.layerSwitcher && <LayerSwitcher layerManager={layerManager} />}
              {mergedMapOptions?.mapTypeSwitcher && <MapTypeSwitcher mapType={mapType} setMapType={setMapType} />}
              {mergedMapOptions?.mapToolsController && <MapToolsController toggleTool={toggleTool} />}
            </>
          )}
          {mergedMapOptions?.layerControlDrawer && eventManager && (
            <>
              <LayerControlDrawer
                layerManager={layerManager}
                map={map}
                toggleDrawer={toggleDrawer}
                isDrawerOpen={isDrawerOpen}
                layersTrigger={layersTrigger}
                setLoading={setLoading}
              />
              {selectedFeature && <FarmfieldInfoWindow selectedFeature={selectedFeature} setSelectedFeature={setSelectedFeature} />}
            </>
          )}
          {isModalOpen && <LayerConfigModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} toggleExport={toggleExport} />}
          {loading && <MapLoadingOverlay />}
          {contextHolder}
        </>
      )}
      {children}
    </div>
  );
};

export default BackgroundMap;
