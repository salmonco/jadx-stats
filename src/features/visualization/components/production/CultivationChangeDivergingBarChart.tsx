import * as Plot from "@observablehq/plot";
import { Button } from "antd";
import * as d3 from "d3";
import { Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import downloadCsv, { CsvColumn } from "~/utils/downloadCsv";

interface Props {
  chartData: any;
  selectedCrop: string;
  year: number;
  viewType: string;
  isReportMode?: boolean;
}

const CultivationChangeDivergingBarChart = ({ chartData, selectedCrop, year, viewType, isReportMode }: Props) => {
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
    if (!chartData || !containerRef.current) return;

    const actualWidth = isReportMode && containerRef.current.parentElement ? containerRef.current.parentElement.clientWidth : size.width;

    const regionTotals = Object.entries(chartData)
      .map(([region, products]) => {
        const match = (products as any[]).find((p) => p.crop_nm === selectedCrop);
        if (!match) return null;

        const currentArea = match.area_std / 10_000;
        const previousArea = currentArea - match.chg_cn / 10_000;
        const value = viewType === "absolute" ? match.chg_cn : viewType === "rate" ? match.chg_pct : match.area_std;
        return {
          region: region,
          chg_cn: match.chg_cn,
          chg_pct: match.chg_pct,
          area_std: match.area_std,
          current_area: currentArea,
          previous_area: previousArea,
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
          return Math.max(d.previous_area, d.current_area);
        } else if (viewType === "rate") {
          return Math.abs(d.chg_pct);
        } else if (viewType === "area") {
          return Math.abs(d.area_std / 10_000);
        } else {
          return 0;
        }
      }) || 1;

    const xDomain = viewType === "absolute" ? [0, maxAbs * 1.3] : viewType === "area" ? [0, maxAbs * 1.3] : [-maxAbs * 1.4, maxAbs * 1.3];

    const marks =
      viewType === "absolute"
        ? [
            Plot.axisY({ tickSize: 0, tickPadding: 15 }),
            Plot.barX(regionTotals, {
              x: "previous_area",
              y: "region",
              fill: "#7E57C2",
              insetTop: barInset,
              insetBottom: barInset,
            }),
            Plot.text(regionTotals, {
              x: "previous_area",
              y: "region",
              text: (d) => `${d.previous_area.toFixed(1)}`,
              dx: 5,
              textAnchor: "start",
              fill: isReportMode ? "black" : "#e9e9e9",
              fontSize: "13px",
              fontWeight: "400",
            }),
            Plot.line(regionTotals, {
              x: "current_area",
              y: "region",
              stroke: "#FF6B6B",
              strokeWidth: 3,
            }),
            Plot.dot(regionTotals, {
              x: "current_area",
              y: "region",
              fill: "#FF6B6B",
              r: 5,
            }),
            Plot.text(regionTotals, {
              x: "current_area",
              y: "region",
              text: (d) => `${d.current_area.toFixed(1)}`,
              dx: 5,
              textAnchor: "start",
              dy: -10,
              fill: isReportMode ? "black" : "#e9e9e9",
              fontSize: "13px",
              fontWeight: "400",
            }),
          ]
        : [
            Plot.axisY({ tickSize: 0, tickPadding: viewType === "area" ? 15 : 37 }),
            Plot.barX(regionTotals, {
              x: (d) => (viewType === "rate" ? d.chg_pct : d.area_std / 10_000),
              y: "region",
              fill: barColor,
              sort: { y: "-x" },
              insetTop: barInset,
              insetBottom: barInset,
            }),
            Plot.text(
              regionTotals.filter((d) => {
                const value = viewType === "rate" ? d.chg_pct : d.area_std / 10_000;
                return value >= 0;
              }),
              {
                x: (d) => (viewType === "rate" ? d.chg_pct : d.area_std / 10_000),
                y: "region",
                text: (d) => (viewType === "rate" ? `${d.chg_pct.toFixed(1)}%` : `${(d.area_std / 10000).toFixed(1)}ha`),
                dx: 4,
                textAnchor: "start",
                dy: 1,
                fill: isReportMode ? "black" : "#e9e9e9",
                fontSize: "13px",
                fontWeight: "400",
              }
            ),
            Plot.text(
              regionTotals.filter((d) => {
                const value = viewType === "rate" ? d.chg_pct : d.area_std / 10_000;
                return value < 0;
              }),
              {
                x: (d) => (viewType === "rate" ? d.chg_pct : d.area_std / 10_000),
                y: "region",
                text: (d) => (viewType === "rate" ? `${d.chg_pct.toFixed(1)}%` : `${(d.area_std / 10000).toFixed(1)}ha`),
                dx: -4,
                textAnchor: "end",
                dy: 1,
                fill: isReportMode ? "black" : "#e9e9e9",
                fontSize: "13px",
                fontWeight: "400",
              }
            ),
            Plot.ruleX([0], { stroke: "#e9e9e9", opacity: 0.5 }),
          ];

    const chart = Plot.plot({
      width: actualWidth,
      height: height,
      marginTop: margin.top,
      marginRight: margin.right,
      marginBottom: margin.bottom,
      marginLeft: viewType === "absolute" ? 97 : (regionTotals.length > 12 ? margin.left : 70) + (viewType === "area" ? -25 : 0),
      x: {
        grid: true,
        label: "",
        labelArrow: false,
        tickFormat: (d) => {
          if (viewType === "rate") return d + "%";
          return d;
        },
        domain: xDomain,
      },
      y: {
        label: null,
        domain: regionTotals.map((d) => d.region),
      },
      marks: marks,
      style: {
        fontSize: "15px",
        color: isReportMode ? "black" : "#e9e9e9",
        background: isReportMode ? "transparent" : undefined,
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
  }, [chartData, selectedCrop, size, isReportMode, containerRef]);

  const handleDownload = () => {
    if (!chartData || !selectedCrop) return;

    const columns: CsvColumn[] = [
      { title: "지역", dataIndex: "region" },
      { title: `전년 재배면적(ha)`, dataIndex: "previous_area" },
      { title: `${year}년 재배면적(ha)`, dataIndex: "current_area" },
      { title: "변화량(ha)", dataIndex: "change" },
      { title: "변화율(%)", dataIndex: "change_rate" },
    ];

    const regionTotals = Object.entries(chartData)
      .map(([region, products]) => {
        const match = (products as any[]).find((p) => p.crop_nm === selectedCrop);
        if (!match) return null;

        const currentArea = match.area_std / 10_000;
        const previousArea = currentArea - match.chg_cn / 10_000;

        return {
          region,
          previous_area: previousArea.toFixed(1),
          current_area: currentArea.toFixed(1),
          change: (match.chg_cn / 10_000).toFixed(1),
          change_rate: match.chg_pct.toFixed(1),
        };
      })
      .filter((d) => d !== null);

    downloadCsv(columns, regionTotals, `${selectedCrop}_재배면적_추이_${year}.csv`);
  };

  return (
    <div className="h-full w-full">
      <div className="mb-[8px] flex items-center justify-between">
        <p className="text-xl font-semibold">
          {viewType === "absolute"
            ? `전년대비 ${selectedCrop} 재배면적 추이`
            : viewType === "rate"
              ? `전년대비 ${selectedCrop} 재배면적 변화율`
              : `${year}년 ${selectedCrop} 재배면적`}
        </p>
        {!isReportMode && viewType === "absolute" && (
          <Button type="primary" icon={<Download size={16} />} onClick={handleDownload}>
            CSV 다운로드
          </Button>
        )}
      </div>
      <div
        ref={containerRef}
        style={isReportMode ? {} : { height: `${size.height}px` }}
        className={isReportMode ? "w-full min-w-full" : "custom-dark-scroll min-w-full overflow-y-auto"}
      />
    </div>
  );
};

export default CultivationChangeDivergingBarChart;
