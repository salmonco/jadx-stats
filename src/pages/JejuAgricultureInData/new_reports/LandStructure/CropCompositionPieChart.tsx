import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// 2023년 작물별 재배면적 구성비 데이터
const cropComposition2023 = [
  { name: "벼", value: 0.01, color: "#1e40af" },
  { name: "맥류", value: 2.76, color: "#f97316" },
  { name: "서류", value: 8.32, color: "#9ca3af" },
  { name: "잡곡", value: 7.65, color: "#eab308" },
  { name: "서류", value: 2.03, color: "#22c55e" },
  { name: "채소", value: 27.89, color: "#8b5cf6" },
  { name: "특용작물", value: 1.62, color: "#06b6d4" },
  { name: "과수", value: 36.13, color: "#84cc16" },
  { name: "기타수원지", value: 1.95, color: "#f59e0b" },
  { name: "기타작물", value: 6.61, color: "#6b7280" },
  { name: "유휴경지", value: 5.03, color: "#ef4444" },
];

export default function CropCompositionPieChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={cropComposition2023}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={140}
          paddingAngle={1}
          dataKey="value"
          labelLine={false}
          label={({ name, percent }) => (percent > 0.01 ? `${name} ${(percent * 100).toFixed(1)}%` : null)}
          fontSize={14}
        >
          {cropComposition2023.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={1} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name) => [`${value.toFixed(2)}%`, name]}
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "14px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          wrapperStyle={{ fontSize: "15px", color: "#475569" }}
          formatter={(value, entry) => (
            <span style={{ color: entry.color }}>
              {value} ({entry.payload.value.toFixed(1)}%)
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
