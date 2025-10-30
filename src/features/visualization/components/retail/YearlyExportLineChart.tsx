import * as Plot from "@observablehq/plot";
import { useMemo, useRef, useEffect, useState } from "react";
import { GroupedCountryYearData } from "~/features/visualization/hooks/useGroupedExportData";
import { ScrollSelectorOption } from "~/features/visualization/components/common/OneDepthScrollSelector";

interface YearlyExportLineChartProps {
  yearlyData: GroupedCountryYearData;
  type: "totalAmount" | "totalWeight";
  countryOptions: ScrollSelectorOption[];
}

const metricConfig = {
  totalAmount: {
    title: "수출액 연도별 추이",
    label: "수출액($)",
  },
  totalWeight: {
    title: "수출량 연도별 추이",
    label: "수출량(ton)",
  },
};

const YearlyExportLineChart = ({ yearlyData, type, countryOptions }: YearlyExportLineChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const colorMap = countryOptions.reduce(
    (acc, option) => {
      acc[option.value] = option.color || "#000000";
      return acc;
    },
    {} as Record<string, string>
  );
  const topCountries = Object.entries(yearlyData)
    .map(([country, yearData]) => {
      const years = Object.keys(yearData).map(Number);
      const latestYear = Math.max(...years);
      const metricValue = yearData[latestYear]?.[type] ?? 0;
      return { country, metricValue };
    })
    .sort((a, b) => b.metricValue - a.metricValue)
    .slice(0, 5)
    .map(({ country }) => country);

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

  const data = useMemo(() => {
    const result: { year: number; value: number; country: string }[] = [];
    Object.entries(yearlyData).forEach(([country, yearData]) => {
      Object.entries(yearData).forEach(([year, values]) => {
        result.push({
          year: Number(year),
          value: values[type],
          country: country,
        });
      });
    });
    return result;
  }, [yearlyData, type]);

  const config = metricConfig[type];

  const domain = useMemo(() => {
    const maxValue = Math.max(...data.map((d) => d.value));
    return [0, Math.ceil(maxValue * 1.05)];
  }, [data]);
  useEffect(() => {
    if (!svgRef.current || !dimensions.width) return;

    const lastPoints = Object.values(
      data.reduce((acc, d) => {
        if (!acc[d.country] || d.year > acc[d.country].year) {
          acc[d.country] = d;
        }
        return acc;
      }, {})
    );
    const chart = Plot.plot({
      width: dimensions.width,
      height: dimensions.height || 360,
      marginTop: 30,
      marginRight: 10,
      marginBottom: 65,
      marginLeft: 80,
      grid: true,
      style: {
        fontSize: "13px",
      },
      color: {
        domain: Object.keys(yearlyData),
        range: Object.keys(yearlyData).map((country) => colorMap[country]),
      },
      x: {
        type: "point",
        label: "",
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
          stroke: "country",
          strokeWidth: 2,
          curve: "linear",
        }),
        Plot.dot(data, {
          x: "year",
          y: "value",
          stroke: "country",
          fill: "white",
          title: (d) => `${d.country}\n${d.year}년\n${d.value.toLocaleString()}\n)`,
        }),
        Plot.text(lastPoints, {
          x: "year",
          y: "value",
          text: "country",
          dx: 6, // 오른쪽으로 약간 이동
          dy: -6, // 위로 약간 이동
          fill: (d) => colorMap[d.country], // 색상도 맞춰줌
          fontWeight: "bold",
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
          const [country, year, value] = titleData.split("\n");

          tooltip.innerHTML = `
          <div style="display: grid; grid-template-columns: auto 1fr; column-gap: 6px; padding: 14px 20px 14px 14px; border-radius: 12px; background-color: #37445E; color: white; pointer-events: none;">
            <div style="color: #FFC132; font-size: 16px;">▶</div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="color: #FFC132; font-weight: 700;">${year} ${country}</div>
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
    svgRef.current.addEventListener("mouseout", () => {
      tooltip.style.display = "none";
    });

    svgRef.current.innerHTML = "";
    svgRef.current.appendChild(chart);
  }, [dimensions, data, config, domain, countryOptions]);

  return (
    <div ref={containerRef} className="h-full max-h-[360px] w-full">
      {/* <div className="legend flex flex-wrap gap-2 mb-4"></div> */}
      <div className="mb-2 flex justify-between text-xl font-semibold">
        {config.title}
        <div className="flex flex-wrap gap-3 p-2">
          {topCountries.map((country) => (
            <div key={country} className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full" style={{ backgroundColor: colorMap[country] || "#ccc" }} />
              <div className="text-sm text-white">{country}</div>
            </div>
          ))}
        </div>
      </div>
      <div ref={svgRef} className="h-full w-full" />
    </div>
  );
};

export default YearlyExportLineChart;
