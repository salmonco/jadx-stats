export type VisualizationSetting = {
  /** 범례 설정 */
  legendOptions: LegendOptions;
  /** 시각화 타입 */
  visualType: VisualType;
  /** 레이블 설정 */
  labelOptions: LabelOptions;
  /** 투명도 */
  opacity: number;
};

/** 범례 설정 */
export type LegendOptions = {
  level: number;
  color: LegendColor;
  /** level, 사용자 정의에 따라 달라지는 기준값 */
  pivotPoints: number[];
};

export type LegendColor = "red" | "green" | "blue" | "purple" | "indigo" | "brown";

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

/** 지도 타입 설정 */
export const VISUAL_TYPES = {
  "색상": "color",
  "점": "dot",
  "버블": "bubble",
  "히트": "heat",
} as const;

export type VisualType = (typeof VISUAL_TYPES)[keyof typeof VISUAL_TYPES];

/** 지도 타입 기본값 */
export const DEFAULT_VISUAL_TYPE: VisualType = VISUAL_TYPES.색상;

/** 히트맵 반지름 기본값 */
export const DEFAULT_HEATMAP_RADIUS = 20;
/** 히트맵 블러 기본값 */
export const DEFAULT_HEATMAP_BLUR = 10;

/** 레이블 설정 */
export type LabelOptions = {
  isShowValue: boolean;
  isShowRegion: boolean;
};

/** 레이블 설정 기본값 */
export const DEFAULT_LABEL_OPTIONS: LabelOptions = {
  isShowValue: true,
  isShowRegion: true,
};

export const LABEL_TYPES = {
  값: "value",
  지역: "region",
} as const;

export type LabelType = (typeof LABEL_TYPES)[keyof typeof LABEL_TYPES];

/** 투명도 기본값 */
export const DEFAULT_TRANSPARENCY = 0.8;

/** 시각화 설정 기본값 */
export const DEFAULT_VISUALIZATION_SETTING: VisualizationSetting = {
  legendOptions: DEFAULT_LEGEND_OPTIONS,
  visualType: DEFAULT_VISUAL_TYPE,
  labelOptions: DEFAULT_LABEL_OPTIONS,
  opacity: DEFAULT_TRANSPARENCY,
};

export const VISUAL_SETTING_BUTTONS = {
  타입: "type",
  레이블: "label",
  초기화: "reset",
  "투명도 설정": "transparency",
} as const;

export type VisualSettingButtonId = (typeof VISUAL_SETTING_BUTTONS)[keyof typeof VISUAL_SETTING_BUTTONS];
