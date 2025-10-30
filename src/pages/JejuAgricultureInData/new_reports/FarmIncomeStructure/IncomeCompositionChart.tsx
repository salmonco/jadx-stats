import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// 2023년 소득 구성 데이터
const incomeComposition = [
  { name: "농업소득", value: 25.2, color: "#6366f1" },
  { name: "농외소득", value: 43.4, color: "#06b6d4" },
  { name: "이전소득", value: 25.2, color: "#10b981" },
  { name: "비경상소득", value: 6.0, color: "#f59e0b" },
];

export default function IncomeCompositionPieChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={incomeComposition}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={110}
          paddingAngle={2}
          dataKey="value"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
          fontSize={13}
        >
          {incomeComposition.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value}%`, name]}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "14px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: "15px", fontSize: "14px" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
