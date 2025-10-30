import { ButtonGroupSelectorOption } from "../components/common/ButtonGroupSelector";

export const regionLevelOptions: ButtonGroupSelectorOption[] = [
  { label: "제주도", value: "do" },
  { label: "행정시", value: "city" },
  { label: "권역", value: "region" },
  { label: "읍/면", value: "emd" },
  { label: "리/동", value: "ri" },
];

export function getFilteredRegionOptions(excludedLabels: string[]): ButtonGroupSelectorOption[] {
  return regionLevelOptions.filter((option) => !excludedLabels.includes(option.label));
}
