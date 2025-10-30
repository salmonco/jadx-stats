import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import visualizationApi from "~/services/apis/visualizationApi";
import VisualizationContainer from "~/features/visualization/components/common/VisualizationContainer";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import ChartContainer from "~/features/visualization/components/common/ChartContainer";
import YearSelector from "~/features/visualization/components/common/YearSelector";
import ButtonGroupSelector, { ButtonGroupSelectorOption } from "~/features/visualization/components/common/ButtonGroupSelector";
import CultivationChangeDivergingBarChart from "~/features/visualization/components/production/CultivationChangeDivergingBarChart";
import {
  HibernationVegetableCultivationFeatureCollection,
  HibernationVegetableCultivationLayer,
  InnerLayer,
} from "~/features/visualization/layers/HibernationVegetableCultivationLayer";
import { regionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";
import InfoTooltip from "~/components/InfoTooltip";
import useSetupOL from "~/maps/hooks/useSetupOL";
import BackgroundMap, { MapOptions } from "~/maps/components/BackgroundMap";
import { RegionLevels } from "~/maps/services/MapDataService";
import { infoTooltipContents } from "~/utils/InfoTooltipContents";
import { interpolateRdYlBu } from "d3";
import { v4 as uuidv4 } from "uuid";

const MAP_ID = uuidv4();
const mapOptions: MapOptions = {
  type: "Base",
  layerSwitcher: true,
  mapTypeSwitcher: true,
  roundCorners: true,
};

const TARGET_YEAR = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];

const LEGEND_ITEMS: ButtonGroupSelectorOption[] = [
  { label: "월동무", value: "월동무" },
  { label: "양배추", value: "양배추" },
  { label: "당근", value: "당근" },
  { label: "마늘", value: "마늘" },
  { label: "양파", value: "양파" },
  { label: "브로콜리", value: "브로콜리" },
  { label: "비트", value: "비트" },
  { label: "콜라비", value: "콜라비" },
  { label: "적채", value: "적채" },
  { label: "쪽파", value: "쪽파" },
  { label: "월동배추", value: "월동배추" },
  { label: "방울다다기양배추", value: "방울다다기양배추" },
];
type CropType = "월동무" | "양배추" | "당근" | "마늘" | "양파" | "브로콜리" | "비트" | "콜라비" | "적채" | "쪽파" | "월동배추" | "방울다다기양배추";

const HibernationVegetableCultivation = () => {
  const { layerManager, ready } = useSetupOL(MAP_ID, 10.5, "jeju", true, false);

  const [selectedTargetYear, setSelectedTargetYear] = useState(2023);
  const [selectedLevel, setSelectedLevel] = useState<RegionLevels | null | "emd">("emd");

  const [selectedCrops, setSelectedCrops] = useState<CropType>("월동무");
  const [chartData, setChartData] = useState<any>(null);

  const { data: features } = useQuery<HibernationVegetableCultivationFeatureCollection>({
    queryKey: ["hibernationVegetableCultivationFeatures", selectedTargetYear, selectedLevel],
    queryFn: () => visualizationApi.getHinatVgtblCltvarDclrFile(selectedTargetYear, selectedTargetYear - 1, selectedLevel),
    enabled: !!ready,
  });

  //features 차트 데이터로 가공
  useEffect(() => {
    if (features) {
      const processed = processedData(features);
      setChartData(processed);
    }
  }, [features]);

  function processedData(data) {
    const result = {};

    data.features.forEach((feature) => {
      const name = feature.properties.vrbs_nm;
      const changeData = feature.properties.area_chg?.chg_mttr;

      if (name && Array.isArray(changeData)) {
        result[name] = changeData;
      }
    });

    return result;
  }

  useEffect(() => {
    if (!ready || !features) return;

    const layerWrapper = layerManager.getLayer("HibernationVegetableCultivationLayer");
    const existingLayer = layerWrapper?.layer as InnerLayer | undefined;

    if (existingLayer) {
      existingLayer.updateFeatures(features);
      existingLayer.updateSelectedCrops(selectedCrops);
      existingLayer.changed();
    } else {
      HibernationVegetableCultivationLayer.createLayer(features, selectedCrops).then((layer) => {
        layerManager.addLayer(layer, "HibernationVegetableCultivationLayer", 1);
      });
    }
  }, [ready, features, selectedCrops]);

  const HibernationVegetableCultivationLegend = ({ features, selectedCrops }) => {
    const maxAbsValue = useMemo(() => {
      if (!features || !Array.isArray(features.features)) return 0;

      let max = -Infinity;

      for (const feature of features.features) {
        const matters = feature?.properties?.area_chg.chg_mttr;
        if (!Array.isArray(matters)) continue;

        for (const matter of matters) {
          if (matter.crop_nm === selectedCrops) {
            const value = matter.chg_cn;
            if (typeof value === "number" && !isNaN(value)) {
              max = Math.max(max, Math.abs(value) / 10000);
            }
          }
        }
      }

      return max === -Infinity ? 0 : max;
    }, [features, selectedCrops]);

    const minValue = -maxAbsValue;
    const maxValue = maxAbsValue;
    const colorScale1 = (t) => interpolateRdYlBu(1 - t);

    const gradientSteps1 = Array.from({ length: 100 }, (_, i) => (
      <div
        key={i}
        style={{
          width: "1%",
          height: "15px",
          backgroundColor: colorScale1(i / 100),
          display: "inline-block",
        }}
      />
    ));

    return (
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 100 }} className="flex w-[280px] flex-col gap-2 rounded-lg">
        <div className="rounded-lg border border-[#d9d9d9] bg-[#fff] px-[8px] py-[8px] pb-[4px]">
          <div className="flex justify-center">{gradientSteps1}</div>
          <div className="flex justify-between px-[2px] text-[14px] text-[#222]">
            <span>{minValue.toFixed(1)}</span>
            <span>0</span>
            <span>{maxValue.toFixed(1)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <VisualizationContainer
      title="월동채소 재배면적 변화"
      tooltip={<InfoTooltip content={infoTooltipContents["월동채소 재배면적 변화"]} />}
      mapContent={
        <BackgroundMap layerManager={layerManager} ready={ready} mapId={MAP_ID} mapOptions={mapOptions}>
          <HibernationVegetableCultivationLegend features={features} selectedCrops={selectedCrops} />
        </BackgroundMap>
      }
      filterContent={
        <FilterContainer>
          <YearSelector targetYear={TARGET_YEAR} selectedTargetYear={selectedTargetYear} setSelectedTargetYear={setSelectedTargetYear} />
          <ButtonGroupSelector title="권역 단위" cols={5} options={regionLevelOptions} selectedValues={selectedLevel} setSelectedValues={setSelectedLevel} />
          <ButtonGroupSelector title="범례" cols={3} options={LEGEND_ITEMS} selectedValues={selectedCrops} setSelectedValues={setSelectedCrops} />
        </FilterContainer>
      }
      chartContent={
        <ChartContainer cols={3} minHeight={500}>
          <CultivationChangeDivergingBarChart chartData={chartData} selectedCrops={selectedCrops} year={selectedTargetYear} viewType={"absolute"} />
          <CultivationChangeDivergingBarChart chartData={chartData} selectedCrops={selectedCrops} year={selectedTargetYear} viewType={"rate"} />
          <CultivationChangeDivergingBarChart chartData={chartData} selectedCrops={selectedCrops} year={selectedTargetYear} viewType={"area"} />
        </ChartContainer>
      }
    />
  );
};

export default HibernationVegetableCultivation;
