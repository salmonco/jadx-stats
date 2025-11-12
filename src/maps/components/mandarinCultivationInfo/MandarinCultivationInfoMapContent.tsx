import { useQuery } from "@tanstack/react-query";
import CropFilter from "~/features/visualization/components/common/CropFilter";
import FloatingContainer from "~/features/visualization/components/common/FloatingContainer";
import RegionFilter from "~/features/visualization/components/common/RegionFilter";
import useRegionFilter from "~/features/visualization/hooks/useRegionFilter";
import { useVisualizationLayer } from "~/features/visualization/hooks/useVisualizationLayer";
import { MandarinCultivationFeatureCollection, MandarinCultivationLayer } from "~/features/visualization/layers/MandarinCultivationLayer";
import { DEFAULT_ALL_OPTION } from "~/features/visualization/utils/regionFilterOptions";
import MandarinCultivationInfoMap from "~/maps/classes/MandarinCultivationInfoMap";
import ListManagedBackgroundMap from "~/maps/components/ListManagedBackgroundMap";
import MandarinCultivationInfoLegend from "~/maps/components/mandarinCultivationInfo/MandarinCultivationInfoLegend";
import { VisualizationSetting } from "~/maps/constants/visualizationSetting";
import { useMapList } from "~/maps/hooks/useMapList";
import useSetupOL from "~/maps/hooks/useSetupOL";
import visualizationApi from "~/services/apis/visualizationApi";

interface Props {
  mapId: string;
}

const MandarinCultivationInfoMapContent = ({ mapId }: Props) => {
  const mapList = useMapList<MandarinCultivationInfoMap>();
  const map = mapList.getMapById(mapId);

  const { layerManager, ready, map: olMap } = useSetupOL(mapId, 10.5, "jeju");

  const { selectedRegion, setSelectedRegion, filterFeatures } = useRegionFilter(map.regionFilterSetting);

  const { data: cropList } = useQuery({
    queryKey: ["mandarinVarietyList"],
    queryFn: () => visualizationApi.getMandarinVarietyList(),
    retry: 1,
  });

  const { data: features } = useQuery({
    queryKey: ["mandarinCultivationInfoFeatures", map.getSelectedRegionLevel(), map.selectedCropGroup, map.selectedCropDetailGroup],
    queryFn: () =>
      visualizationApi.getMandarinCultivationInfo(
        map.getSelectedRegionLevel(),
        map.selectedCropGroup,
        map.selectedCropDetailGroup === DEFAULT_ALL_OPTION ? null : map.selectedCropDetailGroup
      ),
    enabled: !!ready,
  });

  const filteredFeatures = features
    ? {
        ...features,
        features: features.features.filter(filterFeatures),
      }
    : null;

  const createCultivationInfoLayer = async (features: MandarinCultivationFeatureCollection, visualizationSetting: VisualizationSetting) => {
    return MandarinCultivationLayer.createLayer(features, visualizationSetting, map.selectedCropDetailGroup);
  };

  useVisualizationLayer({
    ready,
    features: filteredFeatures,
    layerManager,
    layerName: "mandarinCultivationLayer",
    createLayer: createCultivationInfoLayer,
    map,
    updateProps: {
      selectedCropDetailGroup: map.selectedCropDetailGroup,
    },
  });

  if (!map) {
    return null;
  }

  return (
    <ListManagedBackgroundMap layerManager={layerManager} ready={ready} mapId={mapId} map={olMap}>
      <FloatingContainer
        filter={
          <>
            <RegionFilter features={features} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} map={map} />
            <CropFilter cropList={cropList} map={map} />
          </>
        }
        visualizationSetting={
          <MandarinCultivationInfoLegend
            features={features}
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

export default MandarinCultivationInfoMapContent;
