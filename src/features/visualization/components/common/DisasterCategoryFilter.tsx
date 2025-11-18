import { Select } from "antd";
import { DisasterCategory } from "~/maps/constants/yearlyDisasterInfo";

interface DisasterCategoryFilterOption {
  label: string;
  value: DisasterCategory;
}

interface DisasterCategoryFilterProps {
  title: string;
  options: DisasterCategoryFilterOption[];
  selectedValue: DisasterCategory;
  onSelectionChange: (selected: DisasterCategory) => void;
}

const DisasterCategoryFilter = ({ title, options, selectedValue, onSelectionChange }: DisasterCategoryFilterProps) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-bold">{title}</p>
      <Select className="w-full" placeholder="항목을 선택하세요" value={selectedValue} onChange={onSelectionChange} options={options} size="large" />
    </div>
  );
};

export default DisasterCategoryFilter;
