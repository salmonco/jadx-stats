import { Select } from "antd";
import React, { SetStateAction } from "react";

interface Props {
  targetYear: number[];
  selectedTargetYear: number;
  setSelectedTargetYear: React.Dispatch<SetStateAction<number>>;
}

const YearFilter = ({ targetYear, selectedTargetYear, setSelectedTargetYear }: Props) => {
  const yearOptions = targetYear.map((y) => ({ value: y, label: y.toString() }));

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-bold">기준연도</p>
      <Select options={yearOptions} value={selectedTargetYear} onChange={setSelectedTargetYear} size="large" />
    </div>
  );
};

export default YearFilter;
