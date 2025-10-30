"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 제주와 전국 평균 소득 비교 데이터 (2023년, 천원)
const comparisonData = [
  {
    category: "농가소득",
    jeju: 60531,
    national: 50644,
  },
  {
    category: "농업소득",
    jeju: 15231,
    national: 12500,
  },
  {
    category: "농외소득",
    jeju: 26271,
    national: 19500,
  },
  {
    category: "이전소득",
    jeju: 15231,
    national: 14500,
  },
  {
    category: "비경상소득",
    jeju: 3798,
    national: 4144,
  },
];

export default function JejuNationalComparisonChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={comparisonData} margin={{ top: 20, right: 40, left: 20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="category" tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor="end" height={80} />
        <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}만원`} domain={[0, 70000]} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value, name) => [`${value.toLocaleString()}천원`, name === "jeju" ? "제주" : "전국평균"]}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "13px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "13px" }} formatter={(value) => (value === "jeju" ? "제주" : "전국평균")} />
        <Bar dataKey="jeju" name="jeju" fill="#6366f1" radius={[4, 4, 0, 0]} />
        <Bar dataKey="national" name="national" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
