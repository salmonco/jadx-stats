export const TARGET_YEAR = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010];
export const STANDARD_YEAR = [5, 4, 3, 2, 1];

export const DEFAULT_TARGET_YEAR = 2024;

export const DISASTER_CATEGORY = {
  재난지원금: "total_dstr_sprt_amt",
  피해면적: "total_cfmtn_dmg_qnty",
} as const;

export type DisasterCategory = (typeof DISASTER_CATEGORY)[keyof typeof DISASTER_CATEGORY];

export const DISASTER_CATEGORY_OPTIONS = Object.entries(DISASTER_CATEGORY).map(([label, value]) => ({ label, value }));

export const DEFAULT_DISASTER_CATEGORY: DisasterCategory = DISASTER_CATEGORY.재난지원금;

export const DEFAULT_DISASTER = "호우";

export const DISASTER_COLOR = {
  강풍: "#4e79a7",
  풍랑: "#f28e2b",
  태풍: "#34495e",
  대설: "#ffcb77",
  호우: "#e15759",
  지진: "#59a14f",
  한파: "#4e89ae",
  해일: "#b07aa1",
  우박: "#f6a365",
  일조량부족: "#d4a5a5",
  고온: "#ff9da7",
  강우: "#a1c181",
  폭염: "#ff0000",
} as const;

export type DisasterColor = (typeof DISASTER_COLOR)[keyof typeof DISASTER_COLOR];
