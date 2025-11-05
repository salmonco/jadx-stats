import ListManagedVisualizationContainer from "~/features/visualization/components/common/ListManagedVisualizationContainer";
import YearlyDisasterInfoMap from "~/maps/classes/YearlyDisasterInfoMap";
import { MapListProvider } from "~/maps/contexts/MapListContext";
import useMapInitializer from "~/maps/hooks/useMapInitializer";

const TITLE = "농업재해 연도별 현황";

const YearlyDisasterInfo = () => {
  const mapList = useMapInitializer({
    title: TITLE,
    mapConstructor: YearlyDisasterInfoMap,
  });

  return (
    <MapListProvider value={mapList}>
      <ListManagedVisualizationContainer />
    </MapListProvider>
  );
};

export default YearlyDisasterInfo;
