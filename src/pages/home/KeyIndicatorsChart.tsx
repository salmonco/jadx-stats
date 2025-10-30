import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import clsx from "clsx";

interface Props {
  trend: {
    year: number;
    value: number;
  }[];
}

const KeyIndicatorsChart = ({ trend }: Props) => {
  const [hovered, setHovered] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const handleMouseEnter = () => {
    setHovered(true);
    setAnimationKey((prev) => prev + 1);
  };

  return (
    <div className="transition-opacity duration-500" onMouseEnter={handleMouseEnter} onMouseLeave={() => setHovered(false)}>
      <ResponsiveContainer width="100%" height={215} className={clsx("rounded-lg transition-all duration-500", hovered ? "scale-[1.01] opacity-100" : "opacity-90")}>
        <LineChart data={trend} margin={{ top: 10, right: 30, left: -30, bottom: 5 }}>
          <CartesianGrid vertical={true} horizontal={false} stroke="rgba(255, 255, 255, 0.5)" />
          <XAxis
            dataKey="year"
            axisLine={false}
            tickLine={false}
            interval={0}
            tick={({ x, y, payload }) => (
              <text x={x} y={y} dx={-15} dy={10} fill="#a9a9a9" fontSize={12}>
                {payload.value}
              </text>
            )}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={false}
            domain={([min, max]) => {
              const padding = (max - min) * 0.4;
              return [min - padding, max + padding];
            }}
          />
          <Line key={`line-${animationKey}`} dataKey="value" stroke="#81DDFF" strokeWidth={2.5} dot={{ r: 2.25, fill: "#81DDFF" }} isAnimationActive={true} />
          {/* <Tooltip /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default KeyIndicatorsChart;
