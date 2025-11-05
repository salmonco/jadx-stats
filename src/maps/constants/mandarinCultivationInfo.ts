import * as d3 from "d3";

export const PALETTE_12 = [
  "#E63946", // 딥 레드
  "#F1A208", // 진한 앰버
  "#A8DADC", // 소프트 민트
  "#457B9D", // 블루그레이
  "#2A9D8F", // 터콰이즈
  "#FF6B6B", // 코랄레드
  "#6D597A", // 무화과 퍼플
  "#F28482", // 따뜻한 살몬
  "#118AB2", // 청록에 가까운 파랑
  "#FF9F1C", // 오렌지
  "#8AC926", // 라임 그린
  "#8338EC", // 보라
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
