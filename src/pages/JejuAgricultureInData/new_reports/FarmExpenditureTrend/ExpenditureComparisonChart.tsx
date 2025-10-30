import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 제주와 전국 평균 지출 비교 데이터 (2023년, 천원)
const comparisonData = [
  {
    category: "가계지출",
    jeju: 47327,
    national: 37311,
  },
  {
    category: "소비지출",
    jeju: 35825,
    national: 28200,
  },
  {
    category: "비소비지출",
    jeju: 11501,
    national: 9111,
  },
];

export default function ExpenditureComparisonChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={comparisonData} margin={{ top: 20, right: 40, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="category" tick={{ fontSize: 12 }} interval={0} />
        <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}만원`} domain={[0, 50000]} tick={{ fontSize: 12 }} />
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
        <Legend wrapperStyle={{ paddingTop: "15px", fontSize: "13px" }} formatter={(value) => (value === "jeju" ? "제주" : "전국평균")} />
        <Bar dataKey="jeju" name="jeju" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        <Bar dataKey="national" name="national" fill="#22c55e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
