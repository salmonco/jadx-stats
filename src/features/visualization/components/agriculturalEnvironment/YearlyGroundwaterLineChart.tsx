import * as Plot from "@observablehq/plot";
import { useMemo, useRef, useEffect, useState } from "react";

interface YearlyExportLineChartProps {
  yearlyData: GroundwaterGroupArr;
  type: "ntrgn" | "chlrn" | "ph";
}
export interface GroundwaterGroupArr{
  features: GroundwaterGroupData[];
}

export interface GroundwaterGroupData{
  properties: FeatureProperty;
}

export interface FeatureProperty {
  vrbs_nm: string;
  stats: ExportData[];
}
export interface ExportData {
  year: number;
  ntrgn: number;
  chlrn: number;
  ph: number;
}

const metricConfig = {
  ntrgn: {
    title: "지역별 질소 추이",
    label: "질소 수치치",
  },
  chlrn : {
    title: "지역별 염소 추이",
    label: "염소 수치",
  },
  ph : {
    title: "지역별 pH 추이",
    label: "pH 수치",
  },
};

const YearlyGroundwaterLineChart = ({ yearlyData, type }: YearlyExportLineChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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

  const data: { year: number; value: number; region: string }[] = useMemo(() => {
    if (!yearlyData) return [];
    const arr: { year: number; value: number; region: string }[] = [];    
    if (!Array.isArray(yearlyData?.features)) return [];
    for (const feature of yearlyData.features) {
      for (const stat of feature.properties.stats) {                
        arr.push({
          year: stat.year,
          value: stat[type],
          region: feature.properties.vrbs_nm,
        });
      }
    }
    return arr;
  }, [yearlyData, type]);
  const config = metricConfig[type];
  const maxValue = data.length > 0 ? Math.max(...data.map((d) => d.value)) : 0;
  const domain = [0, Math.ceil(maxValue * 1.05)];  
  useEffect(() => {
    if (!svgRef.current || !dimensions.width || data.length === 0) return;

    svgRef.current.innerHTML = "";     
    const chart = Plot.plot({
      width: dimensions.width,
      height: dimensions.height || 360,
      marginTop: 30,
      marginRight: 30,
      marginBottom: 65,
      marginLeft: 40,
      grid: true,
      style: {
        fontSize: "13px",
      },
      color: {
        domain: ["제주", "서귀", "한림", "남원", "안덕", "대정", "애월", "조천", "표선", "한경", "구좌", "성산"],
        range: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#8c564b", "#e377c2", "#bcbd22", "#17becf", "#9467bd", "#7f7f7f", "#e6194B", "#3cb44b",]
      },
      x: {
        type: "linear",
        label: "",
        // ticks: 6,
        tickFormat: (d) => `${d}년`,        
      },
      y: {
        label: config.label,
        domain: domain,
        labelAnchor: "top",
      },
      marks: [
        Plot.line(data, {
          x: "year",
          y: "value",
          stroke: "region",
          strokeWidth: 2,
          curve: "linear",
        }),
        Plot.dot(data, {
          x: "year",
          y: "value",
          stroke: "region",
          fill: "white",
          title: (d) =>
            `${d.region}\n${d.year}년\n${d.value.toLocaleString()}`,
        }),
      ],
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
        const [region, year, value] = titleData.split('\n');
  
        tooltip.innerHTML = `
          <div style="display: grid; grid-template-columns: auto 1fr; column-gap: 6px; padding: 14px 20px 14px 14px; border-radius: 12px; background-color: #37445E; color: white; pointer-events: none;">
            <div style="color: #FFC132; font-size: 16px;">▶</div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="color: #FFC132; font-weight: 700;">${year} ${region}</div>
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
  }, [dimensions, data, config, domain]);

  // ❗ 조건부 렌더링은 여기에서 처리
  if (!yearlyData || data.length === 0) {
    return <div ref={containerRef} className="h-full max-h-[360px] w-full" />;
  }

  return (
    <div ref={containerRef} className="h-full max-h-[360px] w-full">
      <div className="mb-2 text-xl font-semibold">{config.title}</div>
      <div ref={svgRef} className="h-full w-full" />
    </div>
  );
};

export default YearlyGroundwaterLineChart;
