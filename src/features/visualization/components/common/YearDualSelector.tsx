import { Select } from "antd";
import React, { SetStateAction } from "react";

interface Props {
  targetYear: number[];
  standardYear?: number[];
  selectedTargetYear: number;
  setSelectedTargetYear: React.Dispatch<SetStateAction<number>>;
  selectedStandardYear?: number;
  setSelectedStandardYear?: React.Dispatch<SetStateAction<number>>;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
}

const YearDualSelector = ({
  targetYear,
  standardYear,
  selectedTargetYear,
  setSelectedTargetYear,
  selectedStandardYear,
  setSelectedStandardYear,
  getPopupContainer,
}: Props) => {
  const yearOptions = targetYear.map((y) => ({ value: y, label: y.toString() }));
  const referenceYearOptions = standardYear?.map((y) => ({ value: y, label: y.toString() }));

  return (
    <div className="flex w-full gap-4 rounded-lg bg-[#43516D] p-4">
      <div className="flex w-1/2 items-center gap-2">
        <p className="flex-shrink-0 text-[18px] font-semibold text-white">기준연도</p>
        <Select options={yearOptions} onChange={setSelectedTargetYear} className="w-full" value={selectedTargetYear} getPopupContainer={getPopupContainer} />
      </div>
      {standardYear && (
        <div className="flex w-1/2 items-center gap-2">
          <p className="flex-shrink-0 text-[18px] font-semibold text-white">비교연도</p>
          <Select
            options={referenceYearOptions}
            onChange={setSelectedStandardYear}
            className="w-full"
            value={selectedStandardYear}
            getPopupContainer={getPopupContainer}
          />
        </div>
      )}
    </div>
  );
};

export default YearDualSelector;
