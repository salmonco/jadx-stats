import { Slider } from "antd";
import type { SliderSingleProps } from "antd";
import { useEffect, useState } from "react";

const createMonthMarks = (): SliderSingleProps["marks"] => {
  const marks = {};
  for (let month = 1; month <= 12; month++) {
    marks[month] = {
      style: {
        transform: "rotate(-60deg) translateX(-5px) translateY(8px)",
        transformOrigin: "left bottom",
        fontSize: "12px",
      },
      label: `${month}월`,
    };
  }
  return marks;
};

const monthMarks: SliderSingleProps["marks"] = createMonthMarks();

const MonthSlider = ({
  disabled = false,
  onChange = (range) => {
    console.log("monthRange", range);
  },
}: {
  disabled?: boolean;
  onChange?: (range: number[]) => void;
}) => {
  const [monthRange, setMonthRange] = useState([1, 5]);

  useEffect(() => {
    onChange(monthRange);
  }, [monthRange]);

  return (
    <>
      <Slider
        disabled={disabled}
        className="block pb-4"
        min={1}
        max={12}
        range
        marks={monthMarks}
        defaultValue={monthRange}
        onChangeComplete={(value) => {
          setMonthRange(value);
          onChange(value);
        }}
      />
    </>
  );
};

export default MonthSlider;
