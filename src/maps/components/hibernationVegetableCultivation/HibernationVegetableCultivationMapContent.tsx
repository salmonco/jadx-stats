import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import ButtonGroupSelector from "~/features/visualization/components/common/ButtonGroupSelector";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import YearSelector from "~/features/visualization/components/common/YearSelector";
import {
  HibernationVegetableCultivationFeatureCollection,
  HibernationVegetableCultivationLayer,
  InnerLayer,
} from "~/features/visualization/layers/HibernationVegetableCultivationLayer";
import { regionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";
import HibernationVegetableCultivationMap from "~/maps/classes/HibernationVegetableCultivationMap";
import BackgroundMap from "~/maps/components/BackgroundMap";
import HibernationVegetableCultivationLegend from "~/maps/components/hibernationVegetableCultivation/HibernationVegetableCultivationLegend";
import { CROP_LEGEND_ITEMS, TARGET_YEAR } from "~/maps/constants/hibernationVegetableCultivation";
import { useMapList } from "~/maps/hooks/useMapList";
import useSetupOL from "~/maps/hooks/useSetupOL";
import visualizationApi from "~/services/apis/visualizationApi";

interface Props {
  mapId: string;
}

const HibernationVegetableCultivationMapContent = ({ mapId }: Props) => {
  const mapList = useMapList<HibernationVegetableCultivationMap>();
  const map = mapList.getMapById(mapId);

  const { layerManager, ready } = useSetupOL(mapId, 10.5, "jeju");

  const { data: features } = useQuery<HibernationVegetableCultivationFeatureCollection>({
    queryKey: ["hibernationVegetableCultivationFeatures", map.selectedTargetYear, map.getSelectedRegionLevel()],
    queryFn: () => visualizationApi.getHinatVgtblCltvarDclrFile(map.selectedTargetYear, map.selectedTargetYear - 1, map.getSelectedRegionLevel()),
    enabled: !!ready,
  });

  useEffect(() => {
    if (!ready || !features) return;

    const layerWrapper = layerManager.getLayer("HibernationVegetableCultivationLayer");
    const existingLayer = layerWrapper?.layer as InnerLayer | undefined;

    if (existingLayer) {
      existingLayer.updateFeatures(features);
      existingLayer.updateSelectedCrop(map.selectedCrop);
      existingLayer.changed();
    } else {
      HibernationVegetableCultivationLayer.createLayer(features, map.selectedCrop).then((layer) => {
        layerManager.addLayer(layer, "HibernationVegetableCultivationLayer", 1);
      });
    }
  }, [ready, features, map.selectedCrop]);

  if (!map) {
    return null;
  }

  return (
    <BackgroundMap layerManager={layerManager} ready={ready} mapId={mapId}>
      <HibernationVegetableCultivationLegend features={features} selectedCrop={map.selectedCrop} />
      <div className="absolute left-4 top-4 z-10">
        <FilterContainer>
          <YearSelector targetYear={TARGET_YEAR} selectedTargetYear={map.selectedTargetYear} setSelectedTargetYear={map.setSelectedTargetYear} />
          <ButtonGroupSelector
            title="권역 단위"
            cols={5}
            options={regionLevelOptions}
            selectedValues={map.getSelectedRegionLevel()}
            setSelectedValues={map.setSelectedRegionLevel}
          />
          <ButtonGroupSelector title="범례" cols={3} options={CROP_LEGEND_ITEMS} selectedValues={map.selectedCrop} setSelectedValues={map.setSelectedCrop} />
        </FilterContainer>
      </div>
    </BackgroundMap>
  );
};

export default HibernationVegetableCultivationMapContent;
