import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart } from "recharts";

// 제주 경지면적 변화 데이터 (1975-2023)
const landAreaData = [
  { year: 1975, paddy: 1062, field: 48436, total: 49499 },
  { year: 1976, paddy: 1062, field: 48856, total: 49919 },
  { year: 1977, paddy: 1020, field: 49081, total: 50101 },
  { year: 1978, paddy: 974, field: 49008, total: 49981 },
  { year: 1979, paddy: 1003, field: 49107, total: 50111 },
  { year: 1980, paddy: 1004, field: 49113, total: 50117 },
  { year: 1981, paddy: 1204, field: 48860, total: 50064 },
  { year: 1982, paddy: 1164, field: 48760, total: 49924 },
  { year: 1983, paddy: 1073, field: 48584, total: 49657 },
  { year: 1984, paddy: 1071, field: 48482, total: 49553 },
  { year: 1985, paddy: 1038, field: 49990, total: 51028 },
  { year: 1986, paddy: 1004, field: 53361, total: 54365 },
  { year: 1987, paddy: 982, field: 53541, total: 54523 },
  { year: 1988, paddy: 983, field: 53774, total: 54757 },
  { year: 1989, paddy: 886, field: 53928, total: 54814 },
  { year: 1990, paddy: 886, field: 53902, total: 54788 },
  { year: 1991, paddy: 788, field: 53662, total: 54450 },
  { year: 1992, paddy: 474, field: 53723, total: 54197 },
  { year: 1993, paddy: 234, field: 54021, total: 54255 },
  { year: 1994, paddy: 209, field: 56594, total: 56803 },
  { year: 1995, paddy: 206, field: 56623, total: 56829 },
  { year: 1996, paddy: 205, field: 56110, total: 56315 },
  { year: 1997, paddy: 205, field: 56312, total: 56517 },
  { year: 1998, paddy: 205, field: 56607, total: 56812 },
  { year: 1999, paddy: 195, field: 58512, total: 58707 },
  { year: 2000, paddy: 195, field: 59012, total: 59207 },
  { year: 2001, paddy: 194, field: 58771, total: 58965 },
  { year: 2002, paddy: 194, field: 58973, total: 59167 },
  { year: 2003, paddy: 194, field: 58309, total: 58503 },
  { year: 2004, paddy: 171, field: 58780, total: 58951 },
  { year: 2005, paddy: 171, field: 58271, total: 58442 },
  { year: 2006, paddy: 101, field: 57766, total: 57867 },
  { year: 2007, paddy: 101, field: 57103, total: 57204 },
  { year: 2008, paddy: 84, field: 56609, total: 56693 },
  { year: 2009, paddy: 58, field: 59427, total: 59485 },
  { year: 2010, paddy: 33, field: 59222, total: 59255 },
  { year: 2011, paddy: 33, field: 58997, total: 59030 },
  { year: 2012, paddy: 33, field: 61344, total: 61377 },
  { year: 2013, paddy: 32, field: 62823, total: 62856 },
  { year: 2014, paddy: 19, field: 62667, total: 62686 },
  { year: 2015, paddy: 18, field: 62624, total: 62642 },
  { year: 2016, paddy: 17, field: 62123, total: 62140 },
  { year: 2017, paddy: 17, field: 61071, total: 61088 },
  { year: 2018, paddy: 17, field: 59321, total: 59338 },
  { year: 2019, paddy: 17, field: 59022, total: 59039 },
  { year: 2020, paddy: 17, field: 58637, total: 58654 },
  { year: 2021, paddy: 14, field: 56341, total: 56355 },
  { year: 2022, paddy: 12, field: 55945, total: 55957 },
  { year: 2023, paddy: 12, field: 55593, total: 55605 },
];

export default function LandAreaChangeChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={landAreaData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="#e2e8f0" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 12, fill: "#475569" }}
          tickCount={10}
          domain={["dataMin", "dataMax"]}
          interval="preserveStartEnd"
          axisLine={{ stroke: "#cbd5e1" }}
          tickLine={{ stroke: "#cbd5e1" }}
        />
        <YAxis
          yAxisId="left"
          orientation="left"
          tick={{ fontSize: 12, fill: "#475569" }}
          domain={[0, 1400]}
          tickFormatter={(value) => `${value}`}
          axisLine={{ stroke: "#cbd5e1" }}
          tickLine={{ stroke: "#cbd5e1" }}
          label={{ value: "논 면적 (ha)", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 12, fill: "#475569" }}
          domain={[40000, 65000]}
          tickFormatter={(value) => `${value}`}
          axisLine={{ stroke: "#cbd5e1" }}
          tickLine={{ stroke: "#cbd5e1" }}
          label={{ value: "밭 면적 (ha)", angle: 90, position: "insideRight", style: { textAnchor: "middle" } }}
        />
        <Tooltip
          formatter={(value, name) => {
            const labels = {
              paddy: "논 면적",
              field: "밭 면적",
            };
            return [`${value.toLocaleString()} ha`, labels[name] || name];
          }}
          labelFormatter={(label) => `${label}년`}
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "14px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
          cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }}
        />
        <Legend
          wrapperStyle={{ fontSize: "14px", paddingTop: "15px", color: "#475569" }}
          formatter={(value) => {
            const labels = {
              paddy: "논",
              field: "밭",
            };
            return labels[value] || value;
          }}
        />
        <Line
          type="monotone"
          dataKey="paddy"
          yAxisId="left"
          stroke="#1e40af"
          strokeWidth={3}
          name="paddy"
          dot={{ r: 3, fill: "#1e40af", strokeWidth: 2, stroke: "#ffffff" }}
          activeDot={{ r: 5, fill: "#1e40af", strokeWidth: 2, stroke: "#ffffff" }}
        />
        <Line
          type="monotone"
          dataKey="field"
          yAxisId="right"
          stroke="#ef4444"
          strokeWidth={3}
          name="field"
          dot={{ r: 3, fill: "#ef4444", strokeWidth: 2, stroke: "#ffffff" }}
          activeDot={{ r: 5, fill: "#ef4444", strokeWidth: 2, stroke: "#ffffff" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
