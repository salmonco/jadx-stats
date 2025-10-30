"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 자본생산성 정의 주석 추가
/*
 * 자본생산성 : 농업부가가치/경지면적(10a)
 * 투입된 자본에 대한 생산량
 */
const capitalProductivityData = [
  { year: 2003, jeju: 286, national: 388 },
  { year: 2004, jeju: 358, national: 394 },
  { year: 2005, jeju: 405, national: 368 },
  { year: 2006, jeju: 395, national: 363 },
  { year: 2007, jeju: 407, national: 339 },
  { year: 2008, jeju: 379, national: 298 },
  { year: 2009, jeju: 329, national: 321 },
  { year: 2010, jeju: 464, national: 327 },
  { year: 2011, jeju: 385, national: 293 },
  { year: 2012, jeju: 396, national: 299 },
  { year: 2013, jeju: 309, national: 295 },
  { year: 2014, jeju: 292, national: 300 },
  { year: 2015, jeju: 263, national: 328 },
  { year: 2016, jeju: 302, national: 310 },
  { year: 2017, jeju: 343, national: 309 },
  { year: 2018, jeju: 301, national: 285 },
  { year: 2019, jeju: 336, national: 238 },
  { year: 2020, jeju: 296, national: 261 },
  { year: 2021, jeju: 298, national: 277 },
  { year: 2022, jeju: 319, national: 221 },
  { year: 2023, jeju: 270, national: 241 },
];

export default function CapitalProductivityChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={capitalProductivityData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}`} />
        <YAxis tick={{ fontSize: 12 }} domain={[0, 500]} label={{ value: "천원", angle: 0, position: "top" }} />
        <Tooltip formatter={(value, name) => [`${value}천원`, name === "jeju" ? "제주" : "전국(제주제외)"]} labelFormatter={(label) => `${label}년`} />
        <Legend formatter={(value) => (value === "jeju" ? "제주" : "전국(제주제외)")} />
        <Line type="monotone" dataKey="national" stroke="#fbbf24" strokeWidth={3} dot={{ fill: "#fbbf24", strokeWidth: 2, r: 4 }} name="national" />
        <Line type="monotone" dataKey="jeju" stroke="#ef4444" strokeWidth={3} dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }} name="jeju" />
      </LineChart>
    </ResponsiveContainer>
  );
}
