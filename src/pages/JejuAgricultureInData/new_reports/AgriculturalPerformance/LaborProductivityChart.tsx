"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 노동생산성 정의 주석 추가
/*
 * 노동생산성 : 농업부가가치/자영농업노동시간
 * 노동생산성은 자본생산성 지표와 함께 농업과 타산업 또는 농가 상호간의 경제적 능력을 나타냄
 */
const laborProductivityData = [
  { year: 2003, jeju: 9, national: 12 },
  { year: 2004, jeju: 11, national: 13 },
  { year: 2005, jeju: 13, national: 13 },
  { year: 2006, jeju: 12, national: 14 },
  { year: 2007, jeju: 12, national: 13 },
  { year: 2008, jeju: 17, national: 13 },
  { year: 2009, jeju: 13, national: 15 },
  { year: 2010, jeju: 20, national: 16 },
  { year: 2011, jeju: 16, national: 15 },
  { year: 2012, jeju: 17, national: 16 },
  { year: 2013, jeju: 17, national: 16 },
  { year: 2014, jeju: 17, national: 17 },
  { year: 2015, jeju: 17, national: 20 },
  { year: 2016, jeju: 19, national: 20 },
  { year: 2017, jeju: 25, national: 21 },
  { year: 2018, jeju: 17, national: 19 },
  { year: 2019, jeju: 18, national: 18 },
  { year: 2020, jeju: 17, national: 19 },
  { year: 2021, jeju: 18, national: 19 },
  { year: 2022, jeju: 20, national: 16 },
  { year: 2023, jeju: 22, national: 18 },
];

export default function LaborProductivityChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={laborProductivityData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}`} />
        <YAxis tick={{ fontSize: 12 }} domain={[0, 30]} label={{ value: "천원", angle: 0, position: "top" }} />
        <Tooltip formatter={(value, name) => [`${value}천원`, name === "jeju" ? "제주" : "전국(제주제외)"]} labelFormatter={(label) => `${label}년`} />
        <Legend formatter={(value) => (value === "jeju" ? "제주" : "전국(제주제외)")} />
        <Line type="monotone" dataKey="national" stroke="#fbbf24" strokeWidth={3} dot={{ fill: "#fbbf24", strokeWidth: 2, r: 4 }} name="national" />
        <Line type="monotone" dataKey="jeju" stroke="#ef4444" strokeWidth={3} dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }} name="jeju" />
      </LineChart>
    </ResponsiveContainer>
  );
}
