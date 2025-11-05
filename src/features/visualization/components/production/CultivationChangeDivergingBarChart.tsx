import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

interface Props {
  chartData: any;
  selectedCrop: string;
  year: number;
  viewType: string;
}

const CultivationChangeDivergingBarChart = ({ chartData, selectedCrop, year, viewType }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [size, setSize] = useState({ width: 800, height: 420 });
  const barColor = viewType === "absolute" ? "#F48FB1" : viewType === "rate" ? "#7E57C2" : "#4DB6AC";

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const { width } = entry.contentRect;
      setSize((prev) => ({ ...prev, width }));
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      let multiplier = 1;

      if (width >= 2460) {
        multiplier = 1.5; // 4xl
      } else if (width >= 1920) {
        multiplier = 1.2; // 3xl
      }

      setSize((prev) => ({ ...prev, height: 420 * multiplier }));
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    let multiplier = 1;

    if (windowWidth >= 2460) {
      multiplier = 1.5; // 4xl
    } else if (windowWidth >= 1920) {
      multiplier = 1.2; // 3xl
    }

    setSize((prev) => ({ ...prev, height: 420 * multiplier }));
  }, [windowWidth]);

  useEffect(() => {
    if (!chartData) return;

    const regionTotals = Object.entries(chartData)
      .map(([region, products]) => {
        const match = (products as any[]).find((p) => p.crop_nm === selectedCrop);
        if (!match) return null;

        const value = viewType === "absolute" ? match.chg_cn : viewType === "rate" ? match.chg_pct : match.area_std;
        return {
          region: region,
          chg_cn: match.chg_cn,
          chg_pct: match.chg_pct,
          area_std: match.area_std,
          dx: value < 0 ? -5 : 5,
          textAnchor: value < 0 ? "end" : "start",
        };
      })
      .filter((d) => d !== null)
      .sort((a, b) => b.chg_cn - a.chg_cn);

    if (regionTotals.length === 0) return;

    const margin = { top: 0, right: 30, bottom: 27, left: 97 };
    const barHeight = regionTotals.length > 12 ? 32 : 48;
    // 컨테이너 높이는 고정, 차트 높이만 동적으로 조정
    const height = regionTotals?.length > 11 ? regionTotals.length * barHeight + margin.top + margin.bottom : size.height;
    const barInset = regionTotals?.length === 1 ? 110 : regionTotals?.length === 2 ? 40 : regionTotals?.length === 4 ? 15 : 7;

    const maxAbs =
      d3.max(regionTotals, (d) => {
        if (viewType === "absolute") {
          return Math.abs(d.chg_cn);
        } else if (viewType === "rate") {
          return Math.abs(d.chg_pct);
        } else if (viewType === "area") {
          return Math.abs(d.area_std);
        } else {
          return 0;
        }
      }) || 1;

    const xDomain = viewType === "area" ? [0, maxAbs * 1.3] : [-maxAbs * 1.4, maxAbs * 1.3];
    const chart = Plot.plot({
      width: size.width,
      height: height,
      marginTop: margin.top,
      marginRight: margin.right,
      marginBottom: margin.bottom,
      marginLeft: (regionTotals.length > 12 ? margin.left : 70) + (viewType === "area" ? -25 : 0),
      x: {
        grid: true,
        label: "",
        labelArrow: false,
        tickFormat: (d) => {
          if (viewType === "absolute") return d / 10000;
          if (viewType === "rate") return d + "%";
          if (viewType === "area") return d / 10000;
          return d;
        },
        domain: xDomain,
      },
      y: {
        label: null,
        domain: regionTotals.map((d) => d.region),
      },
      marks: [
        Plot.axisY({ tickSize: 0, tickPadding: viewType === "area" ? 15 : 37 }),
        Plot.barX(regionTotals, {
          x: (d) => (viewType === "absolute" ? d.chg_cn : viewType === "rate" ? d.chg_pct : d.area_std),
          y: "region",
          fill: barColor,
          // fill: (d) => {
          //   const value = viewType === "absolute" ? d.chg_cn : viewType === "rate" ? d.chg_pct : d.area_std;
          //   return value < 0 ? "#3B82F6" : "#DC2626";
          // },
          sort: { y: "-x" },
          insetTop: barInset,
          insetBottom: barInset,
        }),
        Plot.text(
          regionTotals.filter((d) => {
            const value = viewType === "absolute" ? d.chg_cn : viewType === "rate" ? d.chg_pct : d.area_std;
            return value >= 0;
          }),
          {
            x: (d) => (viewType === "absolute" ? d.chg_cn : viewType === "rate" ? d.chg_pct : d.area_std),
            y: "region",
            text: (d) =>
              viewType === "absolute" ? `${(d.chg_cn / 10000).toFixed(1)}ha` : viewType === "rate" ? `${d.chg_pct.toFixed(1)}%` : `${(d.area_std / 10000).toFixed(1)}ha`,
            dx: 4,
            textAnchor: "start",
            dy: 1,
            fill: "#e9e9e9",
            fontSize: "13px",
            fontWeight: "400",
          }
        ),
        Plot.text(
          regionTotals.filter((d) => {
            const value = viewType === "absolute" ? d.chg_cn : viewType === "rate" ? d.chg_pct : d.area_std;
            return value < 0;
          }),
          {
            x: (d) => (viewType === "absolute" ? d.chg_cn : viewType === "rate" ? d.chg_pct : d.area_std),
            y: "region",
            text: (d) =>
              viewType === "absolute" ? `${(d.chg_cn / 10000).toFixed(1)}ha` : viewType === "rate" ? `${d.chg_pct.toFixed(1)}%` : `${(d.area_std / 10000).toFixed(1)}ha`,
            dx: -4,
            textAnchor: "end",
            dy: 1,
            fill: "#e9e9e9",
            fontSize: "13px",
            fontWeight: "400",
          }
        ),
        Plot.ruleX([0], { stroke: "#e9e9e9", opacity: 0.5 }),
      ],
      style: {
        fontSize: "15px",
        color: "#e9e9e9",
      },
    });

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(chart);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [chartData, selectedCrop, size]);

  return (
    <div className="h-full w-full">
      <p className="mb-[8px] text-xl font-semibold">
        {viewType === "absolute"
          ? `전년대비 ${selectedCrop} 재배면적 변화량`
          : viewType === "rate"
            ? `전년대비 ${selectedCrop} 재배면적 변화율`
            : `${year}년 ${selectedCrop} 재배면적`}
      </p>
      <div ref={containerRef} style={{ height: `${size.height}px` }} className="custom-dark-scroll min-w-full overflow-y-auto" />
    </div>
  );
};

export default CultivationChangeDivergingBarChart;
