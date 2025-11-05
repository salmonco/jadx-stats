import ListManagedVisualizationContainer from "~/features/visualization/components/common/ListManagedVisualizationContainer";
import AgingStatusMap from "~/maps/classes/AgingStatusMap";
import { MapListProvider } from "~/maps/contexts/MapListContext";
import useMapInitializer from "~/maps/hooks/useMapInitializer";

const TITLE = "고령화 현황";

const AgingStatus = () => {
  const mapList = useMapInitializer({
    title: TITLE,
    mapConstructor: AgingStatusMap,
  });

  return (
    <MapListProvider value={mapList}>
      <ListManagedVisualizationContainer />
    </MapListProvider>
  );
};

export default AgingStatus;
