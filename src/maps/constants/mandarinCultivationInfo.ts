import * as d3 from "d3";

export const PALETTE_12 = [
  "#3B82F6", // 블루
  "#10B981", // 에메랄드
  "#F59E0B", // 앰버
  "#EF4444", // 레드
  "#8B5CF6", // 바이올렛
  "#EC4899", // 핑크
  "#14B8A6", // 틸
  "#F97316", // 오렌지
  "#6366F1", // 인디고
  "#84CC16", // 라임
  "#06B6D4", // 시안
  "#A855F7", // 퍼플
] as const;

export const getColor = (idx: number) => {
  if (idx < PALETTE_12.length) return PALETTE_12[idx];
  const base = PALETTE_12[idx % 12];
  const round = Math.floor(idx / 12);
  return d3
    .color(base)!
    .darker(round * 0.5)
    .formatHex();
};
