import { useContext, useSyncExternalStore } from "react";
import BackgroundMapList from "~/maps/classes/BackgroundMapList";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import { MapListContext } from "~/maps/contexts/MapListContext";

export const useMapList = <M extends CommonBackgroundMap>() => {
  const mapList = useContext<BackgroundMapList<M>>(MapListContext);

  if (!mapList) {
    throw new Error("useMapList must be used within a MapListProvider");
  }

  useSyncExternalStore(mapList.subscribe, mapList.getSnapshot);

  return mapList;
};
