import { useMemo, useSyncExternalStore } from "react";
import InfoTooltip from "~/components/InfoTooltip";
import VisualizationContainer from "~/features/visualization/components/common/VisualizationContainer";
import BackgroundMapList from "~/maps/classes/BackgroundMapList";
import HibernationVegetableCultivationMap from "~/maps/classes/HibernationVegetableCultivationMap";
import { infoTooltipContents } from "~/utils/InfoTooltipContents";

const TITLE = "월동채소 재배면적 변화";

const HibernationVegetableCultivation = () => {
  const mapList = useMemo(
    () =>
      new BackgroundMapList({
        title: TITLE,
        tooltip: <InfoTooltip content={infoTooltipContents[TITLE]} />,
        mapConstructor: HibernationVegetableCultivationMap,
      }),
    []
  );

  // 지도가 변경될 때마다 컴포넌트를 리렌더링하도록 설정
  useSyncExternalStore(mapList.subscribe, mapList.getSnapshot);

  return <VisualizationContainer mapContent={mapList.renderMaps()} chartContent={mapList.renderFirstChart()} />;
};

export default HibernationVegetableCultivation;
