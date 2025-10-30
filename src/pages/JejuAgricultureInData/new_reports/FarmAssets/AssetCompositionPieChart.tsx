import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// 2023년 제주 농가자산 구성 데이터
const assetComposition = [
  { name: "고정자산", value: 87.8, color: "#ef4444" },
  { name: "유동자산", value: 12.2, color: "#1e40af" },
];

export default function AssetCompositionPieChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={assetComposition}
          cx="50%"
          cy="45%"
          innerRadius={50}
          outerRadius={120}
          paddingAngle={2}
          dataKey="value"
          labelLine={false}
          label={({ name, percent }) => (
            <text x={0} y={0} dy={8} textAnchor="middle" fill="#374151" fontSize={11} fontWeight={600}>
              {`${name}\n${(percent * 100).toFixed(1)}%`}
            </text>
          )}
        >
          {assetComposition.map((entry, index) => (
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
            fontSize: "13px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: "15px", fontSize: "12px" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
