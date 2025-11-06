import { ReactNode, useEffect, useMemo, useSyncExternalStore } from "react";
import BackgroundMapList from "~/maps/classes/BackgroundMapList";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import { MapOptions } from "~/maps/constants/mapOptions";
import useMapSharedStateInitializer from "~/maps/hooks/useMapSharedStateInitializer";

interface Params<M> {
  title: string;
  mapConstructor: new (mapOptions: MapOptions, title: string, tooltip?: React.ReactNode) => M;
  tooltip?: ReactNode;
}

const useMapInitializer = <M extends CommonBackgroundMap>({ title, tooltip, mapConstructor }: Params<M>) => {
  const mapList = useMemo(
    () =>
      new BackgroundMapList<M>({
        title,
        tooltip,
        mapConstructor,
      }),
    []
  );

  useMapSharedStateInitializer({ mapList });

  useSyncExternalStore(mapList.subscribe, mapList.getSnapshot);

  useEffect(() => {
    return () => {
      mapList.destroy();
    };
  }, [mapList]);

  return mapList;
};

export default useMapInitializer;
