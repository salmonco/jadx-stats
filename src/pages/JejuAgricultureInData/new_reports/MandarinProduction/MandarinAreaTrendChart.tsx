import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const areaData = [
  { year: 1997, area: 540 },
  { year: 1998, area: 611 },
  { year: 1999, area: 651 },
  { year: 2000, area: 665 },
  { year: 2001, area: 859 },
  { year: 2002, area: 975 },
  { year: 2003, area: 1060 },
  { year: 2004, area: 1464 },
  { year: 2005, area: 1470 },
  { year: 2006, area: 1494 },
  { year: 2007, area: 1506 },
  { year: 2008, area: 1532 },
  { year: 2009, area: 1573 },
  { year: 2010, area: 1701 },
  { year: 2011, area: 1777 },
  { year: 2012, area: 1870 },
  { year: 2013, area: 1927 },
  { year: 2014, area: 2034 },
  { year: 2015, area: 2112 },
  { year: 2016, area: 2261 },
  { year: 2017, area: 3932 },
  { year: 2018, area: 3936 },
  { year: 2019, area: 3973 },
  { year: 2020, area: 3980 },
  { year: 2021, area: 4082 },
  { year: 2022, area: 4162 },
  { year: 2023, area: 4172 },
];

export default function MandarinAreaTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={areaData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}`} />
        <YAxis tick={{ fontSize: 12 }} domain={[0, 4500]} tickFormatter={(value) => `${(value / 1000).toFixed(1)}천`} />
        <Tooltip
          formatter={(value: number) => [`${value.toLocaleString()}ha`, "재배면적"]}
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
          dataKey="area"
          stroke="#dc2626"
          strokeWidth={3}
          dot={{ fill: "#dc2626", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: "#dc2626", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
