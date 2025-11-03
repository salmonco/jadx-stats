import { useContext } from "react";
import BackgroundMapList from "~/maps/classes/BackgroundMapList";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import { MapListContext } from "~/maps/contexts/MapListContext";

export const useMapList = <M extends CommonBackgroundMap>() => {
  const mapList = useContext<BackgroundMapList<M>>(MapListContext);

  if (!mapList) {
    throw new Error("useMapList는 MapListProvider 안에서 사용되어야 합니다.");
  }

  return mapList;
};
