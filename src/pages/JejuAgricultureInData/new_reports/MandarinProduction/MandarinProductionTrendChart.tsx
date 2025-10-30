import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const productionData = [
  { year: 1997, production: 6618 },
  { year: 1998, production: 6114 },
  { year: 1999, production: 7317 },
  { year: 2000, production: 10617 },
  { year: 2001, production: 11130 },
  { year: 2002, production: 13044 },
  { year: 2003, production: 14345 },
  { year: 2004, production: 21652 },
  { year: 2005, production: 24296 },
  { year: 2006, production: 27587 },
  { year: 2007, production: 25247 },
  { year: 2008, production: 31544 },
  { year: 2009, production: 38912 },
  { year: 2010, production: 42826 },
  { year: 2011, production: 45085 },
  { year: 2012, production: 55465 },
  { year: 2013, production: 63963 },
  { year: 2014, production: 65800 },
  { year: 2015, production: 67406 },
  { year: 2016, production: 73915 },
  { year: 2017, production: 78819 },
  { year: 2018, production: 80163 },
  { year: 2019, production: 82442 },
  { year: 2020, production: 92379 },
  { year: 2021, production: 92983 },
  { year: 2022, production: 95991 },
  { year: 2023, production: 116559 },
];

export default function MandarinProductionTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={productionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}`} />
        <YAxis tick={{ fontSize: 12 }} domain={[0, 120000]} tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`} />
        <Tooltip
          formatter={(value: number) => [`${value.toLocaleString()}톤`, "생산량"]}
          labelFormatter={(label) => `${label}년`}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Line
          type="monotone"
          dataKey="production"
          stroke="#1e40af"
          strokeWidth={3}
          dot={{ fill: "#1e40af", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: "#1e40af", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
