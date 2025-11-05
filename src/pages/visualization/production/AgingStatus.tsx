import { useMemo, useSyncExternalStore } from "react";
import VisualizationContainer from "~/features/visualization/components/common/VisualizationContainer";
import AgingStatusMap from "~/maps/classes/AgingStatusMap";
import BackgroundMapList from "~/maps/classes/BackgroundMapList";

const TITLE = "고령화 현황";

const AgingStatus = () => {
  const mapList = useMemo(
    () =>
      new BackgroundMapList({
        title: TITLE,
        mapConstructor: AgingStatusMap,
      }),
    []
  );

  // 지도가 변경될 때마다 컴포넌트를 리렌더링하도록 설정
  useSyncExternalStore(mapList.subscribe, mapList.getSnapshot);

  return <VisualizationContainer mapContent={mapList.renderMaps()} chartContent={mapList.renderFirstChart()} />;
};

export default AgingStatus;
