import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ColoredCropFilter from "~/features/visualization/components/common/ColoredCropFilter";
import CropLevelFilter from "~/features/visualization/components/common/CropLevelFilter";
import FloatingContainer from "~/features/visualization/components/common/FloatingContainer";
import FloatingMenu from "~/features/visualization/components/common/FloatingMenu";
import RegionFilter from "~/features/visualization/components/common/RegionFilter";
import useCropDistributionLayer from "~/features/visualization/hooks/useCropDistributionLayer";
import useRegionFilter from "~/features/visualization/hooks/useRegionFilter";
import { getCropLegendItems } from "~/features/visualization/utils/getCropItems";
import CropDistributionMap from "~/maps/classes/CropDistributionMap";
import ListManagedBackgroundMap from "~/maps/components/ListManagedBackgroundMap";
import { cropInfoOptions } from "~/maps/constants/cropDistribution";
import { CROP_MOCK_DATA } from "~/maps/constants/cropMockData";
import { SEMI_MOCK_DATA } from "~/maps/constants/semiMockData";
import { useMapList } from "~/maps/hooks/useMapList";
import useSetupOL from "~/maps/hooks/useSetupOL";
import visualizationApi from "~/services/apis/visualizationApi";

interface Props {
  mapId: string;
}

const CropDistributionMapContent = ({ mapId }: Props) => {
  const mapList = useMapList<CropDistributionMap>();
  const map = mapList.getMapById(mapId);

  const { layerManager, ready, map: olMap } = useSetupOL(mapId, 10.5, "jeju");

  const [menuPosition, setMenuPosition] = useState(null);
  const [menuChildren, setMenuChildren] = useState(null);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);

  /**
   * @todo CROP_MOCK_DATA 목데이터를 실제 API 요청으로 대체해야 합니다.
   * - 1. 요청 쿼리 파라미터: 지역 구분(level)*
   * - 2. 응답 properties: 지역명(vrbs_nm)*, 재배면적(mandarin_area), 작물(top_pummok), feature_type
   * - *는 새로 추가될 필드를 의미함
   */
  // const { data: cropData } = useQuery({
  //   queryKey: ["farmfields/crop_hexagons"],
  //   queryFn: () => getGeoJson("farmfields/crop_hexagons.geojson"),
  //   enabled: ready,
  // });

  /**
   * @todo SEMI_MOCK_DATA 목데이터를 실제 API 요청으로 대체해야 합니다.
   * - 1. 요청 쿼리 파라미터: 지역 구분(level)*
   * - 2. 응답 properties: 지역명(vrbs_nm)*, 재배면적(mandarin_area), 작물(top_pummok), side, opacity, top_pummok, pummok_data({pummok, area} 배열)
   * - *는 새로 추가될 필드를 의미함
   */
  // const { data: hexData } = useQuery({
  //   queryKey: ["farmfields/semi_hexagons"],
  //   queryFn: () => getGeoJson("farmfields/semi_hexagons.geojson"),
  //   enabled: ready,
  // });

  const { data: areaData } = useQuery({
    queryKey: [""],
    queryFn: () => visualizationApi.getAreaGeojson("emd"),
    enabled: ready,
  });

  const { selectedRegion, setSelectedRegion, filterFeatures } = useRegionFilter(map.regionFilterSetting);

  const cropItems = getCropLegendItems().map((item) => ({ ...item, value: item.label }));

  const filteredCropData = CROP_MOCK_DATA
    ? {
        ...CROP_MOCK_DATA,
        features: CROP_MOCK_DATA.features.filter(filterFeatures).filter((feature) => selectedCrops.length === 0 || selectedCrops.includes(feature.properties.top_pummok)),
      }
    : null;

  const filteredHexData = SEMI_MOCK_DATA
    ? {
        ...SEMI_MOCK_DATA,
        features: SEMI_MOCK_DATA.features.filter(filterFeatures).filter((feature) => selectedCrops.length === 0 || selectedCrops.includes(feature.properties.top_pummok)),
      }
    : null;

  const filteredAreaData = areaData
    ? {
        ...areaData,
        features: areaData.features.filter(filterFeatures),
      }
    : null;

  useCropDistributionLayer({
    layerManager,
    map: olMap,
    ready,
    selectedLvl: map.selectedCropLevel,
    setMenuPosition,
    setMenuChildren,
    cropData: filteredCropData,
    hexData: filteredHexData,
    opacity: map.visualizationSetting.opacity,
    areaData: filteredAreaData,
  });

  const closeMenu = () => {
    setMenuPosition(null);
    setMenuChildren(null);
  };

  if (!map) {
    return null;
  }

  return (
    <ListManagedBackgroundMap layerManager={layerManager} ready={ready} mapId={mapId} map={olMap}>
      {menuPosition && menuChildren && <FloatingMenu position={menuPosition} onClose={closeMenu} menuChildren={menuChildren as any} />}
      <FloatingContainer
        filter={
          <>
            <RegionFilter features={areaData} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} map={map} />
            <CropLevelFilter title="작물 정보" options={cropInfoOptions} selectedValue={map.selectedCropLevel} onSelectionChange={map.setSelectedCropLevel} />
            <ColoredCropFilter title="작물 선택" options={cropItems} selectedOptions={selectedCrops} onSelectionChange={setSelectedCrops} isMulti />
          </>
        }
      />
    </ListManagedBackgroundMap>
  );
};

export default CropDistributionMapContent;
