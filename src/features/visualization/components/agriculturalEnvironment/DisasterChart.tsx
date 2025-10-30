import * as d3 from "d3";
import { Feature } from "ol";
import { useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface ChartProps {
  data: Feature[];
  title: string;
  year: number;
  fiveYearsDataLoading: boolean;
}

const DisasterChart: React.FC<ChartProps> = ({ data, title, year, fiveYearsDataLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
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
    if (!svgRef.current || !legendRef.current || !data.length || !dimensions.width) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 70, right: 20, bottom: 20, left: 30 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const yearRange = { from: year - 4, to: year };
    const defaultYears = Array.from({ length: yearRange.to - yearRange.from + 1 }, (_, i) => yearRange.from + i);

    const processedData = d3.group(
      data.map((feature) => ({
        yr: feature.get("yr"),
        sgg_nm: feature.get("sgg_nm"),
      })),
      (d) => String(d.yr)
    );

    const groupedData = defaultYears.map((year) => {
      const features = processedData.get(String(year)) || [];
      const jeju = features.filter((f) => f.sgg_nm === "제주시").length;
      const seogwipo = features.filter((f) => f.sgg_nm === "서귀포시").length;
      return { year, 제주: jeju, 서귀: seogwipo };
    });

    const years = groupedData.map((d) => String(d.year));
    const regions = ["제주", "서귀"];
    const maxVal = d3.max(groupedData, (d) => Math.max(d.제주, d.서귀)) || 10;

    const x0 = d3.scaleBand().domain(years).rangeRound([0, width]).paddingInner(0.1);
    const x1 = d3.scaleBand().domain(regions).rangeRound([0, x0.bandwidth()]).padding(0.05);
    const y = d3.scaleLinear().domain([0, maxVal]).nice().rangeRound([height, 0]);
    const color = d3.scaleOrdinal<string>().domain(regions).range(["#4A90E2", "#50E3C2"]);

    const xAxis = (g) => g.attr("transform", `translate(0,${height})`).call(d3.axisBottom(x0).tickSizeOuter(0)).selectAll("text").style("font-size", "14px");

    const yAxis = (g) =>
      g
        .call(d3.axisLeft(y).ticks(null, "s"))
        .call((g) => g.select(".domain").remove())
        .selectAll("text")
        .style("font-size", "14px");

    const yGrid = (g) =>
      g
        .call(
          d3
            .axisLeft(y)
            .tickSize(-width)
            .tickFormat(() => "")
        )
        .call((g) => g.select(".domain").remove())
        .selectAll("line")
        .style("stroke", "#fff")
        .style("opacity", 0.2);

    const svgContent = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    svgContent.append("g").call(yGrid);
    svgContent.append("g").call(xAxis);
    svgContent.append("g").call(yAxis);

    // Add chart title above the chart
    svg
      .append("text")
      .attr("x", 0)
      .attr("y", margin.top / 2 - 10)
      .style("font-size", "20px")
      .style("font-weight", "500")
      .style("fill", "#fff")
      .text(title);

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
      .data(groupedData)
      .join("g")
      .attr("transform", (d) => `translate(${x0(String(d.year))},0)`)
      .selectAll("rect")
      .data((d) =>
        regions.map((region) => ({
          year: d.year,
          region,
          value: d[region],
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
          .html(`${d.year}년 ${d.region}<br>${d.value.toLocaleString()} 개소`)
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // 범례를 별도 div에 생성
    const legendContainer = d3.select(legendRef.current);
    legendContainer.selectAll("*").remove();

    const legendDiv = legendContainer.append("div").style("display", "flex").style("gap", "20px").style("align-items", "center");

    regions.forEach((region) => {
      const legendItem = legendDiv.append("div").style("display", "flex").style("align-items", "center").style("gap", "8px");
      legendItem.append("div").style("width", "18px").style("height", "18px").style("background-color", color(region)).style("border-radius", "2px");
      legendItem.append("span").style("color", "#fff").style("font-size", "14px").text(region);
    });
  }, [data, dimensions, title, year]);

  return fiveYearsDataLoading ? (
    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <Spin indicator={<LoadingOutlined spin style={{ color: "#fff", fontSize: "48px", marginBottom: "12px" }} />} />
      <div className="text-xs" style={{ textAlign: "center", marginTop: "10px" }}>
        데이터를 로딩중입니다. 잠시만 기다려주세요
      </div>
    </div>
  ) : (
    <div ref={containerRef} className="relative h-full w-full">
      <div className="absolute right-0 top-0 z-10" ref={legendRef} />
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  );
};

export default DisasterChart;
