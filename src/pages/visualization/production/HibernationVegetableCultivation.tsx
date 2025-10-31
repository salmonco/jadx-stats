import { useMemo, useSyncExternalStore } from "react";
import InfoTooltip from "~/components/InfoTooltip";
import VisualizationContainer from "~/features/visualization/components/common/VisualizationContainer";
import BackgroundMapList from "~/maps/classes/BackgroundMapList";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import HibernationVegetableCultivationMap from "~/maps/classes/HibernationVegetableCultivationMap";
import { MapOptions } from "~/maps/components/BackgroundMap";
import BackgroundMapWrapper from "~/maps/components/BackgroundMapWrapper";
import { infoTooltipContents } from "~/utils/InfoTooltipContents";

const mapOptions: MapOptions = {
  type: "Base",
  layerSwitcher: true,
  mapTypeSwitcher: true,
  roundCorners: true,
};

const TITLE = "월동채소 재배면적 변화";

/**
 * 개별 맵 인스턴스를 렌더링하고 해당 맵의 상태 변경을 구독하는 컴포넌트입니다.
 * `useSyncExternalStore`를 사용하여 맵 인스턴스의 상태가 변경될 때만 리렌더링됩니다。
 */
const MapRenderer = ({ map }: { map: CommonBackgroundMap }) => {
  useSyncExternalStore(map.subscribe, map.getSnapshot);
  return map.renderMap();
};

/**
 * 개별 차트 인스턴스를 렌더링하고 해당 맵의 상태 변경을 구독하는 컴포넌트입니다。
 * `useSyncExternalStore`를 사용하여 맵 인스턴스의 상태가 변경될 때만 리렌더링됩니다。
 */
const ChartRenderer = ({ map }: { map: CommonBackgroundMap }) => {
  useSyncExternalStore(map.subscribe, map.getSnapshot);
  return map.renderChart();
};

const HibernationVegetableCultivation = () => {
  // `useMemo`를 사용하여 `mapList` 인스턴스가 컴포넌트 리렌더링 시 재생성되지 않도록 합니다.
  // `BackgroundMapList`는 여러 맵 인스턴스를 관리하고 상태 변경을 구독할 수 있도록 합니다。
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

  // `mapList`에 포함된 모든 맵을 렌더링합니다.
  // 각 맵은 `MapRenderer` 컴포넌트를 통해 개별적으로 상태를 구독하고 렌더링됩니다。
  const mapsContent = (
    <BackgroundMapWrapper
      title={TITLE}
      maps={mapList.getMaps().map((map) => (
        <MapRenderer key={map.mapId} map={map} />
      ))}
    />
  );

  // 첫 번째 맵 인스턴스의 차트를 렌더링합니다。
  // `ChartRenderer` 컴포넌트를 통해 첫 번째 맵의 상태를 구독하고 렌더링됩니다。
  const firstMap = mapList.getFirstMap();
  const chartContent = firstMap ? <ChartRenderer map={firstMap} /> : null;

  return <VisualizationContainer mapContent={mapsContent} chartContent={chartContent} />;
};

export default HibernationVegetableCultivation;
