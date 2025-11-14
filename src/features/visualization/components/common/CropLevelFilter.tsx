import { Select } from "antd";
import React from "react";

interface CropLevelFilterOption {
  label: string;
  value: string;
}

interface CropLevelFilterProps {
  title: string;
  options: CropLevelFilterOption[];
  selectedValue: string;
  onSelectionChange: (selected: string) => void;
}

const CropLevelFilter: React.FC<CropLevelFilterProps> = ({ title, options, selectedValue, onSelectionChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[18px] font-semibold">{title}</p>
      <Select className="w-full" placeholder="항목을 선택하세요" value={selectedValue} onChange={onSelectionChange} options={options} size="large" />
    </div>
  );
};

export default CropLevelFilter;
