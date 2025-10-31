import { Select } from "antd";
import { SelectProps } from "antd/lib/select";

export interface BaseSelectOption {
  value: string | number;
  label: string;
}

interface CustomSelectProps extends Omit<SelectProps<any>, "options"> {
  title: string;
  options: BaseSelectOption[];
  selectedValue?: string | number | string[];
  onSelect: (value: string | number | string[]) => void;
}

export const BaseSelect = ({ options, className, title, selectedValue, onSelect, ...props }: CustomSelectProps) => {
  return (
    <div className="flex w-full items-center gap-2">
      <p className="flex-shrink-0 text-[18px] font-semibold text-white">{title}</p>
      <Select className={`w-full ${className}`} options={options} value={selectedValue} onChange={onSelect} {...props} size="large" />
    </div>
  );
};

export default BaseSelect;
