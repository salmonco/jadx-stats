import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart } from "recharts";

// 농가부채 변화 데이터 (2003-2023, 백만원)
const debtData = [
  { year: 2003, jeju: 44, national: 26 },
  { year: 2004, jeju: 45, national: 27 },
  { year: 2005, jeju: 48, national: 27 },
  { year: 2006, jeju: 48, national: 28 },
  { year: 2007, jeju: 52, national: 30 },
  { year: 2008, jeju: 44, national: 26 },
  { year: 2009, jeju: 40, national: 26 },
  { year: 2010, jeju: 41, national: 27 },
  { year: 2011, jeju: 32, national: 26 },
  { year: 2012, jeju: 36, national: 27 },
  { year: 2013, jeju: 45, national: 26 },
  { year: 2014, jeju: 55, national: 25 },
  { year: 2015, jeju: 62, national: 23 },
  { year: 2016, jeju: 64, national: 24 },
  { year: 2017, jeju: 65, national: 24 },
  { year: 2018, jeju: 75, national: 31 },
  { year: 2019, jeju: 75, national: 33 },
  { year: 2020, jeju: 84, national: 32 },
  { year: 2021, jeju: 100, national: 31 },
  { year: 2022, jeju: 92, national: 31 },
  { year: 2023, jeju: 94, national: 36 },
];

export default function FarmDebtTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={debtData} margin={{ top: 20, right: 30, left: 40, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="#e2e8f0" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 12, fill: "#475569" }}
          tickCount={8}
          domain={["dataMin", "dataMax"]}
          interval="preserveStartEnd"
          axisLine={{ stroke: "#cbd5e1" }}
          tickLine={{ stroke: "#cbd5e1" }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#475569" }}
          domain={[0, 120]}
          tickFormatter={(value) => `${value}백만원`}
          width={80}
          axisLine={{ stroke: "#cbd5e1" }}
          tickLine={{ stroke: "#cbd5e1" }}
        />
        <Tooltip
          formatter={(value, name) => [`${value}백만원`, name === "jeju" ? "제주" : "전국(제주제외)"]}
          labelFormatter={(label) => `${label}년`}
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "13px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
          cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }}
        />
        <Legend wrapperStyle={{ fontSize: "13px", paddingTop: "15px", color: "#475569" }} formatter={(value) => (value === "jeju" ? "제주" : "전국(제주제외)")} />
        <Line
          type="monotone"
          dataKey="jeju"
          stroke="#ef4444"
          strokeWidth={3}
          name="jeju"
          dot={{ r: 4, fill: "#ef4444", strokeWidth: 2, stroke: "#ffffff" }}
          activeDot={{ r: 6, fill: "#ef4444", strokeWidth: 2, stroke: "#ffffff" }}
        />
        <Line
          type="monotone"
          dataKey="national"
          stroke="#1e40af"
          strokeWidth={2}
          name="national"
          dot={{ r: 3, fill: "#1e40af", strokeWidth: 2, stroke: "#ffffff" }}
          activeDot={{ r: 5, fill: "#1e40af", strokeWidth: 2, stroke: "#ffffff" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
