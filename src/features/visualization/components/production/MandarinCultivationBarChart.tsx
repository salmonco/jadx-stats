import * as Plot from "@observablehq/plot";
import { Button } from "antd"; // Import Button
import { useEffect, useMemo, useRef, useState } from "react";
import { getColor } from "~/maps/constants/mandarinCultivationInfo";
import downloadCsv, { CsvColumn } from "~/utils/downloadCsv";

interface Props {
  chartData: any;
  selectedVariety: string;
  isReportMode?: boolean;
}

const MandarinCultivationBarChart = ({ chartData, selectedVariety, isReportMode }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [size, setSize] = useState({ width: 800, height: 420 });

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

  const regionTotals = useMemo(() => {
    if (!chartData) return [];

    return Object.entries(chartData)
      .map(([region, products]) => {
        const match = (products as any[]).find((p) => p.prdct_nm === selectedVariety);
        return match ? { region: region, total_area: match.total_area } : null;
      })
      .filter((d) => d !== null)
      .sort((a, b) => b.total_area - a.total_area);
  }, [chartData, selectedVariety]);

  const handleDownloadCsv = () => {
    if (!regionTotals.length) return;

    const columns: CsvColumn[] = [
      { title: "지역", dataIndex: "region" },
      { title: "총 재배 면적(ha)", dataIndex: "total_area_ha" },
    ];

    const data = regionTotals.map((d) => ({
      region: d.region,
      total_area_ha: d.total_area / 10_000,
    }));

    downloadCsv(columns, data, "지역별_재배면적.csv");
  };

  useEffect(() => {
    if (!regionTotals.length || !containerRef.current) return;

    const actualWidth = isReportMode && containerRef.current.parentElement 
      ? containerRef.current.parentElement.clientWidth 
      : size.width;

    const margin = { top: 10, right: 100, bottom: 0, left: 70 };
    const barHeight = regionTotals.length > 12 ? 32 : 48;
    const height = regionTotals?.length > 12 ? regionTotals.length * barHeight + margin.top + margin.bottom : size.height;
    const barInset = regionTotals?.length === 1 ? 110 : regionTotals?.length === 2 ? 40 : regionTotals?.length === 4 ? 10 : 3;

    const colorMap = new Map<string, string>();
    regionTotals.forEach((d, i) => colorMap.set(d.region, getColor(i)));

    const chart = Plot.plot({
      width: actualWidth,
      height: height,
      marginTop: margin.top,
      marginRight: margin.right,
      marginBottom: margin.bottom,
      marginLeft: regionTotals.length > 12 ? margin.left : 45,
      x: {
        grid: true,
        label: "재배지역",
        transform: (d) => d / 10000,
        tickFormat: (d) => d.toFixed(0),
        labelOffset: 55,
        tickSize: 0,
      },
      y: {
        label: null,
        domain: regionTotals.map((d) => d.region),
      },
      marks: [
        Plot.barX(regionTotals, {
          y: "region",
          x: "total_area",
          fill: (d) => colorMap.get(d.region),
          title: (d) => `${d.region}: ${(d.total_area / 10000).toFixed(1).toLocaleString()}ha`,
          sort: { y: "-x" },
          insetTop: barInset,
          insetBottom: barInset,
        }),
        Plot.text(regionTotals, {
          x: "total_area",
          y: "region",
          text: (d) => `${(d.total_area / 10000).toFixed(1)} ha`,
          dx: 6, // 바 옆으로 약간 떨어지게
          dy: 2, // 수직 정렬 미세 조정
          textAnchor: "start",
          fill: isReportMode ? "black" : "#ffffff",
          fontWeight: "500",
        }),
        Plot.ruleX([0]),
      ],
      style: {
        fontSize: "14px",
        color: isReportMode ? "black" : "#ffffff",
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
  }, [regionTotals, size, isReportMode]);

  return (
    <div className="h-full w-full">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xl font-semibold">
          {selectedVariety === "YN-26"
            ? "유사실생"
            : selectedVariety === "감평"
              ? "레드향"
              : selectedVariety === "세토카"
                ? "천혜향"
                : selectedVariety === "부지화"
                  ? "한라봉"
                  : (selectedVariety ?? "")}{" "}
          지역별 재배면적 (막대 그래프)
        </p>
        {!isReportMode && (
          <Button type="primary" onClick={handleDownloadCsv}>
            CSV 다운로드
          </Button>
        )}
      </div>
      <div ref={containerRef} style={isReportMode ? {} : { height: `${size.height}px` }} className={isReportMode ? "w-full min-w-full" : "custom-dark-scroll min-w-full overflow-y-auto"} />
    </div>
  );
};

export default MandarinCultivationBarChart;
