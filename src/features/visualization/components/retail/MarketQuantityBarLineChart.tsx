import { useEffect, useMemo, useRef } from "react";
import { MarketQuantityData } from "~/pages/visualization/retail/WholesaleMarketShare";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

export interface QuantityValue {
  group: string;
  holiday: boolean;
  quantity: number;
  range: string;
  x_key: string;
  som: number;
  soy: number;
  price?: number;
  region?: string;
  year?: number | string;
}

const combineData = (data): QuantityValue[] => {
  const combined = {};

  data.forEach((item: QuantityValue) => {
    const { group, holiday, quantity, price, range, som, soy, x_key, year, region } = item;
    const key = `${group}-${region}`;

    if (!combined[key]) {
      combined[key] = {
        region: region,
        holiday: holiday,
        range: range,
        group: group,
        quantity: 0,
        price: 0,
        som: som,
        soy: soy,
        x_key: x_key,
        year: year,
      };
    }
    combined[key].quantity += quantity;
    combined[key].price += price;
  });

  return Object.values(combined);
};

interface Props {
  marketQuantityData: MarketQuantityData[];
  selectedPummok: string;
}

type JejuDataMap = Record<string, QuantityValue>;

interface ProcessedData {
  jejuData: JejuDataMap;
  restData: QuantityValue[];
  domain: string[];
  range: [number, number];
}

