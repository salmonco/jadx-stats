import { useMemo } from "react";
import {
  CITY_OPTIONS,
  CITY_TO_REGION_MAPPING,
  CityOptions,
  DEFAULT_ALL_OPTION,
  EMD_OPTIONS,
  REGION_OPTIONS,
  RegionFilterOptions,
  RI_OPTIONS,
  withAllOption,
} from "~/features/visualization/utils/regionFilterOptions";
import type { RegionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";

interface RegionFilterProps {
  selectedValue: RegionFilterOptions;
  onSelect: (newSelection: RegionFilterOptions) => void;
}

const useRegionFilter = ({ selectedValue, onSelect }: RegionFilterProps) => {
  const isSelectedAll = (selection: string[]) => {
    return selection.length === 0 || selection.includes(DEFAULT_ALL_OPTION);
  };

  const isSelectedAllStr = (selection: string) => selection === DEFAULT_ALL_OPTION || selection === null;

  const handleLevelChange = (newLevel: RegionLevelOptions) => {
    onSelect({
      구분: newLevel,
      행정시: null,
      권역: [],
      읍면: [],
      리동: [],
    });
  };

  const handleCityChange = (newCity: CityOptions) => {
    onSelect({
      구분: selectedValue.구분,
      행정시: isSelectedAllStr(newCity) ? DEFAULT_ALL_OPTION : newCity,
      권역: [],
      읍면: [],
      리동: [],
    });
  };

  const handleRegionChange = (newRegions: RegionFilterOptions["권역"]) => {
    let processedRegions: RegionFilterOptions["권역"];
    const isSelectingAll = newRegions.includes(DEFAULT_ALL_OPTION);

    if (isSelectingAll) {
      if (newRegions[newRegions.length - 1] === DEFAULT_ALL_OPTION || newRegions.length === 1) {
        processedRegions = [];
      } else {
        processedRegions = newRegions.filter((item) => item !== DEFAULT_ALL_OPTION);
      }
    } else {
      processedRegions = newRegions;
    }

    onSelect({
      구분: selectedValue.구분,
      행정시: selectedValue.행정시,
      권역: processedRegions,
      읍면: [],
      리동: [],
    });
  };
  const handleEmdChange = (newEmds: RegionFilterOptions["읍면"]) => {
    let processedEmds: RegionFilterOptions["읍면"];
    const isSelectingAll = newEmds.includes(DEFAULT_ALL_OPTION);

    if (isSelectingAll) {
      if (newEmds[newEmds.length - 1] === DEFAULT_ALL_OPTION || newEmds.length === 1) {
        processedEmds = [];
      } else {
        processedEmds = newEmds.filter((item) => item !== DEFAULT_ALL_OPTION);
      }
    } else {
      processedEmds = newEmds;
    }

    onSelect({
      구분: selectedValue.구분,
      행정시: selectedValue.행정시,
      권역: selectedValue.권역,
      읍면: processedEmds,
      리동: [],
    });
  };
  const handleRiChange = (newRis: RegionFilterOptions["리동"]) => {
    let processedRis: RegionFilterOptions["리동"];
    const isSelectingAll = newRis.includes(DEFAULT_ALL_OPTION);

    if (isSelectingAll) {
      if (newRis[newRis.length - 1] === DEFAULT_ALL_OPTION || newRis.length === 1) {
        processedRis = [];
      } else {
        processedRis = newRis.filter((item) => item !== DEFAULT_ALL_OPTION);
      }
    } else {
      processedRis = newRis;
    }

    onSelect({
      구분: selectedValue.구분,
      행정시: selectedValue.행정시,
      권역: selectedValue.권역,
      읍면: selectedValue.읍면,
      리동: processedRis,
    });
  };

  const cityOptions = useMemo(() => withAllOption(CITY_OPTIONS), []);
  const regionOptions = useMemo(() => {
    if (selectedValue.행정시 === DEFAULT_ALL_OPTION || selectedValue.행정시 === null) {
      return withAllOption(REGION_OPTIONS);
    }
    const filtered = CITY_TO_REGION_MAPPING[selectedValue.행정시] || [];
    return withAllOption(filtered);
  }, [selectedValue.행정시]);

  const emdOptions = useMemo(() => {
    if (selectedValue.권역.length === 0) {
      return withAllOption(Object.values(EMD_OPTIONS).flat());
    }
    const filtered = selectedValue.권역.flatMap((r) => EMD_OPTIONS[r] || []);
    return withAllOption([...new Set(filtered)]);
  }, [selectedValue.권역]);

  const riOptions = useMemo(() => {
    if (selectedValue.읍면.length === 0) {
      if (selectedValue.권역.length === 0) {
        return withAllOption(Object.values(RI_OPTIONS).flat());
      }
      const emdsInRegion = selectedValue.권역.flatMap((r) => EMD_OPTIONS[r] || []);
      const filtered = emdsInRegion.flatMap((e) => RI_OPTIONS[e] || []);
      return withAllOption([...new Set(filtered)]);
    }
    const filtered = selectedValue.읍면.flatMap((e) => RI_OPTIONS[e] || []);
    return withAllOption([...new Set(filtered)]);
  }, [selectedValue.읍면, selectedValue.권역]);

  return {
    cityOptions,
    regionOptions,
    emdOptions,
    riOptions,
    isSelectedAll,
    isSelectedAllStr,
    handleCityChange,
    handleRegionChange,
    handleEmdChange,
    handleRiChange,
    handleLevelChange,
  };
};

export default useRegionFilter;
