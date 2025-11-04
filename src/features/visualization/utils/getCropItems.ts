import * as d3 from "d3";
import { BaseLegendItem } from "~/features/visualization/components/common/BaseLegend";
import { ScrollSelectorOption } from "~/features/visualization/components/common/OneDepthScrollSelector";
import { cropColors, cropLabels } from "~/maps/constants/cropDistribution";

export const getCropSelectorItems = (excludeCrop?: string): ScrollSelectorOption[] => {
  return cropLabels
    .filter((crop) => crop !== excludeCrop)
    .map((crop) => ({
      value: crop,
      label: crop,
      color: cropColorScale(crop) as string,
    }));
};

export const getCropLegendItems = (excludeCrop?: string): BaseLegendItem[] => {
  return cropLabels
    .filter((crop) => crop !== excludeCrop)
    .map((crop) => ({
      label: crop,
      color: cropColorScale(crop) as string,
    }));
};

export const cropColorScale = d3.scaleOrdinal().domain(cropLabels).range(cropColors);

export const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
};
