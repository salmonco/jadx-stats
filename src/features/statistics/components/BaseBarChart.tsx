import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { Check } from "lucide-react";
import { ProcessedBarChartData } from "~/features/statistics/utils/processBarChartData";

interface ChartProps {
  data: ProcessedBarChartData;
  unit?: string;
  margin?: { top?: number; left?: number; right?: number; bottom?: number };
  allCategories?: string[];
  initialVisibleCategories?: string[];
}

const BaseBarChart = ({ data, unit, margin, allCategories, initialVisibleCategories }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    if (allCategories?.length) return allCategories;
    const firstYear = Object.keys(data)[0];
    return data[firstYear]?.map((d) => d.category) ?? [];
  }, [data, allCategories]);

  const [visible, setVisible] = useState<string[]>(() => {
    if (initialVisibleCategories?.length) return initialVisibleCategories;
    return categories;
  });

  useEffect(() => {
    if (initialVisibleCategories?.length) {
      setVisible(initialVisibleCategories);
    }
  }, [initialVisibleCategories]);

  const [size, setSize] = useState({ w: 0, h: 400 });

  const color = useMemo(() => {
    const gen = (n: number) =>
      Array.from({ length: n }, (_, i) => {
        let hue = (210 + (i * 330) / n) % 360;
        if (hue > 60 && hue < 180) hue += 30;
        return d3.hsl(hue, (45 + (i % 4) * 5) / 100, (35 + (i % 3) * 5) / 100).toString();
      });
    return d3.scaleOrdinal<string>().domain(categories).range(gen(categories.length));
  }, [categories]);

  const years = useMemo(() => Object.keys(data).sort((a, b) => +a - +b), [data]);

  const toggleCategory = (category: string) => {
    setVisible((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]));
  };

  useEffect(() => {
    const resize = () => {
      requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const w = containerRef.current.clientWidth;
        if (!w) return;
        setSize({ w, h: Math.max(390, w * 0.28) });
      });
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (!chartRef.current || !size.w || !years.length) return;

    const { w, h } = size;
    const { top = 20, left = 50, right = 20, bottom = 30 } = margin ?? {};
    const innerW = w - left - right;
    const innerH = h - top - bottom;

    const x = d3.scaleBand().domain(years).range([0, innerW]).padding(0.1);
    const xSubgroup = d3.scaleBand().domain(visible).range([0, x.bandwidth()]).padding(0.05);

    const allVals = Object.values(data)
      .flat()
      .map((d) => d.value)
      .filter((v): v is number => typeof v === "number" && !isNaN(v));
    const visVals = visible.flatMap((cat) => years.map((year) => data[year]?.find((d) => d.category === cat)?.value).filter((v): v is number => !isNaN(v!)) ?? []);
    const vals = visVals.length ? visVals : allVals;
    if (!vals.length) return;

    const max = d3.max(vals)!;
    const min = d3.min(vals)!;
    const pad = (max - min) * 0.15;

    const y = d3
      .scaleLinear()
      .domain([Math.max(0, min - pad), max + pad])
      .range([innerH, 0]);

    const svg = d3.select(chartRef.current).attr("width", w).attr("height", h);
    svg.selectAll("*").remove();
    const g = svg.append("g").attr("transform", `translate(${left},${top})`);

    // x축
    g.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(x).tickSize(-innerH))
      .call((g) => g.selectAll(".domain").remove())
      .selectAll("line")
      .attr("stroke", "#c7cbd6")
      .attr("stroke-width", 0.5);

    g.select("g").selectAll("text").attr("dy", "20px");

    // y축
    g.append("g")
      .call(d3.axisLeft(y).ticks(8).tickSize(-innerW))
      .call((g) => g.selectAll(".domain").remove())
      .selectAll("line")
      .attr("stroke", "#c7cbd6")
      .attr("stroke-width", 0.5)
      .filter((d) => d === 0)
      .remove();

    g.selectAll("text").attr("fill", "#91949c").attr("font-size", "15px");

    // 막대
    years.forEach((year) => {
      const yearGroup = g.append("g").attr("transform", `translate(${x(year)},0)`);

      visible.forEach((cat) => {
        const value = data[year]?.find((d) => d.category === cat)?.value ?? 0;
        yearGroup
          .append("rect")
          .attr("x", xSubgroup(cat))
          .attr("y", y(value))
          .attr("width", xSubgroup.bandwidth())
          .attr("height", innerH - y(value))
          .attr("fill", color(cat));
      });

      // 툴팁
      yearGroup
        .on("mouseenter", (event) => {
          const filteredData = visible
            .map((cat) => {
              const value = data[year]?.find((d) => d.category === cat)?.value;
              if (value === undefined) return null;
              return { category: cat, value };
            })
            .filter((item): item is { category: string; value: number } => item !== null)
            .sort((a, b) => b.value - a.value);

          const isLimited = filteredData.length > 10;
          const displayData = filteredData.slice(0, 10);

          const html = displayData
            .map(
              ({ category, value }) => `
                <div style="background: #3D4C6E; border-radius: 6px; padding: 8px 10px; display: flex; justify-content: space-between; gap: 30px; color: white;">
                  <div>${category}</div>
                  <div>${Math.floor(value).toLocaleString()}${unit ?? ""}</div>
                </div>
              `
            )
            .join("");

          const limitMessage = isLimited
            ? `<div style="padding: 0px 8px; color: #FFC132; font-size: 13px;">범례 항목이 10개를 초과할 경우, <br />그래프 툴팁에는 상위 10개 항목만 표시됩니다.</div>`
            : "";

          if (!html) return;

          const tooltip = d3.select(tooltipRef.current);
          tooltip
            .html(
              `
              <div style="padding: 16px; display: flex; flex-direction: column; gap: 10px; min-width: 200px;">
                <strong style="color: #FFC132;">▶ ${year}년</strong>
                ${html}
                ${limitMessage}
              </div>
            `
            )
            .style("display", "block")
            .style("left", `${event.clientX + 20}px`)
            .style("top", `${event.clientY - 20}px`);
        })
        .on("mousemove", (event) => {
          const tooltip = d3.select(tooltipRef.current);
          const tooltipWidth = tooltipRef?.current?.clientWidth ? tooltipRef.current.clientWidth + 30 : 250;
          const viewportRight = window.innerWidth;
          const willOverflow = event.clientX + 10 + tooltipWidth > viewportRight;

          tooltip.style("left", willOverflow ? `${event.clientX + 10 - tooltipWidth}px` : `${event.clientX + 20}px`).style("top", `${event.clientY - 20}px`);
        })
        .on("mouseleave", () => {
          d3.select(tooltipRef.current).style("display", "none");
        });
    });

    // 기존 툴팁 이벤트 제거
    svg.on("mousemove", null).on("mouseleave", null);
  }, [data, visible, size, years]);

  return (
    <div ref={containerRef} className="relative flex h-full w-full flex-col items-center">
      {unit && <div className="ml-[8px] w-full text-[15px] text-[#91949c]">(단위 : {unit})</div>}
      <svg ref={chartRef} className="block w-full" />
      <div
        ref={tooltipRef}
        style={{
          position: "fixed",
          background: "#37445E",
          color: "#fff",
          borderRadius: 6,
          fontSize: 15,
          display: "none",
          pointerEvents: "none",
          zIndex: 100,
        }}
      />
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {categories.map((cat) => {
          const active = visible.includes(cat);
          return (
            <div
              key={cat}
              className="relative flex cursor-pointer items-center space-x-1.5"
              onClick={() => toggleCategory(cat)}
              onMouseEnter={() => {
                if (!active) return;
                const svg = d3.select(chartRef.current);
                svg.selectAll("rect").style("opacity", 0.2);
                svg.selectAll(`rect[fill="${color(cat)}"]`).style("opacity", 1);
              }}
              onMouseLeave={() => {
                if (!active) return;
                const svg = d3.select(chartRef.current);
                svg.selectAll("rect").style("opacity", 1);
              }}
            >
              <div
                className="h-[18px] w-[18px] rounded-full border"
                style={{ backgroundColor: active ? color(cat) : "#e5e7eb", borderColor: active ? color(cat) : "#d1d5db" }}
              />
              <Check size={12} strokeWidth={3} className="absolute left-[-3px]" style={{ color: active ? "#fff" : "#b9b9b9" }} />
              <span style={{ opacity: active ? 1 : 0.4, color: active ? "#111" : "#999", fontSize: 15 }}>{cat}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BaseBarChart;
