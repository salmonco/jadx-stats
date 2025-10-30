import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { YearlyGroundwaterData } from "~/services/types/visualizationTypes";

interface Props {
  element: string;
  data: YearlyGroundwaterData;
}

const YearlyGroundwaterBarChart = ({ element, data }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
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

  useEffect(() => {
    if (!svgRef.current || !Object.keys(data).length || !dimensions.width) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 30, right: 20, bottom: 50, left: 30 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const years = Object.keys(data);
    const regions = ["제주", "서귀", "평균"];

    const x0 = d3.scaleBand().domain(years).rangeRound([0, width]).paddingInner(0.1);

    const x1 = d3.scaleBand().domain(regions).rangeRound([0, x0.bandwidth()]).padding(0.05);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(years, (year) => d3.max(regions, (region) => data[year][region]))])
      .nice()
      .rangeRound([height, 0]);

    const color = d3.scaleOrdinal().domain(regions).range(["#4A90E2", "#50E3C2", "#F5A623"]);

    const xAxis = (g) => g.attr("transform", `translate(0,${height})`).call(d3.axisBottom(x0).tickSizeOuter(0)).selectAll("text").style("font-size", "14px");

    const yAxis = (g) =>
      g
        .call(d3.axisLeft(y).ticks(null, "s"))
        .call((g) => g.select(".domain").remove())
        .selectAll("text")
        .style("font-size", "14px");

    const yGrid = (g) =>
      g
        .attr("class", "grid")
        .call(
          d3
            .axisLeft(y)
            .tickSize(-width)
            .tickFormat(() => "")
        )
        .call((g) => g.select(".domain").remove())
        .selectAll("line")
        .style("stroke", "#e0e0e0");

    const svgContent = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    svgContent.append("g").call(yGrid);
    svgContent.append("g").call(xAxis);
    svgContent.append("g").call(yAxis);

    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    svgContent
      .append("g")
      .selectAll("g")
      .data(years)
      .join("g")
      .attr("transform", (d) => `translate(${x0(d)},0)`)
      .selectAll("rect")
      .data((year) =>
        regions.map((region) => ({
          year,
          region,
          value: data[year][region],
        }))
      )
      .join("rect")
      .attr("x", (d) => x1(d.region))
      .attr("y", (d) => y(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", (d) => y(0) - y(d.value))
      .attr("fill", (d) => color(d.region) as string)
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`${d.year}년 ${d.region}<br>${d.value.toLocaleString()}`)
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    const legend = svgContent
      .append("g")
      .attr("transform", `translate(${width - 150}, -30)`)
      .selectAll("g")
      .data(regions)
      .join("g")
      .attr("transform", (_, i) => `translate(${i * 55}, 0)`);

    legend
      .append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", (d) => color(d) as string);

    legend
      .append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dx", -2)
      .attr("dy", "0.35em")
      .style("font-size", "14px")
      .text((d) => d);
  }, [data, dimensions]);

  return (
    <div ref={containerRef} className="h-full w-full">
      <p className="text-2xl font-semibold">{element}</p>
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  );
};

export default YearlyGroundwaterBarChart;
