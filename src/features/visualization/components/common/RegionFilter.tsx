import { Select } from "antd";
import { useCallback, useEffect, useMemo } from "react";
import { DEFAULT_ALL_OPTION, REGION_LEVEL_LABEL, RegionFilterOptions, withAllOption } from "~/features/visualization/utils/regionFilterOptions";
import { REGION_LEVEL_OPTIONS, RegionLevelOptions, regionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";
import { toOptions } from "~/features/visualization/utils/toOptions";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";

interface Props<M> {
  features: any;
  selectedRegion: RegionFilterOptions;
  setSelectedRegion: (value: RegionFilterOptions | ((prev: RegionFilterOptions) => RegionFilterOptions)) => void;
  map: M;
}

const processMultiSelect = (currentValues: string[]) => {
  if (currentValues.includes(DEFAULT_ALL_OPTION)) {
    if (currentValues[currentValues.length - 1] === DEFAULT_ALL_OPTION || currentValues.length === 1) {
      return [];
    } else {
      return currentValues.filter((v) => v !== DEFAULT_ALL_OPTION);
    }
  }
  return currentValues;
};

const RegionFilter = <M extends CommonBackgroundMap>({ features, selectedRegion, setSelectedRegion, map }: Props<M>) => {
  const currentOptions = useMemo(() => {
    if (!features) {
      return [];
    }
    const names: string[] = features.features.map((feature) => feature.properties.vrbs_nm).sort();
    return withAllOption([...new Set(names)]);
  }, [features]);

  useEffect(() => {
    map.setRegionFilterSetting(selectedRegion);
  }, [selectedRegion]);

  const currentValue = (() => {
    switch (selectedRegion.구분) {
      case REGION_LEVEL_OPTIONS.행정시:
        return selectedRegion.행정시 || DEFAULT_ALL_OPTION;
      case REGION_LEVEL_OPTIONS.권역:
        return selectedRegion.권역?.length ? selectedRegion.권역 : [DEFAULT_ALL_OPTION];
      case REGION_LEVEL_OPTIONS.읍면:
        return selectedRegion.읍면?.length ? selectedRegion.읍면 : [DEFAULT_ALL_OPTION];
      case REGION_LEVEL_OPTIONS.리동:
        return selectedRegion.리동?.length ? selectedRegion.리동 : [DEFAULT_ALL_OPTION];
      default:
        return DEFAULT_ALL_OPTION;
    }
  })();

  const isMulti = selectedRegion.구분 !== REGION_LEVEL_OPTIONS.행정시;

  const handleLevelChange = useCallback(
    (newLevel: RegionLevelOptions) => {
      setSelectedRegion(() => ({
        구분: newLevel,
        행정시: null,
        권역: [],
        읍면: [],
        리동: [],
      }));
    },
    [setSelectedRegion]
  );

  const handleValueChange = useCallback(
    (newValue: string | string[]) => {
      setSelectedRegion((prev) => {
        const newSelection = {
          ...prev,
          행정시: null,
          권역: [],
          읍면: [],
          리동: [],
        };

        switch (prev.구분) {
          case REGION_LEVEL_OPTIONS.행정시:
            newSelection.행정시 = Array.isArray(newValue) ? newValue[0] : newValue;
            break;
          case REGION_LEVEL_OPTIONS.권역:
            newSelection.권역 = processMultiSelect(Array.isArray(newValue) ? newValue : [newValue]);
            break;
          case REGION_LEVEL_OPTIONS.읍면:
            newSelection.읍면 = processMultiSelect(Array.isArray(newValue) ? newValue : [newValue]);
            break;
          case REGION_LEVEL_OPTIONS.리동:
            newSelection.리동 = processMultiSelect(Array.isArray(newValue) ? newValue : [newValue]);
            break;
        }
        return newSelection;
      });
    },
    [setSelectedRegion]
  );

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[18px] font-semibold">지역선택</p>
      <Select title={REGION_LEVEL_LABEL} options={regionLevelOptions} value={selectedRegion.구분} onChange={handleLevelChange} size="large" />

      {selectedRegion.구분 !== REGION_LEVEL_OPTIONS.제주도 && (
        <Select options={toOptions(currentOptions)} value={currentValue} onChange={handleValueChange} mode={isMulti ? "multiple" : undefined} size="large" />
      )}
    </div>
  );
};

export default RegionFilter;
