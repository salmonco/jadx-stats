import useRegionFilter from "~/features/visualization/hooks/useRegionFilter";
import { getKeyByValue } from "~/features/visualization/utils/getKeyByValue";
import { DEFAULT_ALL_OPTION, REGION_LEVEL_LABEL, RegionFilterOptions } from "~/features/visualization/utils/regionFilterOptions";
import { REGION_LEVEL_OPTIONS, regionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <BaseSelect title={REGION_LEVEL_LABEL} options={regionLevelOptions} selectedValue={selectedValue.구분} onSelect={handleLevelChange} />

      {/* 구분 - 행정시 */}
      {selectedValue.구분 === REGION_LEVEL_OPTIONS.행정시 && (
        <BaseSelect
          title={getKeyByValue(REGION_LEVEL_OPTIONS, REGION_LEVEL_OPTIONS.행정시)}
          options={toOptions(cityOptions)}
          selectedValue={selectedValue.행정시 === null ? DEFAULT_ALL_OPTION : selectedValue.행정시}
          onSelect={handleCityChange}
        />
      )}

      {selectedValue.구분 === REGION_LEVEL_OPTIONS.행정시 && !isSelectedAllStr(selectedValue.행정시) && (
        <BaseSelect
          title={getKeyByValue(REGION_LEVEL_OPTIONS, REGION_LEVEL_OPTIONS.권역)}
          options={toOptions(regionOptions)}
          selectedValue={selectedValue.권역.length > 0 ? selectedValue.권역 : [DEFAULT_ALL_OPTION]}
          onSelect={handleRegionChange}
          mode="multiple"
        />
      )}

      {selectedValue.구분 === REGION_LEVEL_OPTIONS.행정시 && !isSelectedAllStr(selectedValue.행정시) && !isSelectedAll(selectedValue.권역) && (
        <BaseSelect
          title={getKeyByValue(REGION_LEVEL_OPTIONS, REGION_LEVEL_OPTIONS.읍면)}
          options={toOptions(emdOptions)}
          selectedValue={selectedValue.읍면.length > 0 ? selectedValue.읍면 : [DEFAULT_ALL_OPTION]}
          onSelect={handleEmdChange}
          mode="multiple"
        />
      )}

      {selectedValue.구분 === REGION_LEVEL_OPTIONS.행정시 &&
        !isSelectedAllStr(selectedValue.행정시) &&
        !isSelectedAll(selectedValue.권역) &&
        !isSelectedAll(selectedValue.읍면) && (
          <BaseSelect
            title={getKeyByValue(REGION_LEVEL_OPTIONS, REGION_LEVEL_OPTIONS.리동)}
            options={toOptions(riOptions)}
            selectedValue={selectedValue.리동.length > 0 ? selectedValue.리동 : [DEFAULT_ALL_OPTION]}
            onSelect={handleRiChange}
            mode="multiple"
          />
        )}

      {/* 구분 - 권역 */}
      {selectedValue.구분 === REGION_LEVEL_OPTIONS.권역 && (
        <BaseSelect
          title={getKeyByValue(REGION_LEVEL_OPTIONS, REGION_LEVEL_OPTIONS.권역)}
          options={toOptions(regionOptions)}
          selectedValue={selectedValue.권역.length > 0 ? selectedValue.권역 : [DEFAULT_ALL_OPTION]}
          onSelect={handleRegionChange}
          mode="multiple"
        />
      )}

      {selectedValue.구분 === REGION_LEVEL_OPTIONS.권역 && !isSelectedAll(selectedValue.권역) && (
        <BaseSelect
          title={getKeyByValue(REGION_LEVEL_OPTIONS, REGION_LEVEL_OPTIONS.읍면)}
          options={toOptions(emdOptions)}
          selectedValue={selectedValue.읍면.length > 0 ? selectedValue.읍면 : [DEFAULT_ALL_OPTION]}
          onSelect={handleEmdChange}
          mode="multiple"
        />
      )}

      {selectedValue.구분 === REGION_LEVEL_OPTIONS.권역 && !isSelectedAll(selectedValue.권역) && !isSelectedAll(selectedValue.읍면) && (
        <BaseSelect
          title={getKeyByValue(REGION_LEVEL_OPTIONS, REGION_LEVEL_OPTIONS.리동)}
          options={toOptions(riOptions)}
          selectedValue={selectedValue.리동.length > 0 ? selectedValue.리동 : [DEFAULT_ALL_OPTION]}
          onSelect={handleRiChange}
          mode="multiple"
        />
      )}

      {/* 구분 - 읍면 */}
      {selectedValue.구분 === REGION_LEVEL_OPTIONS.읍면 && (
        <BaseSelect
          title={getKeyByValue(REGION_LEVEL_OPTIONS, REGION_LEVEL_OPTIONS.읍면)}
          options={toOptions(emdOptions)}
          selectedValue={selectedValue.읍면.length > 0 ? selectedValue.읍면 : [DEFAULT_ALL_OPTION]}
          onSelect={handleEmdChange}
          mode="multiple"
        />
      )}

      {selectedValue.구분 === REGION_LEVEL_OPTIONS.읍면 && !isSelectedAll(selectedValue.읍면) && (
        <BaseSelect
          title={getKeyByValue(REGION_LEVEL_OPTIONS, REGION_LEVEL_OPTIONS.리동)}
          options={toOptions(riOptions)}
          selectedValue={selectedValue.리동.length > 0 ? selectedValue.리동 : [DEFAULT_ALL_OPTION]}
          onSelect={handleRiChange}
          mode="multiple"
        />
      )}

      {/* 구분 - 리동 */}
      {selectedValue.구분 === REGION_LEVEL_OPTIONS.리동 && (
        <BaseSelect
          title={getKeyByValue(REGION_LEVEL_OPTIONS, REGION_LEVEL_OPTIONS.리동)}
          options={toOptions(riOptions)}
          selectedValue={selectedValue.리동.length > 0 ? selectedValue.리동 : [DEFAULT_ALL_OPTION]}
          onSelect={handleRiChange}
          mode="multiple"
        />
      )}
    </div>
  );
};

export default RegionFilter;
