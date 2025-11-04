import ButtonGroupSelector from "~/features/visualization/components/common/ButtonGroupSelector";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import RegionFilter from "~/features/visualization/components/common/RegionFilter";
import YearSelector from "~/features/visualization/components/common/YearSelector";
import { RegionFilterOptions } from "~/features/visualization/utils/regionFilterOptions";
import HibernationVegetableCultivationMap from "~/maps/classes/HibernationVegetableCultivationMap";
import { CROP_LEGEND_ITEMS, TARGET_YEAR } from "~/maps/constants/hibernationVegetableCultivation";
import { useMapList } from "~/maps/hooks/useMapList";

interface Props {
  mapId: string;
  selectedRegion: RegionFilterOptions;
  setSelectedRegion: (region: RegionFilterOptions) => void;
}

const HibernationVegetableCultivationFilter = ({ mapId, selectedRegion, setSelectedRegion }: Props) => {
  const mapList = useMapList<HibernationVegetableCultivationMap>();
  const map = mapList.getMapById(mapId);

  return (
    <FilterContainer>
      <YearSelector targetYear={TARGET_YEAR} selectedTargetYear={map.selectedTargetYear} setSelectedTargetYear={map.setSelectedTargetYear} />
      {/* <ButtonGroupSelector
        title="권역 단위"
        cols={5}
        options={regionLevelOptions}
        selectedValues={map.getSelectedRegionLevel()}
        setSelectedValues={map.setSelectedRegionLevel}
      /> */}
      <RegionFilter selectedValue={selectedRegion} onSelect={setSelectedRegion} />
      <ButtonGroupSelector title="범례" cols={3} options={CROP_LEGEND_ITEMS} selectedValues={map.selectedCrop} setSelectedValues={map.setSelectedCrop} />
    </FilterContainer>
  );
};

export default HibernationVegetableCultivationFilter;
