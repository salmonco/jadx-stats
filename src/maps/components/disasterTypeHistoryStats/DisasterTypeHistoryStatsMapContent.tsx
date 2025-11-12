import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import CropFilter from "~/features/visualization/components/common/CropFilter";
import FloatingContainer from "~/features/visualization/components/common/FloatingContainer";
import RegionFilter from "~/features/visualization/components/common/RegionFilter";
import TwoDepthScrollSelector from "~/features/visualization/components/common/TwoDepthScrollSelector";
import useRegionFilter from "~/features/visualization/hooks/useRegionFilter";
import { useVisualizationLayer } from "~/features/visualization/hooks/useVisualizationLayer";
import { DisasterTypeHistoryStatsFeatureCollection, DisasterTypeHistoryStatsLayer } from "~/features/visualization/layers/DisasterTypeHistoryStatsLayer";
import { DEFAULT_ALL_OPTION } from "~/features/visualization/utils/regionFilterOptions";
import DisasterTypeHistoryStatsMap from "~/maps/classes/DisasterTypeHistoryStatsMap";
import DisasterTypeHistoryStatsLegend from "~/maps/components/disasterTypeHistoryStats/DisasterTypeHistoryStatsLegend";
import ListManagedBackgroundMap from "~/maps/components/ListManagedBackgroundMap";
import { VisualizationSetting } from "~/maps/constants/visualizationSetting";
import { useMapList } from "~/maps/hooks/useMapList";
import useSetupOL from "~/maps/hooks/useSetupOL";
import visualizationApi from "~/services/apis/visualizationApi";

interface Props {
  mapId: string;
}

const DisasterTypeHistoryStatsMapContent = ({ mapId }: Props) => {
  const mapList = useMapList<DisasterTypeHistoryStatsMap>();
  const map = mapList.getMapById(mapId);

  const { layerManager, ready, map: olMap } = useSetupOL(mapId, 10.5, "jeju");

  const { selectedRegion, setSelectedRegion, filterFeatures } = useRegionFilter(map.regionFilterSetting);

  // TODO: api 있는지 확인
  const { data: disasterName } = useQuery({
    queryKey: ["disasterName", map.selectedTargetYear],
    queryFn: () => visualizationApi.getDisasterName(map.selectedTargetYear),
    enabled: !!map.selectedTargetYear,
    retry: 1,
  });

  const { data: cropList } = useQuery({
    queryKey: ["mandarinVarietyList"],
    queryFn: () => visualizationApi.getMandarinVarietyList(),
    retry: 1,
  });

  const { data: features } = useQuery({
    queryKey: ["mandarinCultivationInfoFeatures", map.getSelectedRegionLevel(), map.selectedCropGroup, map.selectedCropDetailGroup],
    queryFn: () =>
      visualizationApi.getMandarinCultivationInfo(
        map.getSelectedRegionLevel(),
        map.selectedCropGroup,
        map.selectedCropDetailGroup === DEFAULT_ALL_OPTION ? null : map.selectedCropDetailGroup
      ),
    enabled: !!ready,
  });

  const filteredFeatures = features
    ? {
        ...features,
        features: features.features.filter(filterFeatures),
      }
    : null;

  const createDisasterTypeHistoryStatsLayer = async (features: DisasterTypeHistoryStatsFeatureCollection, visualizationSetting: VisualizationSetting) => {
    return DisasterTypeHistoryStatsLayer.createLayer(features, visualizationSetting, map.selectedDisaster, map.selectedCropGroup, map.selectedCropDetailGroup);
  };

  useVisualizationLayer({
    ready,
    features: filteredFeatures,
    layerManager,
    layerName: "disasterTypeHistoryStatsLayer",
    createLayer: createDisasterTypeHistoryStatsLayer,
    map,
    updateProps: {
      selectedDisaster: map.selectedDisaster,
      selectedCropDetailGroup: map.selectedCropDetailGroup,
    },
  });

  useEffect(() => {
    if (disasterName) {
      map.setSelectedDisaster(disasterName[0].name);
    }
  }, [disasterName]);

  const disasterOptionsMap: Record<string, string[]> = useMemo(() => {
    const result: Record<string, string[]> = {};
    (disasterName || []).forEach(({ name, items }) => {
      result[name] = items || [];
    });
    return result;
  }, [disasterName]);

  const hasSecondDepth = disasterOptionsMap[map.selectedDisaster]?.length > 0;

  if (!map) {
    return null;
  }

  return (
    <ListManagedBackgroundMap layerManager={layerManager} ready={ready} mapId={mapId} map={olMap}>
      <FloatingContainer
        filter={
          <>
            {/* TODO: 기간 설정 컴포넌트 추가 */}
            <RegionFilter features={features} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} map={map} />
            {/* 재해 구분 */}
            <TwoDepthScrollSelector
              options={disasterOptionsMap}
              title="재해 종류 및 세부 항목"
              selectedFirst={map.selectedDisaster}
              onFirstSelect={map.setSelectedDisaster}
              selectedSecond={""} // 세부 항목 선택 기능은 미적용
              onSecondSelect={() => {}} // 세부 항목 선택 기능은 미적용
              multiSelectSecond={false}
              hasSecondDepth={hasSecondDepth}
            />
            {/* 품목, 세부 품목 */}
            <CropFilter cropList={cropList} map={map} />
          </>
        }
        visualizationSetting={
          <DisasterTypeHistoryStatsLegend
            features={features}
            legendOptions={map.visualizationSetting.legendOptions}
            onLevelChange={map.setLegendLevel}
            onColorChange={map.setLegendColor}
            onPivotPointsChange={map.setLegendPivotPoints}
          />
        }
        setLabelOptions={map.setLabelOptions}
        labelOptions={map.visualizationSetting.labelOptions}
        resetVisualizationSetting={map.resetVisualizationSetting}
        setOpacity={map.setOpacity}
        opacity={map.visualizationSetting.opacity}
        visualType={map.visualizationSetting.visualType}
        setVisualType={(type) => map.setVisualType(type)}
      />
    </ListManagedBackgroundMap>
  );
};

export default DisasterTypeHistoryStatsMapContent;
