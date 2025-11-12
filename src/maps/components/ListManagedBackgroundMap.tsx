import { useCallback, useEffect, useState } from "react";

import OSMTileLayer from "~/maps/layers/OSMTileLayer";
import TracestrackTileLayer from "~/maps/layers/TracestrackTileLayer";
import VworldTileLayer from "~/maps/layers/VworldTileLayer";

import useLayerExport from "~/maps/hooks/useLayerExportTools";
import { LayerManager } from "~/maps/hooks/useLayerManager";
import useMapTools from "~/maps/hooks/useMapTools";

// import LayerSwitcher from "~/maps/components/LayerSwitcher";
import LayerConfigModal from "~/maps/components/LayerConfigModal";
import LayerControlDrawer from "~/maps/components/LayerControlDrawer";
import MapToolsController from "~/maps/components/MapToolsController";
import MiniMap from "~/maps/components/MiniMap";

import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import LayerHeader from "~/maps/components/LayerHeader";
import LayerSwitcher from "~/maps/components/LayerSwitcher";
import MapTypeSwitcher from "~/maps/components/ListManagedMapTypeSwitcher";
import { DEFAULT_MAP_OPTIONS } from "~/maps/constants/mapOptions";
import useMapFullScreen from "~/maps/hooks/useMapFullscreen";
import { ExtendedOLMap } from "~/maps/hooks/useOLMap";
import "~/maps/styles/map.css";
import { cn } from "~/utils/common";
import { useEventHandlers } from "../hooks/useEventHandlers";
import { EventManager } from "../hooks/useEventManager";
import { useHighlightLayer } from "../hooks/useHighlightLayer";
import { useMapList } from "../hooks/useMapList";
import FarmfieldInfoWindow from "./FarmfieldInfoWindow";

interface BackgroundMapProps {
  layerManager: LayerManager;
  eventManager?: EventManager;
  ready: boolean;
  mapId: string;
  map: ExtendedOLMap;
  children?: React.ReactNode;
}

const MapLoadingOverlay = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
    <Spin indicator={<LoadingOutlined style={{ fontSize: 120 }} spin />} />
  </div>
);

const ListManagedBackgroundMap = ({ layerManager, eventManager, ready, map: olMap, mapId, children }: BackgroundMapProps) => {
  const mapList = useMapList();
  const map = mapList.getMapById(mapId);

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [layersTrigger, setLayersTrigger] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [highlightEnabled, setHighlightEnabled] = useState<boolean>(true);

  // 피칭 이벤트 핸들러
  const { selectedFeature, setSelectedFeature, onFeatureClick } = useHighlightLayer(layerManager, ready && highlightEnabled);
  useEventHandlers(eventManager, ready && highlightEnabled, onFeatureClick);

  // 툴 토글
  const { toggleTool } = useMapTools(layerManager, null, setSelectedFeature, setHighlightEnabled);
  const { toggleExport, contextHolder, isCreatingLayer } = useLayerExport({ layerManager, map: olMap, setLayersTrigger });
  const { mapContainerRef, onClickFullScreen } = useMapFullScreen();

  // 레이어 컨트롤 드로어 토글
  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!ready || !map) return;

    const tileLayer = map.mapType === "Terrain" ? new TracestrackTileLayer() : map.mapType === "world" ? new OSMTileLayer() : new VworldTileLayer(map.mapType);
    layerManager.addLayer(tileLayer, "tile");

    return () => {
      layerManager.removeLayer("tile");
    };
  }, [ready, map?.mapType, layerManager]);

  if (!map) {
    return null;
  }

  const mergedMapOptions = { ...DEFAULT_MAP_OPTIONS, ...map.mapOptions };

  return (
    <div
      className={cn("relative h-full w-full border border-[#43516D]", mergedMapOptions?.roundCorners && "overflow-clip rounded-lg", mergedMapOptions?.className)}
      ref={mapContainerRef}
    >
      <div className="h-full w-full" id={mapId} />
      <LayerHeader map={map} olMap={olMap} onClickFullScreen={onClickFullScreen} />
      {ready && (
        <>
          {mergedMapOptions?.miniMap && <MiniMap mainMap={olMap} />}
          {!isCreatingLayer && (
            <>
              {mergedMapOptions?.layerSwitcher && <LayerSwitcher layerManager={layerManager} />}
              {mergedMapOptions?.mapTypeSwitcher && <MapTypeSwitcher mapId={mapId} />}
              {mergedMapOptions?.mapToolsController && <MapToolsController toggleTool={toggleTool} />}
            </>
          )}
          {mergedMapOptions?.layerControlDrawer && eventManager && (
            <>
              <LayerControlDrawer
                layerManager={layerManager}
                map={olMap}
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

export default ListManagedBackgroundMap;
