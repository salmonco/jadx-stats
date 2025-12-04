import { useEffect, useRef, useMemo, useState } from "react";
import { MarketPriceData, MarketQuantityData } from "~/pages/visualization/retail/WholesaleMarketShare";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { Checkbox } from "antd";

type PriceCalculatedData = MarketQuantityData & { prc: number };

interface Props {
  priceData: MarketPriceData[];
  quantityData: MarketQuantityData[];
  selectedPummok: string;
}

const MarketPriceLineChart = ({ priceData, quantityData, selectedPummok }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [showJejuPrice, setShowJejuPrice] = useState(true);

  const jejuData = useMemo(() => {
    if (!quantityData) return [];
    // 1. 거래량 데이터(quantityData)를 기반으로 각 항목의 가격(prc)을 계산합니다.
    // 가격은 총 금액(amt)을 총 중량(wght)으로 나누어 계산하며, 중량이 0인 경우는 가격을 0으로 설정합니다.
    const processed: PriceCalculatedData[] = quantityData.map((d) => ({
      ...d,
      prc: d.wght > 0 ? Math.round(d.amt / d.wght) : 0,
    }));
    // 2. 선택된 품목(selectedPummok)으로 데이터를 필터링합니다.
    const filtered = processed.filter((d) => d.vrty_clsf_nm === selectedPummok);
    // 3. 필터링된 데이터 중에서 제주산(jeju_yn이 true이거나 rgn_nm이 '제주'인 경우) 데이터를 추출합니다.
    const jejuItems = filtered.filter((d) => d.jeju_yn || (d.rgn_nm && d.rgn_nm.includes("제주")));
    // 4. 계산된 가격이 0보다 큰 데이터만 필터링하여 그래프의 들쭉날쭉함을 방지합니다.
    return jejuItems.filter((d) => d.prc > 0);
  }, [quantityData, selectedPummok]);

  const nationalData = useMemo(() => {
    if (!priceData) return [];
    return priceData.filter((d) => d.vrty_clsf_nm === selectedPummok);
  }, [priceData, selectedPummok]);

  const filteredData = nationalData;

  const HolidayLegend = () => {
    const legendRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (legendRef.current) {
        legendRef.current.innerHTML = "";
        const svg = d3.select(legendRef.current).append("svg").attr("width", 80).attr("height", 24);
        svg
          .append("circle")
          .attr("cx", 20)
          .attr("cy", 15)
          .attr("r", 7)
          .attr("fill", "none")
          .attr("stroke", "#fff")
          .attr("stroke-dasharray", "2 2")
          .attr("stroke-width", 2);
        svg.append("text").attr("x", 35).attr("y", 21).text("명절").attr("font-size", "16px").attr("fill", "white");
      }
    }, []);

    return <div ref={legendRef} />;
  };

  useEffect(() => {
    if (!filteredData || filteredData.length === 0 || !chartRef.current || !tooltipRef.current) return;

    chartRef.current.innerHTML = "";

    const domain = filteredData.map((d) => d.wk_id);

    // 전국 데이터의 모든 wk_id에 대해 제주 데이터를 매핑 (없으면 null)
    const jejuDataMap = new Map(jejuData.map((d) => [d.wk_id, d]));
    const alignedJejuData = filteredData.map((d) => {
      const jejuItem = jejuDataMap.get(d.wk_id);
      return {
        wk_id: d.wk_id,
        prc: jejuItem?.prc ?? null,
        lhldy_yn: jejuItem?.lhldy_yn ?? false,
        intrvl: jejuItem?.intrvl ?? d.intrvl,
      };
    });

    const allPrices = [...filteredData.map((d) => d.prc), ...(showJejuPrice ? jejuData.map((d) => d.prc) : [])];
    const maxPrice = d3.max(allPrices) as number;
    const range = [0, maxPrice * 1.1];

    const getHoverText = (wk_id: string) => {
      const national = filteredData.find((d) => d.wk_id === wk_id);
      const jeju = jejuData.find((d) => d.wk_id === wk_id);
      return { national, jeju };
    };

    const marks: any[] = [
      Plot.line(filteredData, {
        x: "wk_id",
        y: "prc",
        stroke: "#9DF05E",
        strokeWidth: 3,
        curve: "catmull-rom",
        opacity: 1.0,
      }),
      Plot.dot(filteredData, {
        x: "wk_id",
        y: "prc",
        r: 5,
        fill: "#9DF05E",
        fillOpacity: 1,
      }),
      Plot.circle(
        filteredData.filter((d) => d.lhldy_yn),
        {
          x: "wk_id",
          y: "prc",
          stroke: "#9DF05E",
          strokeDasharray: "4 4",
          r: 13,
          strokeWidth: 3,
          opacity: 1.0,
          fill: "#9DF05E",
          fillOpacity: 0.3,
        }
      ),
    ];

    if (showJejuPrice && jejuData.length > 0) {
      marks.push(
        Plot.line(alignedJejuData, {
          x: "wk_id",
          y: "prc",
          stroke: "#FFC132",
          strokeWidth: 3,
          curve: "catmull-rom",
          opacity: 1.0,
        }),
        Plot.dot(alignedJejuData, {
          x: "wk_id",
          y: "prc",
          r: 5,
          fill: "#FFC132",
          fillOpacity: 1,
        }),
        Plot.circle(
          alignedJejuData.filter((d) => d.lhldy_yn),
          {
            x: "wk_id",
            y: "prc",
            stroke: "#FFC132",
            strokeDasharray: "4 4",
            r: 13,
            strokeWidth: 3,
            opacity: 1.0,
            fill: "#FFC132",
            fillOpacity: 0.3,
          }
        )
      );
    }

    marks.push(
      Plot.ruleX(
        Object.values(filteredData).filter((x) => x.yr_strt !== 0),
        { x: "wk_id", stroke: "#767C88", strokeWidth: 2, opacity: 1 }
      ),
      Plot.ruleX(
        Object.values(filteredData).filter((d) => d.mm_strt !== 0),
        { x: "wk_id", stroke: "#767C88", strokeWidth: 1, opacity: 0.5 }
      ),
      Plot.text(
        Object.values(filteredData).filter((d) => d.mm_strt !== 0),
        {
          x: "wk_id",
          y: range[1] * 1.05,
          text: (d) => `${d.mm_strt}월`,
          textAnchor: "middle",
          fontSize: 16,
          fill: "rgba(255, 255, 255, 0.65)",
        }
      ),
      Plot.ruleY([0]),
      Plot.ruleX(filteredData, Plot.pointerX({ x: "wk_id", stroke: "#a9a9a9", strokeWidth: 2 }))
    );

    const chart = Plot.plot({
      x: {
        domain: domain,
        label: "주",
        labelAnchor: "right",
        labelOffset: 22,
        tickFormat: (x) => {
          const [_, week] = x.split("-W");
          return `${parseInt(week)}`;
        },
      },
      y: { domain: range, label: "원/kg", labelOffset: 60, labelArrow: false, grid: true },
      marginTop: 40,
      marginRight: 30,
      marginLeft: 60,
      marginBottom: 30,
      width: 1400,
      height: 500,
      style: { fontSize: "18px", color: "#B9BEC7" },
      marks,
    });

    chartRef.current.appendChild(chart);

    const svg = chart instanceof SVGSVGElement ? chart : null;
    const tooltip = tooltipRef.current;

    if (svg && tooltip) {
      const handleMove = (e: MouseEvent) => {
        const rect = svg.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;

        const index = Math.floor((relX / rect.width) * domain.length);
        const x_key = domain[index];
        if (!x_key) return;

        const { national, jeju } = getHoverText(x_key);
        if (!national) return;

        let content = `
          <div style="display: grid; grid-template-columns: auto 1fr; column-gap: 6px; padding: 14px 20px 14px 14px;">
            <div style="color: #FFC132; font-size: 16px;">▶</div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="color: #FFC132;"><strong>${national.intrvl}</strong></div>
              <div>전국: ${national.prc.toLocaleString()}원/kg</div>`;

        if (showJejuPrice && jeju) {
          content += `<div>제주산: ${jeju.prc.toLocaleString()}원/kg</div>`;
        }

        content += `
            </div>
          </div>
        `;

        tooltip.innerHTML = content;
        tooltip.style.left = `${relX + 10}px`;
        tooltip.style.top = `${relY + 10}px`;
        tooltip.style.display = "block";
      };

      const handleLeave = () => {
        tooltip.style.display = "none";
      };

      svg.addEventListener("mousemove", handleMove);
      svg.addEventListener("mouseleave", handleLeave);

      return () => {
        svg.removeEventListener("mousemove", handleMove);
        svg.removeEventListener("mouseleave", handleLeave);
      };
    }
  }, [filteredData, jejuData, showJejuPrice]);

  return (
    <div className="z-10 flex h-full flex-col gap-[6px] rounded-lg bg-[#43516D] p-5">
      <div className="flex justify-between">
        <p className="ml-[4px] text-xl font-semibold text-white">제주도 및 전국 {selectedPummok} 가격 추이</p>
        <div className="flex items-center gap-4">
          {jejuData.length > 0 && (
            <Checkbox checked={showJejuPrice} onChange={(e) => setShowJejuPrice(e.target.checked)} style={{ color: "white" }}>
              <span style={{ color: "white" }}>제주산 가격 표시</span>
            </Checkbox>
          )}
          <HolidayLegend />
        </div>
      </div>
      <div className="relative my-[8px] ml-[24px] mr-[8px] flex h-full items-center justify-center overflow-visible">
        <div className="flex justify-center" ref={chartRef} />
        <div
          ref={tooltipRef}
          style={{
            position: "absolute",
            zIndex: 9999,
            backgroundColor: "#37445E",
            boxShadow: "1px 1px 4px 0px rgba(0, 0, 0, 0.59)",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "14px",
            whiteSpace: "nowrap",
            overflow: "visible",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

export default MarketPriceLineChart;
