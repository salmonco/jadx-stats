import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import visualizationApi from "~/services/apis/visualizationApi";
import { RegionLevels } from "~/services/types/visualizationTypes";
import VisualizationContainer from "~/features/visualization/components/common/VisualizationContainer";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import ChartContainer from "~/features/visualization/components/common/ChartContainer";
import ButtonGroupSelector from "~/features/visualization/components/common/ButtonGroupSelector";
import ItemDepthScrollSelector from "~/features/visualization/components/common/ItemDepthScrollSelector";
import MandarinCultivationBarChart from "~/features/visualization/components/production/MandarinCultivationBarChart";
import MandarinCultivationPieChart from "~/features/visualization/components/production/MandarinCultivationPieChart";
import { InnerLayer, MandarinCultivationLayer } from "~/features/visualization/layers/MandarinCultivationLayer";
import { regionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";
import InfoTooltip from "~/components/InfoTooltip";
import { colorsRed } from "~/utils/gisColors";
import { infoTooltipContents } from "~/utils/InfoTooltipContents";
import useSetupOL from "~/maps/hooks/useSetupOL";
import BackgroundMap, { MapOptions } from "~/maps/components/BackgroundMap";
import { v4 as uuidv4 } from "uuid";
import * as d3 from "d3";

const MAP_ID = uuidv4();
const mapOptions: MapOptions = {
  type: "Base",
  layerSwitcher: true,
  mapTypeSwitcher: true,
  roundCorners: true,
};

export const PALETTE_12 = [
  "#E63946", // 딥 레드
  "#F1A208", // 진한 앰버
  "#A8DADC", // 소프트 민트
  "#457B9D", // 블루그레이
  "#2A9D8F", // 터콰이즈
  "#FF6B6B", // 코랄레드
  "#6D597A", // 무화과 퍼플
  "#F28482", // 따뜻한 살몬
  "#118AB2", // 청록에 가까운 파랑
  "#FF9F1C", // 오렌지
  "#8AC926", // 라임 그린
  "#8338EC", // 보라
];

export const getColor = (idx: number) => {
  if (idx < PALETTE_12.length) return PALETTE_12[idx];
  const base = PALETTE_12[idx % 12];
  const round = Math.floor(idx / 12);
  return d3
    .color(base)!
    .darker(round * 0.5)
    .formatHex();
};

const MandarinCultivationInfo = () => {
  const { layerManager, ready } = useSetupOL(MAP_ID, 10.5, "jeju", true, false);

  const [selectedLevel, setSelectedLevel] = useState<RegionLevels | null | "emd">("emd");

  const [_, setSelectedGroup] = useState<string>("온주밀감류");
  const [selectedPummok, setSelectedPummok] = useState<string>("극조생온주");
  const [selectedVariety, setSelectedVariety] = useState<string>("전체");

  const { data: varietyList } = useQuery({
    queryKey: ["mandarinVarietyList"],
    queryFn: () => visualizationApi.getMandarinVarietyList(),
    retry: 1,
  });

  const { data: features } = useQuery({
    queryKey: ["mandarinCultivationInfoFeatures", selectedLevel, selectedPummok, selectedVariety],
    queryFn: () => visualizationApi.getMandarinCultivationInfo(selectedLevel, selectedPummok, selectedVariety === "전체" ? undefined : selectedVariety),
  });

  const { data: chartData } = useQuery({
    queryKey: ["mandarinCultivationInfoChart", selectedLevel, selectedPummok, selectedVariety],
    queryFn: () => visualizationApi.getMandarinCultivationInfoChart(selectedLevel, selectedPummok, selectedVariety === "전체" ? undefined : selectedVariety),
  });

  useEffect(() => {
    if (!ready || !features) return;

    const layerWrapper = layerManager.getLayer("mandarinCultivationLayer");
    const existingLayer = layerWrapper?.layer as InnerLayer | undefined;

    if (existingLayer && typeof existingLayer.updateFeatures === "function") {
      existingLayer.updateFeatures(features);
      existingLayer.updateSelectedVariety(selectedVariety);
      existingLayer.changed();
    } else {
      MandarinCultivationLayer.createLayer(features, selectedVariety).then((layer) => {
        layerManager.addLayer(layer, "mandarinCultivationLayer", 1);
      });
    }
  }, [ready, features, selectedVariety]);

  const MandarinTreeAgeDistributionLegend = ({ features }) => {
    const { minValue, maxValue } = useMemo(() => {
      if (!features || !Array.isArray(features.features)) return { minValue: 0, maxValue: 0 };

      let min = Infinity;
      let max = -Infinity;

      for (const feature of features.features) {
        const averageAge = feature?.properties?.stats[0]?.total_area;
        if (typeof averageAge === "number" && !isNaN(averageAge)) {
          min = Math.min(min, averageAge);
          max = Math.max(max, averageAge);
        }
      }

      return {
        minValue: min === Infinity ? 0 : min,
        maxValue: max === -Infinity ? 0 : max,
      };
    }, [features]);

    // colorsRed 배열을 역순으로 사용하여 CSS gradient 생성 (높은 나이 = 진한 빨강)
    const gradientColors = [...colorsRed].reverse().join(", ");

    return (
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 100 }} className="flex w-[280px] flex-col rounded-lg">
        <div className="rounded-lg border border-[#d9d9d9] bg-[#fff] px-[8px] py-[8px] pb-[4px]">
          <div
            style={{
              height: "15px",
              background: features?.features?.length === 1 ? colorsRed[6] : `linear-gradient(to right, ${gradientColors})`,
              borderRadius: "4px",
            }}
          />
          <div className="flex justify-between px-[2px] text-[14px] text-[#222]">
            {features?.features?.length === 1 ? (
              <span className="w-full text-center">{((minValue + maxValue) / 2 / 10000).toFixed(1)}ha</span>
            ) : features?.features?.length === 2 ? (
              <>
                <span>{(minValue / 10000).toFixed(1)}ha</span>
                <span>{(maxValue / 10000).toFixed(1)}ha</span>
              </>
            ) : (
              <>
                <span>{(minValue / 10000).toFixed(1)}ha</span>
                <span>{((minValue + maxValue) / 2 / 10000).toFixed(1)}ha</span>
                <span>{(maxValue / 10000).toFixed(1)}ha</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <VisualizationContainer
      title="감귤 재배정보"
      tooltip={<InfoTooltip content={infoTooltipContents["감귤 재배정보"]} />}
      mapContent={
        <BackgroundMap layerManager={layerManager} ready={ready} mapId={MAP_ID} mapOptions={mapOptions}>
          <MandarinTreeAgeDistributionLegend features={features} />
        </BackgroundMap>
      }
      filterContent={
        <FilterContainer>
          <ButtonGroupSelector title="권역 단위" cols={5} options={regionLevelOptions} selectedValues={selectedLevel} setSelectedValues={setSelectedLevel} />
          <ItemDepthScrollSelector
            optionGroups={varietyList ?? []}
            onSelectionChange={(group, first, second) => {
              setSelectedGroup(group);
              setSelectedPummok(first);

              let secondVal = second;
              if (second === "유라실생") secondVal = "YN-26";
              if (second === "레드향") secondVal = "감평";
              if (second === "천혜향") secondVal = "세토카";
              if (second === "한라봉") secondVal = "부지화";

              setSelectedVariety(secondVal);
            }}
          />
        </FilterContainer>
      }
      chartContent={
        <ChartContainer cols={2} minHeight={500}>
          <MandarinCultivationBarChart chartData={chartData} selectedVariety={selectedVariety} />
          <MandarinCultivationPieChart chartData={chartData} selectedVariety={selectedVariety} />
        </ChartContainer>
      }
    />
  );
};

export default MandarinCultivationInfo;
