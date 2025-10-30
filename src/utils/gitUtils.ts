import * as d3 from "d3";
import { BaseLegendItem } from "~/features/visualization/components/common/BaseLegend";
import { ScrollSelectorOption } from "~/features/visualization/components/common/OneDepthScrollSelector";

export const crops = ["감귤", "감자", "당근", "마늘", "무", "방울양배추", "배추", "브로콜리", "비트", "양배추", "양파", "잎마늘", "적채", "쪽파", "콜라비"];

export const colors = [
  "#d90000", // 감귤 (Tangerine) - Orange
  "#8B4513", // 감자 (Potato) - Brown
  "#ff6a00", // 당근 (Carrot) - Carrot Orange
  "#d9c050", // 마늘 (Garlic) - Light Yellow
  "#e4fc6f", // 무 (Radish) - White
  "#006400", // 방울양배추 (Brussels Sprouts) - Dark Green
  "#98FB98", // 배추 (Napa Cabbage) - Light Green
  "#008000", // 브로콜리 (Broccoli) - Green
  "#8B0000", // 비트 (Beet) - Dark Red
  "#4567d6", // 양배추 (Cabbage)
  "#FFFF00", // 양파 (Onion) - Yellow
  "#2E8B57", // 잎마늘 (Garlic Chives) - Dark Green
  "#FF6347", // 적채 (Red Cabbage) - Tomato Red
  "#00FF00", // 쪽파 (Green Onion) - Bright Green
  "#6A5ACD", // 콜라비 (Kohlrabi) - Light Purple
];

export const getCropSelectorItems = (excludeCrop?: string): ScrollSelectorOption[] => {
  return crops
    .filter((crop) => crop !== excludeCrop)
    .map((crop) => ({
      value: crop,
      label: crop,
      color: cropColorScale(crop) as string,
    }));
};

export const getCropLegendItems = (excludeCrop?: string): BaseLegendItem[] => {
  return crops
    .filter((crop) => crop !== excludeCrop)
    .map((crop) => ({
      label: crop,
      color: cropColorScale(crop) as string,
    }));
};

export const cropColorScale = d3.scaleOrdinal().domain(crops).range(colors);

export const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, "");
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;
  return [r, g, b];
};
