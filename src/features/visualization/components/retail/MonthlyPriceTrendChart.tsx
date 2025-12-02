import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { useResponsiveSize } from "~/features/visualization/hooks/useResponsiveSize";
import { MonthlyComparisonData } from "~/pages/visualization/retail/CropTradeInfo";
import { Checkbox, Empty } from "antd";

interface Props {
  pummok: string;
  tradeChartData: MonthlyComparisonData[];
}

const MonthlyPriceTrendChart = ({ pummok, tradeChartData }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const size = useResponsiveSize(containerRef, 0.4, 540);
  const [showPriceValue, setShowPriceValue] = useState(true);

  const augmentedData = useMemo(() => {
    return tradeChartData?.map((d) => ({
      ...d,
      monthLabel: `${d.month}월`,
    }));
  }, [tradeChartData]);

  useEffect(() => {
    if (!size.width || !size.height || !tradeChartData || tradeChartData.length === 0) return;

    const svg = d3.select(plotRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 10, right: 0, bottom: 60, left: 50 };
    const width = size.width - margin.left - margin.right;
    const height = size.height - margin.top - margin.bottom;

    const g = svg.attr("width", size.width).attr("height", size.height).append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const months = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);
    const x = d3.scalePoint().domain(months).range([0, width]).padding(0.5);

    const hoverLine = g.append("line").attr("y1", 0).attr("y2", height).attr("stroke", "#a9a9a9").attr("stroke-width", 2).style("opacity", 0);

    const allValues = tradeChartData.flatMap((d) => [d.target_year, d.previous_year, d.five_year_avg].filter((v) => v != null));
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(allValues)! * 1.1])
      .range([height, 0]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(-height).tickPadding(10))
      .call((g) => g.select(".domain").remove())
      .selectAll("line")
      .attr("stroke", "#767C88")
      .attr("stroke-width", 0.5);

    g.append("g")
      .call(d3.axisLeft(y).tickSize(-width).tickPadding(8).ticks(8))
      .call((g) => g.select(".domain").remove())
      .selectAll("line")
      .attr("stroke", "#767C88")
      .attr("stroke-width", 0.5);

    g.selectAll("text").attr("fill", "#d9d9d9").attr("font-size", 14);

    const line = d3
      .line<any>()
      .defined((d) => d.value != null)
      .x((d) => x(d.month)!)
      .y((d) => y(d.value))
      .curve(d3.curveCatmullRom);

    const lines = [
      { key: "five_year_avg", color: "#ffdb29", label: "평년" },
      { key: "previous_year", color: "#00ddff", label: "전년" },
      { key: "target_year", color: "#9DF05E", label: "금년" },
    ] as const;

    lines.forEach(({ key, color }) => {
      const months = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);
      const filledLineData = months.map((monthLabel, idx) => {
        const raw = tradeChartData.find((d) => d.month === idx + 1);
        return {
          month: monthLabel,
          value: raw?.[key] ?? null,
        };
      });

      g.append("path").datum(filledLineData).attr("fill", "none").attr("stroke", color).attr("stroke-width", 3).attr("d", line);

      g.selectAll(`circle.${key}`)
        .data(filledLineData.filter((d) => d.value != null))
        .enter()
        .append("circle")
        .attr("class", key)
        .attr("cx", (d) => x(d.month)!)
        .attr("cy", (d) => y(d.value))
        .attr("r", 4)
        .attr("fill", color);

      if (showPriceValue) {
        g.selectAll(`text.price-label.${key}`)
          .data(filledLineData.filter((d) => d.value != null))
          .enter()
          .append("text")
          .attr("class", `price-label ${key}`)
          .attr("x", (d) => x(d.month)!)
          .attr("y", (d) => y(d.value) - 10)
          .attr("text-anchor", "middle")
          .attr("fill", color)
          .attr("font-size", "12px")
          .text((d) => d.value.toLocaleString(undefined, { maximumFractionDigits: 0 }));
      }
    });

    const legend = svg
      .append("g")
      .attr("transform", `translate(${size.width / 2 - 65}, ${size.height - 10})`)
      .selectAll("g")
      .data(lines)
      .enter()
      .append("g")
      .attr("transform", (_, i) => `translate(${i * 60}, 0)`);

    legend
      .append("circle")
      .attr("y", 50)
      .attr("r", 6)
      .attr("fill", (d) => d.color);

    legend
      .append("text")
      .attr("x", 12)
      .attr("y", 5)
      .text((d) => d.label)
      .attr("fill", "#d9d9d9")
      .attr("font-size", 16);

    const tooltip = tooltipRef.current!;

    const monthLabels = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);
    const xPositions = monthLabels.map((label) => ({
      label,
      x: x(label)!,
    }));

    svg.on("mousemove", (event) => {
      const [mx] = d3.pointer(event);

      // margin.left 보정
      const relativeX = mx - margin.left;

      // 가장 가까운 x 위치 찾기
      const closest = xPositions.reduce((prev, curr) => (Math.abs(curr.x - relativeX) < Math.abs(prev.x - relativeX) ? curr : prev));

      const xPos = closest.x;
      const monthLabel = closest.label;

      const d = tradeChartData.find((d) => `${d.month}월` === monthLabel);
      if (!d) return;

      hoverLine.attr("x1", xPos).attr("x2", xPos).style("opacity", 1);

      tooltip.innerHTML = `
        <div style="display: grid; grid-template-columns: auto 1fr; column-gap: 6px; padding: 14px 22px 16px 14px;">
          <div style="color: #FFC132; font-size: 16px;">▶</div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="font-size: 16px; color: #FFC132;"><strong>${d.year}년 ${d.month}월</strong></div>
            <div style="font-size: 16px;">금년 : ${d.target_year?.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? "-"}원/kg</div>
            <div style="font-size: 16px;">전년 : ${d.previous_year?.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? "-"}원/kg</div>
            <div style="font-size: 16px;">평년 : ${d.five_year_avg?.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? "-"}원/kg</div>
          </div>
        </div>
      `;

      tooltip.style.left = `${event.clientX + 15}px`;
      tooltip.style.top = `${event.clientY - 30}px`;
      tooltip.style.display = "block";
    });

    svg.on("mouseleave", () => {
      tooltip.style.display = "none";
      hoverLine.style("opacity", 0);
    });
  }, [augmentedData, size, showPriceValue]);

  return (
    <div className="flex w-full flex-1 flex-col gap-3 rounded-lg bg-[#43516D] p-5">
      <div className="flex items-center justify-between">
        <p className="text-[20px] font-semibold">{pummok} 전국 평균 월별 가격 추이</p>
        <Checkbox checked={showPriceValue} onChange={(e) => setShowPriceValue(e.target.checked)} style={{ color: "white" }}>
          <span className="text-white">가격 표시</span>
        </Checkbox>
      </div>
      <div className={`relative h-full w-full ${!tradeChartData || tradeChartData.length === 0 ? "flex items-center justify-center" : ""}`} ref={containerRef}>
        {!tradeChartData || tradeChartData.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <Empty description={<div className="pt-2 text-[18px] text-white">데이터가 없습니다.</div>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        ) : (
          <>
            <svg ref={plotRef} className="w-[99%]" />
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
          </>
        )}
      </div>
    </div>
  );
};

export default MonthlyPriceTrendChart;
