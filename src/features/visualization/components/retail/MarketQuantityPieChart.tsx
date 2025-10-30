import * as d3 from "d3";
import { useEffect, useRef, useMemo, useState } from "react";
import { MarketQuantityData } from "~/pages/visualization/retail/WholesaleMarketShare";
import { getMarketRegionData } from "~/features/visualization/utils/marketDataUilts";

interface Props {
  quantityData: MarketQuantityData[];
  selectedPummok: string;
  selectedTargetYear: number;
  selectedTargetMonth: number;
}

const colors = ["#6771DC", "#66B7DC", "#C667DC", "#FFD65C", "#E57430"];

const MarketQuantityPieChart = ({ quantityData, selectedPummok, selectedTargetYear, selectedTargetMonth }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [size, setSize] = useState(300);

  const { quantityJeju, quantityRest } = getMarketRegionData(quantityData, selectedPummok, selectedTargetYear, selectedTargetMonth);

  const pieData = useMemo(() => {
    return [...quantityJeju, ...quantityRest]
      .filter((d) => d.region && d.quantitySum > 0 && d.region !== "제주도")
      .map((d) => ({
        name: d.region,
        value: d.quantitySum,
      }));
  }, [quantityJeju, quantityRest]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (wrapperRef.current) {
        const { width, height } = wrapperRef.current.getBoundingClientRect();
        const legendWidth = 170;
        const padding = 70;
        const availableWidth = width - legendWidth - 24;
        const availableHeight = height - padding;
        const newSize = Math.min(availableWidth, availableHeight, 400);

        if (newSize > 0) setSize(newSize);
      }
    });

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const radius = size / 2;
    const color = d3.scaleOrdinal(colors);
    const pie = d3.pie<any>().value((d) => d.value);
    const arc = d3
      .arc<any>()
      .innerRadius(radius * 0.75)
      .outerRadius(radius);

    const legendWidth = 170;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", size + legendWidth).attr("height", size);

    const chart = svg.append("g").attr("transform", `translate(${radius}, ${radius})`);

    const tooltip = d3.select(tooltipRef.current);

    chart
      .selectAll("path")
      .data(pie(pieData))
      .join("path")
      .attr("d", arc)
      .attr("fill", (_, i) => color(i.toString()))
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.6)
      .attr("class", "pie-slice")
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.selectAll(".pie-slice").style("opacity", 0.5);
        d3.select(this).style("opacity", 1);

        const tooltipInnerHTML = `
          <div style="display: grid; grid-template-columns: auto 1fr; column-gap: 6px;">
            <div style="color: #FFC132; font-size: 16px;">▶</div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="color: #FFC132;"><strong>${d.data.name}</strong></div>
              <div style="color: #fff;">${(d.data.value / 1000).toFixed(1).toLocaleString()}톤</div>
            </div>
          </div>
        `;

        tooltip
          .html(tooltipInnerHTML)
          .style("display", "block")
          .style("padding", "14px 20px 14px 14px")
          .style("font-size", "16px")
          .style("left", `${event.clientX + 10}px`)
          .style("top", `${event.clientY + 10}px`)
          .style("visibility", "visible")
          .style("pointer-events", "none");
      })
      .on("mousemove", function (event) {
        tooltip.style("left", `${event.clientX + 10}px`).style("top", `${event.clientY + 10}px`);
      })
      .on("mouseout", function () {
        d3.selectAll(".pie-slice").style("opacity", 1);
        tooltip.style("display", "none");
      });

    const totalValue = pieData.reduce((sum, d) => sum + d.value, 0);
    chart
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "24px")
      .style("font-weight", "500")
      .style("fill", "#FFFFFF")
      .text(`${(totalValue / 1000).toFixed(1).toLocaleString()}톤`);

    const legendX = size + 24;
    const legendY = size / 2 - (pieData.length * 24) / 2;

    const legend = svg.append("g").attr("transform", `translate(${legendX}, ${legendY})`);

    pieData.slice(0, 10).forEach((d, i) => {
      const y = i * 26;

      legend
        .append("rect")
        .attr("x", 0)
        .attr("y", y)
        .attr("width", 14)
        .attr("height", 14)
        .attr("fill", color(i.toString()))
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5);

      legend
        .append("text")
        .attr("x", 22)
        .attr("y", y + 12)
        .text(d.name)
        .attr("font-size", 16)
        .attr("fill", "#fff");
    });
  }, [pieData, size]);

  return (
    <div ref={wrapperRef} className="relative flex h-full w-full items-center justify-center">
      <svg ref={svgRef} />
      <div
        ref={tooltipRef}
        style={{
          position: "fixed",
          background: "#37445E",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: "6px",
          fontSize: "14px",
          display: "none",
          pointerEvents: "none",
          zIndex: 100,
        }}
      />
    </div>
  );
};

export default MarketQuantityPieChart;
