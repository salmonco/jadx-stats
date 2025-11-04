import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  HibernationVegetableCultivationFeatureCollection,
  HibernationVegetableCultivationLayer,
  InnerLayer,
} from "~/features/visualization/layers/HibernationVegetableCultivationLayer";
import { DEFAULT_ALL_OPTION, DEFAULT_REGION_SETTING, RegionFilterOptions } from "~/features/visualization/utils/regionFilterOptions";
import { REGION_LEVEL_OPTIONS } from "~/features/visualization/utils/regionLevelOptions";
import HibernationVegetableCultivationMap from "~/maps/classes/HibernationVegetableCultivationMap";
import ListManagedBackgroundMap from "~/maps/components/ListManagedBackgroundMap";
import HibernationVegetableCultivationFilter from "~/maps/components/hibernationVegetableCultivation/HibernationVegetableCultivationFilter";
import HibernationVegetableCultivationLegend from "~/maps/components/hibernationVegetableCultivation/HibernationVegetableCultivationLegend";
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

  const [filteredFeatures, setFilteredFeatures] = useState<HibernationVegetableCultivationFeatureCollection>(features);
  const [selectedRegion, setSelectedRegion] = useState<RegionFilterOptions>(map.regionFilterSetting || DEFAULT_REGION_SETTING);

  useEffect(() => {
    map.setRegionFilterSetting(selectedRegion);
  }, [selectedRegion]);

  useEffect(() => {
    if (!features) {
      return;
    }

    // 지금은 선택한 지역 구분에서만 필터링 됨
    // TODO: 하위 선택 지역도 필터링되도록 수정 필요 (API 호출)
    const filtered = {
      ...features,
      features: features.features.filter((feature) => {
        const props = feature.properties;
        const regionLevel = selectedRegion.구분;

        if (regionLevel === REGION_LEVEL_OPTIONS.행정시 && selectedRegion.행정시 !== DEFAULT_ALL_OPTION && selectedRegion.행정시 !== null) {
          return props.vrbs_nm === selectedRegion.행정시;
        }
        if (regionLevel === REGION_LEVEL_OPTIONS.권역 && selectedRegion.권역.length > 0) {
          return selectedRegion.권역.includes(props.vrbs_nm);
        }
        if (regionLevel === REGION_LEVEL_OPTIONS.읍면 && selectedRegion.읍면.length > 0) {
          return selectedRegion.읍면.includes(props.vrbs_nm);
        }
        if (regionLevel === REGION_LEVEL_OPTIONS.리동 && selectedRegion.리동.length > 0) {
          return selectedRegion.리동.includes(props.vrbs_nm);
        }
        return true;
      }),
    };
    setFilteredFeatures(filtered);
  }, [features, selectedRegion]);

  useEffect(() => {
    if (!ready || !filteredFeatures) return;

    const layerWrapper = layerManager.getLayer("HibernationVegetableCultivationLayer");
    const existingLayer = layerWrapper?.layer as InnerLayer | undefined;

    if (existingLayer) {
      existingLayer.updateFeatures(filteredFeatures);
      existingLayer.updateSelectedCrop(map.selectedCrop);
      existingLayer.changed();
    } else {
      HibernationVegetableCultivationLayer.createLayer(features, map.selectedCrop).then((layer) => {
        layerManager.addLayer(layer, "HibernationVegetableCultivationLayer", 1);
      });
    }
  }, [ready, filteredFeatures, map.selectedCrop]);

  if (!map) {
    return null;
  }

  return (
    <ListManagedBackgroundMap layerManager={layerManager} ready={ready} mapId={mapId}>
      <HibernationVegetableCultivationLegend features={filteredFeatures} selectedCrop={map.selectedCrop} />
      <div className="absolute left-4 top-4 z-10">
        <HibernationVegetableCultivationFilter mapId={mapId} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
      </div>
    </ListManagedBackgroundMap>
  );
};

export default HibernationVegetableCultivationMapContent;
