import useRegionFilter from "~/features/visualization/hooks/useRegionFilter";
import { getKeyByValue } from "~/features/visualization/utils/getKeyByValue";
import { DEFAULT_ALL_OPTION, REGION_LEVEL_LABEL, RegionFilterOptions } from "~/features/visualization/utils/regionFilterOptions";
import { REGION_LEVEL_OPTIONS, regionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";
import { shouldShowRegionFilter } from "~/features/visualization/utils/shouldShowRegionFilter";
import { toOptions } from "~/features/visualization/utils/toOptions";
import { BaseSelect } from "./BaseSelect";

interface RegionFilterProps {
  selectedValue: RegionFilterOptions;
  onSelect: (newSelection: RegionFilterOptions) => void;
}

const RegionFilter = ({ selectedValue, onSelect }: RegionFilterProps) => {
  const {
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
  } = useRegionFilter({ selectedValue, onSelect });

  const filters = [
    {
      level: REGION_LEVEL_OPTIONS.행정시,
      title: getKeyByValue(REGION_LEVEL_OPTIONS, REGION_LEVEL_OPTIONS.행정시),
      options: cityOptions,
      selectedValue: selectedValue.행정시 === null ? DEFAULT_ALL_OPTION : selectedValue.행정시,
      onSelect: handleCityChange,
      isMulti: false,
    },
    {
      level: REGION_LEVEL_OPTIONS.권역,
      title: getKeyByValue(REGION_LEVEL_OPTIONS, REGION_LEVEL_OPTIONS.권역),
      options: regionOptions,
      selectedValue: selectedValue.권역.length > 0 ? selectedValue.권역 : [DEFAULT_ALL_OPTION],
      onSelect: handleRegionChange,
      isMulti: true,
    },
    {
      level: REGION_LEVEL_OPTIONS.읍면,
      title: getKeyByValue(REGION_LEVEL_OPTIONS, REGION_LEVEL_OPTIONS.읍면),
      options: emdOptions,
      selectedValue: selectedValue.읍면.length > 0 ? selectedValue.읍면 : [DEFAULT_ALL_OPTION],
      onSelect: handleEmdChange,
      isMulti: true,
    },
    {
      level: REGION_LEVEL_OPTIONS.리동,
      title: getKeyByValue(REGION_LEVEL_OPTIONS, REGION_LEVEL_OPTIONS.리동),
      options: riOptions,
      selectedValue: selectedValue.리동.length > 0 ? selectedValue.리동 : [DEFAULT_ALL_OPTION],
      onSelect: handleRiChange,
      isMulti: true,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[18px] font-semibold">지역선택</p>
      <BaseSelect title={REGION_LEVEL_LABEL} options={regionLevelOptions} selectedValue={selectedValue.구분} onSelect={handleLevelChange} />

      {filters.map((filter) => {
        if (shouldShowRegionFilter(filter.level, selectedValue, isSelectedAll, isSelectedAllStr)) {
          return (
            <BaseSelect
              key={filter.title}
              title={filter.title}
              options={toOptions(filter.options)}
              selectedValue={filter.selectedValue}
              onSelect={filter.onSelect}
              mode={filter.isMulti ? "multiple" : undefined}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default RegionFilter;
