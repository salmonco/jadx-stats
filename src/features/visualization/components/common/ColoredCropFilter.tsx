import { Select } from "antd";
import React from "react";

interface ColoredCropFilterOption {
  label: string;
  value: string;
  color: string;
}

interface ColoredCropFilterProps {
  title: string;
  options: ColoredCropFilterOption[];
  selectedOptions: string[];
  onSelectionChange: (selected: string[]) => void;
  isMulti?: boolean;
}

const ColoredCropFilter: React.FC<ColoredCropFilterProps> = ({ title, options, selectedOptions, onSelectionChange, isMulti = false }) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[18px] font-semibold">{title}</p>
      <Select
        mode={isMulti ? "multiple" : undefined}
        allowClear
        style={{ width: "100%" }}
        placeholder="작물을 선택하세요"
        value={selectedOptions}
        onChange={onSelectionChange}
        options={options.map((opt) => ({
          value: opt.value,
          label: (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: opt.color, marginRight: 8 }}></div>
              {opt.label}
            </div>
          ),
        }))}
        size="large"
      />
    </div>
  );
};

export default ColoredCropFilter;
