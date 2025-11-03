import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { AgingChartData } from "~/maps/components/agingStatus/AgingStatusChart";
import { useMapList } from "~/maps/hooks/useMapList";

interface Props {
  title: string;
  category: "avg_age" | "count";
  chartData: AgingChartData[];
}

const AgingStatusDivergingBarChart = ({ title, category, chartData }: Props) => {
  const mapList = useMapList();
  const firstMap = mapList.getFirstMap();
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [size, setSize] = useState({ width: 800, height: 420 });
  const barColor = category === "avg_age" ? "#F59E0B" : "#EA580C";

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const { width } = entry.contentRect;
      setSize((prev) => ({ ...prev, width }));
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      let multiplier = 1;

      if (width >= 2460) {
        multiplier = 1.5;
      } else if (width >= 1920) {
        multiplier = 1.2;
      }

      setSize((prev) => ({ ...prev, height: 420 * multiplier }));
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    let multiplier = 1;

    if (windowWidth >= 2460) {
      multiplier = 1.5;
    } else if (windowWidth >= 1920) {
      multiplier = 1.2;
    }

    setSize((prev) => ({ ...prev, height: 420 * multiplier }));
  }, [windowWidth]);

  useEffect(() => {
    if (!chartData?.length) return;

    const regionTotals = chartData
      .map((d) => ({
        region: d.region,
        label: d.label,
        value: d[category],
      }))
      .filter((d) => typeof d.value === "number" && !isNaN(d.value))
      .sort((a, b) => (category === "count" ? b.value - a.value : 0));

    const margin = { top: 0, right: firstMap.getSelectedRegionLevel() === "ri" ? 30 : 40, bottom: 30, left: firstMap.getSelectedRegionLevel() === "ri" ? 80 : 55 };
    const barHeight = regionTotals.length > 12 ? 32 : 48;
    const height = regionTotals.length > 11 ? regionTotals.length * barHeight + margin.top + margin.bottom : size.height;
    const barInset = regionTotals.length === 1 ? 110 : regionTotals.length === 2 ? 40 : regionTotals.length === 4 ? 15 : 7;

    const maxAbs = d3.max(regionTotals, (d) => Math.abs(d.value)) || 1;
    const xMin = category === "avg_age" ? 50 : 0;
    const xDomain = category === "avg_age" ? [xMin, maxAbs * 1.035] : [xMin, maxAbs * 1.08];

    const chart = Plot.plot({
      width: size.width,
      height,
      marginTop: margin.top,
      marginRight: margin.right,
      marginBottom: margin.bottom,
      marginLeft: regionTotals.length > 12 ? margin.left : 55,
      x: {
        grid: true,
        label: "",
        domain: xDomain,
        labelArrow: false,
        tickFormat: (d) => (category === "avg_age" ? `${d.toFixed(0)}` : `${d.toLocaleString()}`),
      },
      y: {
        label: null,
        domain: regionTotals.map((d) => d.region),
      },
      marks: [
        Plot.axisY({
          tickSize: 0,
          tickPadding: 20,
          tickFormat: (region) => {
            const found = regionTotals.find((d) => d.region === region);
            return found?.label ?? region;
          },
        }),
        Plot.barX(regionTotals, {
          x: "value",
          x1: xMin,
          y: "region",
          fill: barColor,
          insetTop: barInset,
          insetBottom: barInset,
        }),
        Plot.text(regionTotals, {
          x: "value",
          y: "region",
          text: (d) => (category === "avg_age" ? `${d.value.toFixed(2)}세` : `${d.value.toLocaleString()}명`),
          dx: 5,
          dy: 1,
          textAnchor: "start",
          fill: "#e9e9e9",
          fontSize: "14px",
        }),
        Plot.ruleX([xMin], { stroke: "#e9e9e9", opacity: 0.5 }),
      ],
      style: {
        fontSize: "15px",
        color: "#e9e9e9",
      },
    });

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(chart);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [chartData, category, size]);

  return (
    <div className="h-full w-full">
      <p className="mb-[8px] text-xl font-semibold">{title}</p>
      <div ref={containerRef} style={{ height: `${size.height}px` }} className="custom-dark-scroll min-w-full overflow-y-auto" />
    </div>
  );
};

export default AgingStatusDivergingBarChart;
