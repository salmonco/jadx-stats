export const CULTIVATION_TYPE = {
  전체: "all",
  시설: "farmhouse",
  노지: "openField",
} as const;

export type CultivationType = (typeof CULTIVATION_TYPE)[keyof typeof CULTIVATION_TYPE];

export const DEFAULT_CULTIVATION_TYPE: CultivationType = CULTIVATION_TYPE.전체;

export const CULTIVATION_TYPE_OPTIONS = Object.entries(CULTIVATION_TYPE).map(([key, value]) => ({
  label: key,
  value: value,
}));