const MarketQuantityBarLineChart = ({ marketQuantityData, selectedPummok }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const processedData = useMemo<ProcessedData | null>(() => {
    if (!marketQuantityData) return null;

    const filteredData = marketQuantityData.filter((item) => item.vrty_clsf_nm === selectedPummok);

    const jejuData: JejuDataMap = filteredData
      .filter((item) => item.jeju_yn)
      .reduce((acc, item) => {
        const key = item.wk_id;
        if (!acc[key]) {
          acc[key] = {
            group: item.wk_se,
            holiday: item.lhldy_yn,
            quantity: 0,
            range: item.intrvl,
            x_key: item.wk_id,
            som: item.mm_strt,
            soy: item.yr_strt,
          };
        }
        acc[key].quantity += item.amt / 1000000;
        return acc;
      }, {} as JejuDataMap);

    const restData = combineData(
      filteredData
        .filter((item) => !item.jeju_yn && item.rgn_nm !== "수입산" && item.rgn_nm !== "원양산")
        .map((item) => ({
          group: item.wk_se,
          holiday: item.lhldy_yn,
          quantity: item.amt / 1000000,
          range: item.intrvl,
          region: item.rgn_nm,
          x_key: item.wk_id,
        }))
    );

    const restDataWithRank = Object.values(
      restData.reduce(
        (acc, item) => {
          const key = item.x_key;
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        },
        {} as Record<string, QuantityValue[]>
      )
    ).flatMap((group) =>
      group
        .sort((a, b) => b.quantity - a.quantity)
        .map((item, index) => ({
          ...item,
          rank: index,
        }))
    );

    const getMaxRange = () => {
      const jejuMax = Math.max(...Object.values(jejuData).map((d) => d.quantity));
      const restMax = Math.max(
        ...restData.reduce((acc, curr) => {
          const sum = restData.filter((d) => d.x_key === curr.x_key).reduce((sum, d) => sum + d.quantity, 0);
          return [...acc, sum];
        }, [] as number[])
      );

      return Math.max(jejuMax, restMax) * 1.1;
    };

    return {
      jejuData,
      restData: restDataWithRank,
      domain: Object.keys(jejuData),
      range: [0, getMaxRange()],
    };
  }, [marketQuantityData, selectedPummok]);

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
    if (!processedData || !chartRef.current || !tooltipRef.current) return;

    chartRef.current.innerHTML = "";

    const { domain, range, jejuData, restData } = processedData;
    const jejuValues = Object.values(jejuData);

    const barColors = ["#5D6980", "#848FA5", "#ACB1BC"];
    const getBarColor = (rank: number) => barColors[rank] ?? "#ccc";

    const getHoverText = (xKey: string, jejuData: JejuDataMap, restData: QuantityValue[]) => {
      const findJejuData = jejuData[xKey];
      const weekRange = findJejuData?.range;
      const sortedRestData = restData.filter((d) => d.x_key === xKey && d.quantity > 0).sort((a, b) => b.quantity - a.quantity);

      return { findJejuData, weekRange, sortedRestData };
    };

    const chart = Plot.plot({
      color: {
        type: "categorical",
        scheme: "category10",
      },
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
      y: { domain: range, label: "톤(ton)", labelOffset: 60, labelArrow: false, grid: true },
      marginTop: 40,
      marginRight: 30,
      marginLeft: 60,
      marginBottom: 30,
      height: 500,
      width: 1400,
      style: {
        fontSize: "18px",
        color: "#B9BEC7",
      },
      marks: [
        Plot.barY(restData, {
          opacity: 0.7,
          x: "x_key",
          y: "quantity",
          fill: (d) => getBarColor(d.rank),
          sort: (a, b) => b.quantity - a.quantity,
          stroke: "#767C88",
          strokeWidth: 0.5,
        }),
        Plot.lineY(jejuValues, {
          x: "x_key",
          y: "quantity",
          stroke: "#FFC132",
          curve: "catmull-rom",
          strokeWidth: 3,
          opacity: 1.0,
        }),
        Plot.dot(jejuValues, {
          x: "x_key",
          y: "quantity",
          r: 4,
          fill: "#FFC132",
          fillOpacity: 1,
        }),
        Plot.circle(
          jejuValues.filter((d) => d.holiday),
          {
            x: "x_key",
            y: "quantity",
            stroke: "#FFC132",
            strokeDasharray: "4 4",
            r: 13,
            strokeWidth: 3,
            opacity: 1.0,
            fill: "#FFC132",
            fillOpacity: 0.3,
          }
        ),
        Plot.ruleX(
          Object.values(jejuData).filter((x) => x.som !== 0),
          {
            x: "x_key",
            stroke: "#767C88",
            strokeWidth: 1,
            opacity: 0.5,
          }
        ),
        Plot.ruleX(
          Object.values(jejuData).filter((x) => x.soy !== 0),
          {
            x: "x_key",
            stroke: "#767C88",
            strokeWidth: 2,
            opacity: 1,
          }
        ),
        Plot.text(
          Object.values(jejuData).filter((x) => x.som !== 0),
          {
            x: "x_key",
            y: range[1] * 1.05,
            text: (d) => `${d.som}월`,
            textAnchor: "middle",
            fontSize: 16,
            fill: "rgba(255, 255, 255, 0.65)",
          }
        ),
        Plot.ruleY([0]),
        Plot.ruleX(Object.values(jejuData), Plot.pointerX({ x: "x_key", py: "quantity", stroke: "#a9a9a9", strokeWidth: 2 })),
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

        const jeju = jejuData[x_key];
        if (!jeju) return;

        const { findJejuData, weekRange, sortedRestData } = getHoverText(x_key, jejuData, restData);

        tooltip.innerHTML = `
          <div style="display: grid; grid-template-columns: auto 1fr; column-gap: 6px; padding: 14px 20px 14px 14px;">
            <div style="color: #FFC132; font-size: 16px;">▶</div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="color: #FFC132;"><strong>${weekRange}</strong></div>
              <div>제주 출하량 : ${findJejuData?.quantity.toFixed(1).toLocaleString()}톤</div>
              <hr style="width: 100%; border: none; border-top: 1px solid rgba(255, 255, 255, 0.3);" />
              ${sortedRestData.map((d) => `<div style="color: #B9BEC7;">${d.region} : ${d.quantity.toLocaleString()}톤</div>`).join("")}
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

    d3.select(chart).style("overflow", "visible");
  }, [processedData]);

  return (
    <div className="flex h-full flex-col gap-[6px] overflow-visible rounded-lg bg-[#43516D] p-5">
      <div className="flex justify-between">
        <p className="ml-[4px] text-xl font-semibold text-white">제주도 및 전국 출하물량 비교</p>
        <HolidayLegend />
      </div>
      <div className="relative my-[8px] ml-[24px] mr-[8px] flex h-full items-center justify-center">
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

export default MarketQuantityBarLineChart;
