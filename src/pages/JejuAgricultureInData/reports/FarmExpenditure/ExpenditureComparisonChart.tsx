import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 제주와 전국 평균 지출 비교 데이터
const comparisonData = [
  {
    category: "가계지출",
    jeju: 47327,
    national: 37311,
    difference: 10016,
  },
  {
    category: "소비지출",
    jeju: 35825,
    national: 28200,
    difference: 7625,
  },
  {
    category: "비소비지출",
    jeju: 11501,
    national: 9111,
    difference: 2390,
  },
];

export default function ExpenditureComparisonChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={comparisonData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }} barSize={60}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="category" tick={{ fontSize: 14 }} />
        <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}만`} domain={[0, 50000]} tick={{ fontSize: 14 }} />
        <Tooltip
          formatter={(value, name) => [`${value.toLocaleString()} 천원`, `${name}`]}
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
