import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import ItemDepthScrollSelector from "~/features/visualization/components/common/ItemDepthScrollSelector";
import RegionFilter from "~/features/visualization/components/common/RegionFilter";
import useRegionFilter from "~/features/visualization/hooks/useRegionFilter";
import { InnerLayer, MandarinCultivationLayer } from "~/features/visualization/layers/MandarinCultivationLayer";
import MandarinCultivationInfoMap from "~/maps/classes/MandarinCultivationInfoMap";
import ListManagedBackgroundMap from "~/maps/components/ListManagedBackgroundMap";
import MandarinTreeAgeDistributionLegend from "~/maps/components/mandarinCultivationInfo/MandarinTreeAgeDistributionLegend";
import { useMapList } from "~/maps/hooks/useMapList";
import useSetupOL from "~/maps/hooks/useSetupOL";
import visualizationApi from "~/services/apis/visualizationApi";

interface Props {
  mapId: string;
}

const MandarinCultivationInfoMapContent = ({ mapId }: Props) => {
  const mapList = useMapList<MandarinCultivationInfoMap>();
  const map = mapList.getMapById(mapId);

  const { layerManager, ready } = useSetupOL(mapId, 10.5, "jeju");

  const { data: varietyList } = useQuery({
    queryKey: ["mandarinVarietyList"],
    queryFn: () => visualizationApi.getMandarinVarietyList(),
    retry: 1,
  });

  const { data: features } = useQuery({
    queryKey: ["mandarinCultivationInfoFeatures", map.getSelectedRegionLevel(), map.selectedCropPummok, map.selectedCropDetailGroup],
    queryFn: () =>
      visualizationApi.getMandarinCultivationInfo(
        map.getSelectedRegionLevel(),
        map.selectedCropPummok,
        map.selectedCropDetailGroup === "전체" ? null : map.selectedCropDetailGroup
      ),
  });

  const { selectedRegion, setSelectedRegion, filterFeatures } = useRegionFilter(map.regionFilterSetting);

  useEffect(() => {
    if (!ready || !features) return;

    const filtered = {
      ...features,
      features: features.features.filter(filterFeatures),
    };

    const layerWrapper = layerManager.getLayer("mandarinCultivationLayer");
    const existingLayer = layerWrapper?.layer as InnerLayer | undefined;

    if (existingLayer && typeof existingLayer.updateFeatures === "function") {
      existingLayer.updateFeatures(filtered);
      existingLayer.updateSelectedVariety(map.selectedCropDetailGroup);
      existingLayer.changed();
    } else {
      MandarinCultivationLayer.createLayer(features, map.selectedCropDetailGroup).then((layer) => {
        layerManager.addLayer(layer, "mandarinCultivationLayer", 1);
      });
    }
  }, [ready, features, selectedRegion, map.selectedCropDetailGroup]);

  return (
    <ListManagedBackgroundMap layerManager={layerManager} ready={ready} mapId={mapId}>
      <FilterContainer isFixed>
        <RegionFilter features={features} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
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
        <MandarinTreeAgeDistributionLegend features={features} />
      </FilterContainer>
    </ListManagedBackgroundMap>
  );
};

export default MandarinCultivationInfoMapContent;
