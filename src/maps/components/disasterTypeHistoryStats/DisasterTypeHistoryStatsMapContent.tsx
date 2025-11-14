import { useQuery } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import CropFilter from "~/features/visualization/components/common/CropFilter";
import CultivationTypeFilter from "~/features/visualization/components/common/CultivationTypeFilter";
import DateRangeFilter from "~/features/visualization/components/common/DateRangeFilter";
import DisasterFilter from "~/features/visualization/components/common/DisasterFilter";
import FloatingContainer from "~/features/visualization/components/common/FloatingContainer";
import RegionFilter from "~/features/visualization/components/common/RegionFilter";
import useRegionFilter from "~/features/visualization/hooks/useRegionFilter";
import { useVisualizationLayer } from "~/features/visualization/hooks/useVisualizationLayer";
import { DisasterTypeHistoryStatsFeatureCollection, DisasterTypeHistoryStatsLayer } from "~/features/visualization/layers/DisasterTypeHistoryStatsLayer";
import DisasterTypeHistoryStatsMap from "~/maps/classes/DisasterTypeHistoryStatsMap";
import DisasterTypeHistoryStatsLegend from "~/maps/components/disasterTypeHistoryStats/DisasterTypeHistoryStatsLegend";
import ListManagedBackgroundMap from "~/maps/components/ListManagedBackgroundMap";
import { DISASTER_TYPE_HISTORY_MOCK_DATA } from "~/maps/constants/disasterTypeHistoryMockData";
import { CULTIVATION_TYPE_OPTIONS } from "~/maps/constants/disasterTypeHistoryStats";
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

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(1, "years"));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null]) => {
    setStartDate(dates[0]);
    setEndDate(dates[1]);
  };

  const { selectedRegion, setSelectedRegion, filterFeatures } = useRegionFilter(map.regionFilterSetting);

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

  // TODO: 신규 api 추가
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
    return DisasterTypeHistoryStatsLayer.createLayer(features, visualizationSetting, map.selectedCultivationType);
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
            {/* 기간 설정 */}
            <DateRangeFilter title="기간 설정" startDate={startDate} endDate={endDate} onDateRangeChange={handleDateRangeChange} />
            {/* 지역 선택 */}
            <RegionFilter features={features} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} map={map} />
            {/* 재해 구분 */}
            <DisasterFilter
              options={disasterOptionsMap}
              title="재해 구분"
              selectedFirst={map.selectedDisaster}
              onFirstSelect={map.setSelectedDisaster}
              selectedSecond={""} // 세부 항목 선택 기능은 미적용
              onSecondSelect={() => {}} // 세부 항목 선택 기능은 미적용
              hasSecondDepth={hasSecondDepth}
            />
            {/* 품목, 세부 품목 */}
            <CropFilter cropList={cropList} map={map} />
            {/* 재배 방식 */}
            <CultivationTypeFilter
              title="재배 방식"
              options={CULTIVATION_TYPE_OPTIONS}
              selectedValue={map.selectedCultivationType}
              onSelectionChange={map.setSelectedCultivationType}
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
