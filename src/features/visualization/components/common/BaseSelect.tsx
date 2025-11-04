import { Select } from "antd";
import { SelectProps } from "antd/lib/select";

export interface BaseSelectOption {
  value: string | number;
  label: string;
}

interface CustomSelectProps extends Omit<SelectProps<any>, "options"> {
  options: BaseSelectOption[];
  selectedValue?: string | number | string[];
  onSelect: (value: string | number | string[]) => void;
}

export const BaseSelect = ({ options, className, selectedValue, onSelect, ...props }: CustomSelectProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Select className={`w-full ${className}`} options={options} value={selectedValue} onChange={onSelect} {...props} size="large" />
    </div>
  );
};

export default BaseSelect;
