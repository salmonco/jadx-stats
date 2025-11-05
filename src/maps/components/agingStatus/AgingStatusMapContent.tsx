import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { AgingStatusLayer, InnerLayer } from "~/features/visualization/layers/AgingStatusLayer";
import { RegionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";
import AgingStatusLegend from "~/maps/components/agingStatus/AgingStatusLegend";
import BackgroundMap, { MapOptions } from "~/maps/components/BackgroundMap";
import useSetupOL from "~/maps/hooks/useSetupOL";
import visualizationApi from "~/services/apis/visualizationApi";

interface Props {
  mapId: string;
  mapOptions: MapOptions;
  title: string;
  tooltip?: React.ReactNode;
  onAddMap: () => void;
  selectedRegionLevel: RegionLevelOptions;
  excludeDong: boolean;
}

const AgingStatusMapContent = ({ mapId, mapOptions, title, tooltip, onAddMap, selectedRegionLevel, excludeDong }: Props) => {
  const { layerManager, ready } = useSetupOL(mapId, 10.5, "jeju", true, false);

  const { data: features } = useQuery({
    queryKey: ["agingStatus", selectedRegionLevel, excludeDong],
    queryFn: () => visualizationApi.getAgingStatus(selectedRegionLevel, excludeDong),
    enabled: !!selectedRegionLevel,
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

  return (
    <BackgroundMap layerManager={layerManager} ready={ready} mapId={mapId} mapOptions={mapOptions} title={title} tooltip={tooltip} onAddMap={onAddMap}>
      <AgingStatusLegend features={features} />
    </BackgroundMap>
  );
};

export default AgingStatusMapContent;
