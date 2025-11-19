import * as Plot from "@observablehq/plot";
import { Button } from "antd";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import AgingStatusMap from "~/maps/classes/AgingStatusMap";
import { AgingChartData } from "~/maps/components/agingStatus/AgingStatusChart";
import { useMapList } from "~/maps/hooks/useMapList";

interface Props {
  title: string;
  category: "avg_age" | "count";
  chartData: AgingChartData[];
}

const AgingStatusDivergingBarChart = ({ title, category, chartData }: Props) => {
  const mapList = useMapList<AgingStatusMap>();
  const firstMap = mapList.getFirstMap();

  const containerRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [size, setSize] = useState({ width: 800, height: 420 });

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
    if (!chartData?.length || !containerRef.current) {
      containerRef.current.innerHTML = "";
      return;
    }

    if (category === "count") {
      // 트리맵 차트
      const root = d3.hierarchy({ children: chartData }).sum((d: any) => d.count);

      const treemapLayout = d3.treemap().size([size.width, size.height]).padding(1);

      treemapLayout(root);

      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

      const svg = d3
        .create("svg")
        .attr("width", size.width)
        .attr("height", size.height)
        .attr("viewBox", `0 0 ${size.width} ${size.height}`)
        .style("font", "10px sans-serif")
        .style("overflow", "visible");

      const leaf = svg
        .selectAll("g")
        .data(root.leaves())
        .join("g")
        .attr("transform", (d: d3.HierarchyRectangularNode<any>) => `translate(${d.x0},${d.y0})`);

      leaf
        .append("rect")
        .attr("fill", (d: d3.HierarchyRectangularNode<any>) => colorScale(d.data.label))
        .attr("width", (d: d3.HierarchyRectangularNode<any>) => d.x1 - d.x0)
        .attr("height", (d: d3.HierarchyRectangularNode<any>) => d.y1 - d.y0);

      svg
        .selectAll(".treemap-label-region")
        .data(root.leaves())
        .join("text")
        .attr("class", "treemap-label-region")
        .attr("x", (d: d3.HierarchyRectangularNode<any>) => d.x0 + (d.x1 - d.x0) / 2)
        .attr("y", (d: d3.HierarchyRectangularNode<any>) => d.y0 + (d.y1 - d.y0) / 2 - 5)
        .attr("text-anchor", "middle")
        .text((d: any) => d.data.label)
        .attr("fill", "white")
        .style("font-size", "12px");

      svg
        .selectAll(".treemap-label-count")
        .data(root.leaves())
        .join("text")
        .attr("class", "treemap-label-count")
        .attr("x", (d: d3.HierarchyRectangularNode<any>) => d.x0 + (d.x1 - d.x0) / 2)
        .attr("y", (d: d3.HierarchyRectangularNode<any>) => d.y0 + (d.y1 - d.y0) / 2 + 10)
        .attr("text-anchor", "middle")
        .text((d: any) => `${d.data.count.toLocaleString()}개`)
        .attr("fill", "white")
        .style("font-size", "12px");

      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(svg.node()!);
    } else {
      const regionTotals = chartData
        .map((d) => ({
          region: d.region,
          label: d.label,
          value: d[category],
        }))
        .filter((d) => typeof d.value === "number" && !isNaN(d.value))
        .sort((a, b) => b.value - a.value);

      const margin = {
        top: 0,
        right: firstMap.getSelectedRegionLevel() === "ri" ? 30 : 40,
        bottom: 30,
        left: firstMap.getSelectedRegionLevel() === "ri" ? 80 : 55,
      };
      const barHeight = regionTotals.length > 12 ? 32 : 48;
      const height = regionTotals.length > 11 ? regionTotals.length * barHeight + margin.top + margin.bottom : size.height;
      const barInset = regionTotals.length === 1 ? 110 : regionTotals.length === 2 ? 40 : regionTotals.length === 4 ? 15 : 7;

      const maxAbs = d3.max(regionTotals, (d) => Math.abs(d.value)) || 1;
      const xMin = category === "avg_age" ? 50 : 0;
      const xDomain = category === "avg_age" ? [xMin, maxAbs * 1.035] : [xMin, maxAbs * 1.08];

      const barColor = category === "avg_age" ? "#F59E0B" : "#EA580C";

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
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [chartData, category, size]);

  const handleDownloadCsv = () => {
    const headers = ["지역"];
    const dataKeys: (keyof AgingChartData)[] = ["region"];

    if (category === "avg_age") {
      headers.push("평균 연령");
      dataKeys.push("avg_age");
    } else if (category === "count") {
      headers.push("총 경영체 수");
      dataKeys.push("count");
    }

    const sortedChartData = [...chartData].sort((a, b) => {
      const valA = a[category] ?? 0;
      const valB = b[category] ?? 0;
      return valB - valA;
    });

    const csvContent =
      headers.join(",") +
      "\n" +
      sortedChartData
        .map((d) =>
          dataKeys
            .map((key) => {
              const value = d[key];
              return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value;
            })
            .join(",")
        )
        .join("\n");

    const blob = new Blob(["\ufeff", csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `경영체_연령_분포_차트_데이터_${category}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full w-full">
      <div className="mb-[8px] flex items-center justify-between">
        <p className="text-xl font-semibold">{title}</p>
        <Button type="primary" onClick={handleDownloadCsv}>
          CSV 다운로드
        </Button>
      </div>
      <div ref={containerRef} style={{ height: `${size.height}px` }} className="custom-dark-scroll min-w-full overflow-y-auto" />
    </div>
  );
};

export default AgingStatusDivergingBarChart;
