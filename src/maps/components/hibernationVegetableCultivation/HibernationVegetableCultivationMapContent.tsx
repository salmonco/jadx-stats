import { useQuery } from "@tanstack/react-query";
import ButtonGroupSelector from "~/features/visualization/components/common/ButtonGroupSelector";
import FloatingContainer from "~/features/visualization/components/common/FloatingContainer";
import RegionFilter from "~/features/visualization/components/common/RegionFilter";
import YearFilter from "~/features/visualization/components/common/YearFilter";
import useRegionFilter from "~/features/visualization/hooks/useRegionFilter";
import { useVisualizationLayer } from "~/features/visualization/hooks/useVisualizationLayer";
import { HibernationVegetableCultivationLayer } from "~/features/visualization/layers/HibernationVegetableCultivationLayer";
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

  const { data: features } = useQuery({
    queryKey: ["hibernationVegetableCultivationFeatures", map.selectedTargetYear, selectedRegion.구분],
    queryFn: () => visualizationApi.getHinatVgtblCltvarDclrFile(map.selectedTargetYear, map.selectedTargetYear - 1, selectedRegion.구분),
    enabled: !!ready,
  });

  const filteredFeatures = features
    ? {
        ...features,
        features: features.features.filter(filterFeatures),
      }
    : null;

  const createHibernationLayer = async (features: any, visualizationSetting: any) => {
    return HibernationVegetableCultivationLayer.createLayer(features, visualizationSetting, map.selectedCrop);
  };

  useVisualizationLayer({
    ready,
    features: filteredFeatures,
    layerManager,
    layerName: "HibernationVegetableCultivationLayer",
    createLayer: createHibernationLayer,
    map,
    updateProps: {
      selectedCrop: map.selectedCrop,
    },
  });

  if (!map) {
    return null;
  }

  return (
    <ListManagedBackgroundMap layerManager={layerManager} ready={ready} mapId={mapId}>
      <FloatingContainer
        filter={
          <>
            <YearFilter targetYear={TARGET_YEAR} selectedTargetYear={map.selectedTargetYear} setSelectedTargetYear={map.setSelectedTargetYear} />
            <RegionFilter features={features} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} map={map} />
            <ButtonGroupSelector title="범례" cols={3} options={CROP_LEGEND_ITEMS} selectedValues={map.selectedCrop} setSelectedValues={map.setSelectedCrop} />
          </>
        }
        visualizationSetting={
          <HibernationVegetableCultivationLegend
            features={features}
            selectedCrop={map.selectedCrop}
            legendOptions={map.visualizationSetting.legendOptions}
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
      />
    </ListManagedBackgroundMap>
  );
};

export default HibernationVegetableCultivationMapContent;
