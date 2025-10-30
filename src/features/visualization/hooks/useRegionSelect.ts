import { useState } from "react";
import { RegionFilterOptions } from "~/features/visualization/utils/regionFilterOptions";
import { DEFAULT_REGION_LEVEL } from "~/features/visualization/utils/regionLevelOptions";

const useRegionSelect = () => {
  const [selectedRegion, setSelectedRegion] = useState<RegionFilterOptions>({
    구분: DEFAULT_REGION_LEVEL,
    행정시: null,
    권역: [],
    읍면: [],
    리동: [],
  });

  return { selectedRegion, setSelectedRegion };
};

export default useRegionSelect;
