import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import ItemDepthScrollSelector from "~/features/visualization/components/common/ItemDepthScrollSelector";
import RegionFilter from "~/features/visualization/components/common/RegionFilter";
import MandarinTreeAgeChange from "~/features/visualization/components/observation/MandarinTreeAgeChange";
import useOffsetCounter from "~/features/visualization/hooks/useOffsetCounter";
import {
  InnerLayer,
  MandarinTreeAgeDistributionFeatureCollection,
  MandarinTreeAgeDistributionLayer,
} from "~/features/visualization/layers/MandarinTreeAgeDistributionLayer";
import { DEFAULT_REGION_SETTING, RegionFilterOptions } from "~/features/visualization/utils/regionFilterOptions";
import MandarinTreeAgeDistributionMap from "~/maps/classes/MandarinTreeAgeDistributionMap";
import ListManagedBackgroundMap from "~/maps/components/ListManagedBackgroundMap";
import MandarinTreeAgeDistributionLegend from "~/maps/components/mandarinTreeAgeDistribution/MandarinTreeAgeDistributionLegend";
import { useMapList } from "~/maps/hooks/useMapList";
import useSetupOL from "~/maps/hooks/useSetupOL";
import { OffsetRange } from "~/pages/visualization/observation/MandarinTreeAgeDistribution";
import visualizationApi from "~/services/apis/visualizationApi";

const MandarinTreeAgeDistributionMapContent = ({ mapId }) => {
  const mapList = useMapList<MandarinTreeAgeDistributionMap>();
  const map = mapList.getMapById(mapId);

  const { layerManager, ready } = useSetupOL(mapId, 10.7, "jeju");

  const { data: features } = useQuery<MandarinTreeAgeDistributionFeatureCollection>({
    queryKey: [
      "treeAgeDistributionFeatures",
      map.selectedTargetYear,
      map.getSelectedRegionLevel(),
      map.selectedCropPummok,
      map.selectedCropDetailGroup === "전체" ? undefined : map.selectedCropDetailGroup,
    ],
    queryFn: () =>
      visualizationApi.getMandarinTreeAgeDistribution(
        map.selectedTargetYear,
        map.getSelectedRegionLevel(),
        map.selectedCropPummok,
        map.selectedCropDetailGroup === "전체" ? undefined : map.selectedCropDetailGroup
      ),
    enabled: !!ready,
  });

  const { data: varietyList } = useQuery({
    queryKey: ["mandarinVarietyList"],
    queryFn: () => visualizationApi.getMandarinVarietyList(),
    retry: 1,
  });

  const [filteredFeatures, setFilteredFeatures] = useState<MandarinTreeAgeDistributionFeatureCollection>(features);
  const [selectedRegion, setSelectedRegion] = useState<RegionFilterOptions>(map.regionFilterSetting || DEFAULT_REGION_SETTING);

  const [offset, setOffset] = useState<OffsetRange>("0");
  const { autoplay, setAutoplay } = useOffsetCounter({ length: 11, setOffset, setSelectedTargetYear: map.setSelectedTargetYear });

  useEffect(() => {
    setOffset("0");
    setAutoplay(false);
  }, [map.getSelectedRegionLevel(), map.selectedCropPummok, map.selectedCropDetailGroup]);

  useEffect(() => {
    if (!ready || !filteredFeatures) return;
    const layerWrapper = layerManager.getLayer("mandarinTreeAgeDistribution");
    const existingLayer = layerWrapper?.layer as InnerLayer | undefined;

    if (existingLayer && typeof existingLayer.updateFeatures === "function") {
      existingLayer.updatePummok(map.selectedCropPummok);
      existingLayer.updateVariety(map.selectedCropDetailGroup);
      existingLayer.updateFeatures(filteredFeatures);
    } else {
      MandarinTreeAgeDistributionLayer.createLayer(filteredFeatures, map.selectedCropPummok, map.selectedCropDetailGroup).then((layer) => {
        layerManager.addLayer(layer, "mandarinTreeAgeDistribution", 1);
      });
    }
  }, [ready, filteredFeatures]);

  return (
    <ListManagedBackgroundMap layerManager={layerManager} ready={ready} mapId={mapId}>
      <FilterContainer isFixed>
        <RegionFilter selectedRegion={selectedRegion} features={features} setSelectedRegion={setSelectedRegion} setFilteredFeatures={setFilteredFeatures} />
        <ItemDepthScrollSelector
          optionGroups={varietyList ?? []}
          onSelectionChange={(group, first, second) => {
            map.setSelectedCropGroup(group);
            map.setSelectedCropPummok(first);

            let secondVal = second;
            if (second === "유라실생") secondVal = "YN-26";
            if (second === "레드향") secondVal = "감평";
            if (second === "천혜향") secondVal = "세토카";
            if (second === "한라봉") secondVal = "부지화";

            map.setSelectedCropDetailGroup(secondVal);
          }}
        />
        <MandarinTreeAgeChange
          autoplay={autoplay}
          setAutoplay={setAutoplay}
          offset={offset}
          setOffset={setOffset}
          selectedTargetYear={map.selectedTargetYear}
          setSelectedTargetYear={map.setSelectedTargetYear}
        />
        <MandarinTreeAgeDistributionLegend features={features} />
      </FilterContainer>
    </ListManagedBackgroundMap>
  );
};

export default MandarinTreeAgeDistributionMapContent;
