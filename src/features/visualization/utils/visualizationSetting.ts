export type VisualizationSetting = {
  /** 범례 설정 */
  legendOptions: LegendOptions;
  /** 시각화 타입 */
  visualType: VisualType;
  /** 레이블 설정 */
  labelOptions: LabelOptions;
  /** 투명도 */
  transparency: number;
};

/** 범례 레벨 기본값 */
const DEFAULT_LEGEND_LEVEL = 7;

/** 범례 색상 기본값 */
const DEFAULT_LEGEND_COLOR: LegendColor = "red";

/** 범례 설정 기본값 */
export const DEFAULT_LEGEND_OPTIONS: LegendOptions = {
  level: DEFAULT_LEGEND_LEVEL,
  color: DEFAULT_LEGEND_COLOR,
  pivotPoints: [],
};

/** 시각화 타입 기본값 */
export const DEFAULT_VISUAL_TYPE: VisualType = "color";

/** 레이블 설정 기본값 */
export const DEFAULT_LABEL_OPTIONS: LabelOptions = {
  isShowValue: true,
  isShowRegion: true,
};

/** 투명도 기본값 */
export const DEFAULT_TRANSPARENCY = 0.8;

type LegendOptions = {
  level: number;
  color: LegendColor;
  /** level, 사용자 정의에 따라 달라지는 기준값 */
  pivotPoints: number[];
};

type LegendColor = "red" | "green" | "blue" | "purple" | "indigo" | "brown";

type VisualType = "color" | "dot" | "bubble" | "hit";

type LabelOptions = {
  isShowValue: boolean;
  isShowRegion: boolean;
};
