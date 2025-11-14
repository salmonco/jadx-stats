import { Select } from "antd";
import { CropType } from "~/maps/constants/hibernationVegetableCultivation";

interface VegetableFilterOption {
  label: string;
  value: CropType;
}

interface VegetableFilterProps {
  title: string;
  options: VegetableFilterOption[];
  selectedValues: CropType;
  onSelectionChange: (selected: CropType) => void;
}

const VegetableFilter = ({ title, options, selectedValues, onSelectionChange }: VegetableFilterProps) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[18px] font-semibold">{title}</p>
      <Select
        className="w-full"
        allowClear
        placeholder="작물 종류를 선택하세요"
        value={selectedValues}
        onChange={onSelectionChange}
        options={options.map((opt) => ({
          value: opt.value,
          label: opt.label,
        }))}
        size="large"
      />
    </div>
  );
};

export default VegetableFilter;
