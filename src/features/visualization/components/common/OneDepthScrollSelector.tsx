import React from "react";

export interface ScrollSelectorOption {
  value: string | number;
  color?: string;
}

interface Props<T> {
  title?: string;
  options: ScrollSelectorOption[];
  multiSelect?: boolean;
  selectedValues: T | T[];
  setSelectedValues: React.Dispatch<React.SetStateAction<T | T[]>>;
  height?: string;
}

const OneDepthScrollSelector = <T extends string>({ title = "선택", options, multiSelect = false, selectedValues, setSelectedValues, height = "220px" }: Props<T>) => {
  const handleClick = (option: T) => {
    if (multiSelect) {
      const values = selectedValues as T[];
      const newSelection = values.includes(option) ? values.filter((item) => item !== option) : [...values, option];
      setSelectedValues(newSelection);
    } else {
      setSelectedValues(option);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-[#43516D] p-5">
      <p className="text-[18px] font-semibold text-white">{title}</p>
      <div className="w-full overflow-y-auto rounded-lg border border-gray-300 bg-white p-2" style={{ maxHeight: height }}>
        {options.map((option) => {
          const isSelected = Array.isArray(selectedValues) ? selectedValues.includes(option.value as T) : selectedValues === option.value;

          return (
            <div
              key={option.value}
              onClick={() => handleClick(option.value as T)}
              style={{
                padding: "6px",
                cursor: "pointer",
                backgroundColor: isSelected ? option.color || "#e0e0e0" : "transparent",
                color: isSelected && option.color ? "white" : "black",
              }}
            >
              {option.value}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OneDepthScrollSelector;
