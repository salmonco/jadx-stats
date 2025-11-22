import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import DisasterCategoryFilter from "~/features/visualization/components/common/DisasterCategoryFilter";
import DisasterFilter from "~/features/visualization/components/common/DisasterFilter";
import FloatingContainer from "~/features/visualization/components/common/FloatingContainer";
import RegionFilter from "~/features/visualization/components/common/RegionFilter";
import YearFilter from "~/features/visualization/components/common/YearFilter";
import useRegionFilter from "~/features/visualization/hooks/useRegionFilter";
import { useVisualizationLayer } from "~/features/visualization/hooks/useVisualizationLayer";
import { YearlyDisasterFeatureCollection, YearlyDisasterLayer } from "~/features/visualization/layers/YearlyDisasterLayer";
import YearlyDisasterInfoMap from "~/maps/classes/YearlyDisasterInfoMap";
import ListManagedBackgroundMap from "~/maps/components/ListManagedBackgroundMap";
import YearlyDisasterLegend from "~/maps/components/yearlyDisasterInfo/YearlyDisasterLegend";
import { VisualizationSetting } from "~/maps/constants/visualizationSetting";
import { DISASTER_CATEGORY_OPTIONS, TARGET_YEAR } from "~/maps/constants/yearlyDisasterInfo";
import { useMapList } from "~/maps/hooks/useMapList";
import useSetupOL from "~/maps/hooks/useSetupOL";
import visualizationApi from "~/services/apis/visualizationApi";

interface Props {
  mapId: string;
  onClickFullScreen: (mapId: string) => void;
}

const YearlyDisasterInfoMapContent = ({ mapId, onClickFullScreen }: Props) => {
  const mapList = useMapList<YearlyDisasterInfoMap>();
  const map = mapList.getMapById(mapId);

  const { layerManager, ready, map: olMap } = useSetupOL(mapId, 10.5, "jeju");

  const { selectedRegion, setSelectedRegion, filterFeatures } = useRegionFilter(map.regionFilterSetting);

  const { data: disasterName } = useQuery({
    queryKey: ["disasterName", map.selectedTargetYear],
    queryFn: () => visualizationApi.getDisasterName(map.selectedTargetYear),
    enabled: !!map.selectedTargetYear,
    retry: 1,
  });

  const { data: features } = useQuery({
    queryKey: ["disasterFeatures", map.selectedTargetYear, map.getSelectedRegionLevel(), map.selectedDisaster],
    queryFn: () => visualizationApi.getDisasterFeatures(map.selectedTargetYear, map.getSelectedRegionLevel(), map.selectedDisaster),
    enabled: !!map.selectedTargetYear || !!map.getSelectedRegionLevel() || !!map.selectedDisaster,
    retry: false,
  });

  const filteredFeatures = features
    ? {
        ...features,
        features: features.features.filter(filterFeatures),
      }
    : null;

  const createYearlyDisasterInfoLayer = async (features: YearlyDisasterFeatureCollection, visualizationSetting: VisualizationSetting) => {
    return YearlyDisasterLayer.createLayer(features, visualizationSetting, map.mapType, map.selectedDisasterCategory);
  };

  useVisualizationLayer({
    ready,
    features: filteredFeatures,
    layerManager,
    layerName: "yearlyDisasterLayer",
    createLayer: createYearlyDisasterInfoLayer,
    map,
    updateProps: {
      selectedDisasterCategory: map.selectedDisasterCategory,
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
    <ListManagedBackgroundMap layerManager={layerManager} ready={ready} mapId={mapId} map={olMap} onClickFullScreen={onClickFullScreen}>
      <FloatingContainer
        filter={
          <>
            <YearFilter targetYear={TARGET_YEAR} selectedTargetYear={map.selectedTargetYear} setSelectedTargetYear={map.setSelectedTargetYear} />
            <RegionFilter features={features} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} map={map} />
            <DisasterCategoryFilter
              title="항목"
              options={DISASTER_CATEGORY_OPTIONS}
              selectedValue={map.selectedDisasterCategory}
              onSelectionChange={map.setSelectedDisasterCategory}
            />
            <DisasterFilter
              options={disasterOptionsMap}
              title="재해 종류 및 세부 항목"
              selectedFirst={map.selectedDisaster}
              onFirstSelect={map.setSelectedDisaster}
              selectedSecond={""} // 세부 항목 선택 기능은 미적용
              onSecondSelect={() => {}} // 세부 항목 선택 기능은 미적용
              hasSecondDepth={hasSecondDepth}
            />
          </>
        }
        visualizationSetting={
          <YearlyDisasterLegend
            features={features}
            legendOptions={map.visualizationSetting.legendOptions}
            selectedDisasterCategory={map.selectedDisasterCategory}
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

export default YearlyDisasterInfoMapContent;
