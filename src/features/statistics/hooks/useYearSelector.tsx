import { Select } from "antd";
import { useState } from "react";

const { Option } = Select;

const useYearSelector = (initialYear: number) => {
    const [year, setYear] = useState(initialYear);

    const handleYearChange = (value: number) => {
        setYear(value);
    };

    const YearSelector = (
        <div className="absolute right-8 top-4 flex items-center gap-3">
            <span className="text-[16px] font-semibold">기준년도</span>
            <Select value={year} onChange={handleYearChange} className="w-[85px]" size="large">
                {Array.from({ length: 12 }, (_, i) => 2011 + i).map((year) => (
                    <Option key={year} value={year}>
                        {year}
                    </Option>
                ))}
            </Select>
        </div>
    );

    return { year, YearSelector };
};

export default useYearSelector;
