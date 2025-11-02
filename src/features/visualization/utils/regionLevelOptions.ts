import { ButtonGroupSelectorOption } from "../components/common/ButtonGroupSelector";

export const REGION_LEVEL_OPTIONS = {
  제주도: "do",
  행정시: "city",
  권역: "region",
  읍면: "emd",
  리동: "ri",
} as const;

export const REGION_LEVEL_HIERARCHY = [
  REGION_LEVEL_OPTIONS.제주도,
  REGION_LEVEL_OPTIONS.행정시,
  REGION_LEVEL_OPTIONS.권역,
  REGION_LEVEL_OPTIONS.읍면,
  REGION_LEVEL_OPTIONS.리동,
];

export const DEFAULT_REGION_LEVEL = REGION_LEVEL_OPTIONS.읍면;

export const regionLevelOptions: ButtonGroupSelectorOption[] = Object.entries(REGION_LEVEL_OPTIONS).map(([label, value]) => ({
  label,
  value,
}));

export function getFilteredRegionOptions(excludedLabels: string[]): ButtonGroupSelectorOption[] {
  return regionLevelOptions.filter((option) => !excludedLabels.includes(option.label));
}

export type RegionLevelOptions = (typeof REGION_LEVEL_OPTIONS)[keyof typeof REGION_LEVEL_OPTIONS];
