import { useEffect, useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import useDisasterLayer from "~/features/visualization/hooks/useDisasterLayer";
import VisualizationContainer from "~/features/visualization/components/common/VisualizationContainer";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import ChartContainer from "~/features/visualization/components/common/ChartContainer";
import DisasterChart from "~/features/visualization/components/agriculturalEnvironment/DisasterChart";
import BaseLegend from "~/features/visualization/components/common/BaseLegend";
import YearSelector from "~/features/visualization/components/common/YearSelector";
import ButtonGroupSelector from "~/features/visualization/components/common/ButtonGroupSelector";
import InfoTooltip from "~/components/InfoTooltip";
import { cropColorScale, getCropLegendItems, hexToRgb } from "~/utils/gitUtils";
import useSetupOL from "~/maps/hooks/useSetupOL";
import BackgroundMap, { MapOptions } from "~/maps/components/BackgroundMap";
import { Feature } from "ol";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Fill, Stroke } from "ol/style";
import { Slider } from "antd";
import { v4 as uuidv4 } from "uuid";

const MAP_ID = uuidv4();
const baseUrl = import.meta.env.VITE_API_URL;
const mapOptions: MapOptions = {
  layerSwitcher: true,
  mapTypeSwitcher: true,
  roundCorners: true,
};

const TARGET_YEAR = [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
const STANDARD_YEAR = [1, 2, 3, 4, 5];

const mapValue = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

const fetchAndReadMonthFeatures = async (year: number, month: number) => {
  try {
    const disasterDataJson_ = await fetch(`${baseUrl}/api/stats/v0/visualize/ltlnd_dstdmg_dam?year=${year}&month=${month}`);
    const disasterData = await disasterDataJson_.json();
    if (disasterData.length === 0) {
      return [];
    }
    return new GeoJSON({ dataProjection: "EPSG:4326", featureProjection: "EPSG:3857" }).readFeatures(disasterData);
  } catch (error) {
    console.error("Error fetching GeoJSON data:", error);
    return [];
  }
};

const fetchMonthFeatures = async ({ queryKey }) => {
  const [_, { yearRange, monthRange }] = queryKey;
  const { from, to } = yearRange;
  const [startMonth, endMonth] = monthRange;

  const fetchPromises = [];

  for (let year = from; year <= to; year++) {
    for (let month = startMonth; month <= endMonth; month++) {
      fetchPromises.push(fetchAndReadMonthFeatures(year, month));
    }
  }

  const allFeaturesArray = await Promise.all(fetchPromises);
  const allData = allFeaturesArray.flat();

  return allData;
};

const fetchFiveYearsFeatures = async ({ queryKey }) => {
  const [_, { yearToday, disasterType }] = queryKey;

  const fetchPromises = [];
  for (let i = 0; i < 5; i++) {
    const targetYear = yearToday - i;
    for (let month = 1; month <= 12; month++) {
      fetchPromises.push(fetchAndReadMonthFeatures(targetYear, month));
    }
  }
  const allFeaturesArray = await Promise.all(fetchPromises);
  return allFeaturesArray.flat();
};

// 작물 정보 유지
const fetchCropData = async () => {
  try {
    const resp = await fetch(`${baseUrl}/api/stats/v0/visualize/crop/hexagons`);
    const response = await resp.json();
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

const DisasterInfo = () => {
  const { layerManager, map, ready } = useSetupOL(MAP_ID, 10.7, "jeju", true, false);
  const [sliderValue, setSliderValue] = useState(20);
  const [disasterType, setDisasterType] = useState<"rain" | "cold" | "wind">("rain");
  const [monthRange, setMonthRange] = useState<number[]>([1, 12]);
  const [year, setYear] = useState<number>(2025);
  const [referenceYears, setReferenceYears] = useState<number>(2);
  const [yearRange, setYearRange] = useState({ from: 2024, to: 2025 });
  const [selectedVis, setSelectedVis] = useState<"cluster" | "heatmap">("cluster");
  const [opacity, setOpacity] = useState<number>(0.8);
  const [blur, setBlur] = useState<number>(15);
  const [radius, setRadius] = useState<number>(2);

  const [disasterData, setDisasterData] = useState<Feature[]>([]);
  const [rain, setRain] = useState<Feature[]>([]);
  const [wind, setWind] = useState<Feature[]>([]);
  const [cold, setCold] = useState<Feature[]>([]);
  const [rainForFiveYears, setRainForFiveYears] = useState<Feature[]>([]);
  const [windForFiveYears, setWindForFiveYears] = useState<Feature[]>([]);
  const [coldForFiveYears, setColdForFiveYears] = useState<Feature[]>([]);

  const distance = useMemo(() => Math.round(mapValue(sliderValue, 0, 100, 50, 200)), [sliderValue]);
  const settings = useMemo(() => ({ distance, opacity, blur, radius, selectedVis }), [sliderValue, opacity, blur, radius, selectedVis]);

  const yearToday = new Date().getFullYear();

  const { data: disasterDataRaw, refetch: refetchDisasterData } = useQuery({
    queryKey: ["disaster-data/month", { yearRange, monthRange, year }],
    queryFn: fetchMonthFeatures,
    enabled: !!ready && monthRange.length > 0,
    staleTime: 60 * 60 * 1000,
  });

  const {
    isLoading: fiveYearsDataLoading,
    data: fiveYearsDataRaw,
    refetch: refetchFiveYearsData,
  } = useQuery({
    queryKey: ["disaster-data/five-years", { yearToday, disasterType }],
    queryFn: fetchFiveYearsFeatures,
    enabled: false,
    staleTime: 60 * 60 * 1000,
  });

  const { data: cropData } = useQuery({
    queryKey: ["DevMap2/crop-data"],
    queryFn: fetchCropData,
    enabled: ready,
  });

  useEffect(() => {
    if (ready) {
      refetchFiveYearsData();
    }
  }, [ready]);

  useEffect(() => {
    if (fiveYearsDataRaw) {
      const rain_ = fiveYearsDataRaw.filter((feature) => feature.get("dstr_type") === "호우");
      const wind_ = fiveYearsDataRaw.filter((feature) => feature.get("dstr_type") === "강풍");
      const cold_ = fiveYearsDataRaw.filter((feature) => feature.get("dstr_type") === "한파" || feature.get("dstr_type") === "대설");

      setRainForFiveYears(rain_);
      setWindForFiveYears(wind_);
      setColdForFiveYears(cold_);
    }
  }, [fiveYearsDataRaw]);

  // `year` 변경 시 `yearRange` 업데이트 및 데이터 다시 호출
  useEffect(() => {
    const updatedRange = { from: year - (referenceYears - 1), to: year };
    setYearRange(updatedRange);
  }, [year, referenceYears]);

  // `yearRange` 또는 다른 의존성이 변경될 때 데이터 다시 호출
  useEffect(() => {
    if (ready) {
      refetchDisasterData();
    }
  }, [yearRange, monthRange, ready, refetchDisasterData]);

  // 재해 데이터를 분류하여 상태 업데이트
  useEffect(() => {
    if (disasterDataRaw) {
      const rain_ = disasterDataRaw.filter((feature) => feature.get("dstr_type") === "호우");
      setRain(rain_);
      const wind_ = disasterDataRaw.filter((feature) => feature.get("dstr_type") === "강풍");
      setWind(wind_);
      const cold_ = disasterDataRaw.filter((feature) => feature.get("dstr_type") === "한파" || feature.get("dstr_type") === "대설");
      setCold(cold_);
    }
  }, [disasterDataRaw]);

  useEffect(() => {
    if (disasterType === "rain") {
      setDisasterData(rain);
    } else if (disasterType === "wind") {
      setDisasterData(wind);
    } else {
      setDisasterData(cold);
    }
  }, [disasterType, rain, wind, cold]);

  // 지도에 재해 레이어 추가
  useDisasterLayer(layerManager, ready, disasterData, settings, disasterType);

  const cropStyleFunc = useCallback(
    (feature: Feature) => {
      const pummok = feature.get("top_pummok");
      const col = cropColorScale(pummok);
      const [r, g, b] = hexToRgb(col);
      return new Style({
        fill: new Fill({ color: `rgba(${r}, ${g}, ${b}, 0.65)` }),
        stroke: new Stroke({ color: "rgba(0, 0, 0, 0.2)", width: 1 }),
      });
    },
    [opacity]
  );

  useEffect(() => {
    if (ready && map && cropData) {
      const cropFeatures = new GeoJSON().readFeatures(cropData);
      layerManager.addOrReplaceLayer("작물정보", cropFeatures, { style: cropStyleFunc });
    }
  }, [ready, map, cropData, cropStyleFunc, layerManager]);

  const legendItems = getCropLegendItems();

  return (
    <VisualizationContainer
      title="농업재해 발생정보"
      tooltip={<InfoTooltip title="농업재해 발생정보" content="..." />}
      mapContent={<BackgroundMap layerManager={layerManager} ready={ready} mapId={MAP_ID} mapOptions={mapOptions} />}
      filterContent={
        <FilterContainer>
          <YearSelector
            targetYear={TARGET_YEAR}
            standardYear={STANDARD_YEAR}
            selectedTargetYear={year}
            setSelectedTargetYear={setYear}
            selectedStandardYear={referenceYears}
            setSelectedStandardYear={setReferenceYears}
          />
          {/* <MonthSlider
            onChange={([start, end]) => {
              setMonthRange([start, end]);
            }}
          /> */}
          <ButtonGroupSelector
            title="재해 유형"
            cols={3}
            options={[
              { label: "호우", value: "rain" },
              { label: "강풍", value: "wind" },
              { label: "한파/대설", value: "cold" },
            ]}
            selectedValues={disasterType}
            setSelectedValues={setDisasterType}
          />
          <ButtonGroupSelector
            title="시각화 종류"
            cols={2}
            options={[
              { label: "히트맵", value: "heatmap" },
              { label: "클러스터", value: "cluster" },
            ]}
            selectedValues={selectedVis}
            setSelectedValues={setSelectedVis}
          />
          {selectedVis === "cluster" && (
            <div className="flex flex-col rounded-lg bg-[#43516D] p-5">
              <p className="flex-shrink-0 text-[18px] font-semibold text-white">중첩반경</p>
              <Slider value={sliderValue} onChange={(x: number) => setSliderValue(x)} />
            </div>
          )}
          {selectedVis === "heatmap" && (
            <div className="flex flex-col rounded-lg bg-[#43516D] p-5">
              <p className="flex-shrink-0 text-[18px] font-semibold text-white">투명도</p>
              <Slider min={0} max={1} step={0.05} value={opacity} onChange={(x: number) => setOpacity(x)} />
              <p className="flex-shrink-0 text-[18px] font-semibold text-white">블러</p>
              <Slider min={0} max={50} value={blur} onChange={(x: number) => setBlur(x)} />
              <p className="flex-shrink-0 text-[18px] font-semibold text-white">반경</p>
              <Slider min={0} max={10} step={0.2} value={radius} onChange={(x: number) => setRadius(x)} />
            </div>
          )}
          <BaseLegend title="범례" items={legendItems} direction="horizontal" itemsPerRow={3} />
        </FilterContainer>
      }
      chartContent={
        <ChartContainer minHeight={360}>
          <DisasterChart data={rainForFiveYears} title="호우" year={yearToday} fiveYearsDataLoading={fiveYearsDataLoading} />
          <DisasterChart data={windForFiveYears} title="강풍" year={yearToday} fiveYearsDataLoading={fiveYearsDataLoading} />
          <DisasterChart data={coldForFiveYears} title="한파/대설" year={yearToday} fiveYearsDataLoading={fiveYearsDataLoading} />
        </ChartContainer>
      }
    />
  );
};

export default DisasterInfo;
