import * as Plot from "@observablehq/plot";
import { Button } from "antd";
import { Download } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CROPS, CROP_COLORS } from "~/maps/constants/cropDistribution";
import downloadCsv, { CsvColumn } from "~/utils/downloadCsv";

const KOREAN_CROP_COLORS: { [key: string]: string } = {};
Object.entries(CROPS).forEach(([korean, english]) => {
  KOREAN_CROP_COLORS[korean] = CROP_COLORS[english];
});

const TOP_CROPS_LIMIT = 12;

interface Props {
  chartData: { [crop: string]: { [region: string]: number } };
  isReportMode?: boolean;
}

const CropDistributionBarChart = ({ chartData, isReportMode }: Props) => {
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
        multiplier = 1.5;
      } else if (width >= 1920) {
        multiplier = 1.2;
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

  const { displayData, totalCount } = useMemo(() => {
    const totals: { crop: string; area: number }[] = [];
    Object.entries(chartData).forEach(([crop, regions]) => {
      const totalArea = Object.values(regions).reduce((sum, area) => sum + area, 0);
      totals.push({ crop, area: totalArea });
    });
    const sortedTotals = totals.sort((a, b) => b.area - a.area);
    return {
      displayData: sortedTotals.slice(0, TOP_CROPS_LIMIT),
      totalCount: sortedTotals.length,
    };
  }, [chartData]);

  const handleDownloadCsv = () => {
    const columns: CsvColumn[] = [
      { title: "작물", dataIndex: "crop" },
      { title: "재배면적(ha)", dataIndex: "area" },
    ];

    // Download all crops, not just top 12
    const allCropTotals: { crop: string; area: number }[] = [];
    Object.entries(chartData).forEach(([crop, regions]) => {
      const totalArea = Object.values(regions).reduce((sum, area) => sum + area, 0);
      allCropTotals.push({ crop, area: totalArea });
    });
    const sortedAll = allCropTotals.sort((a, b) => b.area - a.area);

    const data = sortedAll.map((d) => ({
      crop: d.crop,
      area: d.area.toFixed(1),
    }));

    downloadCsv(columns, data, "작물별_재배면적.csv");
  };

  useEffect(() => {
    if (!displayData.length || !containerRef.current) return;

    const actualWidth = isReportMode && containerRef.current.parentElement ? containerRef.current.parentElement.clientWidth : size.width;

    const margin = { top: 10, right: 100, bottom: 0, left: 90 };
    const barHeight = 48;
    const chartHeight = displayData.length * barHeight + margin.top + margin.bottom;
    const barInset = displayData.length === 1 ? 110 : displayData.length === 2 ? 40 : displayData.length === 4 ? 10 : 3;

    const chart = Plot.plot({
      width: actualWidth,
      height: chartHeight,
      marginTop: margin.top,
      marginRight: margin.right,
      marginBottom: margin.bottom,
      marginLeft: totalCount > TOP_CROPS_LIMIT ? margin.left : 70,
      x: {
        grid: true,
        label: "재배면적 (ha)",
        tickFormat: (d) => d.toFixed(0),
        labelOffset: 55,
        tickSize: 0,
      },
      y: {
        label: null,
        domain: displayData.map((d) => d.crop),
      },
      marks: [
        Plot.barX(displayData, {
          y: "crop",
          x: "area",
          fill: (d) => KOREAN_CROP_COLORS[d.crop] || "#999",
          title: (d) => `${d.crop}\n${d.area.toFixed(1)}ha`,
          sort: { y: "-x" },
          insetTop: barInset,
          insetBottom: barInset,
        }),
        Plot.text(displayData, {
          x: "area",
          y: "crop",
          text: (d) => `${d.area.toFixed(1)} ha`,
          dx: 6,
          dy: 2,
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
  }, [displayData, totalCount, size, isReportMode]);

  return (
    <div className="h-full w-full">
      <div className="mb-[8px] flex items-center justify-between">
        <p className="text-xl font-semibold">작물별 재배 면적</p>
        {!isReportMode && (
          <Button type="primary" icon={<Download size={16} />} onClick={handleDownloadCsv}>
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

export default CropDistributionBarChart;
