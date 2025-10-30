import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import visualizationApi from "~/services/apis/visualizationApi";
import WeatherAndQualityGraph from "~/features/visualization/components/agriculturalEnvironment/WeatherAndQualityGraph";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import VisualizationContainer from "~/features/visualization/components/common/VisualizationContainer";
import YearSelector from "~/features/visualization/components/common/YearSelector";
import OneDepthScrollSelector from "~/features/visualization/components/common/OneDepthScrollSelector";
import ButtonGroupSelector from "~/features/visualization/components/common/ButtonGroupSelector";
import ButtonRowGroupSelector from "~/features/visualization/components/common/ButtonRowGroupSelector";
import { regionKeysByLevel } from "~/utils/townList";
import * as d3 from "d3";
import { message } from "antd";

const baseUrl = import.meta.env.VITE_API_URL;

const WeatherVariableAnalysis = () => {
  const [year, setYear] = useState(2023);
  const [referenceYears, setReferenceYears] = useState(5);
  const [standardYear, setSelectedStandardYear] = useState(2019);
  const [region, setRegion] = useState<string>("제주");
  const [selectedObservationType, setSelectedObservationType] = useState<"brix" | "cdty" | "brix_cdty_rt" | "count" | "size" | "flower_leaf">("brix_cdty_rt");
  const [selectedWeatherType, setSelectedWeatherType] = useState<"temp" | "rain" | "sun">("temp");
  const [selectedChartTypes, setSelectedChartTypes] = useState<string[]>(["average"]);
  const [changeRate, setChangeRate] = useState<number>(0); // 변화율(혹은 변화량)을 저장할 State
  const [isChangeRateOpen, setIsChangeRateOpen] = useState<boolean>(false);

  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [qualityData, setQualityData] = useState<any[]>([]);
  const [growthData, setGrowthData] = useState<any[]>([]);

  const [selectedLevel, setSelectedLevel] = useState<"jeju" | "seogwi">("jeju");

  useEffect(() => {
    // "changeRate" 옵션이 선택된 경우에만 변화율 계산 로직을 열어둠
    if (selectedChartTypes.includes("changeRate")) {
      setIsChangeRateOpen(true);
    } else {
      setIsChangeRateOpen(false);
      setChangeRate(0); // 혹은 필요하다면 초기화
    }
  }, [selectedChartTypes]);

  // selectedChartTypes에 average는 항상 포함
  useEffect(() => {
    if (!selectedChartTypes.includes("average")) {
      setSelectedChartTypes([...selectedChartTypes, "average"]);
    }
  }, [selectedChartTypes]);

  useEffect(() => {
    setSelectedStandardYear(year - referenceYears);
  }, [year]);

  // flower_leaf 화엽비 데이터
  const { data: flowerleafData } = useQuery({
    queryKey: ["mandarinGrowthSurveySpiderChartData", year, referenceYears, "flower_leaf"],
    queryFn: async () => {
      const MIN_YEAR = 2008;
      const yearFrom = Math.max(year - referenceYears + 1, MIN_YEAR);
      const fetchList = [];

      for (let i = yearFrom; i <= year; i++) {
        const standardYear = Math.max(i - referenceYears, MIN_YEAR); // 기준년도도 2007보다 작아지지 않게
        fetchList.push(visualizationApi.getMandarinGrowthSurveyCompare("emd", i, standardYear, "flower_leaf", null));
      }

      const results = await Promise.all(fetchList);
      const allProperties = results.flatMap((res) => res.features?.map((feature: any) => feature.properties) ?? []);

      return allProperties;
    },
  });

  useEffect(() => {
    fetchAndReadMonthFeatures(year, flowerleafData);
  }, [year, referenceYears, flowerleafData]);

  const fetchAndReadMonthFeatures = async (year: number, charData: any) => {
    try {
      const yearFrom = year - referenceYears + 1;
      const tmpWeatherData: any[] = [];
      const tmpQualityData: any[] = [];
      const tmpGrowthData: any[] = [];

      for (let i = yearFrom; i <= year; i++) {
        const res = await fetch(`${baseUrl}/api/stats/v0/visualize/frt-weather/by-year?target_year=${i}`);
        const data: { files: any } = await res.json();
        const allData = data.files;
        if (!allData) continue;

        // (A) 날씨
        if (allData.cifru_obsrvn_wethr && allData.cifru_obsrvn_wethr.length > 0) {
          const flattened = allData.cifru_obsrvn_wethr.flatMap((item: any) => {
            if (!item.data) return [];
            return item.data.flatMap((sub: any) => {
              if (!sub.data) return [];
              const weatherObj = sub.data;
              return [
                {
                  ...weatherObj,
                  yr: sub.yr,
                  rgn_nm: item.rgn_nm, // 지역 명
                },
              ];
            });
          });
          tmpWeatherData.push(...flattened);
        }

        // (B) 품질(브릭스 등)
        if (allData.wethr_brix_cdty_rt && allData.wethr_brix_cdty_rt.length > 0) {
          const flattened = allData.wethr_brix_cdty_rt.flatMap((item: any) => {
            if (!item.data) return [];
            return item.data.flatMap((sub: any) => {
              if (!sub.data) return [];
              return sub.data.map((qualityObj: any) => ({
                ...qualityObj,
                yr: sub.yr,
                rgn_nm: item.rgn_nm,
              }));
            });
          });
          tmpQualityData.push(...flattened);
        }

        // (C) 생육(열매수, 과일 크기 등)
        if (allData.wethr_frc_frt_sz && allData.wethr_frc_frt_sz.length > 0) {
          const flattened = allData.wethr_frc_frt_sz.flatMap((item: any) => {
            if (!item.data) return [];
            return item.data.flatMap((sub: any) => {
              if (!sub.data) return [];
              return sub.data.map((growthObj: any) => ({
                ...growthObj,
                yr: sub.yr,
                rgn_nm: item.rgn_nm,
              }));
            });
          });
          tmpGrowthData.push(...flattened);
        }
      }

      setWeatherData(tmpWeatherData);
      setQualityData(tmpQualityData);
      setGrowthData(tmpGrowthData);

      if (tmpWeatherData.length === 0 && tmpQualityData.length === 0 && tmpGrowthData.length === 0) {
        message.warning("선택한 기간 동안 데이터를 찾을 수 없습니다.");
      }
    } catch (error) {
      message.error("데이터를 불러오는 중 오류가 발생했습니다.");
      console.error("데이터 불러오기 오류:", error);
    }
  };

  // 지역으로 필터링된 날씨 데이터
  const filteredWeatherData = useMemo(() => {
    return weatherData.filter((w) => w.rgn_nm === region);
  }, [weatherData, region]);

  // 관측(브릭스, 열매수, 횡경 등) 데이터
  const observationData = useMemo(() => {
    if (selectedObservationType === "brix") {
      // 브릭스 당도
      if (!qualityData || qualityData.length === 0) return [];
      const regionQualityData = qualityData.filter((q) => q.rgn_nm === region);
      // 연도별 그룹
      const grouped = d3.group(regionQualityData, (d) => d.yr);
      return Array.from(grouped, ([yr, arr]) => {
        const avgVal = d3.mean(arr, (d: any) => d.brix ?? 0);
        return { yr, value: avgVal ?? 0 };
      });
    } else if (selectedObservationType === "cdty") {
      // 산도
      if (!qualityData || qualityData.length === 0) return [];
      const regionQualityData = qualityData.filter((q) => q.rgn_nm === region);
      // 연도별 그룹
      const grouped = d3.group(regionQualityData, (d) => d.yr);
      return Array.from(grouped, ([yr, arr]) => {
        const avgVal = d3.mean(arr, (d: any) => d.cdty ?? 0);
        return { yr, value: avgVal ?? 0 };
      });
    } else if (selectedObservationType === "brix_cdty_rt") {
      // 산도
      if (!qualityData || qualityData.length === 0) return [];
      const regionQualityData = qualityData.filter((q) => q.rgn_nm === region);
      // 연도별 그룹
      const grouped = d3.group(regionQualityData, (d) => d.yr);
      return Array.from(grouped, ([yr, arr]) => {
        const avgVal = d3.mean(arr, (d: any) => d.brix_cdty_rt ?? 0);
        return { yr, value: avgVal ?? 0 };
      });
    } else if (selectedObservationType === "count") {
      // 열매수
      if (!growthData || growthData.length === 0) return [];
      const regionGrowthData = growthData.filter((g) => g.rgn_nm === region);
      const grouped = d3.group(regionGrowthData, (d) => d.yr);
      return Array.from(grouped, ([yr, arr]) => {
        const avgVal = d3.mean(arr, (d: any) => d.aug_frc ?? 0);
        return { yr, value: avgVal ?? 0 };
      });
    } else if (selectedObservationType === "flower_leaf") {
      // 화엽비
      if (!flowerleafData || flowerleafData.length === 0) return [];
      const regionGrowthData = flowerleafData.filter((g) => g.vrbs_nm === region);
      const yearValuePairs: { yr: number; value: number; rgn_nm: string }[] = [];

      regionGrowthData.forEach((item) => {
        Object.entries(item.stats).forEach(([key, val]: [string, any]) => {
          const year = Number(key);
          if (isNaN(year)) return;

          yearValuePairs.push({
            yr: year,
            value: val.average_flower_leaf_ratio ?? 0,
            rgn_nm: item.vrbs_nm,
          });
        });
      });
      const grouped = d3.group(yearValuePairs, (d) => d.yr);
      const result = Array.from(grouped, ([yr, arr]) => {
        const avgVal = d3.mean(arr, (d) => d.value ?? 0);
        return { yr, value: avgVal ?? 0 };
      });

      const sorted = result.sort((a, b) => a.yr - b.yr);
      return sorted;
    } else {
      // 횡경
      const regionGrowthData = growthData.filter((g) => g.rgn_nm === region);
      const grouped = d3.group(regionGrowthData, (d) => d.yr);
      return Array.from(grouped, ([yr, arr]) => {
        const avgVal = d3.mean(arr, (d: any) => d.aug_frt_sz ?? 0);
        return { yr, value: avgVal ?? 0 };
      });
    }
  }, [selectedObservationType, qualityData, growthData, region]);

  // 변화율 계산 로직 (예: 2023 대비 2025 변화량)
  const changeRateInfo = useMemo(() => {
    if (!isChangeRateOpen || filteredWeatherData.length === 0 || observationData.length === 0) {
      return null;
    }

    const earliestYear = year - referenceYears + 1; // 예: 2023
    const latestYear = year; // 예: 2025

    // (1) 날씨 데이터 중 선택된 weatherType에 해당하는 필드를 사용해야 함.
    //     weatherData는 구조가 어떻게 되어 있는지 확인 후 적절히 필드명 매핑 필요
    //     예: temp -> weatherObj.temp, rain -> weatherObj.rain, sun -> weatherObj.sun
    //     실제 데이터 구조에 맞게 변경하세요.
    const getWeatherValue = (d: any) => {
      // 실제 데이터의 key에 맞게 조정 필요
      if (selectedWeatherType === "temp") return d.temp ?? 0;
      if (selectedWeatherType === "rain") return d.rain ?? 0;
      if (selectedWeatherType === "sun") return d.sun ?? 0;
      return 0;
    };

    // earliestYear 필터
    const earliestWeatherList = filteredWeatherData.filter((d) => d.yr === earliestYear && d.rgn_nm === region);
    // latestYear 필터
    const latestWeatherList = filteredWeatherData.filter((d) => d.yr === latestYear && d.rgn_nm === region);

    const earliestWeatherAvg = d3.mean(earliestWeatherList, getWeatherValue) ?? 0;
    const latestWeatherAvg = d3.mean(latestWeatherList, getWeatherValue) ?? 0;

    // (2) 관측 데이터 (brix, count, size)에 따른 key 매핑
    const getObservationValue = (d: any) => d.value ?? 0;
    // 이미 observationData는 { yr, value } 형태로 정제되어 있으므로
    // 위처럼 하면 됩니다.

    const earliestObs = observationData.find((o) => o.yr === earliestYear);
    const latestObs = observationData.find((o) => o.yr === latestYear);

    const earliestObsValue = earliestObs ? getObservationValue(earliestObs) : 0;
    const latestObsValue = latestObs ? getObservationValue(latestObs) : 0;

    // (3) 변화량 or 변화율 계산
    // 여기서는 단순한 "차이(최신 - 과거)"만 예시로 듭니다.
    // 필요하다면 아래처럼 비율(%)로 계산할 수도 있음
    // let weatherChangeRate = 0;
    // if (earliestWeatherAvg !== 0) {
    //   weatherChangeRate = ((latestWeatherAvg - earliestWeatherAvg) / earliestWeatherAvg) * 100;
    // }

    const weatherDiff = latestWeatherAvg - earliestWeatherAvg;
    const observationDiff = latestObsValue - earliestObsValue;

    // 필요하다면 setChangeRate(...)를 여기서 실행해도 되고,
    // 혹은 useMemo로 반환한 뒤 컴포넌트 내에서 적절히 표시할 수도 있습니다.
    return {
      earliestYear,
      latestYear,
      earliestWeatherAvg,
      latestWeatherAvg,
      weatherDiff,
      earliestObsValue,
      latestObsValue,
      observationDiff,
    };
  }, [isChangeRateOpen, filteredWeatherData, observationData, region, selectedWeatherType, year, referenceYears]);

  // changeRateInfo가 갱신될 때마다 state에 변화를 저장하고 싶다면
  useEffect(() => {
    if (changeRateInfo) {
      // 예: "날씨 차이(온도, etc)"만 changeRate로 저장한다고 가정
      setChangeRate(changeRateInfo.weatherDiff);
    }
  }, [changeRateInfo]);

  const title = useMemo(() => {
    if (selectedObservationType === "brix_cdty_rt") {
      return `${region} 지역 당산비 데이터`;
    } else if (selectedObservationType === "brix") {
      return `${region} 지역 당도 데이터`;
    } else if (selectedObservationType === "cdty") {
      return `${region} 지역 산도 데이터`;
    } else if (selectedObservationType === "count") {
      return `${region} 지역 열매수 데이터`;
    } else if (selectedObservationType === "flower_leaf") {
      return `${region} 지역 화엽비 데이터`;
    } else {
      return `${region} 지역 횡경 데이터`;
    }
  }, [region, selectedObservationType]);

  const WEATHER_TYPES = [
    { type: "temp", label: "온도" },
    { type: "rain", label: "강수" },
    { type: "sun", label: "일조" },
  ] as const;

  const regionOptions = useMemo(() => {
    return (regionKeysByLevel[selectedLevel] || []).map((key) => ({ value: key }));
  }, [selectedLevel]);

  return (
    <VisualizationContainer
      title="노지감귤 생육과 기상 변수 연계 분석"
      mapContent={
        <WeatherAndQualityGraph
          weatherData={filteredWeatherData}
          observationData={observationData}
          selectedWeatherType={selectedWeatherType}
          selectedObservationType={selectedObservationType}
          year={year}
          referenceYears={referenceYears}
          changeRate={changeRate} // 변화량(혹은 변화율)을 그래프에 넘길 수도 있음
          isChangeRateOpen={isChangeRateOpen}
          title={title}
        />
      }
      filterContent={
        <FilterContainer>
          <YearSelector
            // targetYear={[2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]}
            targetYear={[2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]}
            standardYear={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            selectedTargetYear={year}
            setSelectedTargetYear={setYear}
            selectedStandardYear={referenceYears}
            setSelectedStandardYear={setReferenceYears}
          />
          <ButtonGroupSelector
            title="권역 단위"
            cols={2}
            options={[
              { label: "제주시", value: "jeju" },
              { label: "서귀포시", value: "seogwi" },
            ]}
            selectedValues={selectedLevel}
            setSelectedValues={setSelectedLevel}
          />
          <OneDepthScrollSelector options={regionOptions} title="지역" selectedValues={region} setSelectedValues={setRegion} />
          {/* <TwoDepthScrollSelector
            options={pummokVarietyMap}
            title="품종/품목"
            multiSelectSecond={false}
            selectedFirst={selectedPummok}
            selectedSecond={selectedVariety}
            onFirstSelect={setSelectedPummok}
            onSecondSelect={setSelectedVariety}
          /> */}
          {/* <ButtonGroupSelector
            options={[
              { label: "당/산도", value: "brix" },
              { label: "열매수", value: "count" },
              { label: "횡경", value: "size" },
            ]}
            title="생육 정보"
            selectedValues={selectedObservationType}
            setSelectedValues={setSelectedObservationType}
          /> */}
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <ButtonRowGroupSelector
                title="1차 조사"
                options={[{ label: "화엽비", value: "flower_leaf" }]}
                selectedValues={selectedObservationType}
                setSelectedValues={setSelectedObservationType}
              />
            </div>
            <div style={{ flex: 1 }}>
              <ButtonRowGroupSelector
                title="2차 조사"
                options={[
                  { label: "열매수", value: "count" },
                  { label: "횡경", value: "size" },
                ]}
                selectedValues={selectedObservationType}
                setSelectedValues={setSelectedObservationType}
              />
            </div>
            <div style={{ flex: 1 }}>
              <ButtonRowGroupSelector
                title="3차 조사"
                options={[
                  { label: "당도", value: "brix" },
                  { label: "산도", value: "cdty" },
                  { label: "당산비", value: "brix_cdty_rt" },
                ]}
                selectedValues={selectedObservationType}
                setSelectedValues={setSelectedObservationType}
              />
            </div>
          </div>
          <ButtonGroupSelector
            title="기상 정보"
            options={[
              { label: "온도", value: "temp" },
              { label: "강수", value: "rain" },
              { label: "일조", value: "sun" },
            ]}
            selectedValues={selectedWeatherType}
            setSelectedValues={setSelectedWeatherType}
          />
          {/* <ButtonGroupSelector
            title="표기 항목"
            options={[
              { label: "평균", value: "average" },
              { label: "증감률", value: "changeRate" },
            ]}
            cols={2}
            selectedValues={selectedChartTypes}
            setSelectedValues={setSelectedChartTypes}
            multiSelect={true}
          /> */}
        </FilterContainer>
      }
      chartContent={
        null
        // <ChartContainer minHeight={360}>
        //   {WEATHER_TYPES.map(({ type, label }) => (
        //     <WeatherAndQualityGraph
        //       key={type}
        //       weatherData={filteredWeatherData}
        //       observationData={observationData}
        //       selectedWeatherType={type}
        //       selectedObservationType={selectedObservationType}
        //       year={year}
        //       referenceYears={referenceYears}
        //       title={`${label} (${region})`}
        //     />
        //   ))}
        // </ChartContainer>
      }
    />
  );
};

export default WeatherVariableAnalysis;
