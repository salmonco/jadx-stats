import { useMemo } from "react";
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

  return <VisualizationContainer mapContent={mapList.renderMaps()} chartContent={mapList.renderFirstChart()} />;
};

export default AgingStatus;
