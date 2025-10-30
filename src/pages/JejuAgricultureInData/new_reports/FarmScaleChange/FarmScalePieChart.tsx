import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const data = [
  { name: "0.5ha 미만", value: 33.0, color: "#3b82f6" },
  { name: "0.5ha 이상 ~ 2ha 미만", value: 53.4, color: "#f97316" },
  { name: "2ha 이상", value: 13.5, color: "#9ca3af" },
];

const COLORS = ["#3b82f6", "#f97316", "#9ca3af"];

export default function FarmScalePieChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" outerRadius={120} fill="#8884d8" dataKey="value" label={({ name, value }) => `${name}: ${value}%`} labelLine={false}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => [`${value}%`, "비중"]} />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
}
