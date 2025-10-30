import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";

// 제주 경지면적 데이터 (1975-2023)
const landAreaData = [
  { year: 1975, total: 49499, paddy: 1062, field: 48436 },
  { year: 1976, total: 49919, paddy: 1062, field: 48856 },
  { year: 1977, total: 50101, paddy: 1020, field: 49081 },
  { year: 1978, total: 49981, paddy: 974, field: 49008 },
  { year: 1979, total: 50111, paddy: 1003, field: 49107 },
  { year: 1980, total: 50117, paddy: 1004, field: 49113 },
  { year: 1981, total: 50064, paddy: 1204, field: 48860 },
  { year: 1982, total: 49924, paddy: 1164, field: 48760 },
  { year: 1983, total: 49657, paddy: 1073, field: 48584 },
  { year: 1984, total: 49553, paddy: 1071, field: 48482 },
  { year: 1985, total: 51028, paddy: 1038, field: 49990 },
  { year: 1986, total: 54365, paddy: 1004, field: 53361 },
  { year: 1987, total: 54523, paddy: 982, field: 53541 },
  { year: 1988, total: 54757, paddy: 983, field: 53774 },
  { year: 1989, total: 54814, paddy: 886, field: 53928 },
  { year: 1990, total: 54788, paddy: 886, field: 53902 },
  { year: 1991, total: 54450, paddy: 788, field: 53662 },
  { year: 1992, total: 54197, paddy: 474, field: 53723 },
  { year: 1993, total: 54255, paddy: 234, field: 54021 },
  { year: 1994, total: 56803, paddy: 209, field: 56594 },
  { year: 1995, total: 56829, paddy: 206, field: 56623 },
  { year: 1996, total: 56315, paddy: 205, field: 56110 },
  { year: 1997, total: 56517, paddy: 205, field: 56312 },
  { year: 1998, total: 56812, paddy: 205, field: 56607 },
  { year: 1999, total: 58707, paddy: 195, field: 58512 },
  { year: 2000, total: 59207, paddy: 195, field: 59012 },
  { year: 2001, total: 58965, paddy: 194, field: 58771 },
  { year: 2002, total: 59167, paddy: 194, field: 58973 },
  { year: 2003, total: 58503, paddy: 194, field: 58309 },
  { year: 2004, total: 58951, paddy: 171, field: 58780 },
  { year: 2005, total: 58442, paddy: 171, field: 58271 },
  { year: 2006, total: 57867, paddy: 101, field: 57766 },
  { year: 2007, total: 57204, paddy: 101, field: 57103 },
  { year: 2008, total: 56693, paddy: 84, field: 56609 },
  { year: 2009, total: 59485, paddy: 58, field: 59427 },
  { year: 2010, total: 59255, paddy: 33, field: 59222 },
  { year: 2011, total: 59030, paddy: 33, field: 58997 },
  { year: 2012, total: 61377, paddy: 33, field: 61344 },
  { year: 2013, total: 62856, paddy: 32, field: 62823 },
  { year: 2014, total: 62686, paddy: 19, field: 62667 },
  { year: 2015, total: 62642, paddy: 18, field: 62624 },
  { year: 2016, total: 62140, paddy: 17, field: 62123 },
  { year: 2017, total: 61088, paddy: 17, field: 61071 },
  { year: 2018, total: 59338, paddy: 17, field: 59321 },
  { year: 2019, total: 59039, paddy: 17, field: 59022 },
  { year: 2020, total: 58654, paddy: 17, field: 58637 },
  { year: 2021, total: 56355, paddy: 14, field: 56341 },
  { year: 2022, total: 55957, paddy: 12, field: 55945 },
  { year: 2023, total: 55605, paddy: 12, field: 55593 },
];

export default function LandAreaTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={landAreaData} margin={{ top: 10, right: 30, left: 15, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 14 }} tickCount={10} domain={["dataMin", "dataMax"]} interval="preserveStartEnd" />
        <YAxis
          yAxisId="left"
          orientation="left"
          tick={{ fontSize: 14 }}
          domain={[0, 1400]}
          tickFormatter={(value) => `${value}`}
          label={{ value: "논 면적 (ha)", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 14 }}
          domain={[40000, 65000]}
          tickFormatter={(value) => `${value}`}
          label={{ value: "밭 면적 (ha)", angle: 90, position: "insideRight", style: { textAnchor: "middle" } }}
        />
        <Tooltip
          formatter={(value, name) => {
            const labels = {
              paddy: "논 면적",
              field: "밭 면적",
              total: "총 경지면적",
            };
            return [`${value.toLocaleString()} ha`, labels[name] || name];
          }}
          labelFormatter={(label) => `${label}년`}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #f0f0f0",
            borderRadius: "4px",
            padding: "10px",
          }}
        />
        <Legend formatter={(value) => <span style={{ fontSize: 14 }}>{value}</span>} />
        <Line type="monotone" dataKey="paddy" yAxisId="left" stroke="#4478c8" name="논 면적" strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="field" yAxisId="right" stroke="#f97316" name="밭 면적" strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 5 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
