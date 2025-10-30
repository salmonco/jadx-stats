import { useState } from "react";
import { Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Cell } from "recharts";

// 제주도와 전국의 경지면적당 비료소비량 데이터 (1975-2023)
const fertilizerData = [
  { year: 1975, jejuArea: 48867, jeju: 468, national: 396, ratio: 1.2 },
  { year: 1976, jejuArea: 49499, jeju: 329, national: 287, ratio: 1.1 },
  { year: 1977, jejuArea: 49919, jeju: 437, national: 329, ratio: 1.3 },
  { year: 1978, jejuArea: 50101, jeju: 563, national: 388, ratio: 1.5 },
  { year: 1979, jejuArea: 49981, jeju: 613, national: 388, ratio: 1.6 },
  { year: 1980, jejuArea: 50111, jeju: 642, national: 375, ratio: 1.7 },
  { year: 1981, jejuArea: 50117, jeju: 702, national: 379, ratio: 1.9 },
  { year: 1982, jejuArea: 50064, jeju: 549, national: 282, ratio: 1.9 },
  { year: 1983, jejuArea: 49924, jeju: 591, national: 325, ratio: 1.8 },
  { year: 1984, jejuArea: 49657, jeju: 627, national: 352, ratio: 1.8 },
  { year: 1985, jejuArea: 49553, jeju: 736, national: 375, ratio: 2.0 },
  { year: 1986, jejuArea: 51028, jeju: 797, national: 387, ratio: 2.1 },
  { year: 1987, jejuArea: 54365, jeju: 736, national: 392, ratio: 1.9 },
  { year: 1988, jejuArea: 54523, jeju: 850, national: 399, ratio: 2.1 },
  { year: 1989, jejuArea: 54757, jeju: 880, national: 405, ratio: 2.2 },
  { year: 1990, jejuArea: 54814, jeju: 1032, national: 469, ratio: 2.2 },
  { year: 1991, jejuArea: 54788, jeju: 788, national: 338, ratio: 2.3 },
  { year: 1992, jejuArea: 54450, jeju: 1030, national: 393, ratio: 2.6 },
  { year: 1993, jejuArea: 54197, jeju: 1055, national: 403, ratio: 2.6 },
  { year: 1994, jejuArea: 54255, jeju: 1076, national: 399, ratio: 2.7 },
  { year: 1995, jejuArea: 56803, jeju: 1041, national: 399, ratio: 2.6 },
  { year: 1996, jejuArea: 56829, jeju: 970, national: 397, ratio: 2.4 },
  { year: 1997, jejuArea: 56315, jeju: 890, national: 401, ratio: 2.2 },
  { year: 1998, jejuArea: 56517, jeju: 887, national: 417, ratio: 2.1 },
  { year: 1999, jejuArea: 56812, jeju: 768, national: 409, ratio: 1.9 },
  { year: 2000, jejuArea: 58707, jeju: 645, national: 391, ratio: 1.6 },
  { year: 2001, jejuArea: 59207, jeju: 560, national: 345, ratio: 1.6 },
  { year: 2002, jejuArea: 58965, jeju: 504, national: 340, ratio: 1.5 },
  { year: 2003, jejuArea: 59167, jeju: 528, national: 339, ratio: 1.6 },
  { year: 2004, jejuArea: 58503, jeju: 551, national: 371, ratio: 1.5 },
  { year: 2005, jejuArea: 58951, jeju: 599, national: 354, ratio: 1.7 },
  { year: 2006, jejuArea: 58442, jeju: 314, national: 219, ratio: 1.4 },
  { year: 2007, jejuArea: 57867, jeju: 389, national: 230, ratio: 1.7 },
  { year: 2008, jejuArea: 57204, jeju: 339, national: 284, ratio: 1.2 },
  { year: 2009, jejuArea: 56693, jeju: 360, national: 266, ratio: 1.4 },
  { year: 2010, jejuArea: 59485, jeju: 320, national: 219, ratio: 1.5 },
  { year: 2011, jejuArea: 59255, jeju: 400, national: 236, ratio: 1.7 },
  { year: 2012, jejuArea: 59030, jeju: 381, national: 237, ratio: 1.6 },
  { year: 2013, jejuArea: 61377, jeju: 364, national: 217, ratio: 1.7 },
  { year: 2014, jejuArea: 62856, jeju: 351, national: 213, ratio: 1.6 },
  { year: 2015, jejuArea: 62686, jeju: 362, national: 206, ratio: 1.8 },
  { year: 2016, jejuArea: 62642, jeju: 394, national: 202, ratio: 2.0 },
  { year: 2017, jejuArea: 62140, jeju: 370, national: 192, ratio: 1.9 },
  { year: 2018, jejuArea: 61088, jeju: 383, national: 215, ratio: 1.8 },
  { year: 2019, jejuArea: 59338, jeju: 492, national: 288, ratio: 1.7 },
  { year: 2020, jejuArea: 59039, jeju: 486, national: 284, ratio: 1.7 },
  { year: 2021, jejuArea: 58654, jeju: 526, national: 306, ratio: 1.7 },
  { year: 2022, jejuArea: 56355, jeju: 439, national: 256, ratio: 1.7 },
  { year: 2023, jejuArea: 55957, jeju: 414, national: 247, ratio: 1.7 },
];

