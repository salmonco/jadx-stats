import * as d3 from "d3";
import { Button } from "antd";
import { Download } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import { CROPS, CROP_COLORS } from "~/maps/constants/cropDistribution";
import downloadCsv, { CsvColumn } from "~/utils/downloadCsv";

const KOREAN_CROP_COLORS: { [key: string]: string } = {};
Object.entries(CROPS).forEach(([korean, english]) => {
  KOREAN_CROP_COLORS[korean] = CROP_COLORS[english];
});

const MAX_DISPLAY_ITEMS = 20;

interface Props {
  chartData: { [crop: string]: { [region: string]: number } };
  isReportMode?: boolean;
}

const CropDistributionTreemap = ({ chartData, isReportMode }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height: 420 });

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      setSize({ width, height: Math.max(300, height) });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const cropTotals = useMemo(() => {
    const totals: { crop: string; area: number }[] = [];
    Object.entries(chartData).forEach(([crop, regions]) => {
      const totalArea = Object.values(regions).reduce((sum, area) => sum + area, 0);
      totals.push({ crop, area: totalArea });
    });
    const sorted = totals.sort((a, b) => b.area - a.area);

    // 상위 MAX_DISPLAY_ITEMS개만 표시하고 나머지는 기타로 묶기
    const topItems = sorted.slice(0, MAX_DISPLAY_ITEMS);
    const others = sorted.slice(MAX_DISPLAY_ITEMS);

    if (others.length > 0) {
      const othersSum = others.reduce((sum, item) => sum + item.area, 0);
      return [
        ...topItems,
        {
          crop: "기타",
          area: othersSum,
        },
      ];
    }

    return topItems;
  }, [chartData]);

  const handleDownloadCsv = () => {
    const columns: CsvColumn[] = [
      { title: "작물", dataIndex: "crop" },
      { title: "재배 면적(ha)", dataIndex: "area" },
    ];

    // 전체 데이터를 CSV로 다운로드
    const allTotals: { crop: string; area: number }[] = [];
    Object.entries(chartData).forEach(([crop, regions]) => {
      const totalArea = Object.values(regions).reduce((sum, area) => sum + area, 0);
      allTotals.push({ crop, area: totalArea });
    });
    const sorted = allTotals.sort((a, b) => b.area - a.area);

    const data = sorted.map((d) => ({
      crop: d.crop,
      area: d.area.toFixed(1),
    }));

    downloadCsv(columns, data, "작물별_재배_면적_트리맵.csv");
  };

  useEffect(() => {
    if (!cropTotals.length || !containerRef.current) return;

    const actualWidth = isReportMode && containerRef.current.parentElement ? containerRef.current.parentElement.clientWidth : size.width;

    const root = d3.hierarchy({ children: cropTotals }).sum((d: any) => d.area);

    // 텍스트를 위한 여백 추가
    const padding = 10;
    const treemapWidth = actualWidth - padding * 2;
    const treemapContentHeight = size.height - padding * 2;

    const treemapLayout = d3.treemap().size([treemapWidth, treemapContentHeight]).padding(1);
    treemapLayout(root);

    const svg = d3
      .create("svg")
      .attr("width", actualWidth)
      .attr("height", size.height)
      .style("font", "10px sans-serif")
      .style("overflow", "visible")
      .style("background", isReportMode ? "transparent" : undefined);

    // 전체 트리맵을 감싸는 그룹에 패딩 적용
    const mainGroup = svg.append("g").attr("transform", `translate(${padding},${padding})`);

    const leaf = mainGroup
      .selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", (d: d3.HierarchyRectangularNode<any>) => `translate(${d.x0},${d.y0})`);

    leaf
      .append("rect")
      .attr("fill", (d: d3.HierarchyRectangularNode<any>) => (d.data.crop === "기타" ? "#808080" : KOREAN_CROP_COLORS[d.data.crop] || "#999"))
      .attr("width", (d: d3.HierarchyRectangularNode<any>) => d.x1 - d.x0)
      .attr("height", (d: d3.HierarchyRectangularNode<any>) => d.y1 - d.y0);

    // 텍스트를 SVG에 직접 추가하여 클리핑 방지 (padding 적용)
    svg
      .selectAll(".treemap-label-crop")
      .data(root.leaves())
      .join("text")
      .attr("class", "treemap-label-crop")
      .attr("x", (d: d3.HierarchyRectangularNode<any>) => padding + d.x0 + (d.x1 - d.x0) / 2)
      .attr("y", (d: d3.HierarchyRectangularNode<any>) => padding + d.y0 + (d.y1 - d.y0) / 2 - 5)
      .attr("text-anchor", "middle")
      .attr("pointer-events", "none")
      .text((d: any) => d.data.crop)
      .attr("fill", isReportMode ? "black" : "white")
      .style("font-size", "12px")
      .style("font-weight", "600");

    // Area label
    svg
      .selectAll(".treemap-label-area")
      .data(root.leaves())
      .join("text")
      .attr("class", "treemap-label-area")
      .attr("x", (d: d3.HierarchyRectangularNode<any>) => padding + d.x0 + (d.x1 - d.x0) / 2)
      .attr("y", (d: d3.HierarchyRectangularNode<any>) => padding + d.y0 + (d.y1 - d.y0) / 2 + 15)
      .attr("text-anchor", "middle")
      .attr("pointer-events", "none")
      .text((d: any) => `${d.data.area.toFixed(1)}ha`)
      .attr("fill", isReportMode ? "black" : "white")
      .style("font-size", "12px");

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(svg.node()!);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [cropTotals, size, isReportMode]);

  return (
    <div className="h-full w-full">
      <div className="mb-[8px] flex items-center justify-between">
        <p className="text-xl font-semibold">작물별 재배 면적 (트리맵)</p>
        {!isReportMode && (
          <Button type="primary" icon={<Download size={16} />} onClick={handleDownloadCsv}>
            CSV 다운로드
          </Button>
        )}
      </div>
      <div ref={containerRef} style={isReportMode ? {} : { height: `${size.height}px` }} className={isReportMode ? "w-full min-w-full" : "w-full"} />
    </div>
  );
};

export default CropDistributionTreemap;
