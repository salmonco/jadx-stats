import { useRef } from "react";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import MapRenderer from "~/maps/components/common/MapRenderer";
import DraggableMapWindow from "./DraggableMapWindow";

interface BackgroundMapWrapperProps {
  maps: Array<CommonBackgroundMap>;
  onAddMap: () => void;
  onRemoveMap: (mapId: string) => void;
  getMapPosition: (mapId: string) => { x: number; y: number } | undefined;
  onUpdateMapPosition: (mapId: string, x: number, y: number) => void;
}

const BackgroundMapWrapper = ({ maps, onAddMap, onRemoveMap, onUpdateMapPosition, getMapPosition }: BackgroundMapWrapperProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const isFixedLayout = maps.length <= 2;

  return (
    <div ref={containerRef} className="relative flex h-full w-full">
      {isFixedLayout ? (
        <>
          {maps.map((map) => (
            <div key={map.mapId} className="flex-1">
              <MapRenderer map={map} onAddMap={onAddMap} />
            </div>
          ))}
          {maps.length === 2 && (
            <button className="absolute right-4 top-14 rounded-md bg-white px-4 py-2 text-black shadow-lg" onClick={() => onRemoveMap(maps[1].mapId)}>
              X
            </button>
          )}
        </>
      ) : (
        <>
          {maps.map((map) => {
            const position = getMapPosition(map.mapId);
            if (!position) {
              return null;
            }

            return (
              <DraggableMapWindow
                key={map.mapId}
                mapId={map.mapId}
                initialX={position.x}
                initialY={position.y}
                onClose={onRemoveMap}
                onDrag={onUpdateMapPosition}
                containerRef={containerRef}
              >
                <MapRenderer map={map} onAddMap={onAddMap} />
              </DraggableMapWindow>
            );
          })}
        </>
      )}
    </div>
  );
};

export default BackgroundMapWrapper;
