import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// 2023년 지출 구성 데이터
const expenditureComposition = [
  { name: "소비지출", value: 75.7, color: "#4478c8" },
  { name: "비소비지출", value: 24.3, color: "#f97316" },
];

export default function ExpenditureCompositionChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={expenditureComposition}
          cx="50%"
          cy="50%"
          innerRadius={0}
          outerRadius="70%"
          paddingAngle={0}
          dataKey="value"
          labelLine={true}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
          fontSize={14}
        >
          {expenditureComposition.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value}%`, `${name}`]}
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
