import { useEffect, useMemo, useState } from "react";
import visualizationApi from "~/services/apis/visualizationApi";
import { RegionLevels } from "~/services/types/visualizationTypes";
// import useGroundwaterSuitability from "~/features/visualization/hooks/useGroundwaterSuitability";
import { v4 as uuidv4 } from "uuid";
import InfoTooltip from "~/components/InfoTooltip";
import YearlyGroundwaterLineChart, { GroundwaterGroupArr } from "~/features/visualization/components/agriculturalEnvironment/YearlyGroundwaterLineChart";
import ButtonGroupSelector from "~/features/visualization/components/common/ButtonGroupSelector";
import ChartContainer from "~/features/visualization/components/common/ChartContainer";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import VisualizationContainer from "~/features/visualization/components/common/VisualizationContainer";
import YearSelector from "~/features/visualization/components/common/YearSelector";
import { GroundwaterLayer, InnerLayer } from "~/features/visualization/layers/GroundwaterLayer";
import { regionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";
import BackgroundMap from "~/maps/components/BackgroundMap";
import { MapOptions } from "~/maps/constants/mapOptions";
import useSetupOL from "~/maps/hooks/useSetupOL";
import { colorsRed } from "~/utils/gisColors";

const MAP_ID = uuidv4();

const mapOptions: MapOptions = {
  type: "Base",
  layerSwitcher: true,
  mapTypeSwitcher: true,
  roundCorners: true,
};

const TARGET_YEAR = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004];
const STANDARD_YEAR = [5, 4, 3, 2];

const GroundwaterQuality = () => {
  const { layerManager, map, ready } = useSetupOL(MAP_ID, 10.7, "jeju", true, false);

  const [groundwaterGroupData, setGroundwaterGroupData] = useState<GroundwaterGroupArr>();
  // const [selectedVisType, setSelectedVisType] = useState("metrics");
  const [selectedLevel, setSelectedLevel] = useState<RegionLevels | null>("emd");
  const [selectedTargetYear, setSelectedTargetYear] = useState<number>(2023);
  const [selectedStandardYear, setSelectedStandardYear] = useState<number>(10);
  const [selectedMetrics, setSelectedMetrics] = useState<"ph" | "ntrgn" | "chlrn">("ph");

  // useGroundwaterSuitability(layerManager, ready, map);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await visualizationApi.getField(selectedLevel, selectedTargetYear);
        if (!ready || !response) return;
        setGroundwaterGroupData(response);
        const layerWrapper = layerManager.getLayer("mandarinTreeAgeDistribution");
        const existingLayer = layerWrapper?.layer as InnerLayer | undefined;
        if (existingLayer && typeof existingLayer.updateFeatures === "function") {
          existingLayer.updateFeatures(response, selectedMetrics, selectedTargetYear);
        } else {
          GroundwaterLayer.createLayer(response, selectedMetrics, selectedTargetYear).then((layer) => {
            layerManager.addLayer(layer, "mandarinTreeAgeDistribution", 1);
          });
        }
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
      }
    };

    fetchData();
  }, [ready, selectedLevel, selectedTargetYear, selectedMetrics]);

  const filteredRegionLevelOptions = regionLevelOptions.filter((option) => ["do", "city", "emd"].includes(String(option.value)));

  const GroundwaterLegend = ({ features, metric, selectedYear }: { features: any; metric: "ph" | "ntrgn" | "chlrn"; selectedYear: number }) => {
    const { minValue, maxValue } = useMemo(() => {
      const values = features?.features
        ?.map((f) => f?.properties?.stats?.find((s) => s.year === selectedYear)?.[metric])
        .filter((v) => typeof v === "number" && !isNaN(v));

      if (!values || values.length === 0) return { minValue: 0, maxValue: 0 };

      return {
        minValue: Math.min(...values),
        maxValue: Math.max(...values),
      };
    }, [features, metric, selectedYear]);

    const featureCount = features?.features?.length ?? 0;
    const gradientColors = [...colorsRed].reverse().join(", ");

    return (
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 100 }} className="flex w-[280px] flex-col gap-2 rounded-lg">
        <div className="rounded-lg border border-[#d9d9d9] bg-[#fff] px-[8px] py-[8px] pb-[4px]">
          <div
            className="h-[15px] rounded-md"
            style={{
              background:
                featureCount === 1 ? colorsRed[6] : featureCount === 2 ? `linear-gradient(to right, #df3b0d, #fea654)` : `linear-gradient(to right, ${gradientColors})`,
            }}
          />
          <div className="flex justify-between px-[2px] text-[14px] text-[#222]">
            {featureCount === 1 ? (
              <span className="w-full text-center">{minValue.toFixed(2)}</span>
            ) : featureCount === 2 ? (
              <>
                <span>{minValue.toFixed(2)}</span>
                <span>{maxValue.toFixed(2)}</span>
              </>
            ) : (
              <>
                <span>{minValue.toFixed(2)}</span>
                <span>{((minValue + maxValue) / 2).toFixed(2)}</span>
                <span>{maxValue.toFixed(2)}</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <VisualizationContainer
      title="지하수 관정별 수질변화"
      tooltip={
        <InfoTooltip
          title="지하수 관정별 수질변화 모니터링"
          content={`- 지하수 관정 위치 및 주요 지표(NO3-, Cl-) 시각화(현 시점)\n* 농업용수 부적격 시 별도 표시\n- 지역별·요소별 시계열 시각화 및 관정별 정보 리스트화(대시보드)\n※ 데이터: 물정책과(지하수관리시스템, 도내 지하수 수질분석 결과)`}
        />
      }
      mapContent={
        <BackgroundMap layerManager={layerManager} ready={ready} mapId={MAP_ID} mapOptions={mapOptions}>
          <GroundwaterLegend features={groundwaterGroupData} metric={selectedMetrics} selectedYear={selectedTargetYear} />
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
          {/* { <ButtonGroupSelector
            title="시각화 타입"
            options={[
              { label: "성분", value: "metrics" },
              { label: "적합여부", value: "suitability" },
            ]}
            cols={2}
            selectedValues={selectedVisType}
            setSelectedValues={setSelectedVisType}
          /> } */}
          <ButtonGroupSelector title="권역 단위" cols={3} options={filteredRegionLevelOptions} selectedValues={selectedLevel} setSelectedValues={setSelectedLevel} />

          <ButtonGroupSelector
            title="성분 선택"
            options={[
              { value: "ntrgn", label: "질소" },
              { value: "chlrn", label: "염소" },
              { value: "ph", label: "pH" },
            ]}
            selectedValues={selectedMetrics}
            setSelectedValues={setSelectedMetrics}
          />

          {/* <GroundwaterLegend visType={selectedVisType} metric={selectedMetrics} /> */}
        </FilterContainer>
      }
      chartContent={
        <ChartContainer minHeight={410}>
          {/* {["질소", "염소", "ph"].map(            
            (element) => groundwaterData[element] && <YearlyGroundwaterBarChart key={element} element={element} data={groundwaterData[element]} />
          )} */}
          <YearlyGroundwaterLineChart yearlyData={groundwaterGroupData} type={"ntrgn"} />
          <YearlyGroundwaterLineChart yearlyData={groundwaterGroupData} type={"chlrn"} />
          <YearlyGroundwaterLineChart yearlyData={groundwaterGroupData} type={"ph"} />
        </ChartContainer>
      }
    />
  );
};

export default GroundwaterQuality;
