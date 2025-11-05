import * as d3 from "d3";
import { useEffect, useMemo, useRef } from "react";

import { cropColorScale } from "~/features/visualization/utils/getCropItems";
import { cropLabels } from "~/maps/constants/cropDistribution";

interface Props {
  excludeCrops?: string[];
}

const CropLegend = ({ excludeCrops = [] }: Props) => {
  const filteredCrops = useMemo(() => cropLabels.filter((crop) => !excludeCrops.includes(crop)), [excludeCrops]);

  const ref = useRef(null);

  useEffect(() => {
    drawChart();

    return () => {
      d3.select(ref.current).selectAll("*").remove();
    };
  }, []);

  const drawChart = () => {
    d3.select(ref.current).selectAll("*").remove();

    const maxWidthForCol = {};
    filteredCrops.forEach((crop, index) => {
      const column = Math.floor(index / 5);
      const textWidth = (crop.length + 2) * 16;
      if (textWidth > maxWidthForCol[column] || !maxWidthForCol[column]) {
        maxWidthForCol[column] = textWidth;
      }
    });

    let legendBoxWidth = 0;
    Object.keys(maxWidthForCol).forEach((key) => {
      legendBoxWidth += maxWidthForCol[key];
    });

    const lbWidth = legendBoxWidth + 10 * 2;
    const lbHeight = 5 * 20 + 10 * 2;

    const svg = d3.select(ref.current).attr("width", lbWidth);

    const legend = svg.append("g").attr("class", "legend").attr("anchor", "middle").attr("transform", `translate(10, 10)`);

    legend
      .append("rect")
      .attr("width", lbWidth)
      .attr("height", lbHeight)
      .attr("fill", "rgba(100, 100, 100, 0.6)")
      .attr("transform", `translate(-10, -10)`)
      .attr("rx", 10);

    filteredCrops.forEach((crop, index) => {
      const column = Math.floor(index / 5);
      const row = index % 5;

      let colWidth = 0;
      if (column > 0) {
        Object.keys(maxWidthForCol).forEach((key) => {
          if (parseInt(key) < column) {
            colWidth += maxWidthForCol[key];
          }
        });
      }

      const legendRow = legend
        .append("g")
        .attr("class", "legendRow")
        .attr("transform", `translate(${colWidth}, ${row * 20})`);

      legendRow
        .append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("stroke", "black")
        .attr("stroke-width", 0.1)
        .attr("fill", cropColorScale(crop) as string);

      legendRow.append("text").attr("x", 24).attr("y", 9).attr("dy", "0.35em").attr("fill", "white").attr("stroke", "black").attr("stroke-width", 0.1).text(crop);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[18px] font-semibold text-gray-700">범례</p>
      <svg ref={ref} />
    </div>
  );
};

export default CropLegend;
