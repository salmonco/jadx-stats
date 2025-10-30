import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// 2023년 자산 구성 데이터
const assetComposition = [
  { name: "고정자산", value: 87.79, color: "#4478c8" },
  { name: "유동자산", value: 12.21, color: "#f97316" },
];

export default function AssetCompositionChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={assetComposition}
          cx="50%"
          cy="50%"
          innerRadius={0}
          outerRadius="70%"
          paddingAngle={0}
          dataKey="value"
          labelLine={true}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
        >
          {assetComposition.map((entry, index) => (
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
