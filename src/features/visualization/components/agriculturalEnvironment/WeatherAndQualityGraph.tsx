import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import * as Plot from "@observablehq/plot";

interface Weather {
  yr: number;
  avg_tp: number | null;
  acml_rn: number | null;
  acml_sl: number | null;
}

interface Observation {
  yr: number;
  value: number;
}

interface Props {
  weatherData: Weather[];
  observationData: Observation[];
  selectedWeatherType: "temp" | "rain" | "sun";
  selectedObservationType: "brix_cdty_rt" | "brix"| "cdty" | "count" | "size" | "flower_leaf";
  year: number;
  referenceYears: number;
  changeRate?: number;
  isChangeRateOpen?: boolean;
  title: string;
}

const WeatherAndQualityGraph: React.FC<Props> = ({
  weatherData,
  observationData,
  selectedWeatherType,
  selectedObservationType,
  year,
  referenceYears,
  isChangeRateOpen,
  title,
}) => {
  const plotRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  // 막대(관측) 색상 / 선(날씨) 색상
  const [barColor, setBarColor] = useState("#848FA5");
  const [lineColor, setLineColor] = useState("#7CFFD3");

  // 그래프 사이즈, 색상 세팅
  useEffect(() => {
    // 차트 컨테이너 크기 저장
    if (plotRef.current) {
      const w = plotRef.current.clientWidth;
      const h = plotRef.current.clientHeight;
      if (w > 0 && h > 0) {
        setContainerSize({ width: w, height: h });
      }
    }

    // 날씨 타입에 따른 선 색상
    if (selectedWeatherType === "temp") {
      setLineColor("#FF6A6A");
    } else if (selectedWeatherType === "rain") {
      setLineColor("#40C4FF");
    } else {
      setLineColor("#FFD700");
    }

    // 관측(브릭스/열매수/횡경)에 따른 막대 색상
    // if (selectedObservationType === "brix") {
    //   setBarColor("#848FA5");
    // } else if (selectedObservationType === "count") {
    //   setBarColor("#848FA5");
    // } else {
    //   setBarColor("#848FA5");
    // }
  }, [selectedWeatherType, selectedObservationType, weatherData, observationData]);

  /**
   * (1) 차트에 그릴 데이터 전처리
   *  - weatherData: 연도별 평균(또는 합계)로 집계
   *  - observationData: 이미 (yr, value) 형태로 들어있다고 가정
   */
  const aggregatedWeatherData = useMemo(() => {
    if (!weatherData?.length) return [];

    // 1) 날씨 데이터(연도별) 집계
    const grouped = d3.group(weatherData, (d) => d.yr);
    return Array.from(grouped, ([yr, items]) => {
      const length = items.length || 1;
      const sumTemp = d3.sum(items, (d) => d.avg_tp ?? 0);
      const sumRain = d3.sum(items, (d) => d.acml_rn ?? 0);
      const sumSun = d3.sum(items, (d) => d.acml_sl ?? 0);

      return {
        yr,
        avg_tp: sumTemp / length, // 평균 온도
        acml_rn: sumRain, // 누적 강수량(합계)
        acml_sl: sumSun / length, // 일조시간도 일 단위 평균이라면 평균
      };
    });
  }, [weatherData]);

  /**
   * (2) “이전 연도 대비 지금 연도” 변화량 계산
   *     earliestYear = year - referenceYears + 1
   *     latestYear   = year
   */
  const differenceInfo = useMemo(() => {
    if (referenceYears < 1) return null;
    if (!aggregatedWeatherData?.length || !observationData?.length) return null;

    const earliestYear = year - referenceYears + 1;
    const latestYear = year;

    // weatherKey 결정
    const weatherKey = {
      temp: "avg_tp",
      rain: "acml_rn",
      sun: "acml_sl",
    }[selectedWeatherType] as keyof Weather;

    // (a) earliestYear / latestYear 데이터 찾기
    const earliestWeather = aggregatedWeatherData.find((d) => d.yr === earliestYear);
    const latestWeather = aggregatedWeatherData.find((d) => d.yr === latestYear);

    const earliestWeatherAvg = earliestWeather?.[weatherKey] ?? 0;
    const latestWeatherAvg = latestWeather?.[weatherKey] ?? 0;

    // 관측 데이터
    const earliestObs = observationData.find((d) => d.yr === earliestYear)?.value ?? 0;
    const latestObs = observationData.find((d) => d.yr === latestYear)?.value ?? 0;

    const weatherDiff = latestWeatherAvg - earliestWeatherAvg;
    const observationDiff = latestObs - earliestObs;

    return {
      earliestYear,
      latestYear,
      earliestWeatherAvg,
      latestWeatherAvg,
      weatherDiff,
      earliestObs,
      latestObs,
      observationDiff,
    };
  }, [aggregatedWeatherData, observationData, selectedWeatherType, year, referenceYears]);

  /**
   * (3) 실제 차트 렌더링 (Plot)
   */
  useEffect(() => {
    if (!aggregatedWeatherData?.length || !observationData?.length) return;
    if (!plotRef.current) return;

    // 차트 영역 클리어
    plotRef.current.innerHTML = "";
    const { width, height } = containerSize;
    if (width === 0 || height === 0) return;

    // 1) 사용할 weatherKey
    const weatherKey = {
      temp: "avg_tp",
      rain: "acml_rn",
      sun: "acml_sl",
    }[selectedWeatherType] as keyof Weather;

    // 축 라벨
    const weatherAxisLabel = {
      temp: "온도(℃)",
      rain: "강수량(mm)",
      sun: "일조시간(시간)",
    }[selectedWeatherType];

    const obsAxisLabel = {
      brix: "당도(brix)",
      cdty: "산도(%)",
      brix_cdty_rt: "당산비",
      count: "열매수(개)",
      size: "횡경(cm)",
      flower_leaf: "화엽비"
    }[selectedObservationType];

    // 2) 기준연도 범위
    const yearStart = year - referenceYears + 1;
    const yearArray = d3.range(yearStart, year + 1);

    // 3) 날씨 / 관측 최대값
    let minWeather = d3.min(aggregatedWeatherData, (d) => (d[weatherKey] as number) ?? 0) ?? 0;
    let maxWeather = d3.max(aggregatedWeatherData, (d) => (d[weatherKey] as number) ?? 0) ?? 0;
    let maxObs = d3.max(observationData, (d) => d.value) ?? 0;
    
    // 강수량rain은 보통 양수이고 값이 큼  하한선 0 설정
    if (selectedWeatherType === "rain") {
      minWeather = 0;
      maxWeather += 5; // 강수량 기준으로 적당한 여유값
    }

    // 관측값을 날씨 값 스케일에 맞춰 주기 위한 비율
    const weatherRange = maxWeather - minWeather;
    const obsFactor = maxObs > 0 ? weatherRange / maxObs : 1;

    // 4) Plot 생성
    const marginLeft = 50;
    const marginRight = 80;

    const chart = Plot.plot({
      width,
      height,
      style: {
        width: "100%",
        height: "100%",
        fontSize: "16px",
        color: "#ffffffa6",
      },
      marginLeft,
      marginRight,
      marginTop: 40,
      marginBottom: 55,

      y: {
        domain: [minWeather, maxWeather],
        label: weatherAxisLabel,
        grid: true,
        ticks: 5,
        tickFormat: d3.format("~s"),
        tickSize: 5,
      },
      x: {
        domain: yearArray,
        label: "연도",
        line: true,
        ticks: yearArray.length,
        tickSize: 5,
        labelOffset: 45,
        tickFormat: (d) => d.toString(),
      },

      marks: [
        // 관측(막대)
        Plot.rectY(observationData, {
          x: (d) => d.yr,
          y1: minWeather,
          y2: (d) => d.value * obsFactor + minWeather,
          fill: (d) => (hoveredYear === null || hoveredYear === d.yr ? barColor : (d3.color(barColor)?.copy({ opacity: 0.2 })?.formatRgb() ?? "#ACB1BC")),
          insetLeft: 10,
          insetRight: 10,
        }),
        // 날씨(선)
        Plot.line(aggregatedWeatherData, {
          x: "yr",
          y: (d) => d[weatherKey] ?? 0,
          stroke: lineColor,
          strokeWidth: 4,
          title: (d: any) => `연도: ${d.yr}\n${weatherAxisLabel}: ${(+d[weatherKey]).toFixed(2)}`,
        }),
        Plot.dot(aggregatedWeatherData, {
          x: "yr",
          y: (d) => d[weatherKey] ?? 0,
          r: 5,
          fill: lineColor,
          stroke: "#fff",
          fillOpacity: 1,
        }),
        Plot.axisY({
          label: weatherAxisLabel,
          ticks: 10,
          labelOffset: 35,
          dx: -5,
        }),
        // 오른쪽 축(관측값)
        Plot.axisY({
          label: obsAxisLabel,
          anchor: "right",
          labelOffset: 70,
          ticks: 10,
          tickFormat: (v) =>
            ((v as number) / obsFactor).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            }),
        }),
      ],
    });

    plotRef.current.appendChild(chart);

    // 5) 툴팁 설정
    const svg = chart instanceof SVGSVGElement ? chart : null;
    const tooltip = tooltipRef.current;

    if (svg && tooltip) {
      const handleMove = (e: MouseEvent) => {
        const rect = svg.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;

        const yearStart = year - referenceYears + 1;
        const yearArray = d3.range(yearStart, year + 1);

        const index = Math.floor((relX / rect.width) * yearArray.length);
        const hoveredYear = yearArray[index];
        if (!hoveredYear) return;

        setHoveredYear(hoveredYear);

        const weatherKey = {
          temp: "avg_tp",
          rain: "acml_rn",
          sun: "acml_sl",
        }[selectedWeatherType] as keyof Weather;

        const weatherLabel = {
          temp: "온도(℃)",
          rain: "강수량(mm)",
          sun: "일조시간(시간)",
        }[selectedWeatherType];

        const obsLabel = {
          brix: "당도(brix)",
          cdty: "산도(%)",
          brix_cdty_rt: "당산비",
          count: "열매수(개)",
          size: "횡경(cm)",
          flower_leaf: "화엽비"
        }[selectedObservationType];

        const weatherDataForYear = aggregatedWeatherData.find((d) => d.yr === hoveredYear);
        const observationForYear = observationData.find((d) => d.yr === hoveredYear);

        const weatherValue = weatherDataForYear?.[weatherKey] ?? 0;
        const obsValue = observationForYear?.value ?? 0;

        tooltip.innerHTML = `
          <div style="display: grid; grid-template-columns: auto 1fr; column-gap: 6px; padding: 14px 20px 14px 14px;">
            <div style="color: #FFC132; font-size: 16px;">▶</div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="color: #FFC132;"><strong>${hoveredYear}</strong></div>
              <div>${weatherLabel}: ${weatherValue.toFixed(2)}</div>
              <div>${obsLabel}: ${obsValue.toFixed(2)}</div>
            </div>
          </div>
        `;

        tooltip.style.left = `${e.clientX + 20}px`;
        tooltip.style.top = `${e.clientY - 10}px`;
        tooltip.style.display = "block";
      };

      const handleLeave = () => {
        tooltip.style.display = "none";
        setHoveredYear(null);
      };

      svg.addEventListener("mousemove", handleMove);
      svg.addEventListener("mouseleave", handleLeave);

      return () => {
        svg.removeEventListener("mousemove", handleMove);
        svg.removeEventListener("mouseleave", handleLeave);
      };
    }

    return () => {
      chart.remove();
    };
  }, [
    containerSize,
    weatherData,
    observationData,
    selectedWeatherType,
    selectedObservationType,
    year,
    referenceYears,
    title,
    aggregatedWeatherData,
    barColor,
    lineColor,
    hoveredYear,
  ]);

  /**
   * UI:
   *  1) 차트 제목 & 우측 상단 버튼
   *  2) 모달(열린 경우)
   *  3) 차트
   *  4) 툴팁
   */
  return (
    <div className="relative h-full w-full">
      {/* 헤더 영역 (버튼 포함) */}
      <div className="relative text-center">
        {/* <div style={{ fontWeight: "bold" }}>{title}</div> */}

        {/* 우측 상단 버튼 */}
        {/* <button
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            background: "#f0f0f0",
            border: "1px solid #ccc",
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
          onClick={() => setIsDiffModalOpen((prev) => !prev)}
        >
          변화량 보기
        </button> */}

        {/* 모달 (우측 상단) */}
        {isChangeRateOpen && differenceInfo && (
          <div
            style={{
              position: "absolute",
              top: "30px",
              right: 0,
              width: "220px",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
              padding: "10px",
              fontSize: "12px",
              zIndex: 10,
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
              {differenceInfo.earliestYear} → {differenceInfo.latestYear} 변화량
            </div>
            <div style={{ marginBottom: "4px" }}>
              <span style={{ color: lineColor, fontWeight: "bold" }}>날씨 ({selectedWeatherType})</span> <br />
              과거: {differenceInfo.earliestWeatherAvg.toFixed(2)} → 최근: {differenceInfo.latestWeatherAvg.toFixed(2)}
              <br />
              <strong>차이:</strong> {differenceInfo.weatherDiff.toFixed(2)}
            </div>
            <div>
              <span style={{ color: barColor, fontWeight: "bold" }}>관측 ({selectedObservationType})</span> <br />
              과거: {differenceInfo.earliestObs.toFixed(2)} → 최근: {differenceInfo.latestObs.toFixed(2)}
              <br />
              <strong>차이:</strong> {differenceInfo.observationDiff.toFixed(2)}
            </div>
          </div>
        )}
      </div>
      <div ref={plotRef} className="h-full w-full rounded-lg bg-[#43506E] p-5" style={{maxHeight:"900px"}}/>
      <div
        ref={tooltipRef}
        style={{
          position: "fixed",
          zIndex: 9999,
          backgroundColor: "#37445E",
          boxShadow: "1px 1px 4px 0px rgba(0, 0, 0, 0.59)",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
          whiteSpace: "nowrap",
          overflow: "visible",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default WeatherAndQualityGraph;
