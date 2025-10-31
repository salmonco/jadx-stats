import { useMemo } from "react";
import VisualizationContainer from "~/features/visualization/components/common/VisualizationContainer";
import AgingStatusMap from "~/maps/classes/AgingStatusMap";
import BackgroundMapList from "~/maps/classes/BackgroundMapList";
import { MapOptions } from "~/maps/components/BackgroundMap";

const mapOptions: MapOptions = {
  type: "Base",
  layerSwitcher: true,
  mapTypeSwitcher: true,
  roundCorners: true,
};

const TITLE = "고령화 현황";

const AgingStatus = () => {
  const mapList = useMemo(
    () =>
      new BackgroundMapList<AgingStatusMap>({
        title: TITLE,
        mapOptionsList: [mapOptions, mapOptions],
        mapClass: AgingStatusMap,
      }),
    []
  );

  return <VisualizationContainer mapContent={mapList.renderMaps()} chartContent={mapList.renderFirstChart()} />;
};

export default AgingStatus;
