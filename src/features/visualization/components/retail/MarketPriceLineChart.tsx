import { useEffect, useRef, useMemo } from "react";
import { MarketPriceData } from "~/pages/visualization/retail/WholesaleMarketShare";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

interface Props {
  priceData: MarketPriceData[];
  selectedPummok: string;
}

const MarketPriceLineChart = ({ priceData, selectedPummok }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const filteredData = useMemo(() => {
    if (!priceData) return [];
    return priceData.filter((d) => d.vrty_clsf_nm === selectedPummok);
  }, [priceData, selectedPummok]);

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
    const maxPrice = d3.max(filteredData, (d) => d.prc) as number;
    const range = [0, maxPrice * 1.1];

    const getHoverText = (wk_id: string) => {
      return filteredData.find((d) => d.wk_id === wk_id);
    };

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
      style: {
        fontSize: "18px",
        color: "#B9BEC7",
      },
      marks: [
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
        Plot.ruleX(
          Object.values(filteredData).filter((x) => x.yr_strt !== 0),
          {
            x: "wk_id",
            stroke: "#767C88",
            strokeWidth: 2,
            opacity: 1,
          }
        ),
        Plot.ruleX(
          Object.values(filteredData).filter((d) => d.mm_strt !== 0),
          {
            x: "wk_id",
            stroke: "#767C88",
            strokeWidth: 1,
            opacity: 0.5,
          }
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
        Plot.ruleX(filteredData, Plot.pointerX({ x: "wk_id", stroke: "#a9a9a9", strokeWidth: 2 })),
      ],
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

        const found = getHoverText(x_key);
        if (!found) return;

        tooltip.innerHTML = `
          <div style="display: grid; grid-template-columns: auto 1fr; column-gap: 6px; padding: 14px 20px 14px 14px;">
            <div style="color: #FFC132; font-size: 16px;">▶</div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="color: #FFC132;"><strong>${found.intrvl}</strong></div>
              <div>${found.prc.toLocaleString()}원/kg</div>
            </div>
          </div>
        `;
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
  }, [filteredData]);

  return (
    <div className="z-10 flex h-full flex-col gap-[6px] rounded-lg bg-[#43516D] p-5">
      <div className="flex justify-between">
        <p className="ml-[4px] text-xl font-semibold text-white">{selectedPummok} 가격 추이</p>
        <HolidayLegend />
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
