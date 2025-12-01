import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import InfoTooltip from "~/components/InfoTooltip";

interface Props {
  chartData: any;
  isReportMode?: boolean;
}

const SimulatorResult = ({ chartData, isReportMode }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height: 420 });

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
    if (!chartData || chartData.length === 0 || !svgRef.current) return;

    // Filter out zero values
    const filteredData = chartData.filter((d: any) => d.value > 0);
    if (filteredData.length === 0) return;

    const { width, height } = size;
    const radius = Math.min(width, height) / 2 - 40;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const group = svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2})`);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3
      .pie<any>()
      .sort(null)
      .value((d) => d.value)
      .startAngle(-Math.PI * 2)
      .endAngle(1.5 * Math.PI);

    const arc = d3
      .arc<any>()
      .innerRadius(radius * 0.75)
      .outerRadius(radius);

    const tooltip = d3.select(tooltipRef.current);

    const paths = group
      .selectAll("path")
      .data(pie(filteredData))
      .join("path")
      .attr("d", arc)
      .attr("fill", (d, i) => colorScale(i.toString()))
      .attr("stroke", "#a9a9a9")
      .attr("stroke-width", 1)
      .style("cursor", "pointer");

    paths
      .on("mouseover", function (_, d) {
        tooltip
          .html(
            `
              <div style="display: grid; grid-template-columns: auto 1fr; column-gap: 6px; padding: 14px 18px 14px 14px;">
                <div style="color: #FFC132; font-size: 16px;">▶</div>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <div style="color: #FFC132;"><strong>${d.data.label}</strong></div>
                  <div>${(d.data.value / 10000).toFixed(1)} ha</div>
                </div>
              </div>
            `
          )
          .style("display", "block")
          .style("visibility", "visible")
          .style("pointer-events", "none");
        d3.select(this).attr("fill-opacity", 0.7);
      })
      .on("mousemove", function (event) {
        tooltip.style("left", `${event.clientX + 10}px`).style("top", `${event.clientY - 20}px`);
      })
      .on("mouseout", function () {
        tooltip.style("display", "none");
        d3.select(this).attr("fill-opacity", 1);
      });

    const totalValue = filteredData.reduce((sum: number, d: any) => sum + d.value, 0);
    group
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "18px")
      .style("font-weight", "600")
      .style("fill", isReportMode ? "black" : "#ffffff")
      .text(`총 면적: ${(totalValue / 10000).toFixed(1)}ha`);
  }, [chartData, size, isReportMode]);

  if (!chartData || chartData.length === 0) {
    return null;
  }

  const filteredCount = chartData.filter((d: any) => d.value > 0).length;

  return (
    <div className={`flex h-full w-full flex-col ${isReportMode ? "text-black" : "text-white"}`}>
      <div className="mb-2 flex items-center gap-[10px]">
        <p className="text-xl font-semibold">지역별 경제수령 면적 {filteredCount === 20 && "(상위 20개 지역)"}</p>
        {!isReportMode && (
          <InfoTooltip
            title="지역별 경제수령 면적이란?"
            content={`경제수령기(일반적으로 수령 15~25년)의 감귤나무가 지역별로 얼마나 재배되고 있는지를 나타내는 자료입니다.\n경제수령기의 나무는 생산성이 높고 과실 품질이 우수하기 때문에, 해당 지역의 생산 효율성과 경쟁력을 가늠하는 \n데 지표가 됩니다.`}
          />
        )}
      </div>
      <div ref={containerRef} className="relative flex-1">
        <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
        <div
          ref={tooltipRef}
          className="pointer-events-none fixed z-50 rounded-lg border border-gray-300 bg-[#37445E] text-white shadow-lg"
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

export default SimulatorResult;
