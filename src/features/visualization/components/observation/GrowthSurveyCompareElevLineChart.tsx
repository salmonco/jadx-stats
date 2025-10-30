import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as Plot from "@observablehq/plot";

interface Props {
  data: any[]; // Feature들의 배열
  title?: string; // 차트 제목
  year: number; // 기준 연도
  referenceYears: number; // 이전 연도 개수
}

const GrowthSurveyCompareElevLineChart: React.FC<Props> = ({ data, title, year, referenceYears }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // (A) container 크기 동적 확인
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // (B) 차트 그리기
  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0 || !dimensions.width || !dimensions.height || !containerRef.current) {
      return;
    }

    // 컨테이너 초기화
    containerRef.current.innerHTML = "";

    // (1) 기준 연도 범위 설정
    const startYear = year - referenceYears + 1;
    const endYear = year;

    // x축에서 표시할 전체 연도 목록 (데이터가 없어도 표시)
    const allYears = d3.range(startYear, endYear + 1);

    // (2) 범위 내 데이터 필터링
    const filteredData = data.filter((d) => {
      const yr = d.values_?.yr;
      return yr >= startYear && yr <= endYear;
    });

    // (3) 고도 구간 분류 함수
    const getAltGroup = (alt: number) => {
      if (alt < 100) return "100m 미만";
      else if (alt < 200) return "200m 미만";
      return "200m 이상";
    };

    // (4) title로 어떤 지표인지 구분 (당산도 / 열매수 / 횡경)
    const isBrix = title?.includes("당산도");
    const isCount = title?.includes("열매수");
    const isSize = title?.includes("횡경");

    // (5) 고도+연도별로 값 계산
    type StatObj = { sumVal: number; sumCdty: number; countVal: number };
    const groupMap = new Map<string, Map<number, StatObj>>();

    filteredData.forEach((item) => {
      const altd = item.values_?.altd ?? 0; // 고도
      const yr = item.values_?.yr;
      const altGroup = getAltGroup(altd);

      // 그룹 생성
      if (!groupMap.has(altGroup)) {
        groupMap.set(altGroup, new Map());
      }
      const yearMap = groupMap.get(altGroup)!;
      if (!yearMap.has(yr)) {
        yearMap.set(yr, { sumVal: 0, sumCdty: 0, countVal: 0 });
      }
      const statObj = yearMap.get(yr)!;

      // 당산도: sumVal = brix_cdty_rt 누적, sumCdty = cdty 누적
      if (isBrix) {
        const brix_cdty_rt = item.values_?.brix_cdty_rt ?? 0;
        const cdty = item.values_?.cdty ?? 0;
        statObj.sumVal += brix_cdty_rt;
        statObj.sumCdty += cdty;
      }
      // 열매수: 단순 합계 + 건수
      else if (isCount) {
        const countVal = item.values_?.aug_frc ?? 0;
        statObj.sumVal += countVal;
        statObj.countVal += 1;
      }
      // 횡경: 단순 합계 + 건수
      else if (isSize) {
        const sizeVal = item.values_?.aug_frt_sz ?? 0;
        statObj.sumVal += sizeVal;
        statObj.countVal += 1;
      }
    });

    // (6) 최종 altGroup별 데이터 목록 생성
    const altGroupData: Record<string, Array<{ yr: number; value: number }>> = {};

    // x축 표시용 전체 연도(allYears) 순회하여 값 채우기
    // => 존재하지 않는 연도는 라인 끊김(생략)
    for (const [altGroup, yearMap] of groupMap) {
      altGroupData[altGroup] = [];
      for (const y of allYears) {
        const statObj = yearMap.get(y);
        if (statObj) {
          let val = 0;
          // 당산도 => sumVal/sumCdty
          if (isBrix) {
            val = statObj.sumCdty > 0 ? statObj.sumVal / statObj.sumCdty : 0;
          }
          // 그 외 => sumVal / countVal
          else {
            val = statObj.countVal > 0 ? statObj.sumVal / statObj.countVal : 0;
          }
          altGroupData[altGroup].push({ yr: y, value: val });
        }
      }
    }

    // (7) 고도별 색상·순서
    const altGroupInfo: { label: string; color: string }[] = [
      { label: "100m 미만", color: "#72b0ab" },
      { label: "200m 미만", color: "#ffa500" },
      { label: "200m 이상", color: "#dc5c5c" },
    ];

    altGroupInfo.forEach((g) => {
      if (!altGroupData[g.label] || altGroupData[g.label].length === 0) {
        altGroupData[g.label] = allYears.map((yr) => ({ yr, value: 0 }));
      }
    });

    // (8) marks: 각 altGroup에 대해 라인+점 같이
    //    flatMap을 써서 한 그룹당 2개 마크(line, dot)를 리턴
    const marks = altGroupInfo.flatMap((g) => [
      // 곡선 라인
      Plot.line(altGroupData[g.label], {
        x: "yr",
        y: "value",
        stroke: g.color,
        strokeWidth: 2,
        curve: "catmull-rom", // 부드러운 곡선
        title: (d) => `고도: ${g.label}\n연도: ${d.yr}\n값: ${d.value.toFixed(2)}`,
      }),
      // 데이터 포인트
      Plot.dot(altGroupData[g.label], {
        x: "yr",
        y: "value",
        fill: g.color,
        r: 4, // 점 크기
        title: (d) => `고도: ${g.label}\n연도: ${d.yr}\n값: ${d.value.toFixed(2)}`,
      }),
    ]);

    // (9) Plot 그리기
    const { width, height } = dimensions;
    const chart = Plot.plot({
      width,
      height: Math.max(height, 200),
      style: {
        width: "100%",
        height: "100%",
        shapeRendering: "crispEdges",
      },
      marginLeft: 50,
      marginRight: 30,
      marginTop: 30,
      marginBottom: 40,
      x: {
        label: "연도",
        tickSize: 5,
        tickFormat: (d) => d.toString(),
        domain: d3.range(startYear, endYear + 1),
      },
      y: {
        label: "평균값",
        grid: true,
        nice: true,
      },
      marks,
    });

    containerRef.current.appendChild(chart);

    // (10) 툴팁 설정
    const svg = containerRef.current.querySelector("svg");
    const tooltipEl = tooltipRef.current;
    if (svg && tooltipEl) {
      svg.addEventListener("mousemove", (evt) => {
        const target = evt.target as SVGPathElement | SVGCircleElement;
        const titleText = target?.getAttribute("title");
        if (titleText) {
          const svgRect = svg.getBoundingClientRect();
          const offsetX = evt.clientX - svgRect.left + 10;
          const offsetY = evt.clientY - svgRect.top + 10;

          tooltipEl.style.left = `${offsetX}px`;
          tooltipEl.style.top = `${offsetY}px`;
          tooltipEl.style.display = "block";
          tooltipEl.innerHTML = titleText.replace(/\n/g, "<br/>");
        } else {
          tooltipEl.style.display = "none";
        }
      });

      svg.addEventListener("mouseleave", () => {
        tooltipEl.style.display = "none";
      });
    }

    // cleanup
    return () => {
      chart.remove();
    };
  }, [data, dimensions, year, referenceYears, title]);

  // (C) altGroupInfo도 레전드 표시용으로 재사용
  //     (만약 render 시점에 사용할 것이므로, useEffect 밖에서 재선언해도 됨)
  const altGroupInfo: { label: string; color: string }[] = [
    { label: "100m 미만", color: "#72b0ab" },
    { label: "200m 미만", color: "#ffa500" },
    { label: "200m 이상", color: "#dc5c5c" },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {title && (
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            padding: "8px 0",
            fontSize: "16px",
            flexShrink: 0,
          }}
        >
          {title}
        </div>
      )}

      {/* 차트 영역 */}
      <div
        ref={containerRef}
        style={{
          flexGrow: 1,
          width: "100%",
          height: "100%",
        }}
      />

      {/* 레전드(아래쪽) */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          marginTop: "8px", // 위쪽 간격
        }}
      >
        {altGroupInfo.map((g) => (
          <div key={g.label} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {/* 색상 표시(원이나 사각형 등) */}
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: g.color,
                borderRadius: "50%", // 원 모양
              }}
            />
            <span style={{ fontSize: "12px" }}>{g.label}</span>
          </div>
        ))}
      </div>

      {/* 툴팁 */}
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          pointerEvents: "none",
          background: "white",
          border: "1px solid #ccc",
          padding: "6px",
          borderRadius: "4px",
          display: "none",
          fontSize: "12px",
          boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
          whiteSpace: "pre",
        }}
      />
    </div>
  );
};

export default GrowthSurveyCompareElevLineChart;
