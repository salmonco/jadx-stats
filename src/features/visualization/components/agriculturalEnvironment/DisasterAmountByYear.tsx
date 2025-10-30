import { useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { getGeoJson } from "~/services/gis";

export const COLOR_MAPS = {
  강풍: "#4e79a7",
  풍랑: "#f28e2b",
  호우: "#e15759",
  태풍: "#34495e",
  // 지진: "#59a14f",
  침수: "#edc948",
  // 해일: "#b07aa1",
  // 산사태: "#ff9da7",
  산불: "#9c755f",
  폭염: "#bab0ab",
  한파: "#4e89ae",
  가뭄: "#a1c181",
  대설: "#ffcb77",
  우박: "#f6a365",
  일조량부족: "#d4a5a5",
  건조: "#9c755f",
  고온: "#ff3000",
  기타: "#7f8c8d",
};

const colorArray = Object.values(COLOR_MAPS);

const DisasterAmountByYear = () => {
  const barChartRef = useRef<HTMLDivElement>(null);

  const { isFetching: _, data: byYear } = useQuery({
    queryKey: ["disasters-amount-by-year"],
    initialData: [],
    queryFn: () => getGeoJson("disaster-data/disasters_amount_by_year.json"),
  });

  useEffect(() => {
    if (barChartRef.current && byYear.length > 0) {
      barChartRef.current.innerHTML = "";
    }

    const filteredData = byYear.filter((d) => !["지진", "산사태", "해일"].includes(d.type));

    const chart = Plot.plot({
      marks: [Plot.barY(filteredData, { x: "year", y: "value", fill: "type", tip: true, title: (d) => `${d.type} : ${d.value.toLocaleString()}` }), Plot.ruleY([0])],
      marginTop: 20,
      marginLeft: 65,
      marginBottom: 35,
      marginRight: 30,
      height: 340,
      x: {
        label: null,
        tickFormat: "d",
        labelAnchor: "center",
      },
      y: {
        label: null,
        grid: true,
        tickFormat: "~s",
      },
      color: {
        domain: Object.keys(COLOR_MAPS),
        range: colorArray,
      },
      width: barChartRef.current.clientWidth,
      className: "bar-chart",
      style: {
        fontSize: "14px",
      },
    });

    barChartRef.current.appendChild(chart);

    d3.select(".bar-chart-swatches.bar-chart-swatches-wrap").style("margin-left", "10%").style("display", "flex").style("justify-content", "center");
    d3.select(chart).selectAll('g[aria-label="x-axis tick label"] text').style("font-size", "16px");

    return () => chart.remove();
  }, [byYear]);

  return (
    <div className="h-full w-full rounded-xl bg-white py-2">
      <div ref={barChartRef} />
    </div>
  );
};

export default DisasterAmountByYear;
