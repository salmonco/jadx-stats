import { Select } from "antd";
import React, { SetStateAction } from "react";

interface Props {
  targetYear: number[];
  selectedTargetYear: number;
  setSelectedTargetYear: React.Dispatch<SetStateAction<number>>;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
}

const YearFilter = ({ targetYear, selectedTargetYear, setSelectedTargetYear, getPopupContainer }: Props) => {
  const yearOptions = targetYear.map((y) => ({ value: y, label: y.toString() }));

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-bold">기준연도</p>
      <Select options={yearOptions} value={selectedTargetYear} onChange={setSelectedTargetYear} size="large" getPopupContainer={getPopupContainer} />
    </div>
  );
};

export default YearFilter;
