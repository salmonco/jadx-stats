import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import RegionFilter from "~/features/visualization/components/common/RegionFilter";
import useRegionFilter from "~/features/visualization/hooks/useRegionFilter";
import { AgingStatusLayer, InnerLayer } from "~/features/visualization/layers/AgingStatusLayer";
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

  const { layerManager, ready } = useSetupOL(mapId, 10.5, "jeju");

  const { selectedRegion, setSelectedRegion, filterFeatures } = useRegionFilter(map.regionFilterSetting);

  const { data: features } = useQuery({
    queryKey: ["agingStatus", map.getSelectedRegionLevel(), map.excludeDong],
    queryFn: () => visualizationApi.getAgingStatus(map.getSelectedRegionLevel(), map.excludeDong),
    enabled: !!map.getSelectedRegionLevel(),
    retry: false,
  });

  useEffect(() => {
    map.setRegionFilterSetting(selectedRegion);
  }, [selectedRegion]);

  useEffect(() => {
    if (!ready || !features) return;

    const filtered = {
      ...features,
      features: features.features.filter(filterFeatures),
    };

    const layerWrapper = layerManager.getLayer("agingStatusLayer");
    const existingLayer = layerWrapper?.layer as InnerLayer | undefined;

    if (existingLayer && typeof existingLayer.updateFeatures === "function") {
      existingLayer.updateFeatures(filtered);
    } else {
      AgingStatusLayer.createLayer(features).then((layer) => {
        layerManager.addLayer(layer, "agingStatusLayer", 1);
      });
    }
  }, [ready, features, selectedRegion]);

  if (!map) {
    return null;
  }

  return (
    <ListManagedBackgroundMap layerManager={layerManager} ready={ready} mapId={mapId}>
      <FilterContainer isFixed>
        <RegionFilter features={features} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
        <AgingStatusLegend features={features} />
      </FilterContainer>
    </ListManagedBackgroundMap>
  );
};

export default AgingStatusMapContent;
