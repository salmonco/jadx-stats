import { ReactNode, useEffect, useMemo, useSyncExternalStore } from "react";
import BackgroundMapList from "~/maps/classes/BackgroundMapList";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import { MapOptions } from "~/maps/components/BackgroundMap";

interface Params<M> {
  title: string;
  mapConstructor: new (mapOptions: MapOptions, title: string, tooltip?: React.ReactNode) => M;
  tooltip?: ReactNode;
}

export const useMapInitializer = <M extends CommonBackgroundMap>({ title, tooltip, mapConstructor }: Params<M>) => {
  const mapList = useMemo(
    () =>
      new BackgroundMapList<M>({
        title,
        tooltip,
        mapConstructor,
      }),
    []
  );

  useSyncExternalStore(mapList.subscribe, mapList.getSnapshot);

  useEffect(() => {
    return () => {
      mapList.destroy();
    };
  }, [mapList]);

  return mapList;
};
