import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { FloweringChartData } from "~/pages/visualization/observation/MandarinFlowering";

type RegionName = "구좌" | "남원" | "대정" | "서귀" | "성산" | "안덕" | "애월" | "제주" | "조천" | "중문" | "표선" | "한경" | "한림";
const regions: RegionName[] = ["구좌", "남원", "대정", "서귀", "성산", "안덕", "애월", "제주", "조천", "중문", "표선", "한경", "한림"];

interface Props {
  year: number;
  chartData: FloweringChartData;
  xDomain: string[]; // ["04-25", "04-26", ...]
  dataIdx: number;
  numDates: number;
}

const FloweringRegionArea = ({ year, chartData, xDomain, dataIdx, numDates }: Props) => {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!chartData) return;
    drawChart();
  }, [chartData, dataIdx, numDates]);

  const drawChart = () => {
    if (!chartRef.current) return;
    d3.select(chartRef.current).selectAll("*").remove();

    const slicedMMDDs = xDomain.slice(0, numDates);
    const dataMap = new Map(chartData.data.map((d) => [d.ymd.slice(5), d]));
    const lastData = chartData.data.at(-1);

    const data: {
      date: string;
      region: string;
      total: number;
      current: number;
      pct: number;
    }[] = [];

    slicedMMDDs.forEach((mmdd) => {
      const dayData = dataMap.get(mmdd);
      regions.forEach((region) => {
        const total = lastData?.stats.find((r) => r.rgn_nm === region)?.area ?? 1;
        const current = dayData?.stats.find((r) => r.rgn_nm === region)?.area ?? 0;
        data.push({
          date: mmdd,
          region,
          total,
          current,
          pct: current / total,
        });
      });
    });

    const { clientWidth, clientHeight } = chartRef.current;
    const margin = { top: 2, right: 21, bottom: 20, left: 17 };
    const width = clientWidth - margin.left - margin.right;
    const height = clientHeight - margin.top - margin.bottom;

    const svg = d3.select(chartRef.current).append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleBand()
      .domain(slicedMMDDs)
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3
      .scaleBand()
      .domain(regions)
      .range([height - margin.bottom, margin.top])
      .padding(0.1);

    const colorScale = d3.scaleSequential(d3.interpolateTurbo).domain([0, 1]);

    // 히트맵 사각형
    svg
      .append("g")
      .selectAll()
      .data(data)
      .join("rect")
      .attr("x", (d) => xScale(d.date)!)
      .attr("y", (d) => yScale(d.region)!)
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", (d, i) => {
        if (slicedMMDDs.indexOf(d.date) <= dataIdx) return colorScale(d.pct);
        return "rgba(0,0,0,0.1)";
      });

    // X축
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickSizeOuter(0)
          .tickFormat((d) => {
            const [mm, dd] = (d as string).split("-");
            return `${+mm}/${+dd}`;
          })
      )
      .style("font-size", "12px")
      .style("color", "#ffffffa6")
      .selectAll("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-45)");

    // Y축
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .selectAll(".tick text")
      .style("font-size", "13px")
      .style("color", "#ffffffa6");

    // 개화율 100% 이상 지역 강조
    // const regionsFullyBloomed = new Set<string>();
    // regions.forEach((region) => {
    //   const bloomProgress = data
    //     .filter((d) => d.region === region)
    //     .filter((d, i) => i % regions.length === 0 || slicedMMDDs.indexOf(d.date) <= dataIdx)
    //     .map((d) => d.pct);
    //   if (bloomProgress.some((pct) => pct >= 1)) {
    //     regionsFullyBloomed.add(region);
    //   }
    // });

    // 현재 시점 개화율 텍스트
    const currentFlowering = regions.map((region) => {
      const entry = data.find((d) => d.region === region && slicedMMDDs.indexOf(d.date) === dataIdx);
      return {
        region,
        pct: entry ? Math.min(entry.pct * 100, 100) : 0,
      };
    });

    svg
      .append("g")
      .attr("transform", `translate(${width - 20}, 0)`)
      .selectAll("text")
      .data(currentFlowering)
      .join("text")
      .attr("y", (d) => yScale(d.region)! + yScale.bandwidth() / 2)
      .attr("x", 0)
      .attr("dy", "0.35em")
      .style("text-anchor", "start")
      .style("font-size", "12px")
      .style("fill", (d) => (d.pct >= 100 ? "#FFD700" : "#ffffffa6"))
      .style("font-weight", (d) => (d.pct >= 100 ? "semibold" : "normal"))
      .text((d) => `${d.pct.toFixed(1)}%`);
  };

  return (
    <div className="flex h-full w-full flex-col gap-[12px]">
      <p className="text-xl font-semibold text-white">지역별 개화율</p>
      <svg ref={chartRef} width="100%" height="100%" />
    </div>
  );
};

export default FloweringRegionArea;
