import * as Plot from "@observablehq/plot";
import { Button } from "antd";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import AgingStatusMap from "~/maps/classes/AgingStatusMap";
import { AgingChartData } from "~/maps/components/agingStatus/AgingStatusChart";
import { useMapList } from "~/maps/hooks/useMapList";
import downloadCsv, { CsvColumn } from "~/utils/downloadCsv";

interface Props {
  title: string;
  category: "avg_age" | "count";
  chartData: AgingChartData[];
  isReportMode?: boolean;
}

const MAX_DISPLAY_ITEMS = 20;
const BAR_HEIGHT_THRESHOLD = 12;

const AgingStatusDivergingBarChart = ({ title, category, chartData, isReportMode }: Props) => {
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

    const actualWidth = isReportMode && containerRef.current.parentElement ? containerRef.current.parentElement.clientWidth : size.width;

    const margin = {
      top: 0,
      right: firstMap?.getSelectedRegionLevel() === "ri" ? 30 : 40,
      bottom: 30,
      left: firstMap?.getSelectedRegionLevel() === "ri" ? 80 : 55,
    };
    const barHeight = firstMap?.getSelectedRegionLevel() === "ri" ? 4 : chartData.length > BAR_HEIGHT_THRESHOLD ? 32 : 48;
    const calculatedChartHeight = chartData.length * barHeight + margin.top + margin.bottom;
    const treemapHeight = isReportMode ? Math.min(550, calculatedChartHeight) : size.height;

    if (category === "count") {
      // 트리맵 차트
      // 상위 MAX_DISPLAY_ITEMS개만 표시하고 나머지는 기타로 묶기
      const sortedData = [...chartData].sort((a, b) => b.count - a.count);
      const topItems = sortedData.slice(0, MAX_DISPLAY_ITEMS);
      const others = sortedData.slice(MAX_DISPLAY_ITEMS);

      const processedData = [...topItems];

      if (others.length > 0) {
        const othersSum = others.reduce((sum, item) => sum + item.count, 0);
        processedData.push({
          region: "기타",
          label: "기타",
          avg_age: 0,
          count: othersSum,
        });
      }

      const root = d3.hierarchy({ children: processedData }).sum((d: any) => d.count);

      // 텍스트를 위한 여백 추가
      const padding = 10;
      const treemapWidth = actualWidth - padding * 2;
      const treemapContentHeight = treemapHeight - padding * 2;

      const treemapLayout = d3.treemap().size([treemapWidth, treemapContentHeight]).padding(1);

      treemapLayout(root);

      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

      const svg = d3
        .create("svg")
        .attr("width", actualWidth)
        .attr("height", treemapHeight)
        .style("font", "10px sans-serif")
        .style("overflow", "visible")
        .style("background", isReportMode ? "transparent" : undefined);

      // 전체 트리맵을 감싸는 그룹에 패딩 적용
      const mainGroup = svg.append("g").attr("transform", `translate(${padding},${padding})`);

      const leaf = mainGroup
        .selectAll("g")
        .data(root.leaves())
        .join("g")
        .attr("transform", (d: d3.HierarchyRectangularNode<any>) => `translate(${d.x0},${d.y0})`);

      leaf
        .append("rect")
        .attr("fill", (d: d3.HierarchyRectangularNode<any>) => colorScale(d.data.label))
        .attr("width", (d: d3.HierarchyRectangularNode<any>) => d.x1 - d.x0)
        .attr("height", (d: d3.HierarchyRectangularNode<any>) => d.y1 - d.y0);

      // 텍스트를 SVG에 직접 추가하여 클리핑 방지 (padding 적용)
      svg
        .selectAll(".treemap-label-region")
        .data(root.leaves())
        .join("text")
        .attr("class", "treemap-label-region")
        .attr("x", (d: d3.HierarchyRectangularNode<any>) => padding + d.x0 + (d.x1 - d.x0) / 2)
        .attr("y", (d: d3.HierarchyRectangularNode<any>) => padding + d.y0 + (d.y1 - d.y0) / 2 - 5)
        .attr("text-anchor", "middle")
        .attr("pointer-events", "none")
        .text((d: any) => d.data.label)
        .attr("fill", isReportMode ? "black" : "white")
        .style("font-size", "12px")
        .style("font-weight", "600");

      svg
        .selectAll(".treemap-label-count")
        .data(root.leaves())
        .join("text")
        .attr("class", "treemap-label-count")
        .attr("x", (d: d3.HierarchyRectangularNode<any>) => padding + d.x0 + (d.x1 - d.x0) / 2)
        .attr("y", (d: d3.HierarchyRectangularNode<any>) => padding + d.y0 + (d.y1 - d.y0) / 2 + 10)
        .attr("text-anchor", "middle")
        .attr("pointer-events", "none")
        .text((d: any) => `${d.data.count.toLocaleString()}개`)
        .attr("fill", isReportMode ? "black" : "white")
        .style("font-size", "12px");
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(svg.node()!);
    } else {
      const allRegionTotals = chartData
        .map((d) => ({
          region: d.region,
          label: d.label,
          value: d[category],
        }))
        .filter((d) => typeof d.value === "number" && !isNaN(d.value))
        .sort((a, b) => b.value - a.value);

      // 상위 MAX_DISPLAY_ITEMS개만 표시하고 나머지는 기타로 묶기
      const topItems = allRegionTotals.slice(0, MAX_DISPLAY_ITEMS);
      const others = allRegionTotals.slice(MAX_DISPLAY_ITEMS);

      const regionTotals =
        others.length > 0
          ? [
              ...topItems,
              {
                region: "기타",
                label: "기타",
                value: others.reduce((sum, item) => sum + item.value, 0) / others.length,
              },
            ]
          : topItems;

      const barInset = regionTotals.length === 1 ? 110 : regionTotals.length === 2 ? 40 : regionTotals.length === 4 ? 15 : 7;

      const maxAbs = d3.max(regionTotals, (d) => Math.abs(d.value)) || 1;
      const xMin = category === "avg_age" ? 50 : 0;
      const xDomain = category === "avg_age" ? [xMin, maxAbs * 1.035] : [xMin, maxAbs * 1.08];

      const barColor = category === "avg_age" ? "#3B82F6" : "#10B981";

      const chart = Plot.plot({
        width: actualWidth,
        height: isReportMode ? calculatedChartHeight : regionTotals.length > BAR_HEIGHT_THRESHOLD ? calculatedChartHeight : size.height,
        marginTop: margin.top,
        marginRight: margin.right,
        marginBottom: margin.bottom,
        marginLeft: regionTotals.length > BAR_HEIGHT_THRESHOLD ? margin.left : 55,
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
            fill: isReportMode ? "black" : "#e9e9e9",
            fontSize: "14px",
          }),
          Plot.ruleX([xMin], { stroke: "#e9e9e9", opacity: 0.5 }),
        ],
        style: {
          fontSize: "15px",
          color: isReportMode ? "black" : "#e9e9e9",
          background: isReportMode ? "transparent" : undefined,
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
  }, [chartData, category, size, isReportMode, firstMap]);

  const handleDownloadCsv = () => {
    const columns: CsvColumn[] = [{ title: "지역", dataIndex: "region" }];

    if (category === "avg_age") {
      columns.push({ title: "평균 연령", dataIndex: "avg_age" });
    } else if (category === "count") {
      columns.push({ title: "총 경영체 수", dataIndex: "count" });
    }

    const sortedChartData = [...chartData].sort((a, b) => {
      const valA = a[category] ?? 0;
      const valB = b[category] ?? 0;
      return valB - valA;
    });

    downloadCsv(columns, sortedChartData, `경영체_연령_분포_차트_데이터_${category}.csv`);
  };

  return (
    <div className="h-full w-full">
      <div className="mb-[8px] flex items-center justify-between">
        <p className="text-xl font-semibold">{title}</p>
        {!isReportMode && (
          <Button type="primary" onClick={handleDownloadCsv}>
            CSV 다운로드
          </Button>
        )}
      </div>
      <div
        ref={containerRef}
        style={isReportMode ? {} : { height: `${size.height}px` }}
        className={isReportMode ? "w-full min-w-full" : "custom-dark-scroll min-w-full overflow-y-auto"}
      />
    </div>
  );
};

export default AgingStatusDivergingBarChart;
