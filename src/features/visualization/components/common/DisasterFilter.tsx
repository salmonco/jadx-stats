import { Select } from "antd";

interface DisasterFilterProps {
  title: string;
  options: Record<string, string[]>;
  selectedFirst: string;
  onFirstSelect: (value: string) => void;
  selectedSecond: string | string[];
  onSecondSelect: (value: string | string[]) => void;
  isMultiSecond?: boolean;
  hasSecondDepth?: boolean;
}

const DisasterFilter: React.FC<DisasterFilterProps> = ({
  title,
  options,
  selectedFirst,
  onFirstSelect,
  selectedSecond,
  onSecondSelect,
  isMultiSecond = false,
  hasSecondDepth = false,
}) => {
  const firstLevelOptions = Object.keys(options).map((key) => ({ label: key, value: key }));
  const secondLevelOptions = options[selectedFirst]?.map((item) => ({ label: item, value: item })) || [];

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[18px] font-semibold">{title}</p>
      <Select style={{ width: "100%" }} placeholder="재해 종류를 선택하세요" value={selectedFirst} onChange={onFirstSelect} options={firstLevelOptions} size="large" />
      {hasSecondDepth && (
        <Select
          mode={isMultiSecond ? "multiple" : undefined}
          allowClear
          style={{ width: "100%" }}
          placeholder="세부 항목을 선택하세요"
          value={selectedSecond}
          onChange={onSecondSelect}
          options={secondLevelOptions}
          size="large"
        />
      )}
    </div>
  );
};

export default DisasterFilter;
