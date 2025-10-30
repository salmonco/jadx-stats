import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

// 자산 대비 부채 비율 데이터 (2003-2023)
const comparisonData = [
  { year: 2003, ratio: 13.72, nationalRatio: 13.03 },
  { year: 2004, ratio: 12.25, nationalRatio: 12.3 },
  { year: 2005, ratio: 11.51, nationalRatio: 10.78 },
  { year: 2006, ratio: 11.64, nationalRatio: 7.86 },
  { year: 2007, ratio: 11.38, nationalRatio: 7.63 },
  { year: 2008, ratio: 11.03, nationalRatio: 7.78 },
  { year: 2009, ratio: 9.53, nationalRatio: 7.48 },
  { year: 2010, ratio: 9.19, nationalRatio: 7.52 },
  { year: 2011, ratio: 7.02, nationalRatio: 7.0 },
  { year: 2012, ratio: 6.84, nationalRatio: 6.85 },
  { year: 2013, ratio: 11.01, nationalRatio: 6.8 },
  { year: 2014, ratio: 11.54, nationalRatio: 6.17 },
  { year: 2015, ratio: 11.38, nationalRatio: 5.58 },
  { year: 2016, ratio: 10.27, nationalRatio: 5.5 },
  { year: 2017, ratio: 9.16, nationalRatio: 5.11 },
  { year: 2018, ratio: 8.7, nationalRatio: 6.67 },
  { year: 2019, ratio: 8.15, nationalRatio: 6.58 },
  { year: 2020, ratio: 8.81, nationalRatio: 6.3 },
  { year: 2021, ratio: 9.94, nationalRatio: 5.83 },
  { year: 2022, ratio: 8.69, nationalRatio: 5.48 },
  { year: 2023, ratio: 9.82, nationalRatio: 6.31 },
];

export default function AssetLiabilityComparisonChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={comparisonData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 14 }} tickCount={10} domain={["dataMin", "dataMax"]} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 14 }} domain={[0, 16]} tickFormatter={(value) => `${value}%`} />
        <Tooltip
          formatter={(value, name) => {
            const labels = {
              ratio: "부채비율(제주)",
              nationalRatio: "부채비율(전국)",
            };
            return [`${value}%`, labels[name] || name];
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
        <Line type="monotone" dataKey="ratio" name="부채비율(제주)" stroke="#4478c8" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="nationalRatio" name="부채비율(전국)" stroke="#f97316" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
