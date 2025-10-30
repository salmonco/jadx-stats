import * as Plot from "@observablehq/plot";
import { useEffect, useRef } from "react";
import { baseUrl } from "~/maps/services/MapDataService";

interface SiteData {
  region: string;
  value: number;
}

// 데이터 로드
const loadData = async (element: string): Promise<SiteData[]> => {
  const response = await fetch(`${baseUrl}/groundwater-data/boxplot_${element}.json`, {
    cache: "no-store",
  });
  const jsonData: SiteData[] = await response.json();
  return jsonData;
};

// Box Plot 생성
const createBoxPlot = (element: string, data: SiteData[], container: HTMLElement) => {
  if (data.length === 0) {
    console.error(`No data found for element: ${element}`);
    return;
  }

  const plot = Plot.plot({
    marks: [
      Plot.boxY(data, {
        x: "region",
        y: "value",
        // fill: "region",
        stroke: "region",
      }),
      Plot.dot(data, {
        x: "region",
        y: "value",
        // fill: "region",
        r: 1,
      }),
    ],
    y: {
      label: `${translateElement(element)}`,
      domain: [Math.min(...data.map((d) => d.value)) - 1, Math.max(...data.map((d) => d.value)) + 1],
    },
    x: { label: "" },
    // color: { scheme: "set1" },
    width: container.clientWidth,
    height: container.clientHeight,
  });

  container.innerHTML = "";
  container.appendChild(plot);
};

const translateElement = (element: string): string => {
  switch (element) {
    case "nitrogen":
      return "질소";
    case "chlorine":
      return "염소";
    case "ph":
      return "pH";
    default:
      return element;
  }
};

interface RegionMetricsRangeProps {
  element: string;
}

const RegionMetricsRange = ({ element }: RegionMetricsRangeProps) => {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData(element).then((jsonData) => {
      createBoxPlot(element, jsonData, plotRef.current!);
    });
  }, [element]);

  return (
    <div className="flex flex-col justify-center rounded-lg bg-[#43516D] p-3 text-white">
      <div id={`${element}-plot`} className="h-full w-full" ref={plotRef} />
      <div className="flex justify-center">
        <p className="font-sans-kr text-[18px] font-bold">{translateElement(element)}</p>
      </div>
    </div>
  );
};

export default RegionMetricsRange;
