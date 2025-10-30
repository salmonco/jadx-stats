import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, ReferenceLine } from "recharts";

// 제주 논면적 데이터 (1975-2023)
const paddyFieldData = [
  { year: 1975, area: 1062 },
  { year: 1976, area: 1062 },
  { year: 1977, area: 1020 },
  { year: 1978, area: 974 },
  { year: 1979, area: 1003 },
  { year: 1980, area: 1004 },
  { year: 1981, area: 1204 },
  { year: 1982, area: 1164 },
  { year: 1983, area: 1073 },
  { year: 1984, area: 1071 },
  { year: 1985, area: 1038 },
  { year: 1986, area: 1004 },
  { year: 1987, area: 982 },
  { year: 1988, area: 983 },
  { year: 1989, area: 886 },
  { year: 1990, area: 886 },
  { year: 1991, area: 788 },
  { year: 1992, area: 474 },
  { year: 1993, area: 234 },
  { year: 1994, area: 209 },
  { year: 1995, area: 206 },
  { year: 1996, area: 205 },
  { year: 1997, area: 205 },
  { year: 1998, area: 205 },
  { year: 1999, area: 195 },
  { year: 2000, area: 195 },
  { year: 2001, area: 194 },
  { year: 2002, area: 194 },
  { year: 2003, area: 194 },
  { year: 2004, area: 171 },
  { year: 2005, area: 171 },
  { year: 2006, area: 101 },
  { year: 2007, area: 101 },
  { year: 2008, area: 84 },
  { year: 2009, area: 58 },
  { year: 2010, area: 33 },
  { year: 2011, area: 33 },
  { year: 2012, area: 33 },
  { year: 2013, area: 32 },
  { year: 2014, area: 19 },
  { year: 2015, area: 18 },
  { year: 2016, area: 17 },
  { year: 2017, area: 17 },
  { year: 2018, area: 17 },
  { year: 2019, area: 17 },
  { year: 2020, area: 17 },
  { year: 2021, area: 14 },
  { year: 2022, area: 12 },
  { year: 2023, area: 12 },
];

export default function PaddyFieldDeclineChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={paddyFieldData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 14 }} tickCount={10} domain={["dataMin", "dataMax"]} interval="preserveStartEnd" />
        <YAxis
          tick={{ fontSize: 14 }}
          domain={[0, 1300]}
          tickFormatter={(value) => `${value}`}
          label={{ value: "논 면적 (ha)", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }}
        />
        <Tooltip
          formatter={(value) => [`${value.toLocaleString()} ha`, "논 면적"]}
          labelFormatter={(label) => `${label}년`}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #f0f0f0",
            borderRadius: "4px",
            padding: "10px",
          }}
        />
        <Legend formatter={(value) => <span style={{ fontSize: 14 }}>{value}</span>} />
        <ReferenceLine y={1062} stroke="#ff0000" strokeDasharray="3 3" label={{ value: "1975년 기준 (1,062ha)", position: "top", fill: "#ff0000", fontSize: 11 }} />
        <Line type="monotone" dataKey="area" stroke="#4478c8" name="논 면적" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
