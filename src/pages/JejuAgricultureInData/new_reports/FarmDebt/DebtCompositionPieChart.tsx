import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// 2023년 제주 농가부채 구성 데이터
const debtComposition = [
  { name: "농업용", value: 68.4, color: "#ef4444" },
  { name: "가계용", value: 18.9, color: "#1e40af" },
  { name: "겸업 및 기타", value: 12.6, color: "#f59e0b" },
];

export default function DebtCompositionPieChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={debtComposition}
          cx="50%"
          cy="45%"
          innerRadius={70}
          outerRadius={140}
          paddingAngle={2}
          dataKey="value"
          labelLine={false}
          label={({ name, percent }) => (
            <text x={0} y={0} dy={8} textAnchor="middle" fill="#374151" fontSize={11} fontWeight={500}>
              {`${name}\n${(percent * 100).toFixed(1)}%`}
            </text>
          )}
        >
          {debtComposition.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value}%`, name]}
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "13px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: "15px", fontSize: "12px", color: "#475569" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
