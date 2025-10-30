import { Flex } from "antd";
import Button from "~/components/Button";

export interface ButtonGroupSelectorOption {
  value: string | number;
  label: string;
  color?: string;
}

interface ButtonGroupSelectorProps<T extends boolean> {
  title?: string;
  options: ButtonGroupSelectorOption[];
  cols?: number;
  selectedValues: T extends true ? string[] | number[] : string | number;
  setSelectedValues: T extends true ? React.Dispatch<React.SetStateAction<string[] | number[]>> : React.Dispatch<React.SetStateAction<string | number>>;
  multiSelect?: T;
}

export const ButtonGroupSelector = <T extends boolean>({
  title,
  options,
  cols = 3,
  selectedValues,
  setSelectedValues,
  multiSelect = false as T,
}: ButtonGroupSelectorProps<T>) => {
  const handleSelect = (value: string | number) => {
    if (multiSelect) {
      const setter = setSelectedValues as React.Dispatch<React.SetStateAction<(string | number)[]>>;
      setter((prev) => {
        const prevValues = prev || [];
        return prevValues.includes(value) ? prevValues.filter((v) => v !== value) : [...prevValues, value];
      });
    } else {
      const setter = setSelectedValues as React.Dispatch<React.SetStateAction<string | number>>;
      setter(value);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-[#43516D] p-4" style={{ height: "100%" }}>
      {title && <p className="flex-shrink-0 text-[18px] font-semibold text-white">{title}</p>}
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {options.map((option) => {
          const isSelected = multiSelect ? ((selectedValues as (string | number)[]) || []).includes(option.value) : selectedValues === option.value;

          return <Button key={option.value} label={option.label} onClick={() => handleSelect(option.value)} isSelected={isSelected} />;
        })}
      </div>
    </div>
  );
};

export default ButtonGroupSelector;
