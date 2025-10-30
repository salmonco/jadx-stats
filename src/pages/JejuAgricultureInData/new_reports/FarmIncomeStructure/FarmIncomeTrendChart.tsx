"use client";

import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart } from "recharts";

// 농가소득 데이터 (2003-2023, 백만원)
const incomeData = [
  { year: 2003, farmIncome: 31, nationalAvg: 23 },
  { year: 2004, farmIncome: 39, nationalAvg: 26 },
  { year: 2005, farmIncome: 45, nationalAvg: 30 },
  { year: 2006, farmIncome: 42, nationalAvg: 32 },
  { year: 2007, farmIncome: 41, nationalAvg: 32 },
  { year: 2008, farmIncome: 38, nationalAvg: 30 },
  { year: 2009, farmIncome: 35, nationalAvg: 30 },
  { year: 2010, farmIncome: 41, nationalAvg: 32 },
  { year: 2011, farmIncome: 36, nationalAvg: 30 },
  { year: 2012, farmIncome: 39, nationalAvg: 31 },
  { year: 2013, farmIncome: 42, nationalAvg: 34 },
  { year: 2014, farmIncome: 43, nationalAvg: 35 },
  { year: 2015, farmIncome: 44, nationalAvg: 37 },
  { year: 2016, farmIncome: 46, nationalAvg: 37 },
  { year: 2017, farmIncome: 53, nationalAvg: 38 },
  { year: 2018, farmIncome: 49, nationalAvg: 42 },
  { year: 2019, farmIncome: 49, nationalAvg: 41 },
  { year: 2020, farmIncome: 49, nationalAvg: 45 },
  { year: 2021, farmIncome: 48, nationalAvg: 48 },
  { year: 2022, farmIncome: 58, nationalAvg: 46 },
  { year: 2023, farmIncome: 61, nationalAvg: 51 },
];

export default function FarmIncomeTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={incomeData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} tickCount={8} domain={["dataMin", "dataMax"]} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 12 }} domain={[0, 70]} tickFormatter={(value) => `${value}백만원`} width={60} />
        <Tooltip
          formatter={(value, name) => [`${value}백만원`, name === "farmIncome" ? "제주 농가소득" : "전국 평균 농가소득"]}
          labelFormatter={(label) => `${label}년`}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "13px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "13px", paddingTop: "10px" }} formatter={(value) => (value === "farmIncome" ? "제주 농가소득" : "전국 평균 농가소득")} />
        <Line type="monotone" dataKey="farmIncome" stroke="#6366f1" name="farmIncome" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="nationalAvg" stroke="#10b981" name="nationalAvg" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
