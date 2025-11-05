import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { getColor } from "~/maps/constants/mandarinCultivationInfo";

interface Props {
  chartData: any;
  selectedVariety: string;
}

const MandarinCultivationPieChart = ({ chartData, selectedVariety }: Props) => {
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
    if (!chartData) return;

    const { width, height } = size;
    const radius = Math.min(width, height) / 2 - 40;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const group = svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pieData = Object.entries(chartData)
      .map(([region, products]) => {
        const match = (products as any[]).find((p) => p.prdct_nm === selectedVariety);
        return match ? { region, total_area: match.total_area } : null;
      })
      .filter((d) => d !== null) as { region: string; total_area: number }[];

    if (pieData.length === 0) return;

    const pieDataSorted = [...pieData].sort((a, b) => b.total_area - a.total_area);

    const color = d3
      .scaleOrdinal<string, string>()
      .domain(pieData.map((d) => d.region))
      .range(d3.schemeCategory10);

    const pie = d3
      .pie<{ region: string; total_area: number }>()
      .sort(null)
      .value((d) => d.total_area)
      .startAngle(-Math.PI * 2) // 첫번째 조각 12시 부터 시작
      .endAngle(1.5 * Math.PI);

    const arc = d3
      .arc<any>()
      .innerRadius(radius * 0.75)
      .outerRadius(radius);

    const tooltip = d3.select(tooltipRef.current);

    const paths = group
      .selectAll("path")
      .data(pie(pieDataSorted))
      .join("path")
      .attr("d", arc)
      .attr("fill", (_, i) => getColor(i))
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
                  <div style="color: #FFC132;"><strong>${d.data.region}</strong></div>
                  <div>${(d.data.total_area / 10000).toFixed(1).toLocaleString()} ha</div>
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

    const totalValue = pieData.reduce((sum, d) => sum + d.total_area, 0);
    group
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "18px")
      .style("font-weight", "600")
      .style("fill", "#ffffff")
      .text(`총 재배 면적 : ${(totalValue / 10000).toFixed(1).toLocaleString()}ha`);
  }, [chartData, selectedVariety, size]);

  return (
    <div className="flex h-full w-full flex-col text-white">
      <p className="text-xl font-semibold">
        {selectedVariety === "YN-26"
          ? "유사실생"
          : selectedVariety === "감평"
            ? "레드향"
            : selectedVariety === "세토카"
              ? "천혜향"
              : selectedVariety === "부지화"
                ? "한라봉"
                : (selectedVariety ?? "")}{" "}
        지역별 재배면적 (원 그래프)
      </p>
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

export default MandarinCultivationPieChart;
