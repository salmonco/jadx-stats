import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import visualizationApi from "~/services/apis/visualizationApi";
import { RegionLevels } from "~/services/types/visualizationTypes";
import VisualizationContainer from "~/features/visualization/components/common/VisualizationContainer";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import ChartContainer from "~/features/visualization/components/common/ChartContainer";
import YearDualSelector from "~/features/visualization/components/common/YearDualSelector";
import ButtonGroupSelector from "~/features/visualization/components/common/ButtonGroupSelector";
import ButtonRowGroupSelector from "~/features/visualization/components/common/ButtonRowGroupSelector";
import GrowthSurveyCompareSpiderChart from "~/features/visualization/components/observation/GrowthSurveyCompareSpiderChart";
import GrowthSurveyCompareBarChart from "~/features/visualization/components/observation/GrowthSurveyCompareBarChart";
import { getFilteredRegionOptions } from "~/features/visualization/utils/regionLevelOptions";
import ExplainContainer from "~/features/visualization/components/common/ExplainContainer";
import { InnerLayer, MandarinGrowthSurveyLayer } from "~/features/visualization/layers/MandarinGrowthSurveyLayer";
import InfoTooltip from "~/components/InfoTooltip";
import BackgroundMap, { MapOptions } from "~/maps/components/BackgroundMap";
import useSetupOL from "~/maps/hooks/useSetupOL";
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

const YEARS = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009];

