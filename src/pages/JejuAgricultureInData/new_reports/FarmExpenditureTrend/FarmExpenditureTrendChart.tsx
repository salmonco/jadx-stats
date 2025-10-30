import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart } from "recharts";

// 농가 가계지출 데이터 (2003-2023, 백만원)
const expenditureData = [
  { year: 2003, jeju: 32, national: 23 },
  { year: 2004, jeju: 32, national: 24 },
  { year: 2005, jeju: 36, national: 26 },
  { year: 2006, jeju: 36, national: 28 },
  { year: 2007, jeju: 33, national: 28 },
  { year: 2008, jeju: 32, national: 27 },
  { year: 2009, jeju: 31, national: 27 },
  { year: 2010, jeju: 30, national: 27 },
  { year: 2011, jeju: 31, national: 28 },
  { year: 2012, jeju: 34, national: 27 },
  { year: 2013, jeju: 35, national: 30 },
  { year: 2014, jeju: 38, national: 30 },
  { year: 2015, jeju: 40, national: 30 },
  { year: 2016, jeju: 43, national: 30 },
  { year: 2017, jeju: 44, national: 30 },
  { year: 2018, jeju: 43, national: 33 },
  { year: 2019, jeju: 44, national: 35 },
  { year: 2020, jeju: 42, national: 34 },
  { year: 2021, jeju: 44, national: 35 },
  { year: 2022, jeju: 45, national: 35 },
  { year: 2023, jeju: 47, national: 37 },
];

export default function FarmExpenditureTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={expenditureData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} tickCount={8} domain={["dataMin", "dataMax"]} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 12 }} domain={[0, 50]} tickFormatter={(value) => `${value}백만원`} width={60} />
        <Tooltip
          formatter={(value, name) => [`${value}백만원`, name === "jeju" ? "제주" : "전국(제주제외)"]}
          labelFormatter={(label) => `${label}년`}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "13px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "13px", paddingTop: "10px" }} formatter={(value) => (value === "jeju" ? "제주" : "전국(제주제외)")} />
        <Line type="monotone" dataKey="jeju" stroke="#ef4444" name="jeju" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="national" stroke="#1e40af" name="national" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
