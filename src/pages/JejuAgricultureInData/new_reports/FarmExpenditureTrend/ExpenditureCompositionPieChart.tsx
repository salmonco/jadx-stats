import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// 2023년 가계지출 구성 데이터
const expenditureComposition = [
  { name: "소비지출", value: 75.7, color: "#4f46e5" },
  { name: "비소비지출", value: 24.3, color: "#f97316" },
];

export default function ExpenditureCompositionPieChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={expenditureComposition}
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
          {expenditureComposition.map((entry, index) => (
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
