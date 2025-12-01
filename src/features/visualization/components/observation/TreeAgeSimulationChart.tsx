import * as Plot from "@observablehq/plot";
import { useQuery } from "@tanstack/react-query";
import { Button } from "antd";
import * as d3 from "d3";
import { Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import InfoTooltip from "~/components/InfoTooltip";
import visualizationApi from "~/services/apis/visualizationApi";
import downloadCsv, { CsvColumn } from "~/utils/downloadCsv";
import { MandarinTreeAgeDistributionFeatureCollection } from "../../layers/MandarinTreeAgeDistributionLayer";

const keys = ["10년 이하", "10~19년", "20~29년", "30~39년", "40~49년", "50년 이상"];
const treeAgeColors = ["#cef2e4", "#6cd7ad", "#2c9a6f", "#fed72f", "#fd6923", "#fd1a20"];

interface Props {
  selectedTargetYear: number;
  selectedPummok: string;
  selectedVariety: string;
  isReportMode?: boolean;
}

const TreeAgeSimulationChart = ({ selectedTargetYear, selectedPummok, selectedVariety, isReportMode }: Props) => {
  const plotRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const maxAreaRef = useRef<number | null>(null);
  const [size, setSize] = useState({ width: 800, height: 380 });

  const { data: features } = useQuery<MandarinTreeAgeDistributionFeatureCollection>({
    queryKey: ["treeAgeSimulationChart", selectedTargetYear, selectedPummok, selectedVariety],
    queryFn: () => visualizationApi.getMandarinTreeAgeDistribution(selectedTargetYear, "do", selectedPummok, selectedVariety === "전체" ? undefined : selectedVariety),
  });

  useEffect(() => {
    if (!plotRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(plotRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    maxAreaRef.current = null;
  }, [selectedPummok]);

  useEffect(() => {
    const updateHeight = () => {
      const width = window.innerWidth;
      let multiplier = 1;

      if (width >= 2460) {
        multiplier = 1.5;
      } else if (width >= 1920) {
        multiplier = 1.2;
      }

      setSize((prev) => ({ ...prev, height: 380 * multiplier }));
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // const treeAgeLegend = Plot.legend({
  //   color: {
  //     domain: keys,
  //     range: treeAgeColors,
  //   },
  //   columns: "6",
  //   width: 500,
  //   style: {
  //     fontSize: "12px",
  //   },
  // });

  useEffect(() => {
    if (!features || !features.features.length || !plotRef.current) return;

    const ageGroups = features.features[0]?.properties.stats.age_groups ?? {};

    const chartData = keys.map((key, idx) => ({
      ageGroup: key,
      area: ageGroups[key]?.total_area ?? 0,
      color: treeAgeColors[idx],
    }));

    if (maxAreaRef.current === null) {
      const maxArea = Math.max(...chartData.map((d) => d.area));
      maxAreaRef.current = maxArea;
    }

    const plotWidth = isReportMode ? size.width || 750 : size.width;
    const plotHeight = isReportMode ? 380 : size.height;

    if (plotWidth === 0) return;

    const plot = Plot.plot({
      width: plotWidth,
      height: plotHeight,
      marginTop: 22,
      marginBottom: 8,
      marginLeft: maxAreaRef?.current?.toString().length > 5 ? 60 : 30,
      style: {
        fontSize: "14px",
        color: isReportMode ? "black" : undefined,
        background: isReportMode ? "transparent" : undefined,
      },
      x: {
        domain: keys,
        label: "",
      },
      y: {
        // domain: [0, (maxAreaRef.current ?? 0) * 1.2],
        domain: [0, d3.max(chartData, (d) => d.area) * 1.1],
        label: "면적(ha)",
        grid: true,
        ticks: 8,
        tickFormat: (d) => (d / 10000).toLocaleString(),
      },
      color: {
        domain: keys,
        range: treeAgeColors,
      },
      marks: [
        Plot.barY(chartData, {
          x: "ageGroup",
          y: "area",
          fill: "ageGroup",
        }),
        Plot.text(chartData, {
          x: "ageGroup",
          y: "area",
          text: (d) => `${(d.area / 10000).toFixed(1)}`,
          dy: -8,
          fill: isReportMode ? "black" : "#ffffff",
          fontSize: "12px",
        }),
        Plot.ruleY([0]),
      ],
    });

    plotRef.current.innerHTML = "";
    plotRef.current.appendChild(plot);

    // legendRef.current.innerHTML = "";
    // legendRef.current.appendChild(treeAgeLegend);

    d3.select(plot).style("overflow", "visible");
  }, [features, isReportMode, size]);

  const handleDownloadCsv = () => {
    if (!features || !features.features.length) return;

    const ageGroups = features.features[0]?.properties.stats.age_groups ?? {};

    const columns: CsvColumn[] = [
      { title: "수령", dataIndex: "ageGroup" },
      { title: "면적(ha)", dataIndex: "area" },
    ];

    const data = keys.map((key) => ({
      ageGroup: key,
      area: ((ageGroups[key]?.total_area ?? 0) / 10000).toFixed(1),
    }));

    downloadCsv(columns, data, "수령별_면적_분포.csv");
  };

  return (
    <div className="relative flex h-full w-full flex-col items-start justify-center gap-3 pb-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <p className="text-xl font-semibold">수령별 면적 분포</p>
          {!isReportMode && (
            <InfoTooltip
              title="수령별 면적 분포란?"
              content={`감귤나무의 나이를 기준으로, 각 수령(수령 구간별) 감귤 재배 면적이 얼마나 되는지를 보여주는 통계입니다.\n이를 통해 현재 제주도 감귤 과원의 구성 상태와, 젋은 나무(신규 식재) 또는 오래된 나무(노후 과원)의 비중을 \n파악할 수 있습니다.`}
            />
          )}
        </div>
        {!isReportMode && (
          <Button type="primary" icon={<Download size={16} />} onClick={handleDownloadCsv}>
            CSV 다운로드
          </Button>
        )}
      </div>
      <div className="absolute right-0 top-0" ref={legendRef} />
      <div className="h-full w-full" ref={plotRef} />
    </div>
  );
};

export default TreeAgeSimulationChart;
