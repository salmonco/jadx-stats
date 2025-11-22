import { useQuery } from "@tanstack/react-query";
import CropFilter from "~/features/visualization/components/common/CropFilter";
import FloatingContainer from "~/features/visualization/components/common/FloatingContainer";
import RegionFilter from "~/features/visualization/components/common/RegionFilter";
import useRegionFilter from "~/features/visualization/hooks/useRegionFilter";
import { useVisualizationLayer } from "~/features/visualization/hooks/useVisualizationLayer";
import { MandarinTreeAgeDistributionFeatureCollection, MandarinTreeAgeDistributionLayer } from "~/features/visualization/layers/MandarinTreeAgeDistributionLayer";
import { DEFAULT_ALL_OPTION } from "~/features/visualization/utils/regionFilterOptions";
import MandarinTreeAgeDistributionMap from "~/maps/classes/MandarinTreeAgeDistributionMap";
import ListManagedBackgroundMap from "~/maps/components/ListManagedBackgroundMap";
import MandarinTreeAgeDistributionLegend from "~/maps/components/mandarinTreeAgeDistribution/MandarinTreeAgeDistributionLegend";
import { VisualizationSetting } from "~/maps/constants/visualizationSetting";
import { useMapList } from "~/maps/hooks/useMapList";
import useSetupOL from "~/maps/hooks/useSetupOL";
import visualizationApi from "~/services/apis/visualizationApi";

interface Props {
  mapId: string;
  onClickFullScreen: (mapId: string) => void;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
}

const MandarinTreeAgeDistributionMapContent = ({ mapId, onClickFullScreen, getPopupContainer }: Props) => {
  const mapList = useMapList<MandarinTreeAgeDistributionMap>();
  const map = mapList.getMapById(mapId);

  const { layerManager, ready, map: olMap } = useSetupOL(mapId, 10.7, "jeju");

  const { selectedRegion, setSelectedRegion, filterFeatures } = useRegionFilter(map.regionFilterSetting);

  const { data: cropList } = useQuery({
    queryKey: ["mandarinVarietyList"],
    queryFn: () => visualizationApi.getMandarinVarietyList(),
    retry: 1,
  });

  const { data: features } = useQuery<MandarinTreeAgeDistributionFeatureCollection>({
    queryKey: [
      "treeAgeDistributionFeatures",
      map.selectedTargetYear,
      map.getSelectedRegionLevel(),
      map.selectedCropGroup,
      map.selectedCropDetailGroup === DEFAULT_ALL_OPTION ? null : map.selectedCropDetailGroup,
    ],
    queryFn: () =>
      visualizationApi.getMandarinTreeAgeDistribution(
        map.selectedTargetYear,
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

  // NOTE: 시뮬레이션 기능 관련 주석 처리
  // const [offset, setOffset] = useState<OffsetRange>("0");
  // const { autoplay, setAutoplay } = useOffsetCounter({ length: 11, setOffset, setSelectedTargetYear: map.setSelectedTargetYear });

  // useEffect(() => {
  //   setOffset("0");
  //   setAutoplay(false);
  // }, [map.getSelectedRegionLevel(), map.selectedCropGroup, map.selectedCropDetailGroup]);

  const createTreeAgeDistributionLayer = async (features: MandarinTreeAgeDistributionFeatureCollection, visualizationSetting: VisualizationSetting) => {
    return MandarinTreeAgeDistributionLayer.createLayer(features, visualizationSetting, map.mapType, map.selectedCropGroup, map.selectedCropDetailGroup);
  };

  useVisualizationLayer({
    ready,
    features: filteredFeatures,
    layerManager,
    layerName: "mandarinTreeAgeDistribution",
    createLayer: createTreeAgeDistributionLayer,
    map,
    updateProps: {
      selectedCropGroup: map.selectedCropGroup,
      selectedCropDetailGroup: map.selectedCropDetailGroup,
    },
  });

  if (!map) {
    return null;
  }

  return (
    <ListManagedBackgroundMap
      layerManager={layerManager}
      ready={ready}
      mapId={mapId}
      map={olMap}
      onClickFullScreen={onClickFullScreen}
      getPopupContainer={getPopupContainer}
    >
      <FloatingContainer
        filter={
          <>
            <RegionFilter features={features} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} map={map} getPopupContainer={getPopupContainer} />
            <CropFilter cropList={cropList} map={map} getPopupContainer={getPopupContainer} />
          </>
        }
        visualizationSetting={
          <MandarinTreeAgeDistributionLegend
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
      {/* <MandarinTreeAgeChange
          autoplay={autoplay}
          setAutoplay={setAutoplay}
          offset={offset}
          setOffset={setOffset}
          selectedTargetYear={map.selectedTargetYear}
          setSelectedTargetYear={map.setSelectedTargetYear}
        /> */}
    </ListManagedBackgroundMap>
  );
};

export default MandarinTreeAgeDistributionMapContent;
