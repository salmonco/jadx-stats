import ListManagedVisualizationContainer from "~/features/visualization/components/common/ListManagedVisualizationContainer";
import DisasterTypeHistoryStatsMap from "~/maps/classes/DisasterTypeHistoryStatsMap";
import { MapListProvider } from "~/maps/contexts/MapListContext";
import useMapInitializer from "~/maps/hooks/useMapInitializer";

const TITLE = "농업재해 유형별 과거통계";

const DisasterTypeHistoryStats = () => {
  const mapList = useMapInitializer({
    title: TITLE,
    mapConstructor: DisasterTypeHistoryStatsMap,
  });

  return (
    <MapListProvider value={mapList}>
      <ListManagedVisualizationContainer />
    </MapListProvider>
  );
};

export default DisasterTypeHistoryStats;
