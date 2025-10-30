import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 2024년 제주와 전국의 산업별 취업자 비중 비교 데이터
const comparisonData = [
  {
    category: "농림어업",
    jeju: 12.5,
    national: 5.1,
    difference: 7.4,
  },
  {
    category: "광공업",
    jeju: 3.2,
    national: 15.1,
    difference: -11.9,
  },
  {
    category: "SOC, 기타서비스",
    jeju: 59.5,
    national: 56.7,
    difference: 2.8,
  },
  {
    category: "도소매,숙박,음식점업",
    jeju: 24.8,
    national: 23.1,
    difference: 1.7,
  },
];

export default function IndustryComparisonChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={comparisonData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="category" tick={{ fontSize: 14 }} />
        <YAxis tickFormatter={(value) => `${value}%`} tick={{ fontSize: 14 }} domain={[0, 70]} />
        <Tooltip
          formatter={(value) => [`${value}%`, ""]}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #f0f0f0",
            borderRadius: "4px",
            padding: "10px",
          }}
        />
        <Legend formatter={(value) => <span style={{ fontSize: 14 }}>{value}</span>} />
        <Bar dataKey="jeju" name="제주" fill="#4478c8" />
        <Bar dataKey="national" name="전국" fill="#e74c3c" />
      </BarChart>
    </ResponsiveContainer>
  );
}
