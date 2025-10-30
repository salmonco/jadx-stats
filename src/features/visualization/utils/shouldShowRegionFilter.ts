import { RegionFilterOptions } from "~/features/visualization/utils/regionFilterOptions";
import { REGION_LEVEL_HIERARCHY, REGION_LEVEL_OPTIONS, RegionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";

export const shouldShowRegionFilter = (
  filterLevel: RegionLevelOptions,
  currentSelectedValue: RegionFilterOptions,
  isSelectedAll: (selection: string[]) => boolean,
  isSelectedAllStr: (selection: string) => boolean
): boolean => {
  const { 구분, 행정시, 권역, 읍면 } = currentSelectedValue;

  if (구분 === REGION_LEVEL_OPTIONS.제주도) {
    return false;
  }

  const selectedLevelIndex = REGION_LEVEL_HIERARCHY.indexOf(구분);
  const filterLevelIndex = REGION_LEVEL_HIERARCHY.indexOf(filterLevel);

  const isHigherLevel = filterLevelIndex < selectedLevelIndex;
  if (isHigherLevel) {
    return false;
  }

  const isSameLevel = filterLevelIndex === selectedLevelIndex;
  if (isSameLevel) {
    return true;
  }

  let allAncestorsSelectedSpecific = true;
  for (let i = selectedLevelIndex; i < filterLevelIndex; i++) {
    const ancestorLevel = REGION_LEVEL_HIERARCHY[i];
    switch (ancestorLevel) {
      case REGION_LEVEL_OPTIONS.행정시:
        if (isSelectedAllStr(행정시)) allAncestorsSelectedSpecific = false;
        break;
      case REGION_LEVEL_OPTIONS.권역:
        if (isSelectedAll(권역)) allAncestorsSelectedSpecific = false;
        break;
      case REGION_LEVEL_OPTIONS.읍면:
        if (isSelectedAll(읍면)) allAncestorsSelectedSpecific = false;
    }
    if (!allAncestorsSelectedSpecific) break;
  }

  return allAncestorsSelectedSpecific;
};
