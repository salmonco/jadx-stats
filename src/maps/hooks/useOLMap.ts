import { useEffect, useMemo, useState } from "react";
import { Map as OLMap, View } from "ol";
import { MapOptions } from "ol/Map";
import { Coordinate } from "ol/coordinate";
import { Extent } from "ol/extent";
import { defaults as defaultControls } from "ol/control";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";

export class ExtendedOLMap extends OLMap {
  uniqueId: string;

  constructor(options: any) {
    super(options);
    this.uniqueId = uuidv4();
    // console.log("ExtendedOLMap", this.uniqueId);
  }
}

export interface UseOLMapOptions extends Omit<MapOptions, "target"> {
  center: [number, number] | Coordinate;
  zoom: number;
  extent?: [number, number, number, number] | Extent;
}

const useOLMap = (mapId: string, { center, zoom, extent, ...mapOptions }: UseOLMapOptions): ExtendedOLMap => {
  const memoizedCenter = useMemo(() => center, [JSON.stringify(center)]);
  const memoizedExtent = useMemo(() => extent, [JSON.stringify(extent)]);
  const memoizedMapOptions = useMemo(() => mapOptions, [JSON.stringify(mapOptions)]);

  const [map, setMap] = useState<ExtendedOLMap | null>(null);

  useEffect(() => {
    if (!map) {
      const initialMap = new ExtendedOLMap({
        target: mapId,
        view: new View({
          center: memoizedCenter,
          zoom,
          extent: memoizedExtent,
        }),
        controls: defaultControls({ zoom: false }),
        ...memoizedMapOptions,
      });
      // @ts-ignore
      window.olmap = initialMap;
      setMap(initialMap);
    }

    return () => {
      // if (map) {
      //   map.setTarget(null);
      // }
    };
  }, [memoizedCenter, zoom, memoizedExtent, memoizedMapOptions]);

  return map;
};

export default useOLMap;
