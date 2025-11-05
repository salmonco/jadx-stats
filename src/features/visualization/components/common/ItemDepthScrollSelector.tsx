import { useEffect, useState } from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  isSelected: boolean;
}

const Button = ({ label, onClick, isSelected }: ButtonProps) => {
  const buttonStyle = isSelected ? "border-2 border-[#ffc132]" : "border-[#37445E]";

  return (
    <button onClick={onClick} className={`flex-1 rounded-lg border bg-[#37445E] py-2 text-center text-[15px] font-medium text-white ${buttonStyle}`}>
      {label}
    </button>
  );
};

interface Props<M extends boolean = false> {
  optionGroups: Record<string, Record<string, string[]>>;
  title?: string;
  multiSelectSecond?: M;
  onSelectionChange?: (
    group: string, // = pummok
    first: string, // = subPummok
    second: M extends true ? string[] : string // = variety
  ) => void;
}

const ItemDepthScrollSelector = <M extends boolean = false>({ optionGroups, title = "품목/품종", multiSelectSecond = false as M, onSelectionChange }: Props<M>) => {
  const groupKeys = Object.keys(optionGroups);
  const [selectedGroup, setSelectedGroup] = useState(groupKeys[0]);

  useEffect(() => {
    const groupKeys = Object.keys(optionGroups);
    if (groupKeys.length === 0) return;

    const firstKey = Object.keys(optionGroups[groupKeys[0]] || {})[0] || "";
    const secondList = optionGroups[groupKeys[0]]?.[firstKey] || [];
    const secondDefault = multiSelectSecond ? ([] as M extends true ? string[] : string) : ((secondList[0] ?? "") as M extends true ? string[] : string);

    setSelectedGroup(groupKeys[0]);
    setSelectedFirst(firstKey);
    setSelectedSecond(secondDefault);

    onSelectionChange?.(groupKeys[0], firstKey, secondDefault);
  }, [optionGroups]);

  const firstKeys = Object.keys(optionGroups[selectedGroup] || {});
  const [selectedFirst, setSelectedFirst] = useState(firstKeys[0] || "");

  const [selectedSecond, setSelectedSecond] = useState<M extends true ? string[] : string>(
    multiSelectSecond
      ? ([] as unknown as M extends true ? string[] : string)
      : ((optionGroups[selectedGroup]?.[firstKeys[0]]?.[0] ?? "") as M extends true ? string[] : string)
  );

  // 버튼(그룹) 클릭 시 -> 그룹명 = first 로 반환
  const handleGroupClick = (groupKey: string) => {
    setSelectedGroup(groupKey);

    const firstKeys = Object.keys(optionGroups[groupKey] || {});
    const newFirst = firstKeys[0] || "";
    setSelectedFirst(newFirst);

    const seconds = optionGroups[groupKey]?.[newFirst] ?? [];

    if (multiSelectSecond) {
      const empty = [] as M extends true ? string[] : string;
      setSelectedSecond(empty);
      onSelectionChange?.(groupKey, newFirst, empty);
    } else {
      const newSecond = (seconds[0] ?? "") as M extends true ? string[] : string;
      setSelectedSecond(newSecond);
      onSelectionChange?.(groupKey, newFirst, newSecond);
    }
  };

  const handleFirstClick = (option: string) => {
    setSelectedFirst(option);
    const seconds = optionGroups[selectedGroup]?.[option] ?? [];

    if (multiSelectSecond) {
      const empty = [] as M extends true ? string[] : string;
      setSelectedSecond(empty);
      onSelectionChange?.(selectedGroup, option, empty);
    } else {
      const newSecond = (seconds[0] ?? "") as M extends true ? string[] : string;
      setSelectedSecond(newSecond);
      onSelectionChange?.(selectedGroup, option, newSecond);
    }
  };

  const handleSecondClick = (option: string) => {
    if (multiSelectSecond) {
      const selectedArray = Array.isArray(selectedSecond) ? selectedSecond : [];
      const isSelected = selectedArray.includes(option);
      const newSelection = isSelected ? selectedArray.filter((item) => item !== option) : [...selectedArray, option];
      setSelectedSecond(newSelection as M extends true ? string[] : string);
      onSelectionChange?.(selectedGroup, selectedFirst, newSelection as M extends true ? string[] : string);
    } else {
      setSelectedSecond(option as M extends true ? string[] : string);
      onSelectionChange?.(selectedGroup, selectedFirst, option as M extends true ? string[] : string);
    }
  };

  const options = optionGroups[selectedGroup] || {};

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-[#43516D] p-5">
      <p className="text-[18px] font-semibold text-white">{title}</p>

      {/* 그룹 버튼 */}
      <div className="mb-2 flex w-full gap-2">
        {groupKeys.map((groupKey) => (
          <Button key={groupKey} label={groupKey} onClick={() => handleGroupClick(groupKey)} isSelected={selectedGroup === groupKey} />
        ))}
      </div>

      <div className="flex max-h-[220px] gap-2">
        {/* 1단계 리스트 */}
        <div className="w-full overflow-y-auto rounded-lg border border-gray-300 bg-white p-2 text-[#222]">
          {Object.keys(options).map((option) => (
            <div
              key={option}
              onClick={() => handleFirstClick(option)}
              className="cursor-pointer rounded px-2 py-1"
              style={{
                backgroundColor: selectedFirst === option ? "#e0e0e0" : "transparent",
              }}
            >
              {option}
            </div>
          ))}
        </div>

        {/* 2단계 리스트 */}
        <div className="w-full overflow-y-auto rounded-lg border border-gray-300 bg-white p-2 text-[#222]">
          {(options?.[selectedFirst] ?? []).map((option) => {
            const isSelected = multiSelectSecond ? Array.isArray(selectedSecond) && selectedSecond.includes(option) : selectedSecond === option;

            return (
              <div
                key={option}
                onClick={() => handleSecondClick(option)}
                className="cursor-pointer rounded px-2 py-1"
                style={{
                  backgroundColor: isSelected ? "#e0e0e0" : "transparent",
                }}
              >
                {option}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ItemDepthScrollSelector;
