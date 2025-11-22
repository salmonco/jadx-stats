import { useEffect, useState } from "react";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import BackgroundMapWrapper from "~/maps/components/BackgroundMapWrapper";
import useMapFullScreen from "~/maps/hooks/useMapFullscreen";
import { useMapList } from "~/maps/hooks/useMapList";

const ListManagedVisualizationContainer = () => {
  const mapList = useMapList();
  const [fullscreenMapId, setFullscreenMapId] = useState<string | null>(null);
  const { mapContainerRef, onClickFullScreen: triggerFullscreen } = useMapFullScreen();

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setFullscreenMapId(null);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const onClickFullScreen = (mapId: string) => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      setFullscreenMapId(mapId);
    }
  };

  useEffect(() => {
    if (fullscreenMapId && mapContainerRef.current) {
      triggerFullscreen();
    }
  }, [mapContainerRef, fullscreenMapId, triggerFullscreen]);

  const fullscreenMap = fullscreenMapId ? mapList.getMapById(fullscreenMapId) : null;

  const chart = mapList.renderChartByMapId(fullscreenMapId);

  if (fullscreenMap) {
    return (
      <div ref={mapContainerRef} className="h-full w-full overflow-y-auto bg-[#37445E] p-5">
        <div className="flex h-full flex-col gap-5">
          <BackgroundMapWrapper maps={[fullscreenMap as CommonBackgroundMap]} onClickFullScreen={onClickFullScreen} />
          {chart && (
            <div id="main-chart-container" className={`${fullscreenMapId ? "pb-5" : ""}`}>
              {chart}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 bg-[#37445E] px-5 py-4">
      {/* 지도 */}
      <BackgroundMapWrapper maps={mapList.getMaps() as CommonBackgroundMap[]} onClickFullScreen={onClickFullScreen} />
      {/* 차트 */}
      <div id="main-chart-container">{mapList.renderFirstChart()}</div>
    </div>
  );
};

export default ListManagedVisualizationContainer;
