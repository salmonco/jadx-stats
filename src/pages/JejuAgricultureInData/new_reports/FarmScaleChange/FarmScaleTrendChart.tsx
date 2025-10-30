import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { year: "1980", small: 50.6, medium: 42.4, large: 7.0 },
  { year: "1990", small: 42.6, medium: 45.5, large: 11.9 },
  { year: "1995", small: 45.5, medium: 44.0, large: 10.5 },
  { year: "2000", small: 40.7, medium: 41.7, large: 17.7 },
  { year: "2005", small: 43.9, medium: 38.8, large: 17.3 },
  { year: "2010", small: 28.5, medium: 53.7, large: 17.9 },
  { year: "2011", small: 27.3, medium: 51.5, large: 21.1 },
  { year: "2012", small: 26.3, medium: 52.7, large: 21.0 },
  { year: "2013", small: 25.5, medium: 53.3, large: 21.2 },
  { year: "2014", small: 27.3, medium: 52.7, large: 20.0 },
  { year: "2015", small: 29.3, medium: 54.1, large: 16.6 },
  { year: "2016", small: 29.8, medium: 55.9, large: 14.3 },
  { year: "2017", small: 32.6, medium: 54.1, large: 13.3 },
  { year: "2018", small: 31.9, medium: 55.0, large: 13.1 },
  { year: "2019", small: 30.7, medium: 56.1, large: 13.2 },
  { year: "2020", small: 34.7, medium: 51.9, large: 13.4 },
  { year: "2021", small: 31.0, medium: 55.8, large: 13.2 },
  { year: "2022", small: 31.5, medium: 56.5, large: 12.0 },
  { year: "2023", small: 32.9, medium: 53.6, large: 13.5 },
  { year: "2024", small: 33.0, medium: 53.4, large: 13.5 },
];

export default function FarmScaleTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="year" stroke="#666" fontSize={12} interval={2} />
        <YAxis stroke="#666" fontSize={12} domain={[0, 100]} tickFormatter={(value) => `${value?.toFixed(0)}%`} />
        <Tooltip formatter={(value: number, name: string) => [`${value}%`, name]} labelFormatter={(label) => `${label}년`} />
        <Legend verticalAlign="bottom" height={36} />
        <Area type="monotone" dataKey="large" stackId="1" stroke="#9ca3af" fill="#9ca3af" name="2ha 이상" />
        <Area type="monotone" dataKey="medium" stackId="1" stroke="#f97316" fill="#f97316" name="0.5ha 이상 ~ 2ha 미만" />
        <Area type="monotone" dataKey="small" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="0.5ha 미만" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
