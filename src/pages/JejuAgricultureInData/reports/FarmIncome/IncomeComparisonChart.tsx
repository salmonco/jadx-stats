import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 제주와 전국 평균 소득 비교 데이터
const comparisonData = [
  {
    category: "농가소득",
    jeju: 60531,
    national: 50644,
    difference: 9887,
  },
  {
    category: "농업소득",
    jeju: 15231,
    national: 12500,
    difference: 2731,
  },
  {
    category: "농외소득",
    jeju: 26271,
    national: 19500,
    difference: 6771,
  },
  {
    category: "이전소득",
    jeju: 15231,
    national: 14500,
    difference: 731,
  },
  {
    category: "비경상소득",
    jeju: 3798,
    national: 4144,
    difference: -346,
  },
];

export default function IncomeComparisonChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={comparisonData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="category" fontSize={14} />
        <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}만`} domain={[0, 70000]} fontSize={14} />
        <Tooltip
          formatter={(value) => [`${value.toLocaleString()} 천원`, ""]}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #f0f0f0",
            borderRadius: "4px",
            padding: "10px",
          }}
        />
        <Legend formatter={(value) => <span style={{ fontSize: 14 }}>{value}</span>} />
        <Bar dataKey="jeju" name="제주" fill="#4478c8" />
        <Bar dataKey="national" name="전국평균" fill="#22c55e" />
      </BarChart>
    </ResponsiveContainer>
  );
}
