import * as d3 from "d3";

export const CROP_LEVEL = {
  "상위 1품목": "lvl1",
  "상위 2품목": "lvl2",
} as const;

export type CropLevel = (typeof CROP_LEVEL)[keyof typeof CROP_LEVEL];

export const DEFAULT_CROP_LEVEL: CropLevel = CROP_LEVEL["상위 2품목"];

export const cropInfoOptions = Object.entries(CROP_LEVEL).map(([label, value]) => ({
  label,
  value,
}));

export const CROPS = {
  감귤: "Tangerine",
  감자: "Potato",
  당근: "Carrot",
  마늘: "Garlic",
  무: "Radish",
  방울양배추: "Brussels Sprouts",
  배추: "Napa Cabbage",
  브로콜리: "Broccoli",
  비트: "Beet",
  양배추: "Cabbage",
  양파: "Onion",
  잎마늘: "Garlic Chives",
  적채: "Red Cabbage",
  쪽파: "Green Onion",
  콜라비: "Kohlrabi",
} as const;

export type CropLabel = keyof typeof CROPS;

export const cropLabels = Object.keys(CROPS) as CropLabel[];

export const CROP_COLORS = {
  [CROPS.감귤]: "#d90000", // 감귤 (Tangerine) - Orange
  [CROPS.감자]: "#8B4513", // 감자 (Potato) - Brown
  [CROPS.당근]: "#ff6a00", // 당근 (Carrot) - Carrot Orange
  [CROPS.마늘]: "#d9c050", // 마늘 (Garlic) - Light Yellow
  [CROPS.무]: "#e4fc6f", // 무 (Radish) - White
  [CROPS.방울양배추]: "#006400", // 방울양배추 (Brussels Sprouts) - Dark Green
  [CROPS.배추]: "#98FB98", // 배추 (Napa Cabbage) - Light Green
  [CROPS.브로콜리]: "#008000", // 브로콜리 (Broccoli) - Green
  [CROPS.비트]: "#8B0000", // 비트 (Beet) - Dark Red
  [CROPS.양배추]: "#4567d6", // 양배추 (Cabbage)
  [CROPS.양파]: "#FFFF00", // 양파 (Onion) - Yellow
  [CROPS.잎마늘]: "#2E8B57", // 잎마늘 (Garlic Chives) - Dark Green
  [CROPS.적채]: "#FF6347", // 적채 (Red Cabbage) - Tomato Red
  [CROPS.쪽파]: "#00FF00", // 쪽파 (Green Onion) - Bright Green
  [CROPS.콜라비]: "#6A5ACD", // 콜라비 (Kohlrabi) - Light Purple
} as const;

export type CropColor = (typeof CROP_COLORS)[keyof typeof CROP_COLORS];

export const cropColors = Object.values(CROP_COLORS) as CropColor[];

export const cropColorScale = d3.scaleOrdinal().domain(cropLabels).range(cropColors);
