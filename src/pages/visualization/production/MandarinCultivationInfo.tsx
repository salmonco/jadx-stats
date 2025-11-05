import ListManagedVisualizationContainer from "~/features/visualization/components/common/ListManagedVisualizationContainer";
import MandarinCultivationInfoMap from "~/maps/classes/MandarinCultivationInfoMap";
import MandarinCultivationInfoTooltip from "~/maps/components/mandarinCultivationInfo/MandarinCultivationInfoTooltip";
import { MapListProvider } from "~/maps/contexts/MapListContext";
import useMapInitializer from "~/maps/hooks/useMapInitializer";

export const MANDARIN_CULTIVATION_INFO_TITLE = "감귤 재배정보";

const MandarinCultivationInfo = () => {
  const mapList = useMapInitializer({
    title: MANDARIN_CULTIVATION_INFO_TITLE,
    tooltip: <MandarinCultivationInfoTooltip />,
    mapConstructor: MandarinCultivationInfoMap,
  });

  return (
    <MapListProvider value={mapList}>
      <ListManagedVisualizationContainer />
    </MapListProvider>
  );
};

export default MandarinCultivationInfo;
