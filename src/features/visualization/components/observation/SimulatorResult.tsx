import { Button } from "antd";
import * as d3 from "d3";
import { Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import InfoTooltip from "~/components/InfoTooltip";
import downloadCsv, { CsvColumn } from "~/utils/downloadCsv";

interface Props {
  chartData: any;
  isReportMode?: boolean;
}

const MAX_DISPLAY_ITEMS = 20;

const SimulatorResult = ({ chartData, isReportMode }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height: 420 });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setSize({
        width: rect.width,
        height: Math.max(300, rect.height),
      });
    };

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(containerRef.current);

    setTimeout(updateSize, 0);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const delay = isReportMode ? 200 : 100;
    setTimeout(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 0) {
        setSize({
          width: rect.width,
          height: Math.max(300, rect.height),
        });
      }
    }, delay);
  }, [chartData, isReportMode]);

  useEffect(() => {
    if (!chartData || chartData.length === 0) return;

    // Filter out zero values
    const filteredData = chartData.filter((d: any) => d.value > 0);
    if (filteredData.length === 0) return;

    // 상위 MAX_DISPLAY_ITEMS개만 표시하고 나머지는 기타로 묶기
    const topItems = filteredData.slice(0, MAX_DISPLAY_ITEMS);
    const others = filteredData.slice(MAX_DISPLAY_ITEMS);

    let displayData = topItems;

    if (others.length > 0) {
      const othersSum = others.reduce((sum: number, item: any) => sum + item.value, 0);
      displayData = [
        ...topItems,
        {
          region: "기타",
          label: "기타",
          value: othersSum,
        },
      ];
    }

    // "기타"를 제외하고 정렬한 후, "기타"를 맨 마지막에 추가
    const othersItem = displayData.find((d: any) => d.label === "기타");
    const nonOthersData = displayData.filter((d: any) => d.label !== "기타");
    const sortedDisplayData = othersItem ? [...nonOthersData, othersItem] : nonOthersData;

    const { width, height } = size;
    const actualWidth = width > 0 ? width : isReportMode ? 1200 : 800;

    const radius = Math.min(actualWidth, height) / 2 - 40;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", actualWidth).attr("height", height);

    const group = svg.append("g").attr("transform", `translate(${actualWidth / 2}, ${height / 2})`);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3
      .pie<any>()
      .sort(null)
      .value((d) => d.value)
      .startAngle(-Math.PI * 2)
      .endAngle(1.5 * Math.PI);

    const arc = d3
      .arc<any>()
      .innerRadius(radius * 0.75)
      .outerRadius(radius);

    const tooltip = d3.select(tooltipRef.current);

    const paths = group
      .selectAll("path")
      .data(pie(sortedDisplayData))
      .join("path")
      .attr("d", arc)
      .attr("fill", (d, i) => colorScale(i.toString()))
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
                  <div style="color: #FFC132;"><strong>${d.data.label}</strong></div>
                  <div>${(d.data.value / 10_000).toFixed(1).toLocaleString()} ha</div>
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

    const totalValue = displayData.reduce((sum: number, d: any) => sum + d.value, 0);
    group
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "18px")
      .style("font-weight", "600")
      .style("fill", isReportMode ? "black" : "#ffffff")
      .text(`총 경제수령 면적 : ${(totalValue / 10_000).toFixed(1).toLocaleString()}ha`);
  }, [chartData, size, isReportMode]);

  const handleDownloadCsv = () => {
    if (!chartData || chartData.length === 0) return;

    const filteredData = chartData.filter((d: any) => d.value > 0);

    const columns: CsvColumn[] = [
      { title: "지역", dataIndex: "region" },
      { title: "경제수령 면적(ha)", dataIndex: "area" },
    ];

    const data = filteredData.map((d: any) => ({
      region: d.label,
      area: (d.value / 10000).toFixed(1),
    }));

    downloadCsv(columns, data, "지역별_경제수령_면적.csv");
  };

  if (!chartData || chartData.length === 0) {
    return null;
  }

  const filteredData = chartData.filter((d: any) => d.value > 0);
  const filteredCount = filteredData.length;

  if (filteredCount === 0) {
    return (
      <div className={`flex h-full w-full flex-col items-center justify-center ${isReportMode ? "text-black" : "text-white"}`}>
        <p className="text-base">표시할 데이터가 없습니다</p>
      </div>
    );
  }

  return (
    <div className={`flex h-full w-full flex-col ${isReportMode ? "text-black" : "text-white"}`}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <p className="text-xl font-semibold">지역별 경제수령 면적 {filteredCount > MAX_DISPLAY_ITEMS && "(상위 20개 지역)"}</p>
          {!isReportMode && (
            <InfoTooltip
              title="지역별 경제수령 면적이란?"
              content={`경제수령기(일반적으로 수령 15~25년)의 감귤나무가 지역별로 얼마나 재배되고 있는지를 나타내는 자료입니다.\n경제수령기의 나무는 생산성이 높고 과실 품질이 우수하기 때문에, 해당 지역의 생산 효율성과 경쟁력을 가늠하는 \n데 지표가 됩니다.`}
            />
          )}
        </div>
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

export default SimulatorResult;
