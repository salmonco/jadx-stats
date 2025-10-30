import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 제주와 전국 평균 자산 비교 데이터 (2023년, 백만원)
const comparisonData = [
  {
    category: "총 자산",
    jeju: 962,
    national: 567,
  },
  {
    category: "고정자산",
    jeju: 844,
    national: 495,
  },
  {
    category: "유동자산",
    jeju: 117,
    national: 72,
  },
];

export default function AssetComparisonChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={comparisonData} margin={{ top: 20, right: 40, left: 20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="category" tick={{ fontSize: 12 }} interval={0} />
        <YAxis tickFormatter={(value) => `${value}백만원`} domain={[0, 1000]} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value, name) => [`${value}백만원`, name === "jeju" ? "제주" : "전국평균"]}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "13px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Legend wrapperStyle={{ paddingTop: "15px", fontSize: "13px" }} formatter={(value) => (value === "jeju" ? "제주" : "전국평균")} />
        <Bar dataKey="jeju" name="jeju" fill="#ef4444" radius={[4, 4, 0, 0]} />
        <Bar dataKey="national" name="national" fill="#1e40af" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
