import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ButtonGroupSelector from "~/features/visualization/components/common/ButtonGroupSelector";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import ItemDepthScrollSelector from "~/features/visualization/components/common/ItemDepthScrollSelector";
import MandarinTreeAgeChange from "~/features/visualization/components/observation/MandarinTreeAgeChange";
import useOffsetCounter from "~/features/visualization/hooks/useOffsetCounter";
import { regionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";
import MandarinTreeAgeDistributionMap from "~/maps/classes/MandarinTreeAgeDistributionMap";
import { useMapList } from "~/maps/hooks/useMapList";
import { OffsetRange } from "~/pages/visualization/observation/MandarinTreeAgeDistribution";
import visualizationApi from "~/services/apis/visualizationApi";

interface Props {
  mapId: string;
}

const MandarinTreeAgeDistributionFilter = ({ mapId }: Props) => {
  const mapList = useMapList<MandarinTreeAgeDistributionMap>();
  const map = mapList.getMapById(mapId);

  const { data: varietyList } = useQuery({
    queryKey: ["mandarinVarietyList"],
    queryFn: () => visualizationApi.getMandarinVarietyList(),
    retry: 1,
  });

  const [offset, setOffset] = useState<OffsetRange>("0");

  const { autoplay, setAutoplay } = useOffsetCounter({ length: 11, setOffset, setSelectedTargetYear: map.setSelectedTargetYear });

  useEffect(() => {
    setOffset("0");
    setAutoplay(false);
  }, [map.getSelectedRegionLevel(), map.selectedCropPummok, map.selectedCropDetailGroup]);

  return (
    <FilterContainer>
      <ButtonGroupSelector
        title="권역 단위"
        cols={5}
        options={regionLevelOptions}
        selectedValues={map.getSelectedRegionLevel()}
        setSelectedValues={map.setSelectedRegionLevel}
      />
      <ItemDepthScrollSelector
        optionGroups={varietyList ?? []}
        onSelectionChange={(group, first, second) => {
          map.setSelectedCropGroup(group);
          map.setSelectedCropPummok(first);

          let secondVal = second;
          if (second === "유라실생") secondVal = "YN-26";
          if (second === "레드향") secondVal = "감평";
          if (second === "천혜향") secondVal = "세토카";
          if (second === "한라봉") secondVal = "부지화";

          map.setSelectedCropDetailGroup(secondVal);
        }}
      />
      <MandarinTreeAgeChange
        autoplay={autoplay}
        setAutoplay={setAutoplay}
        offset={offset}
        setOffset={setOffset}
        selectedTargetYear={map.selectedTargetYear}
        setSelectedTargetYear={map.setSelectedTargetYear}
      />
    </FilterContainer>
  );
};

export default MandarinTreeAgeDistributionFilter;
