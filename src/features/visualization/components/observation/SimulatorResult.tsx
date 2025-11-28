import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as Plot from "@observablehq/plot";
import InfoTooltip from "~/components/InfoTooltip";

interface Props {
  chartData: any;
  isReportMode?: boolean;
}

const SimulatorResult = ({ chartData, isReportMode }: Props) => {
  const plotRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);

  const [chartDataLength, setChartDataLength] = useState<number>(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const getInset = (length: number) => {
    if (length === 20) return 3;
    if (length === 14) return 5;
    if (length === 4) return 20;
    if (length === 2) return 40;
    return 120;
  };

  useEffect(() => {
    if (!plotRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      setContainerSize({ width, height });
    });

    observer.observe(plotRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!chartData || !plotRef.current || !legendRef.current) return;
    
    const width = isReportMode ? (containerSize.width || 750) : (containerSize.width || 800);
    const height = isReportMode ? 400 : (containerSize.height || 400);
    
    if (width === 0 || height === 0) return;

    setChartDataLength(chartData?.length);

    const regionLegend = Plot.legend({
      color: {
        type: "categorical",
        domain: ["경제수령"],
        range: ["#698bcf"],
      },
      width: 110,
      style: {
        fontSize: "14px",
        color: isReportMode ? "black" : "#fff",
        marginRight: "-25px",
      },
    });

    const maxValue = Math.max(...chartData.map((d) => d.value));
    const desiredTicks = 8;
    const niceStep = d3.tickStep(0, maxValue, desiredTicks);
    const yMax = Math.ceil(maxValue / niceStep) * niceStep;

    const plot = Plot.plot({
      width: width,
      height: height,
      marginTop: 40,
      marginBottom: chartData.length === 20 ? 35 : 10,
      marginLeft: 60,
      style: {
        fontSize: "16px",
        color: isReportMode ? "black" : undefined,
        background: isReportMode ? "transparent" : undefined,
      },
      x: {
        label: "",
      },
      y: {
        domain: [0, yMax],
        ticks: 8,
        tickFormat: (d) => (d / 10000).toLocaleString(),
        grid: true,
        label: "면적(ha)",
        labelOffset: 55,
      },
      color: {
        range: ["#698bcf"],
      },
      marks: [
        Plot.axisX({
          tickSize: 0,
          tickPadding: chartData.length === 20 ? 13 : 10,
          tickRotate: chartData.length === 20 ? -45 : 0,
          fontSize: "15px",
          tickFormat: (region) => {
            const found = chartData.find((d) => d.region === region);
            return found?.label ?? region;
          },
        }),
        Plot.barY(chartData, {
          x: "region", // 사용자에게 보여주는 그룹화 키
          y: "value",
          fill: "#698bcf", // 혹은 제거 가능
          sort: { x: "-y" },
          insetLeft: getInset(chartData.length),
          insetRight: getInset(chartData.length),
        }),
        Plot.text(chartData, {
          x: "region",
          y: "value",
          text: (d) => `${(d.value / 10000).toFixed(1)}`,
          dy: -8,
          fill: isReportMode ? "black" : "#ffffff",
          fontSize: "12px",
        }),
        Plot.ruleY([0]),
      ],
    });

    plotRef.current.innerHTML = "";
    legendRef.current.innerHTML = "";

    plotRef.current.appendChild(plot);
    legendRef.current.appendChild(regionLegend);
    d3.select(plot).style("overflow", "visible");
  }, [chartData, isReportMode, containerSize]);

  if (!chartData || chartData.length === 0) {
    return null;
  }

  return (
    <div className="relative flex h-full w-full flex-col items-start justify-center gap-3 pb-4">
      <div className="flex items-center gap-[10px]">
        <p className="text-xl font-semibold">지역별 경제수령 면적 {chartDataLength === 20 && "(상위 20개 지역)"}</p>
        {!isReportMode && (
          <InfoTooltip
            title="지역별 경제수령 면적이란?"
            content={`경제수령기(일반적으로 수령 15~25년)의 감귤나무가 지역별로 얼마나 재배되고 있는지를 나타내는 자료입니다.\n경제수령기의 나무는 생산성이 높고 과실 품질이 우수하기 때문에, 해당 지역의 생산 효율성과 경쟁력을 가늠하는 \n데 지표가 됩니다.`}
          />
        )}
      </div>
      <div className="absolute right-0 top-0" ref={legendRef} />
      <div className="h-full w-full" ref={plotRef} />
    </div>
  );
};

export default SimulatorResult;
