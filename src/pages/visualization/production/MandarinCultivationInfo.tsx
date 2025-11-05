import VisualizationContainer from "~/features/visualization/components/common/VisualizationContainer";
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
      <VisualizationContainer />
    </MapListProvider>
  );
};

export default MandarinCultivationInfo;
