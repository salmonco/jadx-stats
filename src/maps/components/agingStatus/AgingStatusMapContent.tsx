import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import RegionFilter from "~/features/visualization/components/common/RegionFilter";
import { AgingStatusFeatureCollection, AgingStatusLayer, InnerLayer } from "~/features/visualization/layers/AgingStatusLayer";
import { DEFAULT_REGION_SETTING, RegionFilterOptions } from "~/features/visualization/utils/regionFilterOptions";
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

  const { data: features } = useQuery({
    queryKey: ["agingStatus", map.getSelectedRegionLevel(), map.excludeDong],
    queryFn: () => visualizationApi.getAgingStatus(map.getSelectedRegionLevel(), map.excludeDong),
    enabled: !!map.getSelectedRegionLevel(),
    retry: false,
  });

  const [filteredFeatures, setFilteredFeatures] = useState<AgingStatusFeatureCollection>(features);
  const [selectedRegion, setSelectedRegion] = useState<RegionFilterOptions>(map.regionFilterSetting || DEFAULT_REGION_SETTING);

  useEffect(() => {
    if (!ready || !filteredFeatures) return;

    const layerWrapper = layerManager.getLayer("agingStatusLayer");
    const existingLayer = layerWrapper?.layer as InnerLayer | undefined;

    if (existingLayer && typeof existingLayer.updateFeatures === "function") {
      existingLayer.updateFeatures(filteredFeatures);
    } else {
      AgingStatusLayer.createLayer(filteredFeatures).then((layer) => {
        layerManager.addLayer(layer, "agingStatusLayer", 1);
      });
    }
  }, [ready, filteredFeatures]);

  if (!map) {
    return null;
  }

  return (
    <ListManagedBackgroundMap layerManager={layerManager} ready={ready} mapId={mapId}>
      <FilterContainer isFixed>
        <RegionFilter selectedRegion={selectedRegion} features={features} setSelectedRegion={setSelectedRegion} setFilteredFeatures={setFilteredFeatures} />
        <AgingStatusLegend features={features} />
      </FilterContainer>
    </ListManagedBackgroundMap>
  );
};

export default AgingStatusMapContent;
