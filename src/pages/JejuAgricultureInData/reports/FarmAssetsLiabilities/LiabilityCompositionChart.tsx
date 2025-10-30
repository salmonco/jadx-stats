import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// 2023년 부채 구성 데이터
const liabilityComposition = [
  { name: "농업용", value: 68.63, color: "#4478c8" },
  { name: "가계용", value: 18.83, color: "#f97316" },
  { name: "기타 및 겸업용", value: 12.54, color: "#9ca3af" },
];

export default function LiabilityCompositionChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={liabilityComposition}
          cx="50%"
          cy="50%"
          innerRadius={0}
          outerRadius="70%"
          paddingAngle={0}
          dataKey="value"
          labelLine={true}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
        >
          {liabilityComposition.map((entry, index) => (
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
        <Legend layout="horizontal" verticalAlign="bottom" align="center" formatter={(value) => <span style={{ fontSize: "0.9rem" }}>{value}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
}
