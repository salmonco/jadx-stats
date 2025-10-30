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

const GrowthSurveyCompareSpiderChart = ({ selectedTargetYear, selectedStandardYear, selectedCategroy }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height: 420 });

  // 읍/면 으로 고정, targetYear, standardYear, category만 사용
  const { data: charData } = useQuery({
    queryKey: ["mandarinGrowthSurveySpiderChartData", selectedTargetYear, selectedStandardYear, selectedCategroy],
    queryFn: () => visualizationApi.getMandarinGrowthSurveyCompare("emd", selectedTargetYear, selectedStandardYear, selectedCategroy, null),
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

    const { width, height } = size;
    // const margin = { top: 25, right: 20, bottom: 30, left: 50 };

    const processedData: { name: string; targetValue: number; standardValue: number }[] = charData.features
      .map((feature: any) => {
        const targetRaw = feature.properties.stats?.[selectedTargetYear]?.[compareKeyMap[selectedCategroy]];
        const standardRaw = feature.properties.stats?.[selectedStandardYear]?.[compareKeyMap[selectedCategroy]];
        return {
          name: feature.properties.vrbs_nm || feature.properties.nm,
          targetValue: targetRaw !== undefined && targetRaw !== null ? Number(targetRaw) : NaN,
          standardValue: standardRaw !== undefined && standardRaw !== null ? Number(standardRaw) : NaN,
        };
      })
      .filter((d) => !isNaN(d.targetValue) && !isNaN(d.standardValue));

    if (processedData.length === 0) return;

    const radius = Math.min(width, height) / 2 - 40;
    const centerX = width / 2;
    const centerY = height / 2;

    const maxTarget = d3.max(processedData, (d) => d.targetValue) || 1;
    const maxStandard = d3.max(processedData, (d) => d.standardValue) || 1;
    const maxValue = Math.max(maxTarget, maxStandard);

    const angleSlice = (Math.PI * 2) / processedData.length;

    const scale = d3.scaleLinear().domain([0, maxValue]).range([0, radius]);

    const targetPoints = processedData.map((d, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const r = scale(d.targetValue!);
      return [centerX + r * Math.cos(angle), centerY + r * Math.sin(angle)];
    });

    const standardPoints = processedData.map((d, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const r = scale(d.standardValue!);
      return [centerX + r * Math.cos(angle), centerY + r * Math.sin(angle)];
    });

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    // 그리드 원
    svg.append("circle").attr("cx", centerX).attr("cy", centerY).attr("r", radius).attr("fill", "none").attr("stroke", "#ccc");

    // 각 축
    processedData.forEach((d, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const xPos = centerX + (radius + 22) * Math.cos(angle);
      const yPos = centerY + (radius + 22) * Math.sin(angle);

      svg
        .append("line")
        .attr("x1", centerX)
        .attr("y1", centerY)
        .attr("x2", centerX + radius * Math.cos(angle))
        .attr("y2", centerY + radius * Math.sin(angle))
        .attr("stroke", "#fff");

      svg
        .append("text")
        .attr("x", xPos)
        .attr("y", yPos)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "500")
        .attr("fill", "#fff")
        .style("cursor", "pointer")
        .text(d.name)
        .on("mouseover", function (_) {
          d3.select(tooltipRef.current)
            .html(
              `
                <div style="display: grid; grid-template-columns: auto 1fr; column-gap: 6px; padding: 14px 20px 14px 14px;">
                  <div style="color: #FFC132; font-size: 16px;">▶</div>
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <div style="color: #FFC132;"><strong>${d.name}</strong></div>
                    <div>${selectedTargetYear}년 : ${d.targetValue.toFixed(2)}${categoryUnitMap[selectedCategroy]}</div>
                    <div>${selectedStandardYear}년 : ${d.standardValue.toFixed(2)}${categoryUnitMap[selectedCategroy]}</div>
                  </div>
                </div>
              `
            )
            .style("display", "block")
            .style("visibility", "visible")
            .style("pointer-events", "none");
        })
        .on("mousemove", function (event) {
          d3.select(tooltipRef.current)
            .style("left", `${event.clientX + 10}px`)
            .style("top", `${event.clientY - 20}px`);
        })
        .on("mouseout", function () {
          d3.select(tooltipRef.current).style("display", "none");
        });
    });

    // targetYear 폴리곤
    svg
      .append("polygon")
      .attr("points", targetPoints.map((p) => p.join(",")).join(" "))
      .attr("fill", "#007CDB")
      .attr("fill-opacity", 0.4)
      .attr("stroke", "#007CDB")
      .attr("stroke-width", 2);

    // standardYear 폴리곤
    svg
      .append("polygon")
      .attr("points", standardPoints.map((p) => p.join(",")).join(" "))
      .attr("fill", "#FF1F1F")
      .attr("fill-opacity", 0.3)
      .attr("stroke", "#FF1F1F")
      .attr("stroke-width", 2);

    if (legendRef.current) {
      legendRef.current.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px; font-size: 16px; color: #fff; ">
            <div style="display: flex; align-items: center; gap: 4px;">
              <div style="width: 16px; height: 16px; background-color: #007CDB; border-radius: 2px;"></div>
              <span>${selectedTargetYear}년</span>
            </div>
            <div style="display: flex; align-items: center; gap: 4px;">
              <div style="width: 16px; height: 16px; background-color: #FF1F1F; border-radius: 2px;"></div>
              <span>${selectedStandardYear}년</span>
            </div>
          </div>
        `;
    }
  }, [charData, size, selectedTargetYear, selectedStandardYear, selectedCategroy]);

  return (
    <div className="relative flex h-full w-full flex-col">
      <p className="text-xl font-semibold">지역별 {categoryMap[selectedCategroy]} 평균값 비교</p>
      <div className="absolute right-0 top-0" ref={legendRef} />
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

export default GrowthSurveyCompareSpiderChart;
