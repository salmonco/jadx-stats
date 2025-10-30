import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 농가 규모별 분포 데이터 (2000-2023)
const sizeData = [
  {
    year: 2000,
    small: 65, // 0.5ha 미만
    medium: 25, // 0.5-2ha
    large: 10, // 2ha 이상
  },
  {
    year: 2005,
    small: 60,
    medium: 28,
    large: 12,
  },
  {
    year: 2010,
    small: 55,
    medium: 30,
    large: 15,
  },
  {
    year: 2015,
    small: 50,
    medium: 32,
    large: 18,
  },
  {
    year: 2020,
    small: 45,
    medium: 35,
    large: 20,
  },
  {
    year: 2023,
    small: 40,
    medium: 37,
    large: 23,
  },
];

export default function FarmSizeChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={sizeData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" />
        <YAxis tickFormatter={(value) => `${value}%`} />
        <Tooltip
          formatter={(value) => [`${value}%`]}
          labelFormatter={(label) => `${label}년`}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #f0f0f0",
            borderRadius: "4px",
            padding: "10px",
          }}
        />
        <Legend formatter={(value) => <span style={{ fontSize: 14 }}>{value}</span>} />
        <Bar dataKey="small" fill="#ef4444" name="소규모 (0.5ha 미만)" stackId="a" radius={[0, 0, 0, 0]} />
        <Bar dataKey="medium" fill="#f97316" name="중규모 (0.5-2ha)" stackId="a" radius={[0, 0, 0, 0]} />
        <Bar dataKey="large" fill="#22c55e" name="대규모 (2ha 이상)" stackId="a" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
