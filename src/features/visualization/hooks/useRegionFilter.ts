import { useEffect, useState } from "react";
import { DEFAULT_ALL_OPTION, DEFAULT_REGION_SETTING, RegionFilterOptions } from "~/features/visualization/utils/regionFilterOptions";
import { REGION_LEVEL_OPTIONS } from "~/features/visualization/utils/regionLevelOptions";

const useRegionFilter = (regionFilterSetting: RegionFilterOptions) => {
  const [selectedRegion, setSelectedRegion] = useState<RegionFilterOptions>(regionFilterSetting || DEFAULT_REGION_SETTING);

  useEffect(() => {
    setSelectedRegion(regionFilterSetting || DEFAULT_REGION_SETTING);
  }, [regionFilterSetting]);

  const filterFeatures = (feature: any) => {
    const props = feature.properties;
    const regionLevel = selectedRegion.구분;

    if (regionLevel === REGION_LEVEL_OPTIONS.행정시 && selectedRegion.행정시 !== null && selectedRegion.행정시 !== DEFAULT_ALL_OPTION) {
      return props.vrbs_nm === selectedRegion.행정시;
    }
    if (regionLevel === REGION_LEVEL_OPTIONS.권역 && selectedRegion.권역.length > 0) {
      return selectedRegion.권역.includes(props.vrbs_nm);
    }
    if (regionLevel === REGION_LEVEL_OPTIONS.읍면동 && selectedRegion.읍면동.length > 0) {
      return selectedRegion.읍면동.includes(props.vrbs_nm);
    }
    if (regionLevel === REGION_LEVEL_OPTIONS.리 && selectedRegion.리.length > 0) {
      return selectedRegion.리.includes(props.vrbs_nm);
    }
    return true;
  };

  return { selectedRegion, setSelectedRegion, filterFeatures };
};

export default useRegionFilter;
