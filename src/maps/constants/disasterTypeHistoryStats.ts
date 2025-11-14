export const CULTIVATION_TYPE = {
  전체: "all",
  시설: "farmhouse",
  노지: "openField",
} as const;

export type CultivationType = (typeof CULTIVATION_TYPE)[keyof typeof CULTIVATION_TYPE];

export const DEFAULT_CULTIVATION_TYPE: CultivationType = CULTIVATION_TYPE.전체;
