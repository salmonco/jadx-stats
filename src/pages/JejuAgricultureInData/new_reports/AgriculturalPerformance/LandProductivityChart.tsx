"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 토지생산성 정의 주석 추가
/*
 * 토지생산성 : 농업부가가치/경지면적(10a)
 * 토지면적 단위당의 생산량을 말하며, 그 토지의 경제성을 타 토지와 비교하는데 사용
 */

// 토지생산성 데이터를 새로운 데이터로 업데이트
const landProductivityData = [
  { year: 2003, jeju: 1042, national: 910 },
  { year: 2004, jeju: 1134, national: 1089 },
  { year: 2005, jeju: 1127, national: 1316 },
  { year: 2006, jeju: 1158, national: 1224 },
  { year: 2007, jeju: 1071, national: 1222 },
  { year: 2008, jeju: 1199, national: 1073 },
  { year: 2009, jeju: 1290, national: 1030 },
  { year: 2010, jeju: 1312, national: 1583 },
  { year: 2011, jeju: 1260, national: 1125 },
  { year: 2012, jeju: 1292, national: 1247 },
  { year: 2013, jeju: 1432, national: 1286 },
  { year: 2014, jeju: 1520, national: 1210 },
  { year: 2015, jeju: 1591, national: 1274 },
  { year: 2016, jeju: 1558, national: 1419 },
  { year: 2017, jeju: 1496, national: 1780 },
  { year: 2018, jeju: 1759, national: 2089 },
  { year: 2019, jeju: 1468, national: 1996 },
  { year: 2020, jeju: 1576, national: 1777 },
  { year: 2021, jeju: 1761, national: 1678 },
  { year: 2022, jeju: 1422, national: 1867 },
  { year: 2023, jeju: 1769, national: 2343 },
];

export default function LandProductivityChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={landProductivityData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}`} />
        <YAxis tick={{ fontSize: 12 }} domain={[0, 2500]} label={{ value: "천원", angle: 0, position: "top" }} />
        <Tooltip formatter={(value, name) => [`${value.toLocaleString()}천원`, name === "jeju" ? "제주" : "전국(제주제외)"]} labelFormatter={(label) => `${label}년`} />
        <Legend formatter={(value) => (value === "jeju" ? "제주" : "전국(제주제외)")} />
        <Line type="monotone" dataKey="national" stroke="#fbbf24" strokeWidth={3} dot={{ fill: "#fbbf24", strokeWidth: 2, r: 4 }} name="national" />
        <Line type="monotone" dataKey="jeju" stroke="#ef4444" strokeWidth={3} dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }} name="jeju" />
      </LineChart>
    </ResponsiveContainer>
  );
}
