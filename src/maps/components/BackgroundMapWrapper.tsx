import { useRef } from "react";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import MapRenderer from "~/maps/components/common/MapRenderer";
import DraggableMapWindow from "~/maps/components/DraggableMapWindow";
import { useMapList } from "~/maps/hooks/useMapList";

interface BackgroundMapWrapperProps {
  maps: CommonBackgroundMap[];
}

const BackgroundMapWrapper = ({ maps }: BackgroundMapWrapperProps) => {
  const mapList = useMapList();

  const containerRef = useRef<HTMLDivElement>(null);

  const isFixedLayout = maps.length <= 2;

  return (
    <div ref={containerRef} className="relative flex h-[65%] min-h-[570px] 3xl:min-h-[800px] 4xl:min-h-[950px]">
      {isFixedLayout ? (
        <>
          {maps.map((map) => (
            <div key={map.mapId} className="flex-1">
              <MapRenderer map={map} />
            </div>
          ))}
          {maps.length === 2 && (
            <button className="absolute right-4 top-14 rounded-md bg-white px-4 py-2 text-black shadow-lg" onClick={() => mapList.removeMap(mapList.getFirstMap().mapId)}>
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
                <MapRenderer map={map} />
              </DraggableMapWindow>
            );
          })}
        </>
      )}
    </div>
  );
};

export default BackgroundMapWrapper;