const GrowthSurveyCompare = () => {
  const { layerManager, ready } = useSetupOL(MAP_ID, 10.5, "jeju", true, false);

  const [selectedLevel, setSelectedLevel] = useState<RegionLevels | null>("emd");
  const [selectedTargetYear, setSelectedTargetYear] = useState<number>(2023);
  const [selectedStandardYear, setSelectedStandardYear] = useState<number>(2022);
  const [selectedCategory, setSelectedCategory] = useState<string>("flower_leaf");
  const [selectedAltitude, setSelectedAltitude] = useState<string | null>(null);

  const { data: features } = useQuery({
    queryKey: ["mandarinGrowthSurveyCompare", selectedLevel, selectedTargetYear, selectedStandardYear, selectedCategory, selectedAltitude],
    queryFn: () => visualizationApi.getMandarinGrowthSurveyCompare(selectedLevel, selectedTargetYear, selectedStandardYear, selectedCategory, selectedAltitude),
  });

  useEffect(() => {
    if (!ready || !features) return;

    const layerWrapper = layerManager.getLayer("mandarinGrowthSurveyCompare");
    const existingLayer = layerWrapper?.layer as InnerLayer | undefined;

    if (existingLayer && typeof existingLayer.updateFeatures === "function") {
      existingLayer.updateFeatures(features);
      existingLayer.updateTargetYear(selectedTargetYear);
      existingLayer.updateAltitude(selectedAltitude);
      existingLayer.updateCategory(selectedCategory);
    } else {
      MandarinGrowthSurveyLayer.createLayer(features, selectedTargetYear, selectedAltitude, selectedCategory).then((layer) => {
        layerManager.addLayer(layer, "mandarinGrowthSurveyCompare", 1);
      });
    }
  }, [ready, features, selectedTargetYear, selectedAltitude, selectedCategory]);

  const QualityAnalysisLegend = ({ features, selectedCategory }) => {
    const keyMap = {
      flower_leaf: "average_flower_leaf_ratio",
      fruit_count: "average_nov_fruit_count",
      width: "average_width",
      brix: "average_brix",
      acidity: "average_acidity",
      brix_ratio: "average_brix_ratio",
    };

    const { minValue, maxValue } = useMemo(() => {
      if (!features || !Array.isArray(features.features)) return { minValue: 0, maxValue: 0 };

      const statKey = keyMap[selectedCategory];
      if (!statKey) return { minValue: 0, maxValue: 0 };

      let min = Infinity;
      let max = -Infinity;

      for (const feature of features.features) {
        const value = feature?.properties?.stats?.change_rate?.[statKey];
        if (typeof value === "number" && !isNaN(value)) {
          min = Math.min(min, value);
          max = Math.max(max, value);
        }
      }

      return {
        minValue: min === Infinity ? 0 : min,
        maxValue: max === -Infinity ? 0 : max,
      };
    }, [features, selectedCategory]);

    const colorScale = (t) => interpolateRdYlBu(1 - t);
    const gradientSteps = Array.from({ length: 100 }, (_, i) => (
      <div
        key={i}
        style={{
          width: "1%",
          height: "15px",
          backgroundColor: colorScale(i / 100),
          display: "inline-block",
        }}
      />
    ));

    return (
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 100 }} className="flex w-[280px] flex-col rounded-lg">
        <div className="rounded-lg border border-[#d9d9d9] bg-[#fff] px-[8px] py-[8px] pb-[4px]">
          <div className="flex justify-center">{gradientSteps}</div>
          <div className="flex justify-between px-[2px] text-[14px] text-[#222]">
            <span>{minValue.toFixed(2)}</span>
            <span>{((minValue + maxValue) / 2).toFixed(2)}</span>
            <span>{maxValue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <VisualizationContainer
      title="감귤 관측조사"
      tooltip={<InfoTooltip content={infoTooltipContents["감귤 관측조사"]} />}
      mapContent={
        <div className="relative h-full w-full">
          <BackgroundMap layerManager={layerManager} ready={ready} mapId={MAP_ID} mapOptions={mapOptions}>
            <QualityAnalysisLegend features={features} selectedCategory={selectedCategory} />
          </BackgroundMap>
        </div>
      }
      filterContent={
        <FilterContainer>
          <YearDualSelector
            targetYear={YEARS}
            standardYear={YEARS.filter((year) => year < selectedTargetYear)}
            selectedTargetYear={selectedTargetYear}
            setSelectedTargetYear={setSelectedTargetYear}
            selectedStandardYear={selectedStandardYear}
            setSelectedStandardYear={setSelectedStandardYear}
          />
          <ButtonGroupSelector
            title="권역 단위"
            cols={4}
            options={getFilteredRegionOptions(["리/동"])}
            selectedValues={selectedLevel}
            setSelectedValues={setSelectedLevel}
          />
          <ButtonGroupSelector
            cols={2}
            title="고도"
            options={[
              { label: "전체", value: null },
              { label: "100m 미만", value: "low" },
              { label: "100m ~ 200m", value: "middle" },
              { label: "200m 이상", value: "high" },
            ]}
            selectedValues={selectedAltitude}
            setSelectedValues={setSelectedAltitude}
          />
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <ButtonRowGroupSelector
                title="1차 조사"
                options={[{ label: "화엽비", value: "flower_leaf" }]}
                selectedValues={selectedCategory}
                setSelectedValues={setSelectedCategory}
              />
            </div>
            <div style={{ flex: 1 }}>
              <ButtonRowGroupSelector
                title="2차 조사"
                options={[
                  { label: "열매수", value: "fruit_count" },
                  { label: "횡경", value: "width" },
                ]}
                selectedValues={selectedCategory}
                setSelectedValues={setSelectedCategory}
              />
            </div>
            <div style={{ flex: 1 }}>
              <ButtonRowGroupSelector
                title="3차 조사"
                options={[
                  { label: "당도", value: "brix" },
                  { label: "산 함량", value: "acidity" },
                  { label: "당산비", value: "brix_ratio" },
                ]}
                selectedValues={selectedCategory}
                setSelectedValues={setSelectedCategory}
              />
            </div>
          </div>
          {(selectedCategory === "flower_leaf" || selectedCategory === "brix_ratio") && <ExplainContainer selectedCategory={selectedCategory} />}
        </FilterContainer>
      }
      chartContent={
        <ChartContainer minHeight={500} cols={2}>
          <GrowthSurveyCompareSpiderChart selectedTargetYear={selectedTargetYear} selectedStandardYear={selectedStandardYear} selectedCategroy={selectedCategory} />
          <GrowthSurveyCompareBarChart selectedTargetYear={selectedTargetYear} selectedStandardYear={selectedStandardYear} selectedCategroy={selectedCategory} />
        </ChartContainer>
      }
    />
  );
};

export default GrowthSurveyCompare;
