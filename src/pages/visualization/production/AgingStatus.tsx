import VisualizationContainer from "~/features/visualization/components/common/VisualizationContainer";
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
      <VisualizationContainer />
    </MapListProvider>
  );
};

export default AgingStatus;
