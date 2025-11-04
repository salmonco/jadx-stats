import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import BaseLegend from "~/features/visualization/components/common/BaseLegend";
import ButtonGroupSelector from "~/features/visualization/components/common/ButtonGroupSelector";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import FloatingMenu from "~/features/visualization/components/common/FloatingMenu";
import RegionFilter from "~/features/visualization/components/common/RegionFilter";
import useCropDistributionLayer from "~/features/visualization/hooks/useCropDistributionLayer";
import { getCropLegendItems } from "~/features/visualization/utils/getCropItems";
import { DEFAULT_REGION_SETTING, RegionFilterOptions } from "~/features/visualization/utils/regionFilterOptions";
import CropDistributionMap from "~/maps/classes/CropDistributionMap";
import ListManagedBackgroundMap from "~/maps/components/ListManagedBackgroundMap";
import { cropInfoOptions } from "~/maps/constants/cropDistribution";
import { useMapList } from "~/maps/hooks/useMapList";
import useSetupOL from "~/maps/hooks/useSetupOL";
import visualizationApi from "~/services/apis/visualizationApi";
import { getGeoJson } from "~/services/gis";

interface Props {
  mapId: string;
}

const CropDistributionMapContent = ({ mapId }: Props) => {
  const mapList = useMapList<CropDistributionMap>();
  const map = mapList.getMapById(mapId);
  const { layerManager, map: olMap, ready } = useSetupOL(mapId, 10.5, "jeju");

  const [menuPosition, setMenuPosition] = useState(null);
  const [menuChildren, setMenuChildren] = useState(null);

  const { data: cropData } = useQuery({
    queryKey: ["farmfields/crop_hexagons"],
    queryFn: () => getGeoJson("farmfields/crop_hexagons.geojson"),
    enabled: ready,
  });

  const { data: hexData } = useQuery({
    queryKey: ["farmfields/semi_hexagons"],
    queryFn: () => getGeoJson("farmfields/semi_hexagons.geojson"),
    enabled: ready,
  });

  const { data: areaData } = useQuery({
    queryKey: [""],
    queryFn: () => visualizationApi.getAreaGeojson("emd"),
    enabled: ready,
  });

  // TODO: 지역 필터링 API 연동
  const [filteredFeatures, setFilteredFeatures] = useState<any>();
  const [selectedRegion, setSelectedRegion] = useState<RegionFilterOptions>(map.regionFilterSetting || DEFAULT_REGION_SETTING);

  useCropDistributionLayer({
    layerManager,
    map: olMap,
    ready,
    selectedLvl: map.selectedCropLevel,
    setMenuPosition,
    setMenuChildren,
    cropData,
    hexData,
    opacity: 1 - map.visualizationSetting.transparency,
    areaData,
  });

  const closeMenu = () => {
    setMenuPosition(null);
    setMenuChildren(null);
  };

  const legendItems = getCropLegendItems();

  if (!map) {
    return null;
  }

  return (
    <ListManagedBackgroundMap layerManager={layerManager} ready={ready} mapId={mapId}>
      {menuPosition && menuChildren && <FloatingMenu position={menuPosition} onClose={closeMenu} menuChildren={menuChildren as any} />}
      <FilterContainer isFixed>
        <RegionFilter selectedRegion={selectedRegion} features={areaData} setSelectedRegion={setSelectedRegion} setFilteredFeatures={setFilteredFeatures} />
        <ButtonGroupSelector title="작물 정보" cols={2} options={cropInfoOptions} selectedValues={map.selectedCropLevel} setSelectedValues={map.setSelectedCropLevel} />
        <BaseLegend title="범례" items={legendItems} direction="horizontal" itemsPerRow={3} />
      </FilterContainer>
    </ListManagedBackgroundMap>
  );
};

export default CropDistributionMapContent;
