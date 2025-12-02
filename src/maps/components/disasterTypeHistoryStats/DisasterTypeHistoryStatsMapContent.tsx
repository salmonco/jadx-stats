import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import CultivationTypeFilter from "~/features/visualization/components/common/CultivationTypeFilter";
import DateRangeFilter from "~/features/visualization/components/common/DateRangeFilter";
import DisasterFilter from "~/features/visualization/components/common/DisasterFilter";
import FloatingContainer from "~/features/visualization/components/common/FloatingContainer";
import RegionFilter from "~/features/visualization/components/common/RegionFilter";
import VegetableFilter from "~/features/visualization/components/common/VegetableFilter";
import useRegionFilter from "~/features/visualization/hooks/useRegionFilter";
import { useVisualizationLayer } from "~/features/visualization/hooks/useVisualizationLayer";
import { DisasterTypeHistoryStatsFeatureCollection, DisasterTypeHistoryStatsLayer } from "~/features/visualization/layers/DisasterTypeHistoryStatsLayer";
import DisasterTypeHistoryStatsMap from "~/maps/classes/DisasterTypeHistoryStatsMap";
import DisasterTypeHistoryStatsLegend from "~/maps/components/disasterTypeHistoryStats/DisasterTypeHistoryStatsLegend";
import ListManagedBackgroundMap from "~/maps/components/ListManagedBackgroundMap";
import { DISASTER_TYPE_HISTORY_MOCK_DATA } from "~/maps/constants/disasterTypeHistoryMockData";
import { CULTIVATION_TYPE_OPTIONS } from "~/maps/constants/disasterTypeHistoryStats";
import { CROP_LEGEND_ITEMS, CropType } from "~/maps/constants/hibernationVegetableCultivation";
import { VisualizationSetting } from "~/maps/constants/visualizationSetting";
import { useMapList } from "~/maps/hooks/useMapList";
import useSetupOL from "~/maps/hooks/useSetupOL";
import visualizationApi from "~/services/apis/visualizationApi";

interface Props {
  mapId: string;
  onClickFullScreen: (mapId: string) => void;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
}

