import { Button } from "antd";
import * as d3 from "d3";
import { Dayjs } from "dayjs";
import { Download } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import downloadCsv, { CsvColumn } from "~/utils/downloadCsv";

interface Props {
  features: any;
  startDate: Dayjs;
  endDate: Dayjs;
  selectedDisaster: string;
  selectedCropPummok: string;
  isReportMode?: boolean;
}

const DisasterTypeHistoryStatsAreaPieChart = ({ features, startDate, endDate, selectedDisaster, selectedCropPummok, isReportMode }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height: 420 });

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      setSize({
        width,
        height: Math.max(300, height),
      });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const pieData = useMemo(() => {
    if (!features?.features || features.features.length === 0) {
      return [];
    }

    const data: { region: string; area: number }[] = [];

    features.features.forEach((feature: any) => {
      const stats = feature.properties?.stats?.[0];
      const region = feature.properties?.vrbs_nm;
      if (region && stats && stats.total_dstr_sprt_amt) {
        data.push({
          region,
          area: stats.total_dstr_sprt_amt,
        });
      }
    });

    return data.sort((a, b) => b.area - a.area);
  }, [features]);

  const handleDownloadCsv = () => {
    if (!pieData.length) return;

    const columns: CsvColumn[] = [
      { title: "지역", dataIndex: "region" },
      { title: "피해 면적(ha)", dataIndex: "area" },
    ];

    const data = pieData.map((d) => ({
      region: d.region,
      area: d.area.toLocaleString("ko-KR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    }));

    downloadCsv(columns, data, `농업재해_${selectedDisaster}_${selectedCropPummok}_지역별_피해면적.csv`);
  };

  useEffect(() => {
    if (!pieData.length) return;

    const { width, height } = size;
    const radius = Math.min(width, height) / 2 - 40;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const group = svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3
      .scaleOrdinal<string, string>()
      .domain(pieData.map((d) => d.region))
      .range(d3.schemeCategory10);

    const pie = d3
      .pie<{ region: string; area: number }>()
      .sort(null)
      .value((d) => d.area)
      .startAngle(-Math.PI * 2)
      .endAngle(1.5 * Math.PI);

    const arc = d3.arc<any>().innerRadius(0).outerRadius(radius);

    const tooltip = d3.select(tooltipRef.current);

    const paths = group
      .selectAll("path")
      .data(pie(pieData))
      .join("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.region))
      .attr("stroke", "#a9a9a9")
      .attr("stroke-width", 1)
      .style("cursor", "pointer");

    paths
      .on("mouseover", function (_, d) {
        tooltip
          .html(
            `
              <div style="display: grid; grid-template-columns: auto 1fr; column-gap: 6px; padding: 14px 18px 14px 14px;">
                <div style="color: #FFC132; font-size: 16px;">▶</div>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <div style="color: #FFC132;"><strong>${d.data.region}</strong></div>
                  <div>${d.data.area.toLocaleString("ko-KR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}ha</div>
                </div>
              </div>
            `
          )
          .style("display", "block")
          .style("visibility", "visible")
          .style("pointer-events", "none");
        d3.select(this).attr("fill-opacity", 0.7);
      })
      .on("mousemove", function (event) {
        tooltip.style("left", `${event.clientX + 10}px`).style("top", `${event.clientY - 20}px`);
      })
      .on("mouseout", function () {
        tooltip.style("display", "none");
        d3.select(this).attr("fill-opacity", 1);
      });

    // 라벨 추가
    const labelArc = d3
      .arc<any>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.6);

    group
      .selectAll("text")
      .data(pie(pieData))
      .join("text")
      .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("fill", isReportMode ? "black" : "#ffffff")
      .each(function (d) {
        const text = d3.select(this);
        text.append("tspan").attr("x", 0).attr("dy", "-0.2em").text(d.data.region);
        text
          .append("tspan")
          .attr("x", 0)
          .attr("dy", "1.2em")
          .text(`${d.data.area.toLocaleString("ko-KR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}ha`);
      });
  }, [pieData, size, isReportMode]);

  return (
    <div className={`flex h-full w-full flex-col ${isReportMode ? "text-black" : "text-white"}`}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xl font-semibold">지역별 피해 면적</p>
        {!isReportMode && (
          <Button type="primary" icon={<Download size={16} />} onClick={handleDownloadCsv}>
            CSV 다운로드
          </Button>
        )}
      </div>
      <div ref={containerRef} className="relative flex-1">
        <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
        <div
          ref={tooltipRef}
          className="pointer-events-none fixed z-50 rounded-lg border border-gray-300 bg-[#37445E] text-white shadow-lg"
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

export default DisasterTypeHistoryStatsAreaPieChart;
