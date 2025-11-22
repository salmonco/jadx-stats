import { Select } from "antd";
import { CultivationType } from "~/maps/constants/disasterTypeHistoryStats";

interface CultivationTypeFilterOption {
  label: string;
  value: CultivationType;
}

interface CultivationTypeFilterProps {
  title: string;
  options: CultivationTypeFilterOption[];
  selectedValue: CultivationType;
  onSelectionChange: (selected: CultivationType) => void;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
}

const CultivationTypeFilter = ({ title, options, selectedValue, onSelectionChange, getPopupContainer }: CultivationTypeFilterProps) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-bold">{title}</p>
      <Select
        className="w-full"
        placeholder="재배 방식을 선택하세요"
        value={selectedValue}
        onChange={onSelectionChange}
        options={options}
        size="large"
        getPopupContainer={getPopupContainer}
      />
    </div>
  );
};

export default CultivationTypeFilter;
