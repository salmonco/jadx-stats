import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  InnerLayer,
  MandarinTreeAgeDistributionFeatureCollection,
  MandarinTreeAgeDistributionLayer,
} from "~/features/visualization/layers/MandarinTreeAgeDistributionLayer";
import MandarinTreeAgeDistributionMap from "~/maps/classes/MandarinTreeAgeDistributionMap";
import BackgroundMap from "~/maps/components/BackgroundMap";
import MandarinTreeAgeDistributionFilter from "~/maps/components/mandarinTreeAgeDistribution/MandarinTreeAgeDistributionFilter";
import MandarinTreeAgeDistributionLegend from "~/maps/components/mandarinTreeAgeDistribution/MandarinTreeAgeDistributionLegend";
import { useMapList } from "~/maps/hooks/useMapList";
import useSetupOL from "~/maps/hooks/useSetupOL";
import visualizationApi from "~/services/apis/visualizationApi";

const MandarinTreeAgeDistributionMapContent = ({ mapId }) => {
  const mapList = useMapList<MandarinTreeAgeDistributionMap>();
  const map = mapList.getMapById(mapId);

  const { layerManager, ready } = useSetupOL(mapId, 10.7, "jeju");

  const { data: features } = useQuery<MandarinTreeAgeDistributionFeatureCollection>({
    queryKey: [
      "treeAgeDistributionFeatures",
      map.selectedTargetYear,
      map.getSelectedRegionLevel(),
      map.selectedCropPummok,
      map.selectedCropDetailGroup === "전체" ? undefined : map.selectedCropDetailGroup,
    ],
    queryFn: () =>
      visualizationApi.getMandarinTreeAgeDistribution(
        map.selectedTargetYear,
        map.getSelectedRegionLevel(),
        map.selectedCropPummok,
        map.selectedCropDetailGroup === "전체" ? undefined : map.selectedCropDetailGroup
      ),
    enabled: !!ready,
  });

  useEffect(() => {
    if (!ready || !features) return;
    const layerWrapper = layerManager.getLayer("mandarinTreeAgeDistribution");
    const existingLayer = layerWrapper?.layer as InnerLayer | undefined;

    if (existingLayer && typeof existingLayer.updateFeatures === "function") {
      existingLayer.updatePummok(map.selectedCropPummok);
      existingLayer.updateVariety(map.selectedCropDetailGroup);
      existingLayer.updateFeatures(features);
    } else {
      MandarinTreeAgeDistributionLayer.createLayer(features, map.selectedCropPummok, map.selectedCropDetailGroup).then((layer) => {
        layerManager.addLayer(layer, "mandarinTreeAgeDistribution", 1);
      });
    }
  }, [ready, features]);

  return (
    <BackgroundMap layerManager={layerManager} ready={ready} mapId={mapId}>
      <MandarinTreeAgeDistributionLegend features={features} />
      <div className="absolute left-4 top-4 z-10">
        <MandarinTreeAgeDistributionFilter mapId={mapId} />
      </div>
    </BackgroundMap>
  );
};

export default MandarinTreeAgeDistributionMapContent;
