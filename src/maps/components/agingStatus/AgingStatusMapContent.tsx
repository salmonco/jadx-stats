import { useQuery } from "@tanstack/react-query";
import FloatingContainer from "~/features/visualization/components/common/FloatingContainer";
import RegionFilter from "~/features/visualization/components/common/RegionFilter";
import useRegionFilter from "~/features/visualization/hooks/useRegionFilter";
import { useVisualizationLayer } from "~/features/visualization/hooks/useVisualizationLayer";
import { AgingStatusLayer } from "~/features/visualization/layers/AgingStatusLayer";
import AgingStatusMap from "~/maps/classes/AgingStatusMap";
import AgingStatusLegend from "~/maps/components/agingStatus/AgingStatusLegend";
import ListManagedBackgroundMap from "~/maps/components/ListManagedBackgroundMap";
import { useMapList } from "~/maps/hooks/useMapList";
import useSetupOL from "~/maps/hooks/useSetupOL";
import visualizationApi from "~/services/apis/visualizationApi";

interface Props {
  mapId: string;
}

const AgingStatusMapContent = ({ mapId }: Props) => {
  const mapList = useMapList<AgingStatusMap>();
  const map = mapList.getMapById(mapId);

  const { layerManager, ready, map: olMap } = useSetupOL(mapId, 10.5, "jeju");

  const { selectedRegion, setSelectedRegion, filterFeatures } = useRegionFilter(map.regionFilterSetting);

  const { data: features } = useQuery({
    queryKey: ["agingStatus", map.getSelectedRegionLevel(), map.excludeDong],
    queryFn: () => visualizationApi.getAgingStatus(map.getSelectedRegionLevel(), map.excludeDong),
    enabled: !!map.getSelectedRegionLevel(),
    retry: false,
  });

  const filteredFeatures = features
    ? {
        ...features,
        features: features.features.filter(filterFeatures),
      }
    : null;

  const createAgingStatusLayer = async (features: any, visualizationSetting: any) => {
    return AgingStatusLayer.createLayer(features, visualizationSetting);
  };

  useVisualizationLayer({
    ready,
    features: filteredFeatures,
    layerManager,
    layerName: "agingStatusLayer",
    createLayer: createAgingStatusLayer,
    map,
  });

  if (!map) {
    return null;
  }

  return (
    <ListManagedBackgroundMap layerManager={layerManager} ready={ready} mapId={mapId} map={olMap}>
      <FloatingContainer
        filter={<RegionFilter features={features} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} map={map} />}
        visualizationSetting={
          <AgingStatusLegend
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
        visualType={map.visualizationSetting.visualType}
        setVisualType={(type) => map.setVisualType(type)}
      />
    </ListManagedBackgroundMap>
  );
};

export default AgingStatusMapContent;
