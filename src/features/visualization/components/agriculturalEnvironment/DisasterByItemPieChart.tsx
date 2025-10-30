import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { DisasterByItemData } from "~/pages/visualization/agricultureEnvironment/DisasterByItem";
import { COLOR_MAPS } from "./DisasterAmountByYear";

interface Props {
  disasterByItem: DisasterByItemData;
  item: string;
}

const DisasterByItemPieChart = ({ disasterByItem, item }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!disasterByItem) return;

    const itemData = findItemData(disasterByItem, item);
    if (!itemData) return;

    const pieData = Object.entries(itemData.ctgry).map(([disaster, data]) => ({
      disaster,
      count: data.count,
    }));

    // 차트 설정
    const width = 270;
    const height = 270;
    const radius = Math.min(width, height) / 2;

    const pie = d3.pie<any>().value((d) => d.count);

    const arc = d3.arc<any>().innerRadius(0).outerRadius(radius);

    // SVG 생성
    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Tooltip div 생성
    const tooltip = d3
      .select(containerRef.current)
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("color", "#333")
      .style("padding", "8px 12px")
      .style("border-radius", "6px")
      .style("font-size", "16px")
      .style("box-shadow", "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)")
      .style("border", "1px solid rgba(0, 0, 0, 0.1)")
      .style("pointer-events", "none")
      .style("z-index", "100");

    // 파이 차트 생성 및 이벤트 핸들러 추가
    const arcs = svg.selectAll("arc").data(pie(pieData)).enter().append("g").attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => COLOR_MAPS[d.data.disaster as keyof typeof COLOR_MAPS] || "#7f8c8d")
      .style("stroke", "#d9d9d9")
      .style("stroke-width", "0.5px")
      .style("transition", "all 0.3s ease")
      .on("mouseover", (event, d) => {
        tooltip.style("visibility", "visible").html(`${d.data.disaster} : ${d.data.count.toLocaleString()}건`);

        d3.select(event.currentTarget).style("stroke", "white").style("stroke-width", "1px").style("opacity", 1);

        arcs
          .selectAll("path")
          .filter(function () {
            return this !== event.currentTarget;
          })
          .style("opacity", 0.2);
      })
      .on("mousemove", (event) => {
        tooltip.style("top", event.pageY - 40 + "px").style("left", event.pageX - 20 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");

        arcs.selectAll("path").style("stroke-width", "1px").style("opacity", 1);
      });

    return () => {
      d3.select(containerRef.current).select("svg").remove();
      d3.select(containerRef.current).select(".tooltip").remove();
    };
  }, [disasterByItem, item]);

  const findItemData = (data: DisasterByItemData, itemName: string) => {
    return data.info.find((item) => item.gds_nm === itemName);
  };

  return (
    <div className="flex h-full w-full flex-col gap-[14px] rounded-xl">
      <p className="text-xl font-semibold">피해원인 비율 - {item}</p>
      <div ref={containerRef} className="flex items-center justify-center" />
    </div>
  );
};

export default DisasterByItemPieChart;
