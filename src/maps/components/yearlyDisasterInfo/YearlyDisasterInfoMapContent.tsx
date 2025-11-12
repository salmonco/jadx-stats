import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import ButtonGroupSelector from "~/features/visualization/components/common/ButtonGroupSelector";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import RegionFilter from "~/features/visualization/components/common/RegionFilter";
import TwoDepthScrollSelector from "~/features/visualization/components/common/TwoDepthScrollSelector";
import YearFilter from "~/features/visualization/components/common/YearFilter";
import useRegionFilter from "~/features/visualization/hooks/useRegionFilter";
import { InnerLayer, YearlyDisasterLayer } from "~/features/visualization/layers/YearlyDisasterLayer";
import YearlyDisasterInfoMap from "~/maps/classes/YearlyDisasterInfoMap";
import ListManagedBackgroundMap from "~/maps/components/ListManagedBackgroundMap";
import YearlyDisasterLegend from "~/maps/components/yearlyDisasterInfo/YearlyDisasterLegend";
import { TARGET_YEAR } from "~/maps/constants/yearlyDisasterInfo";
import { useMapList } from "~/maps/hooks/useMapList";
import useSetupOL from "~/maps/hooks/useSetupOL";
import visualizationApi from "~/services/apis/visualizationApi";

interface Props {
  mapId: string;
}

const YearlyDisasterInfoMapContent = ({ mapId }: Props) => {
  const mapList = useMapList<YearlyDisasterInfoMap>();
  const map = mapList.getMapById(mapId);

  const { layerManager, ready } = useSetupOL(mapId, 10.5, "jeju");

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

  const { selectedRegion, setSelectedRegion, filterFeatures } = useRegionFilter(map.regionFilterSetting);

  const disasterOptionsMap: Record<string, string[]> = useMemo(() => {
    const result: Record<string, string[]> = {};
    (disasterName || []).forEach(({ name, items }) => {
      result[name] = items || [];
    });
    return result;
  }, [disasterName]);

  const hasSecondDepth = disasterOptionsMap[map.selectedDisaster]?.length > 0;

  useEffect(() => {
    if (disasterName) {
      map.setSelectedDisaster(disasterName[0].name);
    }
  }, [disasterName]);

  useEffect(() => {
    if (!ready || !features) return;

    const layerWrapper = layerManager.getLayer("yearlyDisasterLayer");
    const existingLayer = layerWrapper?.layer as InnerLayer | undefined;

    const filtered = {
      ...features,
      features: features.features.filter(filterFeatures),
    };

    if (existingLayer && typeof existingLayer.updateFeatures === "function") {
      existingLayer.updateFeatures(filtered);
      existingLayer.updateSelectedCategory(map.selectedDisasterCategory);
      existingLayer.changed();
    } else {
      YearlyDisasterLayer.createLayer(features, map.selectedDisasterCategory).then((layer) => {
        layerManager.addLayer(layer, "yearlyDisasterLayer", 1);
      });
    }
  }, [ready, features, selectedRegion, map.selectedDisasterCategory]);

  return (
    <ListManagedBackgroundMap layerManager={layerManager} ready={ready} mapId={mapId}>
      <FilterContainer isFixed>
        <YearFilter targetYear={TARGET_YEAR} selectedTargetYear={map.selectedTargetYear} setSelectedTargetYear={map.setSelectedTargetYear} />
        <RegionFilter features={features} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} map={map} />
        <ButtonGroupSelector
          title="항목"
          cols={2}
          options={[
            { value: "total_dstr_sprt_amt", label: "재난지원금" },
            { value: "total_cfmtn_dmg_qnty", label: "피해면적" },
          ]}
          selectedValues={map.selectedDisasterCategory}
          setSelectedValues={map.setSelectedDisasterCategory}
        />
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
        <YearlyDisasterLegend mapId={mapId} features={features} />
      </FilterContainer>
    </ListManagedBackgroundMap>
  );
};

export default YearlyDisasterInfoMapContent;
