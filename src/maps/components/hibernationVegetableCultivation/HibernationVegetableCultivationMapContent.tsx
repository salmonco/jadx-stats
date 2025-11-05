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
import { regionLevelOptions, RegionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";
import BackgroundMap, { MapOptions } from "~/maps/components/BackgroundMap";
import HibernationVegetableCultivationLegend from "~/maps/components/hibernationVegetableCultivation/HibernationVegetableCultivationLegend";
import { CROP_LEGEND_ITEMS, CropType, TARGET_YEAR } from "~/maps/constants/hibernationVegetableCultivation";
import useSetupOL from "~/maps/hooks/useSetupOL";
import visualizationApi from "~/services/apis/visualizationApi";

interface Props {
  mapId: string;
  mapOptions: MapOptions;
  title: string;
  tooltip?: React.ReactNode;
  onAddMap: () => void;
  selectedRegionLevel: RegionLevelOptions;
  selectedTargetYear: number;
  selectedCrops: CropType;
  setSelectedRegionLevel: (levels: RegionLevelOptions) => void;
  setSelectedTargetYear: (year: number) => void;
  setSelectedCrops: (crops: CropType) => void;
}

const HibernationVegetableCultivationMapContent = ({
  mapId,
  mapOptions,
  title,
  tooltip,
  onAddMap,
  selectedRegionLevel,
  selectedTargetYear,
  selectedCrops,
  setSelectedRegionLevel,
  setSelectedTargetYear,
  setSelectedCrops,
}: Props) => {
  const { layerManager, ready } = useSetupOL(mapId, 10.5, "jeju", true, false);

  const { data: features } = useQuery<HibernationVegetableCultivationFeatureCollection>({
    queryKey: ["hibernationVegetableCultivationFeatures", selectedTargetYear, selectedRegionLevel],
    queryFn: () => visualizationApi.getHinatVgtblCltvarDclrFile(selectedTargetYear, selectedTargetYear - 1, selectedRegionLevel),
    enabled: !!ready,
  });

  useEffect(() => {
    if (!ready || !features) return;

    const layerWrapper = layerManager.getLayer("HibernationVegetableCultivationLayer");
    const existingLayer = layerWrapper?.layer as InnerLayer | undefined;

    if (existingLayer) {
      existingLayer.updateFeatures(features);
      existingLayer.updateSelectedCrops(selectedCrops);
      existingLayer.changed();
    } else {
      HibernationVegetableCultivationLayer.createLayer(features, selectedCrops).then((layer) => {
        layerManager.addLayer(layer, "HibernationVegetableCultivationLayer", 1);
      });
    }
  }, [ready, features, selectedCrops]);

  return (
    <BackgroundMap layerManager={layerManager} ready={ready} mapId={mapId} mapOptions={mapOptions} title={title} tooltip={tooltip} onAddMap={onAddMap}>
      <HibernationVegetableCultivationLegend features={features} selectedCrops={selectedCrops} />
      <div className="absolute left-4 top-4 z-10">
        <FilterContainer>
          <YearSelector targetYear={TARGET_YEAR} selectedTargetYear={selectedTargetYear} setSelectedTargetYear={setSelectedTargetYear} />
          <ButtonGroupSelector title="권역 단위" cols={5} options={regionLevelOptions} selectedValues={selectedRegionLevel} setSelectedValues={setSelectedRegionLevel} />
          <ButtonGroupSelector title="범례" cols={3} options={CROP_LEGEND_ITEMS} selectedValues={selectedCrops} setSelectedValues={setSelectedCrops} />
        </FilterContainer>
      </div>
    </BackgroundMap>
  );
};

export default HibernationVegetableCultivationMapContent;
