import { useContext, useSyncExternalStore } from "react";
import { MapListContext } from "~/maps/contexts/MapListContext";

export const useMapList = () => {
  const mapListInstance = useContext(MapListContext);

  if (!mapListInstance) {
    throw new Error("useMapList must be used within a MapListProvider");
  }

  useSyncExternalStore(mapListInstance.subscribe, mapListInstance.getSnapshot);

  return mapListInstance;
};
