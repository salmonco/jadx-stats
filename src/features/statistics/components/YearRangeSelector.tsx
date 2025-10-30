import { useState } from "react";
import { Select, Typography } from "antd";
import { StatsRange } from "~/services/types/statsTypes";

const { Text } = Typography;

interface Props {
  range: StatsRange;
  selectedYearRange: { startYear: number; endYear: number };
  onChange: (value: { startYear: number; endYear: number }) => void;
}

const YearRangeSelector = ({ range, selectedYearRange, onChange }: Props) => {
  if (!range || !selectedYearRange) return null;

  const [selectedStartYear, setSelectedStartYear] = useState(selectedYearRange.startYear);
  const [selectedEndYear, setSelectedEndYear] = useState(selectedYearRange.endYear);

  const startYearCount = Math.max(0, selectedEndYear - range.start_year + 1);
  const startYearOptions = Array.from({ length: startYearCount }, (_, i) => range.start_year + i).map((year) => ({
    label: `${year}년`,
    value: year,
  }));

  const endYearCount = Math.max(0, range.end_year - selectedStartYear + 1);
  const endYearOptions = Array.from({ length: endYearCount }, (_, i) => selectedStartYear + i).map((year) => ({
    label: `${year}년`,
    value: year,
  }));

  const handleStartYearChange = (newStartYear: number) => {
    if (newStartYear < range.start_year) newStartYear = range.start_year;
    if (newStartYear > range.end_year) newStartYear = range.end_year;

    let newEndYear = selectedEndYear;

    if (newStartYear > newEndYear) {
      newEndYear = newStartYear;
    }

    setSelectedStartYear(newStartYear);
    setSelectedEndYear(newEndYear);
    onChange({ startYear: newStartYear, endYear: newEndYear });
  };

  const handleEndYearChange = (newEndYear: number) => {
    if (newEndYear < range.start_year) newEndYear = range.start_year;
    if (newEndYear > range.end_year) newEndYear = range.end_year;

    let newStartYear = selectedStartYear;

    if (newEndYear < newStartYear) {
      newStartYear = newEndYear;
    }

    setSelectedStartYear(newStartYear);
    setSelectedEndYear(newEndYear);
    onChange({ startYear: newStartYear, endYear: newEndYear });
  };

  return (
    <div className="flex items-center gap-[12px]">
      <Select
        className="w-[160px]"
        value={selectedStartYear}
        options={startYearOptions}
        onChange={handleStartYearChange}
        prefix={<span className="text-[#b9b9b9]">시작 연도</span>}
      />
      <Select
        className="w-[160px]"
        value={selectedEndYear}
        options={endYearOptions}
        onChange={handleEndYearChange}
        prefix={<span className="text-[#b9b9b9]">종료 연도</span>}
      />
    </div>
  );
};

export default YearRangeSelector;
