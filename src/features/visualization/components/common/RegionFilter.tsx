import { Select } from "antd";
import { useEffect } from "react";
import useRegionFilter from "~/features/visualization/hooks/useRegionFilter";
import { getKeyByValue } from "~/features/visualization/utils/getKeyByValue";
import { DEFAULT_ALL_OPTION, REGION_LEVEL_LABEL, RegionFilterOptions } from "~/features/visualization/utils/regionFilterOptions";
import { REGION_LEVEL_OPTIONS, regionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";
import { shouldShowRegionFilter } from "~/features/visualization/utils/shouldShowRegionFilter";
import { toOptions } from "~/features/visualization/utils/toOptions";
import { FeatureCollection } from "~/maps/classes/interfaces";

interface RegionFilterProps<F> {
  selectedRegion: RegionFilterOptions;
  features: FeatureCollection<F>;
  setSelectedRegion: (newSelection: RegionFilterOptions) => void;
  setFilteredFeatures: (features: FeatureCollection<F>) => void;
}

const RegionFilter = <F extends { properties: { vrbs_nm: string } }>({ selectedRegion, features, setSelectedRegion, setFilteredFeatures }: RegionFilterProps<F>) => {
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
    filterFeatures,
  } = useRegionFilter({ selectedRegion, setSelectedRegion });

  useEffect(() => {
    if (!features) {
      return;
    }

    // 지금은 선택한 지역 구분에서만 필터링 됨
    // TODO: 하위 선택 지역도 필터링되도록 수정 필요 (API 호출)
    const filtered = {
      ...features,
      features: features.features.filter(filterFeatures),
    };

    setFilteredFeatures(filtered);
  }, [features, selectedRegion]);

  const filters = [
    {
      level: REGION_LEVEL_OPTIONS.행정시,
      title: getKeyByValue(REGION_LEVEL_OPTIONS, REGION_LEVEL_OPTIONS.행정시),
      options: cityOptions,
      selectedValue: selectedRegion.행정시 === null ? DEFAULT_ALL_OPTION : selectedRegion.행정시,
      onSelect: handleCityChange,
      isMulti: false,
    },
    {
      level: REGION_LEVEL_OPTIONS.권역,
      title: getKeyByValue(REGION_LEVEL_OPTIONS, REGION_LEVEL_OPTIONS.권역),
      options: regionOptions,
      selectedValue: selectedRegion.권역.length > 0 ? selectedRegion.권역 : [DEFAULT_ALL_OPTION],
      onSelect: handleRegionChange,
      isMulti: true,
    },
    {
      level: REGION_LEVEL_OPTIONS.읍면,
      title: getKeyByValue(REGION_LEVEL_OPTIONS, REGION_LEVEL_OPTIONS.읍면),
      options: emdOptions,
      selectedValue: selectedRegion.읍면.length > 0 ? selectedRegion.읍면 : [DEFAULT_ALL_OPTION],
      onSelect: handleEmdChange,
      isMulti: true,
    },
    {
      level: REGION_LEVEL_OPTIONS.리동,
      title: getKeyByValue(REGION_LEVEL_OPTIONS, REGION_LEVEL_OPTIONS.리동),
      options: riOptions,
      selectedValue: selectedRegion.리동.length > 0 ? selectedRegion.리동 : [DEFAULT_ALL_OPTION],
      onSelect: handleRiChange,
      isMulti: true,
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[18px] font-semibold">지역선택</p>
      <Select title={REGION_LEVEL_LABEL} options={regionLevelOptions} value={selectedRegion.구분} onChange={handleLevelChange} size="large" />

      {filters.map((filter) => {
        if (shouldShowRegionFilter(filter.level, selectedRegion, isSelectedAll, isSelectedAllStr)) {
          return (
            <Select
              key={filter.title}
              title={filter.title}
              options={toOptions(filter.options)}
              value={filter.selectedValue}
              onChange={filter.onSelect}
              mode={filter.isMulti ? "multiple" : undefined}
              size="large"
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default RegionFilter;
