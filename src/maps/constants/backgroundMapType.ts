import { MenuProps } from "antd";

export const BACKGROUND_MAP_TYPE = {
  일반: "Base",
  위성: "Satellite",
  백지도: "white",
  자정: "midnight",
  지형도: "Terrain",
  세계지도: "world",
} as const;

export type BackgroundMapType = (typeof BACKGROUND_MAP_TYPE)[keyof typeof BACKGROUND_MAP_TYPE];

export const DEFAULT_BACKGROUND_MAP_TYPE: BackgroundMapType = BACKGROUND_MAP_TYPE.일반;

/**
 * 각 지도 타입별 활성화 여부
 */
const BACKGROUND_MAP_ENABLED: Record<BackgroundMapType, boolean> = {
  [BACKGROUND_MAP_TYPE.일반]: true,
  [BACKGROUND_MAP_TYPE.위성]: true,
  [BACKGROUND_MAP_TYPE.백지도]: true,
  [BACKGROUND_MAP_TYPE.자정]: true,
  [BACKGROUND_MAP_TYPE.지형도]: false, // 비활성화
  [BACKGROUND_MAP_TYPE.세계지도]: false, // 비활성화
};

/**
 * enabled가 true인 항목만 필터링하여 생성된 메뉴
 */
export const BackgroundMapTypeMenuItems: MenuProps["items"] = Object.entries(BACKGROUND_MAP_TYPE)
  .filter(([label]) => BACKGROUND_MAP_ENABLED[label as BackgroundMapType])
  .map(([label, key]) => ({
    label,
    key,
  }));
