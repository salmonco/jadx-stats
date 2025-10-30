import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import visualizationApi from "~/services/apis/visualizationApi";
import { getGeoJson } from "~/services/gis";
import useCropDistributionLayer from "~/features/visualization/hooks/useCropDistributionLayer";
import FloatingMenu from "~/features/visualization/components/common/FloatingMenu";
import VisualizationContainer from "~/features/visualization/components/common/VisualizationContainer";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import ButtonGroupSelector, { ButtonGroupSelectorOption } from "~/features/visualization/components/common/ButtonGroupSelector";
import BaseLegend from "~/features/visualization/components/common/BaseLegend";
import InfoTooltip from "~/components/InfoTooltip";
import useSetupOL from "~/maps/hooks/useSetupOL";
import BackgroundMap, { MapOptions } from "~/maps/components/BackgroundMap";
import { getCropLegendItems } from "~/utils/gitUtils";
import { v4 as uuidv4 } from "uuid";

const MAP_ID = uuidv4();

const mapOptions: MapOptions = {
  type: "Base",
  layerSwitcher: true,
  mapTypeSwitcher: true,
  roundCorners: true,
};

const CropDistribution = () => {
  const { layerManager, map, ready } = useSetupOL(MAP_ID, 10.7, "jeju", true, false);
  const [menuPosition, setMenuPosition] = useState(null);
  const [menuChildren, setMenuChildren] = useState(null);
  const [selectedLvl, setSelectedLvl] = useState("lvl1");
  const [opacity, setOpacity] = useState(0.7);

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

  useCropDistributionLayer({
    layerManager,
    map,
    ready,
    selectedLvl,
    setMenuPosition,
    setMenuChildren,
    cropData,
    hexData,
    opacity,
    areaData,
  });

  const closeMenu = () => {
    setMenuPosition(null);
    setMenuChildren(null);
  };

  const cropInfoOptions: ButtonGroupSelectorOption[] = [
    { label: "상위 1품목", value: "lvl2" },
    { label: "상위 2품목", value: "lvl1" },
  ];

  const legendItems = getCropLegendItems();

  return (
    <VisualizationContainer
      title="작물 재배지도"
      tooltip={
        <InfoTooltip
          title="작물 재배지도"
          content={`- 제주 지역별 주 생산 품목을 지도에 색상별로 표기하여 직관적으로 확인\n- ‘상위 2품목’선택시 해당 구역을 클릭하여 전체 순위별로 작물별 재배 면적을 확인 가능\n- ※ 데이터: 드론재배면적조사(’21~’23)`}
        />
      }
      mapContent={
        <BackgroundMap layerManager={layerManager} ready={ready} mapId={MAP_ID} mapOptions={mapOptions}>
          {menuPosition && menuChildren && <FloatingMenu position={menuPosition} onClose={closeMenu} menuChildren={menuChildren as any} />}
        </BackgroundMap>
      }
      filterContent={
        <FilterContainer>
          <ButtonGroupSelector title="작물 정보" cols={2} options={cropInfoOptions} selectedValues={selectedLvl} setSelectedValues={setSelectedLvl} />
          {/* {selectedLvl === "lvl2" && (
            <div className="flex flex-col">
              <p className="text-[20px] font-semibold text-gray-700">투명도</p>
              <Slider min={0} max={1} step={0.05} value={opacity} onChange={(x: number) => setOpacity(x)} />
            </div>
          )} */}
          <BaseLegend title="범례" items={legendItems} direction="horizontal" itemsPerRow={3} />
        </FilterContainer>
      }
      chartContent={
        null
        // <ChartContainer minHeight={360}>
        //   <></>
        //   <></>
        //   <></>
        // </ChartContainer>
      }
    />
  );
};

export default CropDistribution;
