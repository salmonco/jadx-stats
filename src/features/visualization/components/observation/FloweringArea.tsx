import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { FloweringChartData } from "~/pages/visualization/observation/MandarinFlowering";

interface Props {
  year: number;
  chartData: FloweringChartData;
  xDomain: string[];
  dataIdx: number;
  numDates: number;
}

const FloweringArea = ({ year, chartData, xDomain, dataIdx, numDates }: Props) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!chartData) return;
    drawChart();
  }, [chartData, dataIdx, numDates]);

  const drawChart = () => {
    d3.select(ref.current).selectAll("*").remove();

    const { clientWidth, clientHeight } = ref.current;

    const margin = { top: 12, right: 5, bottom: 20, left: 25 };
    const width = clientWidth - margin.left - margin.right;
    const height = clientHeight - margin.top - margin.bottom;
    const svg = d3.select(ref.current).append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const dataMap = new Map(chartData.data.map((d) => [d.ymd.slice(5), d]));
    const slicedMMDDs = xDomain.slice(0, numDates); // ["04-25", "04-26", ...]
    const slicedData = slicedMMDDs.map((mmdd) => {
      const d = dataMap.get(mmdd);
      return d ?? { ymd: `${year}-${mmdd}`, scl_area: 0, altd: [], stats: [] };
    });

    const xScale = d3
      .scaleBand()
      .domain(slicedMMDDs)
      .range([margin.left, width - margin.right])
      .padding(0.1);
    const maxArea = d3.max(slicedData, (d) => d.scl_area);
    const yScale = d3
      .scaleLinear()
      .domain([0, maxArea])
      .range([height - margin.bottom, margin.top]);
    const colorScale = d3.scaleSequential(d3.interpolateTurbo).domain([0, maxArea]);

    svg
      .append("g")
      .selectAll()
      .data(slicedData)
      .join("rect")
      .attr("x", (d) => xScale(d.ymd.slice(5)))
      .attr("y", (d, i) => (i === dataIdx ? yScale(slicedData[i - 1] ? slicedData[i - 1].scl_area : d.scl_area) : yScale(d.scl_area)))
      .attr("height", (d, i) => (i === dataIdx ? yScale(0) - yScale(slicedData[i - 1] ? slicedData[i - 1].scl_area : d.scl_area) : yScale(0) - yScale(d.scl_area)))
      .attr("width", xScale.bandwidth())
      .attr("fill", (d, i) => {
        return i >= dataIdx ? "rgba(50,50,50,0.02)" : colorScale(d.scl_area);
      })
      .transition()
      .duration(900)
      .attr("y", (d) => yScale(d.scl_area))
      .attr("height", (d) => yScale(0) - yScale(d.scl_area))
      .attr("fill", (d, i) => {
        return i > dataIdx ? "rgba(50,50,50,0.02)" : colorScale(d.scl_area);
      });

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickSizeOuter(0)
          .tickFormat((d) => {
            const pared = new Date(d);
            return d3.timeFormat("%m/%d")(pared);
          })
      )
      .style("font-size", "12px")
      .style("color", "#ffffffa6")
      .selectAll("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-45)");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).tickFormat((d) => ((d as number) / 10000).toLocaleString()))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .append("text")
          .attr("x", -margin.left * 2)
          .attr("y", 5)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("면적(ha)")
      )
      .style("font-size", "14px")
      .style("color", "#ffffffa6");
  };

  return (
    <div className="flex h-full w-full flex-col gap-[12px]">
      <p className="text-xl font-semibold text-white">일자별 개화</p>
      <svg ref={ref} width="100%" height="100%" />
    </div>
  );
};

export default FloweringArea;
