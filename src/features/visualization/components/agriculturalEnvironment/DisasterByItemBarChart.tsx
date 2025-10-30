import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { DisasterByItemData } from "~/pages/visualization/agricultureEnvironment/DisasterByItem";
import { cropSelectorItems } from "~/pages/visualization/agricultureEnvironment/DisasterByItem";

interface Props {
  disasterByItem: DisasterByItemData;
}

const DisasterByItemBarChart = ({ disasterByItem }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();

    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!disasterByItem || !dimensions.width || !dimensions.height) return;

    // 아이템별 총 보험금액 계산
    const aggregatedData = disasterByItem.info.map((item) => {
      const totalAmount = Object.values(item.ctgry).reduce((sum, data) => sum + data.give_insrnc_amt, 0);
      return {
        item: item.gds_nm,
        amount: totalAmount,
      };
    });

    // 상위 10개 추출
    const top10Data = aggregatedData.sort((a, b) => b.amount - a.amount).slice(0, 10);

    // 기존 툴팁 제거 및 새로운 툴팁 생성
    const tooltip = d3.select(tooltipRef.current).style("visibility", "hidden");

    // Plot 차트 생성
    const chart = Plot.plot({
      width: dimensions.width,
      height: dimensions.height - 15,
      marginLeft: 70,
      marginRight: 30,
      marginTop: 0,
      marginBottom: 60,
      x: {
        grid: true,
        label: "보험금액 (억원)",
        transform: (d) => d / 100000000,
        tickFormat: (d) => d.toFixed(0),
        labelOffset: 55,
      },
      y: {
        label: null,
        domain: top10Data.map((d) => d.item),
      },
      marks: [
        Plot.barX(top10Data, {
          y: "item",
          x: "amount",
          fill: (d) => cropSelectorItems.find((item) => item.value === d.item)?.color || "#4e79a7",
          title: (d) => `${d.item}: ${(d.amount / 100000000).toFixed(1)}억원`,
          sort: { y: "-x" },
        }),
        Plot.ruleX([0]),
      ],
      style: {
        background: "transparent",
        fontSize: "16px",
        color: "#ffffffa6",
      },
    });

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(chart);

      // 호버 효과와 툴팁 추가
      d3.select(containerRef.current)
        .selectAll("rect")
        .style("transition", "all 0.3s ease")
        .on("mouseover", (event, i: number) => {
          const rect = event.currentTarget;
          const currentData = top10Data[i];

          // 다른 막대만 흐리게 처리
          d3.select(containerRef.current)
            .selectAll("rect")
            .style("opacity", function () {
              return this === rect ? 1 : 0.3;
            });

          const tooltipText = `
            <div style="display: grid; grid-template-columns: auto 1fr; column-gap: 6px;">
              <div style="color: #FFC132; font-size: 16px;">▶</div>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="color: #FFC132;"><strong>${currentData.item}</strong></div>
                <div style="color: #fff;">${(currentData.amount / 100000000).toFixed(1)}억원</div>
              </div>
            </div>
          `;

          // 툴팁 표시
          tooltip
            .html(tooltipText)
            .style("left", `${event.clientX + 10}px`)
            .style("top", `${event.clientY - 30}px`)
            .style("visibility", "visible")
            .style("pointer-events", "none")
            .style("background-color", "#37445E")
            .style("padding", "14px 20px 14px 14px")
            .style("border-radius", "8px")
            .style("border", "none")
            .style("box-shadow", "1px 1px 4px 0px rgba(0, 0, 0, 0.5);");
        })

        .on("mouseout", () => {
          d3.select(containerRef.current).selectAll("rect").style("opacity", 1);
          tooltip.style("visibility", "hidden");
        });
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [disasterByItem, dimensions]);

  return (
    <div className="h-full w-full rounded-xl bg-[#43506A] p-5">
      <p className="mb-4 text-xl font-semibold text-white">피해액 전체 상위 10개 품목</p>
      <div ref={containerRef} className="h-[calc(100%-2rem)] w-full" />
      <div ref={tooltipRef} className="pointer-events-none fixed rounded-lg border border-gray-200 bg-white p-2 text-[16px] text-[#333] shadow-lg" />
    </div>
  );
};

export default DisasterByItemBarChart;
