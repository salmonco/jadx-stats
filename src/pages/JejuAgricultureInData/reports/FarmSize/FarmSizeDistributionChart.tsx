import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// 2024년 제주 경지규모별 농가수 비중 데이터
const distributionData = [
  { name: "0.5ha 미만", value: 33.0, color: "#4478c8" },
  { name: "0.5ha이상~2ha미만", value: 53.4, color: "#f97316" },
  { name: "2ha이상", value: 13.5, color: "#9ca3af" },
];

export default function FarmSizeDistributionChart() {
  const koreanLabels = {
    small: "0.5ha 미만",
    medium: "0.5ha이상~2ha미만",
    large: "2ha이상",
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={distributionData}
          cx="50%"
          cy="50%"
          innerRadius={0}
          outerRadius="60%"
          paddingAngle={0}
          dataKey="value"
          labelLine={true}
          label={({ name, value }) => `${name} ${value}%`}
          fontSize={14}
        >
          {distributionData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value}%`, `${koreanLabels[name] || name}`]}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #f0f0f0",
            borderRadius: "4px",
            padding: "10px",
          }}
        />
        <Legend layout="vertical" align="right" verticalAlign="middle" formatter={(value, entry) => <span style={{ fontSize: "14px" }}>{value}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
}
