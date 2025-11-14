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
}

const CultivationTypeFilter = ({ title, options, selectedValue, onSelectionChange }: CultivationTypeFilterProps) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[18px] font-semibold">{title}</p>
      <Select className="w-full" placeholder="재배 방식을 선택하세요" value={selectedValue} onChange={onSelectionChange} options={options} size="large" />
    </div>
  );
};

export default CultivationTypeFilter;
