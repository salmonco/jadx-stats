import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

// 소득 종류별 증감률 데이터
const growthData = [
  { name: "농업소득", growth: -1.18, color: "#4478c8" },
  { name: "농외소득", growth: 1.58, color: "#f97316" },
  { name: "이전소득", growth: 3.92, color: "#9ca3af" },
  { name: "비경상소득", growth: 64.79, color: "#eab308" },
  { name: "총 농가소득", growth: 3.93, color: "#1e3a8a" },
];

export default function IncomeGrowthChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={growthData} layout="vertical" margin={{ top: 10, right: 30, left: 70, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={true} />
        <XAxis type="number" domain={[-10, 70]} tickFormatter={(value) => `${value}%`} tick={{ fontSize: 14 }} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 14 }} />
        <Tooltip
          formatter={(value) => [`${value}%`, "전년대비 증감률"]}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #f0f0f0",
            borderRadius: "4px",
            padding: "10px",
          }}
        />
        <Bar dataKey="growth" name="전년대비 증감률(%)" radius={[0, 4, 4, 0]}>
          {growthData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
