import { Button } from "antd";
import * as d3 from "d3";
import { Download } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import downloadCsv, { CsvColumn } from "~/utils/downloadCsv";

interface Props {
  features: any;
  selectedDisaster: string;
  selectedDisasterCategory: string;
  isReportMode?: boolean;
}

const DisasterSpectrumChart = ({ features, selectedDisaster, selectedDisasterCategory, isReportMode }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ width: 800, height: 400 });

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const { width } = entry.contentRect;
      setSize({ width, height: 400 });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const heatmapData = useMemo(() => {
    if (!features?.features || features.features.length === 0) return [];

    // TODO: API에서 월/일별 데이터를 가져와야 함
    // 임시로 12개월 x 31일 데이터 생성
    const data = [];
    for (let month = 1; month <= 12; month++) {
      for (let day = 1; day <= 31; day++) {
        data.push({
          month,
          day,
          value: Math.random() * 100, // 임시 데이터
        });
      }
    }
    return data;
  }, [features]);

  useEffect(() => {
    if (!heatmapData.length || !svgRef.current) return;

    const { width, height } = size;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const maxValue = d3.max(heatmapData, (d) => d.value) || 100;
    const colorScale = d3.scaleSequential(d3.interpolateReds).domain([0, maxValue]);

    const cellWidth = chartWidth / 31;
    const cellHeight = chartHeight / 12;

    // 히트맵 셀
    g.selectAll("rect")
      .data(heatmapData)
      .join("rect")
      .attr("x", (d) => (d.day - 1) * cellWidth)
      .attr("y", (d) => (d.month - 1) * cellHeight)
      .attr("width", cellWidth - 1)
      .attr("height", cellHeight - 1)
      .attr("fill", (d) => colorScale(d.value))
      .attr("stroke", isReportMode ? "#ccc" : "#333")
      .attr("stroke-width", 0.5);

    // X축 (일)
    const xScale = d3.scaleLinear().domain([1, 31]).range([0, chartWidth]);

    const xAxis = d3
      .axisBottom(xScale)
      .tickValues([1, 5, 10, 15, 20, 25, 31])
      .tickFormat((d) => `${d}일`);

    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(xAxis)
      .attr("color", isReportMode ? "black" : "white");

    // Y축 (월)
    const yScale = d3.scaleLinear().domain([1, 12]).range([0, chartHeight]);

    const yAxis = d3
      .axisLeft(yScale)
      .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
      .tickFormat((d) => `${d}월`);

    g.append("g")
      .call(yAxis)
      .attr("color", isReportMode ? "black" : "white");
  }, [heatmapData, size, isReportMode]);

  const handleDownloadCsv = () => {
    const columns: CsvColumn[] = [
      { title: "월", dataIndex: "month" },
      { title: "일", dataIndex: "day" },
      { title: "발생 건수", dataIndex: "value" },
    ];

    const data = heatmapData.map((d) => ({
      month: `${d.month}월`,
      day: `${d.day}일`,
      value: d.value.toFixed(1),
    }));

    const categoryName = selectedDisasterCategory === "total_dstr_sprt_amt" ? "재난지원금" : "피해면적";
    downloadCsv(columns, data, `${selectedDisaster}_월일별_${categoryName}.csv`);
  };

  return (
    <div className={`flex h-full w-full flex-col ${isReportMode ? "text-black" : "text-white"}`}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xl font-semibold">월일별 재해 발생 현황</p>
        {!isReportMode && (
          <Button type="primary" icon={<Download size={16} />} onClick={handleDownloadCsv}>
            CSV 다운로드
          </Button>
        )}
      </div>
      <div ref={containerRef} className="relative flex-1">
        <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};

export default DisasterSpectrumChart;
