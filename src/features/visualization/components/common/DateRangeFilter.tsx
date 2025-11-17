import { DatePicker } from "antd";
import { Dayjs } from "dayjs";
import React from "react";

const { RangePicker } = DatePicker;

interface DateRangeFilterProps {
  title: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onDateRangeChange: (dates: [Dayjs | null, Dayjs | null], dateStrings: [string, string]) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ title, startDate, endDate, onDateRangeChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-bold">{title}</p>
      <RangePicker className="w-full" value={[startDate, endDate]} onChange={onDateRangeChange} format="YYYY-MM-DD" size="large" />
    </div>
  );
};

export default DateRangeFilter;