const DisasterTypeHistoryStatsMapContent = ({ mapId, onClickFullScreen, getPopupContainer }: Props) => {
  const mapList = useMapList<DisasterTypeHistoryStatsMap>();
  const map = mapList.getMapById(mapId);

  const { layerManager, ready, map: olMap } = useSetupOL(mapId, 10.5, "jeju");

  const { selectedRegion, setSelectedRegion, filterFeatures } = useRegionFilter(map.regionFilterSetting);

  const { data: disasterName } = useQuery({
    queryKey: ["disasterName", map.selectedTargetYear],
    queryFn: () => visualizationApi.getDisasterName(map.selectedTargetYear),
    enabled: !!map.selectedTargetYear,
    retry: 1,
  });

  /**
   * @todo 작물 종류 API가 확정되면 아래 주석을 해제하고 CROP_LEGEND_ITEMS 대신 사용
   */
  // const { data: cropList } = useQuery({
  //   queryKey: ["mandarinVarietyList"],
  //   queryFn: () => visualizationApi.getMandarinVarietyList(),
  //   retry: 1,
  // });

  /**
   * @todo DISASTER_TYPE_HISTORY_MOCK_DATA 목데이터를 실제 API 요청으로 대체해야 합니다.
   * - 1. 요청 쿼리 파라미터: startDate, endDate, 지역 구분(level), 재해 구분(disaster_name), 품종(pummok), 세부품종(variety)
   * - 2. 응답 properties: 지역명(vrbs_nm), 총 피해 면적, 피해 농가수, 노지 재배 피해 면적, 시설 재배 피해 면적
   */
  //  const { data: features } = useQuery({
  //   queryKey: ["mandarinCultivationInfoFeatures", map.getSelectedRegionLevel(), map.selectedCropGroup, map.selectedCropDetailGroup],
  //   queryFn: () =>
  //     visualizationApi.getMandarinCultivationInfo(
  //       map.getSelectedRegionLevel(),
  //       map.selectedCropGroup,
  //       map.selectedCropDetailGroup === DEFAULT_ALL_OPTION ? null : map.selectedCropDetailGroup
  //     ),
  //   enabled: !!ready,
  // });

  const features = DISASTER_TYPE_HISTORY_MOCK_DATA;

  const filteredFeatures = features
    ? {
        ...features,
        features: features.features.filter(filterFeatures),
      }
    : null;

  const createDisasterTypeHistoryStatsLayer = async (features: DisasterTypeHistoryStatsFeatureCollection, visualizationSetting: VisualizationSetting) => {
    return DisasterTypeHistoryStatsLayer.createLayer(features, visualizationSetting, map.mapType, map.selectedCultivationType);
  };

  useVisualizationLayer({
    ready,
    features: filteredFeatures,
    layerManager,
    layerName: "disasterTypeHistoryStatsLayer",
    createLayer: createDisasterTypeHistoryStatsLayer,
    map,
  });

  useEffect(() => {
    if (disasterName && disasterName.length > 0) {
      map.setSelectedDisaster(disasterName[0].name);
    }
  }, [disasterName, map]);

  /**
   * @todo 작물 종류 API가 확정되면 제거
   * 현재는 CROP_LEGEND_ITEMS의 첫 번째 값으로 초기화
   */
  useEffect(() => {
    if (CROP_LEGEND_ITEMS.length > 0 && !CROP_LEGEND_ITEMS.find((item) => item.value === map.selectedCropPummok)) {
      map.setSelectedCropPummok(CROP_LEGEND_ITEMS[0].value);
      map.setSelectedCropGroup("전체");
      map.setSelectedCropDetailGroup("전체");
    }
  }, [map]);

  const disasterOptionsMap: Record<string, string[]> = useMemo(() => {
    const result: Record<string, string[]> = {};
    (disasterName || []).forEach(({ name, items }) => {
      result[name] = items || [];
    });
    return result;
  }, [disasterName]);

  const hasSecondDepth = disasterOptionsMap[map.selectedDisaster]?.length > 0;

  /**
   * @todo 작물 종류 API가 확정되면 cropList 기반으로 변경
   * 현재는 임시로 CROP_LEGEND_ITEMS 사용
   */
  // 작물 선택 변경 핸들러
  const handleCropChange = (value: CropType) => {
    map.setSelectedCropPummok(value);
    map.setSelectedCropGroup("전체");
    map.setSelectedCropDetailGroup("전체");
  };

  if (!map) {
    return null;
  }

  return (
    <ListManagedBackgroundMap
      layerManager={layerManager}
      ready={ready}
      mapId={mapId}
      map={olMap}
      onClickFullScreen={onClickFullScreen}
      getPopupContainer={getPopupContainer}
    >
      <FloatingContainer
        filter={
          <>
            {/* 기간 설정 */}
            <DateRangeFilter
              title="기간 설정"
              startDate={map.selectedStartDate}
              endDate={map.selectedEndDate}
              onDateRangeChange={([startDate, endDate]) => {
                map.setSelectedStartDate(startDate);
                map.setSelectedEndDate(endDate);
              }}
              getPopupContainer={getPopupContainer}
            />
            {/* 지역 선택 */}
            <RegionFilter features={features} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} map={map} getPopupContainer={getPopupContainer} />
            {/* 재해 구분 */}
            <DisasterFilter
              options={disasterOptionsMap}
              title="재해 구분"
              selectedFirst={map.selectedDisaster}
              onFirstSelect={map.setSelectedDisaster}
              selectedSecond={""} // 세부 항목 선택 기능은 미적용
              onSecondSelect={() => {}} // 세부 항목 선택 기능은 미적용
              hasSecondDepth={hasSecondDepth}
              getPopupContainer={getPopupContainer}
            />
            {/* 작물 종류 */}
            <VegetableFilter
              title="작물 종류"
              options={CROP_LEGEND_ITEMS}
              selectedValues={map.selectedCropPummok as CropType}
              onSelectionChange={handleCropChange}
              getPopupContainer={getPopupContainer}
            />
            {/* 재배 방식 */}
            <CultivationTypeFilter
              title="재배 방식"
              options={CULTIVATION_TYPE_OPTIONS}
              selectedValue={map.selectedCultivationType}
              onSelectionChange={map.setSelectedCultivationType}
              getPopupContainer={getPopupContainer}
            />
          </>
        }
        visualizationSetting={
          <DisasterTypeHistoryStatsLegend
            // TODO: api 적용 이후 타입 단언 제거
            features={features as unknown as DisasterTypeHistoryStatsFeatureCollection}
            legendOptions={map.visualizationSetting.legendOptions}
            selectedCultivationType={map.selectedCultivationType}
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
