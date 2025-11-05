import InfoTooltip from "~/components/InfoTooltip";
import ListManagedVisualizationContainer from "~/features/visualization/components/common/ListManagedVisualizationContainer";
import HibernationVegetableCultivationMap from "~/maps/classes/HibernationVegetableCultivationMap";
import { MapListProvider } from "~/maps/contexts/MapListContext";
import useMapInitializer from "~/maps/hooks/useMapInitializer";
import { infoTooltipContents } from "~/utils/InfoTooltipContents";

const TITLE = "월동채소 재배면적 변화";

const HibernationVegetableCultivation = () => {
  const mapList = useMapInitializer({
    title: TITLE,
    tooltip: <InfoTooltip content={infoTooltipContents[TITLE]} />,
    mapConstructor: HibernationVegetableCultivationMap,
  });

  return (
    <MapListProvider value={mapList}>
      <ListManagedVisualizationContainer />
    </MapListProvider>
  );
};

export default HibernationVegetableCultivation;
