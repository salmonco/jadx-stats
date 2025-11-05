import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { AgingStatusLayer, InnerLayer } from "~/features/visualization/layers/AgingStatusLayer";
import AgingStatusMap from "~/maps/classes/AgingStatusMap";
import AgingStatusLegend from "~/maps/components/agingStatus/AgingStatusLegend";
import BackgroundMap from "~/maps/components/BackgroundMap";
import { useMapList } from "~/maps/hooks/useMapList";
import useSetupOL from "~/maps/hooks/useSetupOL";
import visualizationApi from "~/services/apis/visualizationApi";

interface Props {
  mapId: string;
}

const AgingStatusMapContent = ({ mapId }: Props) => {
  const mapList = useMapList<AgingStatusMap>();
  const map = mapList.getMapById(mapId);

  const { layerManager, ready } = useSetupOL(mapId, 10.5, "jeju");

  const { data: features } = useQuery({
    queryKey: ["agingStatus", map.getSelectedRegionLevel(), map.excludeDong],
    queryFn: () => visualizationApi.getAgingStatus(map.getSelectedRegionLevel(), map.excludeDong),
    enabled: !!map.getSelectedRegionLevel(),
    retry: false,
  });

  useEffect(() => {
    if (!ready || !features) return;

    const layerWrapper = layerManager.getLayer("agingStatusLayer");
    const existingLayer = layerWrapper?.layer as InnerLayer | undefined;

    if (existingLayer && typeof existingLayer.updateFeatures === "function") {
      existingLayer.updateFeatures(features);
    } else {
      AgingStatusLayer.createLayer(features).then((layer) => {
        layerManager.addLayer(layer, "agingStatusLayer", 1);
      });
    }
  }, [ready, features]);

  if (!map) {
    return null;
  }

  return (
    <BackgroundMap layerManager={layerManager} ready={ready} mapId={mapId}>
      <AgingStatusLegend features={features} />
    </BackgroundMap>
  );
};

export default AgingStatusMapContent;
