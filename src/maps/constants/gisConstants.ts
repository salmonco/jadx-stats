import { fromLonLat } from "ol/proj";
import { boundingExtent } from "ol/extent";
import { Style, Fill, Stroke } from "ol/style";

export const defaultMaxZoom = 14;

export type MapType = "jeju" | "rest" | "world";

// ** 제주도 Config **
export const jejuMapCenter = [126.54652, 33.37358]; // 제주도 중심 좌표 (위경도)
const jejuTopLeft = [125.87748, 33.63742];
const jejuBottomRight = [127.53276, 33.04861];

export const jejuMapCorners = [jejuTopLeft, jejuBottomRight];
export const jejuCenterCoord = fromLonLat(jejuMapCenter);
export const jejuMapExtent = boundingExtent([fromLonLat(jejuMapCorners[0]), fromLonLat(jejuMapCorners[1])]);

export const jejuMapConfig = {
  center: jejuCenterCoord,
  zoom: 11,
  extent: jejuMapExtent,
};

export const jejuMainRegions = [
  "gujwa",
  "namwon",
  "seongsan",
  "pyoseon",
  "aewol",
  "jungmun",
  "hallim",
  "jeju",
  "daejeong",
  "hangyeong",
  "jocheon",
  "andeok",
  "seogwi",
  "udo",
  "gapa",
];

// ** 대한민국 Config **
export const koreaMapCenter = [127.766922, 35.907757]; // 대한민국 중심 좌표 (위경도)
const koreaTopLeft = [124.0, 38.5]; // 서해의 서쪽 끝과 북쪽 끝에 가까운 좌표
const koreaBottomRight = [130.5, 34.0]; // 남해와 동해의 동쪽 끝, 제주도 제외

export const koreaMapCorners = [koreaTopLeft, koreaBottomRight];
export const koreaCenterCoord = fromLonLat(koreaMapCenter);
export const koreaMapExtent = boundingExtent([fromLonLat(koreaMapCorners[0]), fromLonLat(koreaMapCorners[1])]);

export const koreaMapConfig = {
  center: koreaCenterCoord,
  zoom: 0,
  extent: koreaMapExtent,
};

// ** 세계 지도 Config **
export const worldMapCenter = [126.54652, 33.37358]; // 세계 지도 중심 좌표 (위경도)
const worldTopLeft = [-180, 85];
const worldBottomRight = [180, -85];

export const worldMapCorners = [worldTopLeft, worldBottomRight];
export const worldCenterCoord = fromLonLat(worldMapCenter);
export const worldMapExtent = [-20037508, -20037508, 20037508, 20037508];

export const worldMapConfig = {
  center: worldCenterCoord,
  zoom: 2,
  extent: worldMapExtent,
};

// ** 스타일 설정 **
export const defaultVectorStyle = new Style({
  stroke: new Stroke({
    color: "rgba(0, 0, 255, 0.7)",
    width: 2,
  }),
  fill: new Fill({
    color: "transparent",
  }),
});

const TOP_Z_INDEX = 1000;

export const defaultHighlightStyle = new Style({
  stroke: new Stroke({
    color: "yellow",
    width: 3,
  }),
  fill: new Fill({
    color: "rgba(255, 255, 0, 0.3)",
  }),
  zIndex: TOP_Z_INDEX,
});

export const defaultSelectedStyle = new Style({
  stroke: new Stroke({
    color: "#ff7e0d",
    width: 3,
  }),
  fill: new Fill({
    color: "rgba(255, 126, 13, 0.3)",
  }),
});

export const EMD_KOR = {
  제주동지역: "jeju",
  애월: "aewol",
  한경: "hangyeong",
  한림: "hallim",
  조천: "jocheon",
  구좌: "gujwa",
  // "우도": "udo",
  서귀동지역: "seogwi",
  남원: "namwon",
  표선: "pyoseon",
  성산: "seongsan",
  안덕: "andeok",
  대정: "daejeong",
} as const;

export type EmdKor = keyof typeof EMD_KOR;

export type EmdEng = (typeof EMD_KOR)[EmdKor];

export const EMD_ENG: Record<EmdEng, EmdKor> = Object.fromEntries(Object.entries(EMD_KOR).map(([k, v]) => [v, k])) as Record<EmdEng, EmdKor>;
