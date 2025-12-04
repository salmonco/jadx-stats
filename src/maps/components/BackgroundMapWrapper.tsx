import { useRef } from "react";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import MapRenderer from "~/maps/components/common/MapRenderer";
import DraggableMapWindow from "~/maps/components/DraggableMapWindow";
import { useMapList } from "~/maps/hooks/useMapList";

interface BackgroundMapWrapperProps {
  maps: CommonBackgroundMap[];
  onClickFullScreen: (mapId: string) => void;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
}

const BackgroundMapWrapper = ({ maps, onClickFullScreen, getPopupContainer }: BackgroundMapWrapperProps) => {
  const mapList = useMapList();

  const containerRef = useRef<HTMLDivElement>(null);

  const isFixedLayout = maps.length <= 2;

  return (
    <div ref={containerRef} className="relative flex h-[85%] min-h-[850px] 3xl:min-h-[1050px] 4xl:min-h-[1200px]">
      {isFixedLayout ? (
        <>
          {maps.map((map) => (
            <div key={map.mapId} className="flex-1">
              <MapRenderer map={map} onClickFullScreen={onClickFullScreen} getPopupContainer={getPopupContainer} />
            </div>
          ))}
          {maps.length === 2 && (
            <button className="absolute right-4 top-14 rounded-md bg-white px-4 py-2 text-black shadow-lg" onClick={() => mapList.removeMap(mapList.getLastMap().mapId)}>
              X
            </button>
          )}
        </>
      ) : (
        <>
          {maps.map((map) => {
            const position = mapList.getMapPosition(map.mapId);
            if (!position) {
              return null;
            }

            return (
              <DraggableMapWindow
                key={map.mapId}
                mapId={map.mapId}
                initialX={position.x}
                initialY={position.y}
                onClose={mapList.removeMap}
                onDrag={mapList.updateMapPosition}
                containerRef={containerRef}
              >
                <MapRenderer map={map} onClickFullScreen={onClickFullScreen} getPopupContainer={getPopupContainer} />
              </DraggableMapWindow>
            );
          })}
        </>
      )}
    </div>
  );
};

export default BackgroundMapWrapper;
