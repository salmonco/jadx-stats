import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import ButtonGroupSelector from "~/features/visualization/components/common/ButtonGroupSelector";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import TwoDepthScrollSelector from "~/features/visualization/components/common/TwoDepthScrollSelector";
import YearSelector from "~/features/visualization/components/common/YearSelector";
import { regionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";
import YearlyDisasterInfoMap from "~/maps/classes/YearlyDisasterInfoMap";
import { STANDARD_YEAR, TARGET_YEAR } from "~/maps/constants/yearlyDisasterInfo";

import { useMapList } from "~/maps/hooks/useMapList";
import visualizationApi from "~/services/apis/visualizationApi";

interface Props {
  mapId: string;
}

const YearlyDisasterInfoFilter = ({ mapId }: Props) => {
  const mapList = useMapList<YearlyDisasterInfoMap>();
  const map = mapList.getMapById(mapId);

  const { data: disasterName } = useQuery({
    queryKey: ["disasterName", map.selectedTargetYear],
    queryFn: () => visualizationApi.getDisasterName(map.selectedTargetYear),
    enabled: !!map.selectedTargetYear,
    retry: 1,
  });

  const disasterOptionsMap: Record<string, string[]> = useMemo(() => {
    const result: Record<string, string[]> = {};
    (disasterName || []).forEach(({ name, items }) => {
      result[name] = items || [];
    });
    return result;
  }, [disasterName]);

  const hasSecondDepth = disasterOptionsMap[map.selectedDisaster]?.length > 0;

  return (
    <FilterContainer>
      <YearSelector targetYear={TARGET_YEAR} standardYear={STANDARD_YEAR} selectedTargetYear={map.selectedTargetYear} setSelectedTargetYear={map.setSelectedTargetYear} />
      <ButtonGroupSelector
        title="권역 단위"
        cols={5}
        options={regionLevelOptions}
        selectedValues={map.getSelectedRegionLevel()}
        setSelectedValues={map.setSelectedRegionLevel}
      />
      <ButtonGroupSelector
        title="항목"
        cols={2}
        options={[
          { value: "total_dstr_sprt_amt", label: "재난지원금" },
          { value: "total_cfmtn_dmg_qnty", label: "피해면적" },
        ]}
        selectedValues={map.selectedDisasterCategory}
        setSelectedValues={map.setSelectedDisasterCategory}
      />
      <TwoDepthScrollSelector
        options={disasterOptionsMap}
        title="재해 종류 및 세부 항목"
        selectedFirst={map.selectedDisaster}
        onFirstSelect={map.setSelectedDisaster}
        selectedSecond={""} // 세부 항목 선택 기능은 미적용
        onSecondSelect={() => {}} // 세부 항목 선택 기능은 미적용
        multiSelectSecond={false}
        hasSecondDepth={hasSecondDepth}
      />
    </FilterContainer>
  );
};

export default YearlyDisasterInfoFilter;
