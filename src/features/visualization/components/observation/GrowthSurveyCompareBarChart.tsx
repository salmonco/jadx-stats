import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import visualizationApi from "~/services/apis/visualizationApi";
import { categoryMap, categoryUnitMap, compareKeyMap } from "~/features/visualization/layers/MandarinGrowthSurveyLayer";
import * as d3 from "d3";

interface Props {
  selectedTargetYear: number;
  selectedStandardYear: number;
  selectedCategroy: string;
}

const GrowthSurveyCompareBarChart = ({ selectedTargetYear, selectedStandardYear, selectedCategroy }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height: 420 });

  const { data: charData } = useQuery({
    queryKey: ["mandarinGrowthSurveyBarChartData", selectedTargetYear, selectedStandardYear, selectedCategroy],
    queryFn: () => visualizationApi.getMandarinGrowthSurveyCompare("do", selectedTargetYear, selectedStandardYear, selectedCategroy, null),
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      setSize({
        width,
        height: Math.max(300, height),
      });
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!charData || !Array.isArray(charData.features)) return;

    const feature = charData.features[0];
    if (!feature?.properties?.stats) return;

    const { width, height } = size;
    const margin = { top: 50, right: 15, bottom: 30, left: 40 };

    const statsEntries = Object.entries(feature.properties.stats)
      .filter(([key, value]) => !isNaN(Number(key)) && value && value[compareKeyMap[selectedCategroy]] !== undefined)
      .map(([year, data]) => ({
        year: Number(year),
        value: Number(data[compareKeyMap[selectedCategroy]]),
      }))
      .sort((a, b) => a.year - b.year);

    if (statsEntries.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const x = d3
      .scaleBand()
      .domain(statsEntries.map((d) => d.year.toString()))
      .range([margin.left, width - margin.right])
      .padding(statsEntries?.length <= 2 ? 0.6 : statsEntries?.length <= 5 ? 0.4 : 0.35);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(statsEntries, (d) => d.value)! * 1.05])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Y축 격자선
    svg
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .tickSize(-(width - margin.left - margin.right))
          .tickFormat(null)
      )
      .selectAll<SVGLineElement, unknown>("line")
      .attr("transform", `translate(${margin.left}, 0)`)
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.5)
      .attr("opacity", 0.2);

    const tooltip = d3.select(tooltipRef.current);

    const bars = svg.append("g");

    bars
      .selectAll("rect")
      .data(statsEntries)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.year.toString())!)
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.value))
      .attr("fill", "#007CDB")
      .style("cursor", "pointer")
      .on("mouseover", function (_, d) {
        tooltip
          .html(
            `
              <div style="display: grid; grid-template-columns: auto 1fr; column-gap: 6px; padding: 14px 18px 14px 14px;">
                <div style="color: #FFC132; font-size: 16px;">▶</div>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <div style="color: #FFC132;"><strong>${d.year}</strong></div>
                  <div>${categoryMap[selectedCategroy]} : ${d.value} ${categoryUnitMap[selectedCategroy]}</div>
                </div>
              </div>
            `
          )
          .style("display", "block")
          .style("visibility", "visible")
          .style("pointer-events", "none");

        d3.select(this).attr("fill", "#0055AA");
      })
      .on("mousemove", function (event) {
        tooltip.style("left", `${event.clientX + 10}px`).style("top", `${event.clientY - 20}px`);
      })
      .on("mouseout", function () {
        tooltip.style("display", "none");
        d3.select(this).attr("fill", "#007CDB");
      });

    // X축
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("font-size", "14px")
      .attr("transform", "rotate(0)");

    // Y축
    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y)).selectAll("text").attr("font-size", "14px").attr("fill", "#fff");

    svg
      .append("text")
      .attr("x", 5) // Y축 선 옆에
      .attr("y", 22) // 그래프 상단에서 살짝 띄워
      .attr("text-anchor", "start")
      .attr("font-size", "15px")
      .attr("fill", "#fff")
      .text(`${categoryMap[selectedCategroy]}${categoryUnitMap[selectedCategroy] ? ` (${categoryUnitMap[selectedCategroy]})` : ""}`);

    // 축 domain 선 제거
    svg.selectAll(".domain").remove();
    svg.selectAll(".tick line").attr("stroke", "#fff").attr("stroke-width", 1);
  }, [charData, size, selectedTargetYear, selectedStandardYear, selectedCategroy]);

  return (
    <div className="flex h-full w-full flex-col">
      <p className="text-xl font-semibold">제주도 연도별 {categoryMap[selectedCategroy]} 평균 비교</p>
      <div className="relative h-full w-full" ref={containerRef}>
        <svg ref={svgRef} />
        <div
          ref={tooltipRef}
          style={{
            position: "fixed",
            background: "#37445E",
            color: "#fff",
            borderRadius: "6px",
            fontSize: "16px",
            display: "none",
            pointerEvents: "none",
            zIndex: 100,
          }}
        />
      </div>
    </div>
  );
};

export default GrowthSurveyCompareBarChart;
