import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import ButtonGroupSelector from "~/features/visualization/components/common/ButtonGroupSelector";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import RegionFilter from "~/features/visualization/components/common/RegionFilter";
import YearFilter from "~/features/visualization/components/common/YearFilter";
import useRegionFilter from "~/features/visualization/hooks/useRegionFilter";
import {
  HibernationVegetableCultivationFeatureCollection,
  HibernationVegetableCultivationLayer,
  InnerLayer,
} from "~/features/visualization/layers/HibernationVegetableCultivationLayer";
import HibernationVegetableCultivationMap from "~/maps/classes/HibernationVegetableCultivationMap";
import ListManagedBackgroundMap from "~/maps/components/ListManagedBackgroundMap";
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

  const { selectedRegion, setSelectedRegion, filterFeatures } = useRegionFilter(map.regionFilterSetting);

  const { data: features } = useQuery<HibernationVegetableCultivationFeatureCollection>({
    queryKey: ["hibernationVegetableCultivationFeatures", map.selectedTargetYear, selectedRegion.구분],
    queryFn: () => visualizationApi.getHinatVgtblCltvarDclrFile(map.selectedTargetYear, map.selectedTargetYear - 1, selectedRegion.구분),
    enabled: !!ready,
  });

  useEffect(() => {
    map.setRegionFilterSetting(selectedRegion);
  }, [selectedRegion]);

  useEffect(() => {
    if (!ready || !features) return;

    const filtered = {
      ...features,
      features: features.features.filter(filterFeatures),
    };

    const layerWrapper = layerManager.getLayer("HibernationVegetableCultivationLayer");
    const existingLayer = layerWrapper?.layer as InnerLayer | undefined;

    if (existingLayer) {
      existingLayer.updateFeatures(filtered);
      existingLayer.updateSelectedCrop(map.selectedCrop);
      existingLayer.changed();
    } else {
      HibernationVegetableCultivationLayer.createLayer(features, map.selectedCrop).then((layer) => {
        layerManager.addLayer(layer, "HibernationVegetableCultivationLayer", 1);
      });
    }
  }, [ready, features, selectedRegion, map.selectedCrop]);

  if (!map) {
    return null;
  }

  return (
    <ListManagedBackgroundMap layerManager={layerManager} ready={ready} mapId={mapId}>
      <FilterContainer isFixed>
        <YearFilter targetYear={TARGET_YEAR} selectedTargetYear={map.selectedTargetYear} setSelectedTargetYear={map.setSelectedTargetYear} />
        <RegionFilter features={features} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
        <ButtonGroupSelector title="범례" cols={3} options={CROP_LEGEND_ITEMS} selectedValues={map.selectedCrop} setSelectedValues={map.setSelectedCrop} />
        <HibernationVegetableCultivationLegend features={features} selectedCrop={map.selectedCrop} />
      </FilterContainer>
    </ListManagedBackgroundMap>
  );
};

export default HibernationVegetableCultivationMapContent;
