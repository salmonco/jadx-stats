import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import ButtonGroupSelector from "~/features/visualization/components/common/ButtonGroupSelector";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import ItemDepthScrollSelector from "~/features/visualization/components/common/ItemDepthScrollSelector";
import { InnerLayer, MandarinCultivationLayer } from "~/features/visualization/layers/MandarinCultivationLayer";
import { regionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";
import MandarinCultivationInfoMap from "~/maps/classes/MandarinCultivationInfoMap";
import BackgroundMap from "~/maps/components/BackgroundMap";
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

  useEffect(() => {
    if (!ready || !features) return;

    const layerWrapper = layerManager.getLayer("mandarinCultivationLayer");
    const existingLayer = layerWrapper?.layer as InnerLayer | undefined;

    if (existingLayer && typeof existingLayer.updateFeatures === "function") {
      existingLayer.updateFeatures(features);
      existingLayer.updateSelectedVariety(map.selectedCropDetailGroup);
      existingLayer.changed();
    } else {
      MandarinCultivationLayer.createLayer(features, map.selectedCropDetailGroup).then((layer) => {
        layerManager.addLayer(layer, "mandarinCultivationLayer", 1);
      });
    }
  }, [ready, features, map.selectedCropDetailGroup]);

  return (
    <BackgroundMap layerManager={layerManager} ready={ready} mapId={mapId}>
      <MandarinTreeAgeDistributionLegend features={features} />
      <div className="absolute left-4 top-4 z-10">
        <FilterContainer>
          <ButtonGroupSelector
            title="권역 단위"
            cols={5}
            options={regionLevelOptions}
            selectedValues={map.getSelectedRegionLevel()}
            setSelectedValues={map.setSelectedRegionLevel}
          />
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
        </FilterContainer>
      </div>
    </BackgroundMap>
  );
};

export default MandarinCultivationInfoMapContent;
