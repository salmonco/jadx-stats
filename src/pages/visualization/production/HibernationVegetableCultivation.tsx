import { useMemo } from "react";
import InfoTooltip from "~/components/InfoTooltip";
import VisualizationContainer from "~/features/visualization/components/common/VisualizationContainer";
import BackgroundMapList from "~/maps/classes/BackgroundMapList";
import HibernationVegetableCultivationMap from "~/maps/classes/HibernationVegetableCultivationMap";
import { MapOptions } from "~/maps/components/BackgroundMap";
import { infoTooltipContents } from "~/utils/InfoTooltipContents";

const mapOptions: MapOptions = {
  type: "Base",
  layerSwitcher: true,
  mapTypeSwitcher: true,
  roundCorners: true,
};

const TITLE = "월동채소 재배면적 변화";

const HibernationVegetableCultivation = () => {
  const mapList = useMemo(
    () =>
      new BackgroundMapList<HibernationVegetableCultivationMap>({
        title: TITLE,
        tooltip: <InfoTooltip content={infoTooltipContents[TITLE]} />,
        mapOptionsList: [mapOptions, mapOptions],
        mapClass: HibernationVegetableCultivationMap,
      }),
    []
  );

  return <VisualizationContainer mapContent={mapList.renderMaps()} chartContent={mapList.renderFirstChart()} />;
};

export default HibernationVegetableCultivation;
