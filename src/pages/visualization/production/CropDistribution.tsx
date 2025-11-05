import VisualizationContainer from "~/features/visualization/components/common/VisualizationContainer";
import CropDistributionMap from "~/maps/classes/CropDistributionMap";
import CropDistributionTooltip from "~/maps/components/cropDistribution/CropDistributionTooltip";
import { MapListProvider } from "~/maps/contexts/MapListContext";
import useMapInitializer from "~/maps/hooks/useMapInitializer";

const TITLE = "작물 재배지도";

const CropDistribution = () => {
  const mapList = useMapInitializer({
    title: TITLE,
    tooltip: <CropDistributionTooltip />,
    mapConstructor: CropDistributionMap,
  });

  return (
    <MapListProvider value={mapList}>
      <VisualizationContainer />
    </MapListProvider>
  );
};

export default CropDistribution;
