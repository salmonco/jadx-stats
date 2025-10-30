import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 제주와 전국 평균 부채 비교 데이터 (2023년, 백만원)
const comparisonData = [
  {
    category: "총 부채",
    jeju: 94,
    national: 36,
  },
  {
    category: "농업용 부채",
    jeju: 65,
    national: 25,
  },
  {
    category: "가계용 부채",
    jeju: 18,
    national: 8,
  },
  {
    category: "겸업 및 기타",
    jeju: 12,
    national: 3,
  },
];

export default function DebtComparisonChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={comparisonData} margin={{ top: 20, right: 40, left: 20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="#e2e8f0" />
        <XAxis dataKey="category" tick={{ fontSize: 12, fill: "#475569" }} interval={0} axisLine={{ stroke: "#cbd5e1" }} tickLine={{ stroke: "#cbd5e1" }} />
        <YAxis
          tickFormatter={(value) => `${value}백만원`}
          domain={[0, 100]}
          tick={{ fontSize: 12, fill: "#475569" }}
          axisLine={{ stroke: "#cbd5e1" }}
          tickLine={{ stroke: "#cbd5e1" }}
        />
        <Tooltip
          formatter={(value, name) => [`${value}백만원`, name === "jeju" ? "제주" : "전국평균"]}
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "13px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "13px", color: "#475569" }} formatter={(value) => (value === "jeju" ? "제주" : "전국평균")} />
        <Bar dataKey="jeju" name="jeju" fill="#ef4444" radius={[4, 4, 0, 0]} />
        <Bar dataKey="national" name="national" fill="#1e40af" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
