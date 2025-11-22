import { Select } from "antd";
import React from "react";
import { DEFAULT_ALL_OPTION } from "~/features/visualization/utils/regionFilterOptions";

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
  const handleChange = (selected: string[]) => {
    if (selected.includes(DEFAULT_ALL_OPTION)) {
      if (selected[selected.length - 1] === DEFAULT_ALL_OPTION || selected.length === 1) {
        onSelectionChange([]);
      } else {
        onSelectionChange(selected.filter((v) => v !== DEFAULT_ALL_OPTION));
      }
    } else {
      onSelectionChange(selected);
    }
  };

  const displayValue = selectedOptions.length === 0 ? [DEFAULT_ALL_OPTION] : selectedOptions;

  const allOptions = [
    {
      value: DEFAULT_ALL_OPTION,
      label: <div style={{ display: "flex", alignItems: "center" }}>{DEFAULT_ALL_OPTION}</div>,
    },
    ...options.map((opt) => ({
      value: opt.value,
      label: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: opt.color, marginRight: 8 }}></div>
          {opt.label}
        </div>
      ),
    })),
  ];

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-bold">{title}</p>
      <Select
        mode={isMulti ? "multiple" : undefined}
        allowClear
        style={{ width: "100%" }}
        placeholder="작물을 선택하세요"
        value={displayValue}
        onChange={handleChange}
        options={allOptions}
        size="large"
      />
    </div>
  );
};

export default ColoredCropFilter;
