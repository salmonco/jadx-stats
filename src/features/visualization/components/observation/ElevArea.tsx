import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { FloweringChartData } from "~/pages/visualization/observation/MandarinFlowering";

interface Props {
  year: number;
  chartData: FloweringChartData;
  dataIdx: number;
  numDates: number;
}

const ElevArea = ({ year, chartData, dataIdx, numDates }: Props) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!chartData) return;
    drawChart();
  }, [chartData, dataIdx, numDates]);

  const drawChart = () => {
    const { clientWidth, clientHeight } = ref.current;

    const margin = { top: 17, right: 10, bottom: 20, left: 22 };
    const width = clientWidth - margin.left - margin.right;
    const height = clientHeight - margin.top - margin.bottom;
    const svg = d3.select(ref.current).selectAll("g").data([null]).join("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Slice the data based on numDates
    const bins = chartData?.data.slice(0, numDates)[dataIdx]?.altd;

    const xScale = d3
      .scaleLinear()
      .domain([bins[0]?.x0, 300])
      .range([margin.left, width - margin.right]);

    const maxArea = 11000000;

    const colorScale = d3.scaleSequential(d3.interpolateOranges).domain([-maxArea * 0.2, maxArea * 0.8]);

    const yScale = d3
      .scaleLinear()
      .domain([0, maxArea])
      .range([height - margin.bottom, margin.top]);

    // 바를 다시 찾기 위해 key를 사용
    const bars = svg.selectAll("rect").data(bins, (d: any) => d.x0);

    // Enter + Update
    bars.join(
      (enter) =>
        enter
          .append("rect")
          .attr("x", (d) => xScale(d.x0) + 1)
          .attr("width", (d) => xScale(d.x1) - xScale(d.x0) - 1)
          .attr("y", yScale(0)) // 시작 y
          .attr("height", 0) // 시작 높이
          .attr("fill", (d) => colorScale(d.scl_area))
          .call((enter) =>
            enter
              .transition()
              .duration(900)
              .attr("y", (d) => yScale(d.scl_area))
              .attr("height", (d) => yScale(0) - yScale(d.scl_area))
          ),
      (update) =>
        update.call((update) =>
          update
            .transition()
            .duration(900)
            .attr("y", (d) => yScale(d.scl_area))
            .attr("height", (d) => yScale(0) - yScale(d.scl_area))
            .attr("fill", (d) => colorScale(d.scl_area))
        ),
      (exit) => exit.remove()
    );

    // X 라벨
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickSizeOuter(0)
          .tickFormat((d) => d.toLocaleString())
      )
      .style("font-size", "12px")
      .style("color", "#ffffffa6")
      .selectAll("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-45)");

    // Y 라벨
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).tickFormat((d) => ((d as number) / 10000).toLocaleString()))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .append("text")
          .attr("x", -margin.left * 2)
          .attr("y", 0)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("면적(ha)")
      )
      .style("font-size", "12px")
      .style("color", "#ffffffa6");
  };

  return (
    <div className="flex h-full w-full flex-col gap-[12px]">
      <p className="text-xl font-semibold text-white">고도별 개화</p>
      <svg ref={ref} width="100%" height="100%" />
    </div>
  );
};

export default ElevArea;
