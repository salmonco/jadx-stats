import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";

// 제주 경지규모별 농가수 변화 데이터 (1980-2024)
const farmSizeData = [
  { year: 1980, small: 50.6, medium: 42.4, large: 7.0 },
  { year: 1990, small: 42.6, medium: 45.5, large: 11.9 },
  { year: 1995, small: 45.5, medium: 44.0, large: 10.5 },
  { year: 2000, small: 40.7, medium: 41.7, large: 17.7 },
  { year: 2005, small: 43.9, medium: 38.8, large: 17.3 },
  { year: 2010, small: 28.5, medium: 53.7, large: 17.9 },
  { year: 2011, small: 27.3, medium: 51.5, large: 21.1 },
  { year: 2012, small: 26.3, medium: 52.7, large: 21.0 },
  { year: 2013, small: 25.5, medium: 53.3, large: 21.2 },
  { year: 2014, small: 27.3, medium: 52.7, large: 20.0 },
  { year: 2015, small: 29.3, medium: 54.1, large: 16.6 },
  { year: 2016, small: 29.8, medium: 55.9, large: 14.3 },
  { year: 2017, small: 32.6, medium: 54.1, large: 13.3 },
  { year: 2018, small: 31.9, medium: 55.0, large: 13.1 },
  { year: 2019, small: 30.7, medium: 56.1, large: 13.2 },
  { year: 2020, small: 34.7, medium: 51.9, large: 13.4 },
  { year: 2021, small: 31.0, medium: 55.8, large: 13.2 },
  { year: 2022, small: 31.5, medium: 56.5, large: 12.0 },
  { year: 2023, small: 32.9, medium: 53.6, large: 13.5 },
  { year: 2024, small: 33.0, medium: 53.4, large: 13.5 },
];

export default function FarmSizeTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={farmSizeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} stackOffset="expand" barSize={40}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 14 }} />
        <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} tick={{ fontSize: 14 }} />
        <Tooltip
          formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, ""]}
          labelFormatter={(label) => `${label}년`}
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
        <Bar dataKey="small" stackId="a" fill="#4478c8" name="small">
          <LabelList dataKey="small" position="center" formatter={(value) => `${(value * 100).toFixed(0)}%`} fill="#fff" fontSize={10} />
        </Bar>
        <Bar dataKey="medium" stackId="a" fill="#f97316" name="medium">
          <LabelList dataKey="medium" position="center" formatter={(value) => `${(value * 100).toFixed(0)}%`} fill="#fff" fontSize={10} />
        </Bar>
        <Bar dataKey="large" stackId="a" fill="#9ca3af" name="large">
          <LabelList dataKey="large" position="center" formatter={(value) => `${(value * 100).toFixed(0)}%`} fill="#fff" fontSize={10} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
