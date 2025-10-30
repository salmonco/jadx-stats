import * as Plot from "@observablehq/plot";
import { GroupedQualityAnalysisFeatures } from "~/pages/visualization/observation/QualityAnalysis";
import { useMemo, useRef, useEffect, useState } from "react";
import { ScrollSelectorOption } from "../common/OneDepthScrollSelector";
import { Feather } from "lucide-react";

interface QualityAnalysisLineChartProps {
  groupedFeatures: GroupedQualityAnalysisFeatures;
  selectedRegions: string[];
  metricType: string;
  targetYear: number;
  standardYear: number;
  selectedVariety: string;
  regionOptions: ScrollSelectorOption[];
}

interface MonthlyAverage {
  year: number;
  month: string;
  value: number;
  region: string;
}

const metricConfig: Record<string, { title: string; label: string }> = {
  brix: {
    title: "당도(Brix) 월별 평균",
    label: "당도(°Bx)",
  },
  cdty: {
    title: "산도 월별 평균",
    label: "산도(%)",
  },
  brix_cdty_rt: {
    title: "당산비 월별 평균",
    label: "당산비",
  },
};

const QualityAnalysisLineChart = ({
  groupedFeatures,
  selectedRegions,
  metricType,
  targetYear,
  standardYear,
  selectedVariety,
  regionOptions,
}: QualityAnalysisLineChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const months = [8, 9, 10, 11, 12, 1, 2, 3];
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

  // const yearlyAverages = useMemo(() => {
  //   const result: MonthlyAverage[] = [];
  //   const years = Array.from({ length: standardYear }, (_, i) => targetYear - standardYear + 1 + i);

  //   selectedRegions?.forEach((region) => {
  //     const features = groupedFeatures[region];
  //     if (!features) return;

  //     years.forEach((year) => {
  //       // 해당 년도의 10,11,12월과 다음 해의 1월 데이터 필터링
  //       const yearFeatures = features.filter((feature) => {
  //         const date = new Date(feature.properties.rcpt_ymd);
  //         const month = date.getMonth() + 1;
  //         const featureYear = date.getFullYear();

  //         return (
  //           // 해당 년도의 10,11,12월
  //           (featureYear === year && month >= 10) ||
  //           // 다음 해의 1월
  //           (featureYear === year + 1 && month === 1)
  //         );
  //       });
  //       if (yearFeatures.length > 0) {
  //         const average = yearFeatures.reduce((sum, f) => sum + f.properties[metricType], 0) / yearFeatures.length;

  //         result.push({
  //           year,
  //           value: average,
  //           region,
  //         });
  //       }
  //     });
  //   });

  //   return result;
  // }, [groupedFeatures, selectedRegions, metricType]);
  const monthlyAverages = useMemo(() => {
    const result: MonthlyAverage[] = [];

    selectedRegions?.forEach((region) => {
      const monthMap = new Map<number, number>();

      const features = groupedFeatures[region];
      if (!features) return;

      features.forEach((feature) => {
        const dataByVariety = feature.properties.stats[selectedVariety];
        if (!dataByVariety) return;

        Object.entries(dataByVariety).forEach(([key, stats]) => {
          const [, monthStr] = key.split("-");
          const month = parseInt(monthStr, 10);
          if (!months.includes(month)) return;

          const val = stats?.[metricType];
          if (typeof val === "number") {
            const existing = monthMap.get(month) || 0;
            monthMap.set(month, existing + val);
          }
        });
      });

      months.forEach((month) => {
        result.push({
          year: 0,
          month: month.toString(),
          value: monthMap.has(month) ? monthMap.get(month)! : 0,
          region,
        });
      });
    });

    return result;
  }, [groupedFeatures, selectedRegions, selectedVariety, metricType]);
  const config = metricConfig[metricType];
  const domain = ["8", "9", "10", "11", "12", "1", "2", "3"];

  // const domain = useMemo(() => {
  //   const maxValue = Math.max(...yearlyAverages.map((d) => d.value));
  //   return [0, Math.ceil(maxValue * 1.1)];
  // }, [yearlyAverages]);

  // useEffect(() => {
  //   if (!svgRef.current || !dimensions.width) return;

  //   const years = Array.from({ length: standardYear }, (_, i) => targetYear - standardYear + 1 + i);
  //   const months = [10, 11, 12, 1];

  //   const chart = Plot.plot({
  //     width: dimensions.width,
  //     height: dimensions.height || 360,
  //     marginTop: 30,
  //     marginBottom: 50,
  //     grid: true,
  //     x: {
  //       type: "point",
  //       label: "연도",
  //       tickFormat: (d) => `${d}년`,
  //       domain: years,
  //     },
  //     y: {
  //       label: config.label,
  //       domain: domain,
  //       labelAnchor: "top",
  //       labelOffset: 30,
  //     },
  //     color: {
  //       domain: selectedRegions,
  //       range: selectedRegions.map((region) => regionOptions.find((opt) => opt.value === region)?.color || "#000"),
  //     },
  //     marks: [
  //       Plot.line(yearlyAverages, {
  //         x: "year",
  //         y: "value",
  //         stroke: "region",
  //         strokeWidth: 2,
  //         curve: "linear",
  //       }),
  //       Plot.dot(yearlyAverages, {
  //         x: "year",
  //         y: "value",
  //         stroke: "region",
  //         fill: "white",
  //         title: (d) => `${d.region}\n${d.year}년\n${config.label}: ${d.value.toFixed(2)}`,
  //       }),
  //     ],
  //   });

  //   svgRef.current.innerHTML = "";
  //   svgRef.current.appendChild(chart);
  // }, [dimensions, yearlyAverages, config, domain, selectedRegions, regionOptions]);
  useEffect(() => {
    if (!svgRef.current || !dimensions.width) return;

    const chart = Plot.plot({
      width: dimensions.width,
      height: dimensions.height || 360,
      marginTop: 30,
      marginBottom: 30,
      marginRight: 0,
      marginLeft: 35,
      grid: true,
      x: {
        label: "",
        domain: domain,
        tickFormat: (d) => `${d}월`,
      },
      y: {
        label: config.label,
        labelAnchor: "top",
        labelOffset: 30,
        domain: [0, Math.ceil(Math.max(...monthlyAverages.map((d) => d.value)) * 1.1)],
      },
      color: {
        domain: selectedRegions,
        range: selectedRegions.map((region) => regionOptions.find((opt) => opt.value === region)?.color || "#000"),
      },
      marks: [
        Plot.line(monthlyAverages, {
          x: (d) => d.month,
          y: "value",
          stroke: "region",
          strokeWidth: 2,
          curve: "linear",
        }),
        Plot.dot(monthlyAverages, {
          x: (d) => d.month,
          y: "value",
          stroke: "region",
          fill: "white",
          title: (d) => `${d.region}\n${d.month}월\n${config.label}: ${d.value.toFixed(2)}`,
        }),
      ],
      style: {
        fontSize: "14px",
        color: "#fff",
      },
    });

    // 툴팁 생성
    const tooltip = document.createElement("div");
    tooltip.style.position = "absolute";
    tooltip.style.backgroundColor = "#37445E";
    tooltip.style.color = "white";
    tooltip.style.borderRadius = "12px";
    tooltip.style.display = "none";
    tooltip.style.zIndex = "9999";
    tooltip.style.pointerEvents = "none";
    tooltip.style.boxShadow = "1px 1px 4px 1px rgba(0, 0, 0, 0, 59)";
    document.body.appendChild(tooltip);

    svgRef.current.addEventListener("mousemove", (event) => {
      const target = event.target as HTMLElement;

      if (target.tagName === "circle") {
        const title = target.querySelector("title");

        // plot title 저장 후 제거
        if (title) {
          target.setAttribute("data-title", title.textContent || "");
          title.remove();
        }

        // plot title로 tooltip 생성
        const titleData = target.getAttribute("data-title");
        if (titleData) {
          const [region, month, value] = titleData.split("\n");

          tooltip.innerHTML = `
            <div style="display: grid; grid-template-columns: auto 1fr; column-gap: 6px; padding: 14px 20px 14px 14px; border-radius: 12px; background-color: #37445E; color: white; pointer-events: none;">
              <div style="color: #FFC132; font-size: 16px;">▶</div>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="color: #FFC132; font-weight: 700;">${region} ${month}</div>
                <div>${value}</div>
              </div>
            </div>
          `;
          tooltip.style.display = "block";

          const { pageX, pageY } = event;
          const tooltipWidth = tooltip.offsetWidth;

          const offsetX = 10;
          const offsetY = -10;

          let left = pageX + offsetX + 10;
          if (pageX + tooltipWidth + offsetX + 100 > window.innerWidth) {
            left = pageX - tooltipWidth - offsetX;
          }

          tooltip.style.left = `${left}px`;
          tooltip.style.top = `${pageY + offsetY}px`;
        }
      }
    });

    // 마우스 아웃 시 툴팁 숨기기
    svgRef.current.addEventListener("mouseout", (event) => {
      tooltip.style.display = "none";
    });

    svgRef.current.innerHTML = "";
    svgRef.current.appendChild(chart);
  }, [dimensions, monthlyAverages, config, domain, selectedRegions, regionOptions]);

  return (
    <div ref={containerRef} className="h-full max-h-[360px] w-full">
      <div className="mb-2 text-xl font-semibold">{config.title}</div>
      <div ref={svgRef} className="h-full w-full" />
    </div>
  );
};

export default QualityAnalysisLineChart;
