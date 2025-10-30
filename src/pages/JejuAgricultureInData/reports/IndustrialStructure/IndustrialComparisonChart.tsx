import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 2023년 전국과 제주의 산업별 생산 비중 비교 데이터
const comparisonData = [
  {
    category: "농림, 임업 및 어업",
    jeju: 10.1,
    national: 1.5,
    difference: 8.6,
  },
  {
    category: "광제조업",
    jeju: 6.5,
    national: 29.8,
    difference: -23.3,
  },
  {
    category: "건설업",
    jeju: 6.8,
    national: 5.4,
    difference: 1.4,
  },
  {
    category: "도매운수숙박음식점",
    jeju: 21.6,
    national: 15.4,
    difference: 6.2,
  },
  {
    category: "서비스업",
    jeju: 56.3,
    national: 47.3,
    difference: 9.0,
  },
];

export default function IndustrialComparisonChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={comparisonData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={true} vertical={false} />
        <XAxis type="number" domain={[0, 60]} tickFormatter={(value) => `${value}%`} tick={{ fontSize: 14 }} />
        <YAxis dataKey="category" type="category" tick={{ fontSize: 14 }} width={150} />
        <Tooltip
          formatter={(value, name) => [`${value}%`, `${name}`]}
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
