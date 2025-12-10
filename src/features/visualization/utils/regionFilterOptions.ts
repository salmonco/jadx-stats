import { DEFAULT_REGION_LEVEL, RegionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";

export const REGION_LEVEL_LABEL = "구분";
export const DEFAULT_ALL_OPTION = "전체";
export const DEFAULT_EXCLUDE_DONG = false;

export type RegionFilterOptions = {
  구분: RegionLevelOptions;
  행정시?: string | null;
  권역?: string[];
  읍면동?: string[];
  리?: string[];
  excludeDong?: boolean;
};

export const DEFAULT_REGION_SETTING: RegionFilterOptions = {
  구분: DEFAULT_REGION_LEVEL,
  행정시: null,
  권역: [],
  읍면동: [],
  리: [],
  excludeDong: DEFAULT_EXCLUDE_DONG,
};

export const withAllOption = (options: readonly string[]) => [DEFAULT_ALL_OPTION, ...options];
