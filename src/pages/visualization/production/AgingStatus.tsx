import { useEffect, useMemo } from "react";
import VisualizationContainer from "~/features/visualization/components/common/VisualizationContainer";
import AgingStatusMap from "~/maps/classes/AgingStatusMap";
import BackgroundMapList from "~/maps/classes/BackgroundMapList";
import { MapListProvider } from "~/maps/contexts/MapListContext";

const TITLE = "고령화 현황";

const AgingStatus = () => {
  const mapList = useMemo(
    () =>
      new BackgroundMapList<AgingStatusMap>({
        title: TITLE,
        mapConstructor: AgingStatusMap,
      }),
    []
  );

  useEffect(() => {
    return () => {
      mapList.destroy();
    };
  }, [mapList]);

  return (
    <MapListProvider value={mapList}>
      <VisualizationContainer />
    </MapListProvider>
  );
};

export default AgingStatus;
