"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const productionData = [
  { year: 2000, production: 518731 },
  { year: 2001, production: 619731 },
  { year: 2002, production: 738530 },
  { year: 2003, production: 586734 },
  { year: 2004, production: 536668 },
  { year: 2005, production: 569577 },
  { year: 2006, production: 588920 },
  { year: 2007, production: 677770 },
  { year: 2008, production: 520350 },
  { year: 2009, production: 655046 },
  { year: 2010, production: 490502 },
  { year: 2011, production: 500150 },
  { year: 2012, production: 558942 },
  { year: 2013, production: 554007 },
  { year: 2014, production: 573442 },
  { year: 2015, production: 519243 },
  { year: 2016, production: 466817 },
  { year: 2017, production: 440254 },
  { year: 2018, production: 467600 },
  { year: 2019, production: 491149 },
  { year: 2020, production: 515778 },
  { year: 2021, production: 467923 },
  { year: 2022, production: 428977 },
  { year: 2023, production: 405885 },
];

export default function CitrusProductionTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={productionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}`} />
        <YAxis tick={{ fontSize: 12 }} domain={[300000, 800000]} tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`} />
        <Tooltip
          formatter={(value: number) => [`${value.toLocaleString()}톤`, "생산량"]}
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
          dataKey="production"
          stroke="#1e40af"
          strokeWidth={3}
          dot={{ fill: "#1e40af", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: "#1e40af", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
