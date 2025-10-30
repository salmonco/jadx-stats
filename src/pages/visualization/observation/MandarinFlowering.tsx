import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import visualizationApi from "~/services/apis/visualizationApi";
import FloweringArea from "~/features/visualization/components/observation/FloweringArea";
// import ElevArea from "~/features/visualization/components/observation/ElevArea";
import FloweringRegionArea from "~/features/visualization/components/observation/FloweringRegionArea";
import FloweringMap from "~/features/visualization/components/observation/FloweringMap";
import { useDateIdx, useHeatmapConfigs } from "~/features/visualization/utils/mandarinFloweringUtils";
import InfoTooltip from "~/components/InfoTooltip";
import GeoJSON from "ol/format/GeoJSON";
import { infoTooltipContents } from "~/utils/InfoTooltipContents";
import { Select, Slider, Switch } from "antd";

interface Bin {
  x0: number;
  x1: number;
  scl_area: number;
  data?: any[];
}

interface RegionStat {
  rgn_nm: string;
  area: number;
}

interface FloweringDay {
  ymd: string;
  altd: Bin[];
  scl_area: number;
  stats: RegionStat[];
}

export interface FloweringChartData {
  data: FloweringDay[];
  ymds: string[];
}

const TARGET_YEARS = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];

const MandarinFlowering = () => {
  const [selectedTargetYear, setSelectedTargetYear] = useState<number>(2023);
  const [selectedStandardYear, setSelectedStandardYear] = useState<number[]>([2022]);
  const [numDates, setNumDates] = useState<number>(16);
  const [currentDate, setCurrentDate] = useState<string>("");

  const { dateIdx, setDateIdx, autoPlay, setAutoPlay } = useDateIdx(numDates);
  const { opacity, setOpacity, blur, setBlur, radius, setRadius } = useHeatmapConfigs();

  const { data: floweringData } = useQuery({
    queryKey: ["flowering/by-year", selectedTargetYear, selectedStandardYear],
    initialData: null,
    queryFn: () => visualizationApi.getMandarinFloweringByYear(selectedTargetYear, selectedStandardYear),
  });

  const chartData: FloweringChartData = useMemo(() => {
    if (!floweringData?.data?.flowering_chart_data) return {};
    return floweringData?.data?.flowering_chart_data;
  }, [floweringData]);

  const xDomain = (chartData?.[selectedTargetYear]?.ymds ?? []).map((ymd) => ymd.slice(5));

  const geoData = useMemo(() => {
    if (!floweringData || !floweringData.data) return [];
    const geoData = floweringData.data.farmfields_with_offset;
    const format = new GeoJSON();
    const readFeatures = format.readFeatures(geoData);
    return readFeatures;
  }, [floweringData]);

  useEffect(() => {
    if (chartData) {
      const minNumDates = Object.values(chartData).reduce((minLength, data: FloweringChartData) => {
        const ymdsLength = data.ymds?.length || Infinity;
        return Math.min(minLength, ymdsLength);
      }, Infinity);

      setDateIdx(0);
      setNumDates(minNumDates);
    }
  }, [chartData, setDateIdx]);

  useEffect(() => {
    if (chartData && chartData[selectedTargetYear]?.ymds) {
      const newDate = chartData[selectedTargetYear]?.ymds[dateIdx].slice(5);
      setCurrentDate(newDate);
    }
  }, [chartData, dateIdx, selectedTargetYear]);

  // 개화율 % 계산
  const getFloweringPercent = (year: number): number => {
    const yearData = chartData?.[year]?.data;
    if (!yearData || !currentDate) return 0;

    const current = yearData.find((d) => d.ymd?.slice(5) === currentDate)?.scl_area ?? 0;
    const total = yearData.at(-1)?.scl_area ?? 1;

    return Math.round((current / total) * 10000) / 100;
  };

  // 개화 시작일, 50% 개화일, 만개일 계산
  const getFloweringMilestones = (year: number) => {
    const yearData = chartData?.[year]?.data;
    if (!yearData || yearData.length === 0) return null;

    const total = yearData.at(-1)?.scl_area ?? 1;

    const startDate = yearData.find((d: FloweringDay) => d.scl_area > 0)?.ymd;

    const halfDate = yearData.reduce((closest: FloweringDay | null, d: FloweringDay) => {
      const percent = d.scl_area / total;
      return Math.abs(percent - 0.5) < Math.abs((closest?.scl_area ?? 0) / total - 0.5) ? d : closest;
    })?.ymd;

    const fullBloomDate = yearData.find((d: FloweringDay) => d.scl_area >= total * 0.9)?.ymd;

    return {
      startDate,
      halfDate,
      fullBloomDate,
    };
  };

  useEffect(() => {
    if (geoData?.length === 0 || !chartData) {
      setDateIdx(0);
      setAutoPlay(false);
      return;
    }
    setAutoPlay(true);
  }, [geoData, chartData, setDateIdx, setAutoPlay]);

  return (
    <div className="h-full min-h-[calc(100vh-71px)] w-full p-5">
      <div className="flex h-full w-full flex-col gap-5 rounded-lg bg-[#37445E] p-5">
        <div className="flex items-center gap-[10px] rounded-lg bg-[#43506E] px-5 py-4">
          <p className="text-2xl font-semibold text-white">감귤 개화기</p>
          <InfoTooltip content={infoTooltipContents["감귤 개화기"]} />
        </div>

        <div className="flex gap-[16px]">
          <div className="flex w-full flex-col justify-around rounded-lg bg-[#43506E] p-[18px] 3xl:flex-row 3xl:justify-start 3xl:gap-[36px]">
            <div className="flex items-center gap-[24px] 3xl:gap-[40px] 3xl:pr-[10px]">
              <div className="flex gap-[10px]">
                <p className="flex flex-shrink-0 items-center text-[18px] font-semibold text-white">기준 연도</p>
                <Select
                  options={TARGET_YEARS.map((year) => ({ value: year, label: year }))}
                  value={selectedTargetYear}
                  onChange={setSelectedTargetYear}
                  className="w-[90px]"
                />
              </div>
              <div className="flex gap-[10px]">
                <p className="flex flex-shrink-0 items-center text-[18px] font-semibold text-white">비교 연도</p>
                <Select
                  options={TARGET_YEARS.filter((year) => year !== selectedTargetYear).map((year) => ({ value: year, label: year }))}
                  value={selectedStandardYear}
                  onChange={setSelectedStandardYear}
                  mode="multiple"
                  className="w-[200px]"
                  maxCount={2}
                />
              </div>
              <div className="flex items-center gap-[10px]">
                <p className="flex-shrink-0 text-[18px] font-semibold text-white">자동 재생</p>
                <Switch checked={autoPlay} onChange={(e) => setAutoPlay(e)} />
              </div>
            </div>
            <div className="flex items-center gap-[12px]">
              <p className="flex-shrink-0 text-[18px] font-semibold text-white">기준일 {currentDate}</p>
              <Slider
                value={dateIdx}
                onChange={(e: number) => setDateIdx(e)}
                min={0}
                max={numDates - 1}
                disabled={geoData.length === 0}
                className="w-[383px]"
                tooltip={{
                  formatter: (value) => chartData?.[selectedTargetYear]?.ymds?.[value] ?? value,
                }}
              />
            </div>
          </div>
          <div className="flex min-w-[500px] flex-col flex-wrap rounded-lg bg-[#43506E] p-[18px]">
            <p className="flex-shrink-0 text-[18px] font-semibold text-white">히트맵 강조 설정</p>
            <div className="flex items-center gap-[10px]">
              <p className="w-[60px] text-[15px] font-semibold text-white">투명도</p>
              <Slider min={0} max={1} step={0.05} disabled={geoData.length === 0} value={opacity} onChange={(x: number) => setOpacity(x)} className="flex-grow" />
            </div>
            <div className="flex items-center gap-[10px]">
              <p className="w-[60px] text-[15px] font-semibold text-white">블러</p>
              <Slider min={0} max={20} disabled={geoData.length === 0} value={blur} onChange={(x: number) => setBlur(x)} className="flex-grow" />
            </div>
            <div className="flex w-full items-center gap-[10px]">
              <p className="w-[60px] text-[15px] font-semibold text-white">반경</p>
              <Slider min={0} max={3} step={0.2} disabled={geoData.length === 0} value={radius} onChange={(x: number) => setRadius(x)} className="flex-grow" />
            </div>
          </div>
        </div>

        {/* 내용 */}
        <div className="flex flex-grow flex-col gap-[18px]">
          {[selectedTargetYear, ...selectedStandardYear]?.map((year, _, array) => (
            <div key={year} className="flex flex-col gap-[12px] rounded-lg bg-[#43506E] p-5">
              {/* 연도 타이틀 */}
              <div className="flex items-center gap-[16px]">
                <p className="text-[20px] font-semibold text-white">{year}년 개화 정보</p>
                <div className="it mt-1 flex gap-[18px] text-sm text-white">
                  <div className="flex items-center gap-[6px]">
                    <div className="text-[18px] text-gray-300">개화 시작일</div>
                    <div className="text-[20px] font-semibold">{getFloweringMilestones(year)?.startDate?.slice(5)}</div>
                  </div>
                  <div className="flex items-center gap-[6px]">
                    <div className="text-[18px] text-gray-300">50% 개화일</div>
                    <div className="text-[20px] font-semibold">{getFloweringMilestones(year)?.halfDate?.slice(5)}</div>
                  </div>
                  <div className="flex items-center gap-[6px]">
                    <div className="text-[18px] text-gray-300">만개일</div>
                    <div className="text-[20px] font-semibold">{getFloweringMilestones(year)?.fullBloomDate?.slice(5)}</div>
                  </div>
                </div>
              </div>
              {/* 실제 내용 영역 */}
              <div className="flex min-h-[320px] gap-[28px] rounded-lg 3xl:min-h-[400px]" style={{ flexBasis: `${100 / Math.min(array.length, 3)}%` }}>
                <FloweringMap
                  year={year}
                  geoData={geoData}
                  blur={blur}
                  radius={radius}
                  opacity={opacity}
                  currentDate={currentDate}
                  floweringPercent={getFloweringPercent(year)}
                />
                <FloweringArea year={year} chartData={chartData[year]} xDomain={xDomain} dataIdx={dateIdx} numDates={numDates} />
                {/* <ElevArea year={year} chartData={chartData[year]} dataIdx={dateIdx} numDates={numDates} /> */}
                <FloweringRegionArea year={year} chartData={chartData[year]} xDomain={xDomain} dataIdx={dateIdx} numDates={numDates} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MandarinFlowering;
