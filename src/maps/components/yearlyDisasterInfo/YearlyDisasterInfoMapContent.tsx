import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { InnerLayer, YearlyDisasterLayer } from "~/features/visualization/layers/YearlyDisasterLayer";
import YearlyDisasterInfoMap from "~/maps/classes/YearlyDisasterInfoMap";
import ListManagedBackgroundMap from "~/maps/components/ListManagedBackgroundMap";
import YearlyDisasterInfoFilter from "~/maps/components/yearlyDisasterInfo/YearlyDisasterInfoFilter";
import YearlyDisasterLegend from "~/maps/components/yearlyDisasterInfo/YearlyDisasterLegend";

import { useMapList } from "~/maps/hooks/useMapList";
import useSetupOL from "~/maps/hooks/useSetupOL";
import visualizationApi from "~/services/apis/visualizationApi";

interface Props {
  mapId: string;
}

const YearlyDisasterInfoMapContent = ({ mapId }: Props) => {
  const mapList = useMapList<YearlyDisasterInfoMap>();
  const map = mapList.getMapById(mapId);

  const { layerManager, ready } = useSetupOL(mapId, 10.5, "jeju");

  const { data: disasterName } = useQuery({
    queryKey: ["disasterName", map.selectedTargetYear],
    queryFn: () => visualizationApi.getDisasterName(map.selectedTargetYear),
    enabled: !!map.selectedTargetYear,
    retry: 1,
  });

  const { data: features } = useQuery({
    queryKey: ["disasterFeatures", map.selectedTargetYear, map.getSelectedRegionLevel(), map.selectedDisaster],
    queryFn: () => visualizationApi.getDisasterFeatures(map.selectedTargetYear, map.getSelectedRegionLevel(), map.selectedDisaster),
    enabled: !!map.selectedTargetYear || !!map.getSelectedRegionLevel() || !!map.selectedDisaster,
    retry: false,
  });

  useEffect(() => {
    if (disasterName) {
      map.setSelectedDisaster(disasterName[0].name);
    }
  }, [disasterName]);

  useEffect(() => {
    if (!ready || !features) return;

    const layerWrapper = layerManager.getLayer("yearlyDisasterLayer");
    const existingLayer = layerWrapper?.layer as InnerLayer | undefined;

    if (existingLayer && typeof existingLayer.updateFeatures === "function") {
      existingLayer.updateFeatures(features);
      existingLayer.updateSelectedCategory(map.selectedDisasterCategory);
      existingLayer.changed();
    } else {
      YearlyDisasterLayer.createLayer(features, map.selectedDisasterCategory).then((layer) => {
        layerManager.addLayer(layer, "yearlyDisasterLayer", 1);
      });
    }
  }, [ready, features, map.selectedDisasterCategory]);

  return (
    <ListManagedBackgroundMap layerManager={layerManager} ready={ready} mapId={mapId}>
      <YearlyDisasterLegend mapId={mapId} features={features} />
      <div className="absolute left-4 top-4 z-10">
        <YearlyDisasterInfoFilter mapId={mapId} />
      </div>
    </ListManagedBackgroundMap>
  );
};

export default YearlyDisasterInfoMapContent;
