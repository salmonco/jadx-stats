import { Switch } from "antd";
import ButtonGroupSelector from "~/features/visualization/components/common/ButtonGroupSelector";
import { regionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";
import { RegionLevels } from "~/services/types/visualizationTypes";

interface LayerHeaderProps {
  selectedLevel: RegionLevels;
  setSelectedLevel: (newSelection: RegionLevels) => void;
  excludeDong: boolean;
  setExcludeDong: (value: boolean) => void;
}

export const LayerHeader = ({ selectedLevel, setSelectedLevel, excludeDong, setExcludeDong }: LayerHeaderProps) => {
  return (
    <div className="absolute left-0 top-0 flex w-full justify-between bg-[#37445E] p-3">
      <div className="flex items-center gap-6">
        <div className="text-2xl font-semibold text-white">고령화 통계</div>
        <div className="w-[380px]">
          <ButtonGroupSelector cols={5} options={regionLevelOptions} selectedValues={selectedLevel} setSelectedValues={setSelectedLevel} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p className="flex-shrink-0 text-[18px] font-semibold text-white">동 지역 제외</p>
        <Switch checked={excludeDong} onChange={setExcludeDong} />
      </div>
    </div>
  );
};
