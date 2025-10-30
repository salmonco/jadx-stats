import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { Check } from "lucide-react";
import { ProcessedLineChartData } from "~/features/statistics/utils/processLineChartData";

interface ChartProps {
  data: ProcessedLineChartData;
  unit?: string;
  margin?: { top?: number; left?: number; right?: number; bottom?: number };
  allCategories?: string[];
  initialVisibleCategories?: string[];
}

const BaseLineChart = ({ data, unit, margin, allCategories, initialVisibleCategories }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<SVGLineElement>(null);
  const xRef = useRef<d3.ScalePoint<string> | null>(null);

  const categories = allCategories ?? Object.keys(data);
  const [visible, setVisible] = useState<string[]>(initialVisibleCategories ?? categories);

  useEffect(() => {
    setVisible(initialVisibleCategories ?? categories);
  }, [initialVisibleCategories, categories]);

  const [size, setSize] = useState({ w: 0, h: 370 });

  const color = useMemo(() => {
    const gen = (n: number) =>
      Array.from({ length: n }, (_, i) => {
        let hue = (210 + (i * 330) / n) % 360;
        if (hue > 60 && hue < 180) hue += 30;
        return d3.hsl(hue, (45 + (i % 4) * 5) / 100, (35 + (i % 3) * 5) / 100).toString();
      });
    return d3.scaleOrdinal<string>().domain(categories).range(gen(categories.length));
  }, [categories]);

  const years = useMemo(() => {
    const allYears = Object.values(data)
      .flat()
      .map((d) => d.year);
    return Array.from(new Set(allYears)).sort((a, b) => +a - +b);
  }, [data]);

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

    const { top, left, right, bottom } = { top: 15, left: 50, right: 20, bottom: 30, ...margin };
    const innerW = w - left - right;
    const innerH = h - top - bottom;

    const x = d3.scalePoint<string>().domain(years).range([0, innerW]).padding(0.4);
    xRef.current = x;
    const allVals = Object.values(data)
      .flat()
      .map((d) => d.value)
      .filter((v): v is number => typeof v === "number" && !isNaN(v));
    const visVals = visible.flatMap((c) => data[c]?.map((d) => d.value).filter((v): v is number => !isNaN(v)) ?? []);
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

    g.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(x).tickSize(-innerH))
      .call((g) => g.selectAll(".domain").remove())
      .selectAll("line")
      .attr("stroke", "#c7cbd6")
      .attr("stroke-width", 0.5);

    g.select("g").selectAll("text").attr("dy", "24px").style("font-size", "15px");

    g.append("g")
      .call(d3.axisLeft(y).ticks(8).tickSize(-innerW))
      .call((g) => g.selectAll(".domain").remove())
      .selectAll("line")
      .attr("stroke", "#c7cbd6")
      .attr("stroke-width", 0.5)
      .filter((d) => d === 0)
      .remove();

    g.selectAll("text").attr("fill", "#91949c").attr("font-size", "15px");

    const hoverLine = g.append("line").attr("y1", 0).attr("y2", innerH).attr("stroke", "#b9b9b9").attr("stroke-width", 2).style("opacity", 0);
    hoverRef.current = hoverLine.node() as SVGLineElement;

    const line = d3
      .line<{ year: string; value: number }>()
      .defined((d) => years.includes(d.year) && typeof d.value === "number" && !isNaN(d.value) && x(d.year) != null)
      .x((d) => x(d.year)!)
      .y((d) => y(d.value));

    visible.forEach((cat) => {
      const arr = data[cat];
      if (!arr?.length) return;

      g.append("path").datum(arr).attr("fill", "none").attr("stroke", color(cat)).attr("stroke-width", 2).attr("d", line);

      g.append("g")
        .selectAll("circle")
        .data(arr.filter((d) => years.includes(d.year) && typeof d.value === "number" && !isNaN(d.value) && x(d.year) != null))
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d.year)!)
        .attr("cy", (d) => y(d.value))
        .attr("r", 4.25)
        .attr("fill", color(cat))
        .attr("stroke", "white")
        .attr("stroke-width", 2);
    });
  }, [data, visible, size, color, years, margin]);

  useEffect(() => {
    const div = tooltipRef.current;
    const svg = chartRef.current;
    if (!div || !svg || !size.w || !years.length) return;

    const { left: L } = svg.getBoundingClientRect();
    const x = xRef.current;

    const move = (e: MouseEvent) => {
      const offset = e.clientX - L - (margin?.left ?? 50);
      if (offset < 0 || !x) return;

      const distances = years.map((y) => ({
        year: y,
        dist: Math.abs(x(y)! - offset),
        xVal: x(y)!,
      }));
      const closest = distances.reduce((a, b) => (a.dist < b.dist ? a : b));
      const { year, xVal } = closest;

      if (hoverRef.current) {
        hoverRef.current.setAttribute("x1", `${xVal}`);
        hoverRef.current.setAttribute("x2", `${xVal}`);
        hoverRef.current.style.opacity = "1";
      }

      const filteredData = visible
        .map((c) => {
          const p = data[c]?.find((d) => d.year === year);
          return p ? { category: c, value: p.value } : null;
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
              <div>
                ${typeof value === "number" ? Math.floor(value)?.toLocaleString() : "-"}
                ${unit ?? ""}
              </div>
            </div>
        `
        )
        .join("");

      const limitMessage = isLimited
        ? `<div style="padding: 0px 8px; color: #FFC132; font-size: 13px;">범례 항목이 10개를 초과할 경우, <br />그래프 툴팁에는 상위 10개 항목만 표시됩니다.</div>`
        : "";

      if (!html) return;

      const tooltipWidth = tooltipRef?.current?.clientWidth ? tooltipRef?.current?.clientWidth + 30 : 250;
      const viewportRight = window.innerWidth;
      const willOverflow = e.clientX + 10 + tooltipWidth > viewportRight;

      div.innerHTML = `
          <div style="padding: 16px; display: flex; flex-direction: column; gap: 10px; min-width: 200px;">
            <strong style="color: #FFC132;">▶ ${year}년</strong>
            ${html}
            ${limitMessage}
          </div>
      `;
      div.style.left = willOverflow ? `${e.clientX + 10 - tooltipWidth}px` : `${e.clientX + 15}px`;
      div.style.top = `${e.clientY - 15}px`;
      div.style.display = "block";
    };

    const leave = () => {
      if (hoverRef.current) hoverRef.current.style.opacity = "0";
      div.style.display = "none";
    };

    svg.removeEventListener("mousemove", move);
    svg.removeEventListener("mouseleave", leave);

    svg.addEventListener("mousemove", move);
    svg.addEventListener("mouseleave", leave);

    return () => {
      svg.removeEventListener("mousemove", move);
      svg.removeEventListener("mouseleave", leave);
    };
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
      <div className="mt-7 flex flex-wrap justify-center gap-4">
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
                svg.selectAll("path").style("opacity", 0.2);
                svg.selectAll("circle").style("opacity", 0.2);
                svg.selectAll(`path[stroke="${color(cat)}"]`).style("opacity", 1);
                svg.selectAll(`circle[fill="${color(cat)}"]`).style("opacity", 1);
              }}
              onMouseLeave={() => {
                if (!active) return;
                const svg = d3.select(chartRef.current);
                svg.selectAll("path").style("opacity", 1);
                svg.selectAll("circle").style("opacity", 1);
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

export default BaseLineChart;
