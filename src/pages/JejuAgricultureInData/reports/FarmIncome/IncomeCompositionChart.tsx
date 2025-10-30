import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// 2023년 소득 구성 데이터
const incomeComposition = [
  { name: "농업소득", value: 25.16, color: "#4478c8" },
  { name: "농외소득", value: 43.4, color: "#f97316" },
  { name: "이전소득", value: 25.17, color: "#9ca3af" },
  { name: "비경상소득", value: 6.27, color: "#eab308" },
];

export default function IncomeCompositionChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={incomeComposition}
          cx="50%"
          cy="50%"
          innerRadius={0}
          outerRadius="70%"
          paddingAngle={0}
          dataKey="value"
          labelLine={true}
          fontSize={14}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
        >
          {incomeComposition.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${value}%`, ""]}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #f0f0f0",
            borderRadius: "4px",
            padding: "10px",
          }}
        />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" formatter={(value) => <span style={{ fontSize: "14px" }}>{value}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
}
