import { useRef, useEffect } from "react";
import * as d3 from "d3";
import { GroundwaterData, HistoricalData } from "~/pages/visualization/agricultureEnvironment/RegionNitrateNitrogen";

interface MetricsChartProps {
  data: GroundwaterData;
}

export const MetricsBarChart = ({ data }: MetricsChartProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const findLatestData = (historicalData: HistoricalData[]) => {
    const latestNitrogen = historicalData
      .filter((entry) => entry.elem === "nitrogen")
      .reduce((latest, entry) => {
        return new Date(entry.dt) > new Date(latest.dt) ? entry : latest;
      }, historicalData[0]);

    const latestChlorine = historicalData
      .filter((entry) => entry.elem === "chlorine")
      .reduce((latest, entry) => {
        return new Date(entry.dt) > new Date(latest.dt) ? entry : latest;
      }, historicalData[0]);

    const latestPh = historicalData
      .filter((entry) => entry.elem === "ph")
      .reduce((latest, entry) => {
        return new Date(entry.dt) > new Date(latest.dt) ? entry : latest;
      }, historicalData[0]);

    return {
      nitrogen: latestNitrogen.vl,
      chlorine: latestChlorine.vl,
      ph: latestPh.vl,
    };
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    d3.select(svgRef.current).selectAll("*").remove();

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    // 가장 최근 데이터를 추출
    const latestValues = findLatestData(data.dsctn);

    const barData = [
      { name: "질소", value: latestValues.nitrogen, color: "#FFC132" },
      { name: "염소", value: latestValues.chlorine, color: "#9DF05E" },
      { name: "pH", value: latestValues.ph, color: "#5EC6FF" },
    ];

    const margin = { top: 20, right: 10, bottom: 20, left: 40 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(barData.map((d) => d.name))
      .range([0, width])
      .padding(0.4);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(barData, (d) => d.value) || 0])
      .nice()
      .range([height, 0]);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll(".bar")
      .data(barData)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.name)!)
      .attr("y", (d) => y(d.value)!)
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value)!)
      .attr("fill", (d) => d.color);
  }, [data]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export const MetricsTimeSeriesChart: React.FC<MetricsChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const findRecentData = (historicalData: HistoricalData[]) => {
    const recentNitrogen = historicalData
      .filter((entry) => entry.elem === "nitrogen")
      .sort((a, b) => new Date(b.dt).getTime() - new Date(a.dt).getTime())
      .slice(0, 5)
      .reverse();

    const recentChlorine = historicalData
      .filter((entry) => entry.elem === "chlorine")
      .sort((a, b) => new Date(b.dt).getTime() - new Date(a.dt).getTime())
      .slice(0, 5)
      .reverse();

    const recentPh = historicalData
      .filter((entry) => entry.elem === "ph")
      .sort((a, b) => new Date(b.dt).getTime() - new Date(a.dt).getTime())
      .slice(0, 5)
      .reverse();

    return {
      nitrogen: recentNitrogen,
      chlorine: recentChlorine,
      ph: recentPh,
    };
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    d3.select(svgRef.current).selectAll("*").remove();

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    // 최근 5개 데이터를 오름차순으로 정렬해서 추출
    const recentValues = findRecentData(data.dsctn);

    const margin = { top: 20, right: 30, bottom: 20, left: 20 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X축: scaleBand를 사용하여 날짜를 동일한 간격으로 배치
    const allDates = recentValues.nitrogen.map((d) => d.dt);

    const x = d3.scaleBand().domain(allDates).range([0, width]).padding(0.1);

    const xAxis = d3.axisBottom(x).tickFormat((d) => d3.timeFormat("%y-%m-%d")(new Date(d as string)));

    svg.append("g").attr("transform", `translate(0,${height})`).call(xAxis);

    // Y축: 값
    const y = d3
      .scaleLinear()
      .domain([0, d3.max([...recentValues.nitrogen.map((d) => d.vl), ...recentValues.chlorine.map((d) => d.vl), ...recentValues.ph.map((d) => d.vl)]) || 0])
      .nice()
      .range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    const line = d3
      .line<HistoricalData>()
      .x((d) => x(d.dt)! + x.bandwidth() / 2) // x 좌표를 scaleBand의 중앙에 맞춤
      .y((d) => y(d.vl))
      .curve(d3.curveMonotoneX);

    svg.append("path").datum(recentValues.nitrogen).attr("fill", "none").attr("stroke", "#FFC132").attr("stroke-width", 2).attr("d", line);
    svg.append("path").datum(recentValues.chlorine).attr("fill", "none").attr("stroke", "#9DF05E").attr("stroke-width", 2).attr("d", line);
    svg.append("path").datum(recentValues.ph).attr("fill", "none").attr("stroke", "#5EC6FF").attr("stroke-width", 2).attr("d", line);

    svg
      .selectAll(".dot-nitrogen")
      .data(recentValues.nitrogen)
      .enter()
      .append("circle")
      .attr("class", "dot-nitrogen")
      .attr("cx", (d) => x(d.dt)! + x.bandwidth() / 2) // 점의 x 좌표도 동일하게 조정
      .attr("cy", (d) => y(d.vl))
      .attr("r", 3.5)
      .attr("fill", "#FFC132");

    svg
      .selectAll(".dot-chlorine")
      .data(recentValues.chlorine)
      .enter()
      .append("circle")
      .attr("class", "dot-chlorine")
      .attr("cx", (d) => x(d.dt)! + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.vl))
      .attr("r", 3.5)
      .attr("fill", "#9DF05E");

    svg
      .selectAll(".dot-ph")
      .data(recentValues.ph)
      .enter()
      .append("circle")
      .attr("class", "dot-ph")
      .attr("cx", (d) => x(d.dt)! + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.vl))
      .attr("r", 3.5)
      .attr("fill", "#5EC6FF");
  }, [data]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <svg ref={svgRef} />
    </div>
  );
};