export default function FertilizerConsumptionChart() {
  const [activeYear, setActiveYear] = useState<number | null>(null);

  // 마우스 이벤트 핸들러
  const handleMouseEnter = (data: any) => {
    setActiveYear(data.year);
  };

  const handleMouseLeave = () => {
    setActiveYear(null);
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={fertilizerData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }} onMouseLeave={handleMouseLeave}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 14 }} tickCount={10} domain={["dataMin", "dataMax"]} interval="preserveStartEnd" />
        <YAxis
          yAxisId="left"
          orientation="left"
          tick={{ fontSize: 14 }}
          domain={[0, 1200]}
          label={{ value: "비료소비량 (kg/ha)", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 14 }}
          domain={[0, 70000]}
          label={{ value: "경지면적 (ha)", angle: 90, position: "insideRight", style: { textAnchor: "middle" } }}
        />
        <Tooltip
          formatter={(value, name) => {
            if (name === "jejuArea") return [`${value.toLocaleString()} ha`, "경지면적(제주)"];
            if (name === "jeju") return [`${value} kg/ha`, "제주"];
            if (name === "national") return [`${value} kg/ha`, "전국"];
            return [value, name];
          }}
          labelFormatter={(label) => `${label}년`}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #f0f0f0",
            borderRadius: "4px",
            padding: "10px",
          }}
        />
        <Legend
          payload={[
            { value: "경지면적(제주)", type: "rect", color: "#d1d5db" },
            { value: "제주", type: "line", color: "#f97316" },
            { value: "전국", type: "line", color: "#4478c8" },
          ]}
        />
        <Bar dataKey="jejuArea" yAxisId="right" name="jejuArea" barSize={20} onMouseEnter={handleMouseEnter}>
          {fertilizerData.map((entry) => (
            <Cell
              key={`cell-${entry.year}`}
              fill={activeYear === entry.year ? "#94a3b8" : "#d1d5db"}
              fillOpacity={activeYear === entry.year ? 0.9 : 0.6}
              stroke={activeYear === entry.year ? "#64748b" : "none"}
              strokeWidth={activeYear === entry.year ? 1 : 0}
            />
          ))}
        </Bar>
        <Line type="monotone" dataKey="jeju" yAxisId="left" stroke="#f97316" name="jeju" strokeWidth={3} dot={{ r: 3, strokeWidth: 2 }} activeDot={{ r: 6 }} z={10} />
        <Line
          type="monotone"
          dataKey="national"
          yAxisId="left"
          stroke="#4478c8"
          name="national"
          strokeWidth={3}
          dot={{ r: 3, strokeWidth: 2 }}
          activeDot={{ r: 6 }}
          z={10}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
