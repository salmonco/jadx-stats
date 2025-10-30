import { useRef, useEffect } from "react";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useQuery } from "@tanstack/react-query";
import { getGeoJson } from "~/services/gis";
// @ts-ignore
import { svg } from "htl";

interface Disaster {
  raw_name: string;
  official_name: string;
  emojis: string;
  min_date: Date;
  max_date: Date;
  amount: number;
  x2: number;
  types: string[];
}

const DisasterListedByYear = () => {
  const ganttChartRef = useRef<HTMLDivElement>(null);

  const formatDisasters = (disasters: any[]): Disaster[] => {
    const transformed = disasters.map((disaster: any) => {
      const minDate = new Date(disaster.min_date);
      let maxDate = null;
      if (disaster.max_date) {
        maxDate = new Date(disaster.max_date);
      } else {
        maxDate = new Date(disaster.min_date);
      }
      const days = (disaster.amount / 33369437) * 2000;
      const x2 = minDate.getTime() + days * 24 * 60 * 60 * 1000;

      return {
        ...disaster,
        min_date: minDate,
        max_date: maxDate,
        x2,
      };
    });
    return transformed;
  };

  const { isFetching: _, data: disasters } = useQuery<Disaster[]>({
    queryKey: ["disasters"],
    initialData: [],
    queryFn: async () => {
      const data = await getGeoJson("disaster-data/disasters.json");
      return formatDisasters(data);
    },
  });

  useEffect(() => {
    if (ganttChartRef.current && disasters.length > 0) {
      ganttChartRef.current.innerHTML = "";
    }

    const filteredData = disasters.filter((d) => {
      const excludedTypes = ["지진", "산사태", "해일"];
      return !d.types.some((type) => excludedTypes.includes(type));
    });

    const chart = Plot.plot({
      marginLeft: 155 + 100,
      marginRight: 60,
      width: ganttChartRef.current.clientWidth,
      height: 3000,
      axis: null,
      x: {
        axis: "top",
        grid: true,
        tickFormat: (x) => {
          const date = new Date(x);
          const year = date.getFullYear().toString().slice(2);
          let month = (date.getMonth() + 1).toString();
          month = month.length === 1 ? `0${month}` : month;
          return `${year}년${month}월`;
        },
      },
      marks: [
        () => svg`<defs>
              <linearGradient id="gradient2" gradientTransform="rotate(0)">
                <stop offset="15%" stop-color="gold" />
                <stop offset="75%" stop-color="red" />
                <stop offset="100%" stop-color="purple" />
              </linearGradient>
            </defs>`,
        Plot.barX(filteredData, {
          x1: "min_date",
          x2: "x2",
          y: "raw_name",
          sort: { y: "x1" },
          fill: "gray",
          dx: 2,
          dy: -1,
        }),
        Plot.barX(filteredData, {
          x1: "min_date",
          x2: "x2",
          y: "raw_name",
          sort: { y: "x1" },
          fill: "url(#gradient2)",
        }),
        Plot.text(filteredData, {
          x: "min_date",
          y: "raw_name",
          text: "official_name",
          textAnchor: "end",
          dx: -3,
        }),
        Plot.text(filteredData, {
          x: "x2",
          y: "raw_name",
          text: "emojis",
          textAnchor: "start",
          dx: 5,
        }),
        Plot.tip(
          filteredData,
          Plot.pointer({
            x: "min_date",
            y: "raw_name",
            fontSize: 14,
            title: (d) => {
              return d.raw_name;
            },
          })
        ),
      ],
    });

    ganttChartRef.current.appendChild(chart);

    d3.select(chart).selectAll('g[aria-label="text"] text').style("font-size", "16px").style("cursor", "pointer");

    return () => chart.remove();
  }, [disasters]);

  return (
    <div className={`w-full rounded-xl bg-white py-4`}>
      <div ref={ganttChartRef} />
    </div>
  );
};

export default DisasterListedByYear;
