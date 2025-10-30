"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const areaData = [
  { year: 2000, area: 24261 },
  { year: 2001, area: 23788 },
  { year: 2002, area: 23456 },
  { year: 2003, area: 22456 },
  { year: 2004, area: 19725 },
  { year: 2005, area: 19286 },
  { year: 2006, area: 19035 },
  { year: 2007, area: 18535 },
  { year: 2008, area: 18457 },
  { year: 2009, area: 18279 },
  { year: 2010, area: 17922 },
  { year: 2011, area: 17626 },
  { year: 2012, area: 17389 },
  { year: 2013, area: 17165 },
  { year: 2014, area: 16941 },
  { year: 2015, area: 16775 },
  { year: 2016, area: 16610 },
  { year: 2017, area: 15006 },
  { year: 2018, area: 14898 },
  { year: 2019, area: 14815 },
  { year: 2020, area: 14752 },
  { year: 2021, area: 14607 },
  { year: 2022, area: 14405 },
  { year: 2023, area: 14242 },
];

export default function CitrusAreaTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={areaData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}`} />
        <YAxis tick={{ fontSize: 12 }} domain={[13000, 25000]} tickFormatter={(value) => `${(value / 1000).toFixed(0)}천`} />
        <Tooltip
          formatter={(value: number) => [`${value.toLocaleString()}ha`, "재배면적"]}
          labelFormatter={(label) => `${label}년`}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Line
          type="monotone"
          dataKey="area"
          stroke="#dc2626"
          strokeWidth={3}
          dot={{ fill: "#dc2626", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: "#dc2626", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
