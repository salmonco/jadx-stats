import { interpolateYlOrRd } from "d3";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import BaseSelect, { BaseSelectOption } from "~/features/visualization/components/common/BaseSelect";
import ButtonGroupSelector from "~/features/visualization/components/common/ButtonGroupSelector";
import ChartContainer from "~/features/visualization/components/common/ChartContainer";
import TwoDepthSelector, { DepthScrollSelectorOption } from "~/features/visualization/components/common/DepthSelector";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import OneDepthScrollSelector from "~/features/visualization/components/common/OneDepthScrollSelector";
import VisualizationContainer from "~/features/visualization/components/common/VisualizationContainer";
import YearSelector from "~/features/visualization/components/common/YearSelector";
import QualityAnalysisLineChart from "~/features/visualization/components/observation/QualityAnalysisLineChart";
import { InnerLayer, QualityAnalysisRegionLayer } from "~/features/visualization/layers/QualityAnalysisRegionLayer";
import { regionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";
import { Geometry } from "~/maps/classes/interfaces";
import BackgroundMap from "~/maps/components/BackgroundMap";
import { MapOptions } from "~/maps/constants/mapOptions";
import useSetupOL from "~/maps/hooks/useSetupOL";
import { RegionLevels } from "~/maps/services/MapDataService";
import visualizationApi from "~/services/apis/visualizationApi";

const MAP_ID = uuidv4();

const mapOptions: MapOptions = {
  type: "Base",
  layerSwitcher: true,
  mapTypeSwitcher: true,
  roundCorners: true,
};

interface Stats {
  [category: string]: {
    [yearMonth: string]: {
      [key: string]: number;
    };
  };
}

interface QualityAnalysisFeature {
  id: string;
  type: "Feature";
  properties: {
    FID: number;
    id: string;
    lvl: string;
    nm: string;
    rt: number;
    stats: Stats;
    vrbs_nm: string;
  };
  geometry: Geometry;
}

type QualityAnalysisFeatureCollection = QualityAnalysisFeature[];

export interface GroupedQualityAnalysisFeatures {
  [region: string]: QualityAnalysisFeature[];
}

const TARGET_YEAR = [2022, 2021, 2020, 2019, 2018, 2017, 2016]; //해당 데이터는 16년도까지 있음
const STANDARD_YEAR = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

const mandarinVarietyOptions: BaseSelectOption[] = [
  { value: "한라봉", label: "한라봉" },
  { value: "레드향", label: "레드향" },
  { value: "천혜향", label: "천혜향" },
  { value: "조생온주", label: "조생온주" },
  { value: "아스미", label: "아스미" },
  { value: "극조생", label: "극조생" },
  { value: "남진해(캬라향|귤로향)", label: "남진해(캬라향|귤로향)" },
  { value: "윈터프린스", label: "윈터프린스" },
  { value: "황금향", label: "황금향" },
  { value: "기타", label: "기타" },
];

const regionSelectOptions2: DepthScrollSelectorOption[] = [
  { gb: "region", value: "제주", color: "#1f77b4" },
  { gb: "region", value: "동부", color: "#2ca02c" },
  { gb: "region", value: "서귀", color: "#ff7f0e" },
  { gb: "region", value: "서부", color: "#1f77b4" },

  { gb: "emd1", value: "한경", color: "#7f7f7f" },
  { gb: "emd1", value: "한림", color: "#2ca02c" },
  { gb: "emd1", value: "애월", color: "#bcbd22" },
  { gb: "emd1", value: "제주", color: "#1f77b4" },
  { gb: "emd1", value: "조천", color: "#17becf" },
  { gb: "emd1", value: "구좌", color: "#e6194B" },

  { gb: "emd2", value: "대정", color: "#e377c2" },
  { gb: "emd2", value: "안덕", color: "#8c564b" },
  { gb: "emd2", value: "서귀", color: "#ff7f0e" },
  { gb: "emd2", value: "남원", color: "#d62728" },
  { gb: "emd2", value: "표선", color: "#9467bd" },
  { gb: "emd2", value: "성산", color: "#3cb44b" },
];

const QualityAnalysis = () => {
  const { layerManager, ready } = useSetupOL(MAP_ID, 11, "jeju", true, false);

  const [selectedTargetYear, setSelectedTargetYear] = useState<number>(2022);
  const [selectedStandardYear, setSelectedStandardYear] = useState<number>(5);
  const [selectedVariety, setSelectedVariety] = useState<string>("조생온주");
  const [selectedLevel, setSelectedLevel] = useState<RegionLevels | null>("region");
  const [qualityAnalysisResult, setQualityAnalysisResult] = useState<QualityAnalysisFeatureCollection | null>(null);

  const firstOptions: DepthScrollSelectorOption[] = regionSelectOptions2
    .filter((item) => item.gb === "region")
    .map((item) => ({
      gb: "region" as const,
      value: item.value,
      color: item.color,
    }));

  const secondOptions: DepthScrollSelectorOption[] = regionSelectOptions2
    .filter((item) => item.gb === "emd1")
    .map((item) => ({
      gb: "emd1" as const,
      value: item.value,
      color: item.color,
    }));

  const thirdOptions: DepthScrollSelectorOption[] = regionSelectOptions2
    .filter((item) => item.gb === "emd2")
    .map((item) => ({
      gb: "emd2" as const,
      value: item.value,
      color: item.color,
    }));

  const [selected, setSelected] = useState<DepthScrollSelectorOption[]>([
    {
      gb: "region",
      value: "제주",
      color: "#1f77b4",
    },
    {
      gb: "region",
      value: "서귀",
      color: "#ff7f0e",
    },
  ]);

  useEffect(() => {
    if (selectedLevel === "region") {
      setSelected([
        { gb: "region", value: "제주", color: "#1f77b4" },
        { gb: "region", value: "서귀", color: "#ff7f0e" },
      ]);
    } else if (selectedLevel === "emd") {
      setSelected([
        { gb: "emd1", value: "제주", color: "#1f77b4" },
        { gb: "emd2", value: "서귀", color: "#ff7f0e" },
      ]);
    }
  }, [selectedLevel]);

  // 데이터 조회 및 가공 (지역별 그룹)
  useEffect(() => {
    const fetchAndApply = async () => {
      const response = await visualizationApi.getObservationResultByMonth(selectedLevel, selectedTargetYear);
      const newFeatures = response.features;

      setQualityAnalysisResult(newFeatures);

      if (!ready || !newFeatures || newFeatures.length === 0) return;

      const layerWrapper = layerManager.getLayer("qualityAnalysis");
      const existingLayer = layerWrapper?.layer as InnerLayer | undefined;

      if (existingLayer && typeof existingLayer.updateFeatures === "function") {
        existingLayer.updateFeatures(newFeatures);
        existingLayer.updateLevel(selectedLevel);
        existingLayer.updateTargetYear(selectedTargetYear);
        existingLayer.updateVariety(selectedVariety);
      } else {
        QualityAnalysisRegionLayer.createLayer(newFeatures, selectedTargetYear, selectedLevel, selectedVariety).then((layer) => {
          layerManager.addLayer(layer, "qualityAnalysis", 1);
        });
      }
    };

    fetchAndApply();
  }, [selectedTargetYear, selectedLevel, selectedVariety, ready]);

  const groupedFeatures = useMemo(() => {
    if (!qualityAnalysisResult) return {};

    return qualityAnalysisResult.reduce((acc, feature) => {
      const region = feature.properties.vrbs_nm;
      if (!feature.properties.stats[selectedVariety]) return acc;

      if (!acc[region]) {
        acc[region] = [];
      }
      acc[region].push(feature);
      return acc;
    }, {} as GroupedQualityAnalysisFeatures);
  }, [qualityAnalysisResult, selectedVariety]);

  // 품종 옵션 핸들러
  const handleVarietyChange = (value: string) => {
    setSelectedVariety(value);
  };

  const filteredRegionLevelOptions = regionLevelOptions.filter((option) => ["region", "emd"].includes(String(option.value)));

  const QualityAnalysisLegend = () => {
    const colorScale1 = interpolateYlOrRd;

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
            <span>0</span>
            <span>최대값</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <VisualizationContainer
      title="감귤 품질분석 결과 조회"
      mapContent={
        <BackgroundMap layerManager={layerManager} ready={ready} mapId={MAP_ID} mapOptions={mapOptions}>
          <QualityAnalysisLegend />
        </BackgroundMap>
      }
      filterContent={
        <FilterContainer>
          <YearSelector
            targetYear={TARGET_YEAR}
            standardYear={STANDARD_YEAR}
            selectedTargetYear={selectedTargetYear}
            setSelectedTargetYear={setSelectedTargetYear}
            selectedStandardYear={selectedStandardYear}
            setSelectedStandardYear={setSelectedStandardYear}
          />
          <ButtonGroupSelector title="권역 단위" cols={2} options={filteredRegionLevelOptions} selectedValues={selectedLevel} setSelectedValues={setSelectedLevel} />
          {selectedLevel === "emd" ? (
            <TwoDepthSelector<DepthScrollSelectorOption> firstOptions={secondOptions} secondOptions={thirdOptions} selected={selected} onSelect={setSelected} />
          ) : selectedLevel === "region" ? (
            <OneDepthScrollSelector
              title="지역"
              options={firstOptions}
              selectedValues={selected.map((opt) => opt.value)}
              setSelectedValues={(values: string[]) => {
                setSelected(firstOptions.filter((opt) => values.includes(opt.value)));
              }}
              multiSelect={true}
            />
          ) : null}
          <BaseSelect title="품종" options={mandarinVarietyOptions} selectedValue={selectedVariety} onSelect={handleVarietyChange} />
        </FilterContainer>
      }
      chartContent={
        <ChartContainer minHeight={440} cols={3}>
          {["brix", "cdty", "brix_cdty_rt"].map((type) => (
            <QualityAnalysisLineChart
              key={type}
              targetYear={selectedTargetYear}
              standardYear={selectedStandardYear}
              selectedVariety={selectedVariety}
              groupedFeatures={groupedFeatures}
              selectedRegions={selected.map((option) => option.value)}
              regionOptions={regionSelectOptions2}
              metricType={type}
            />
          ))}
        </ChartContainer>
      }
    />
  );
};

export default QualityAnalysis;
