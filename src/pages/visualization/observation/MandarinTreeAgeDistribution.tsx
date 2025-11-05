import VisualizationContainer from "~/features/visualization/components/common/VisualizationContainer";
import MandarinTreeAgeDistributionMap from "~/maps/classes/MandarinTreeAgeDistributionMap";
import { MapListProvider } from "~/maps/contexts/MapListContext";
import useMapInitializer from "~/maps/hooks/useMapInitializer";

export type OffsetRange = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";

export const MANDARIN_TREE_AGE_DISTRIBUTION_TITLE = "감귤 수령분포";

import MandarinTreeAgeDistributionTooltip from "~/maps/components/mandarinTreeAgeDistribution/MandarinTreeAgeDistributionTooltip";

const MandarinTreeAgeDistribution = () => {
  const mapList = useMapInitializer({
    title: MANDARIN_TREE_AGE_DISTRIBUTION_TITLE,
    tooltip: <MandarinTreeAgeDistributionTooltip />,
    mapConstructor: MandarinTreeAgeDistributionMap,
  });

  return (
    <MapListProvider value={mapList}>
      <VisualizationContainer />
    </MapListProvider>
  );
};

export default MandarinTreeAgeDistribution;
