import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 1980년, 2000년, 2024년 경지규모별 농가 비중 비교 데이터
const comparisonData = [
  {
    year: "1980년",
    small: 50.6,
    medium: 42.4,
    large: 7.0,
  },
  {
    year: "2000년",
    small: 40.7,
    medium: 41.7,
    large: 17.7,
  },
  {
    year: "2024년",
    small: 33.0,
    medium: 53.4,
    large: 13.5,
  },
];

const koreanLabels = {
  small: "0.5ha 미만",
  medium: "0.5ha이상~2ha미만",
  large: "2ha이상",
};

export default function FarmSizeComparisonChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} barSize={60}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(value) => `${value}%`} tick={{ fontSize: 14 }} domain={[0, 60]} />
        <Tooltip
          formatter={(value, name) => [`${value}%`, `${koreanLabels[name] || name}`]}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #f0f0f0",
            borderRadius: "4px",
            padding: "10px",
          }}
        />
        <Legend
          formatter={(value) => <span style={{ fontSize: 14 }}>{value}</span>}
          payload={[
            { value: "0.5ha 미만", type: "square", color: "#4478c8" },
            { value: "0.5ha이상~2ha미만", type: "square", color: "#f97316" },
            { value: "2ha이상", type: "square", color: "#9ca3af" },
          ]}
        />
        <Bar dataKey="small" fill="#4478c8" name="small" />
        <Bar dataKey="medium" fill="#f97316" name="medium" />
        <Bar dataKey="large" fill="#9ca3af" name="large" />
      </BarChart>
    </ResponsiveContainer>
  );
}
