import { useState } from "react";
import { BackgroundMapType, BackgroundMapTypeMenuItems } from "~/maps/constants/backgroundMapType";
import { useMapList } from "~/maps/hooks/useMapList";

interface MapTypeSwitcherProps {
  mapId: string;
}

const MapTypeSwitcher = ({ mapId }: MapTypeSwitcherProps) => {
  const mapList = useMapList();
  const map = mapList.getMapById(mapId);
  const [isOpen, setIsOpen] = useState(false);

  if (!map) {
    return null;
  }

  const handleTypeSelect = (type: BackgroundMapType) => {
    map.setMapType(type);
  };

  return (
    <div className="absolute bottom-3 right-3 flex items-center gap-2">
      {isOpen && (
        <div className="flex gap-2">
          {BackgroundMapTypeMenuItems.map(({ label, key }) => (
            <button
              key={key}
              onClick={() => handleTypeSelect(key)}
              className={`flex h-12 w-12 items-center justify-center rounded-full text-sm text-white shadow-lg transition-transform hover:scale-105 ${map.mapType === key ? "bg-blue-500" : "bg-gray-400"}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gray-700 text-sm text-white shadow-lg transition-transform hover:scale-105"
      >
        지도
      </button>
    </div>
  );
};

export default MapTypeSwitcher;
