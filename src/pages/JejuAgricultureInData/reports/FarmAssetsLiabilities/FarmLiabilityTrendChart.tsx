import { Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";

// 농가 부채 데이터 (2003-2023, 단위: 천원)
const liabilityData = [
  {
    year: 2003,
    agricultural: 26413,
    household: 12540,
    other: 5041,
    totalLiability: 43994,
    nationalAvg: 26297,
  },
  {
    year: 2004,
    agricultural: 26811,
    household: 13587,
    other: 4834,
    totalLiability: 45232,
    nationalAvg: 26913,
  },
  {
    year: 2005,
    agricultural: 28137,
    household: 14827,
    other: 4808,
    totalLiability: 47772,
    nationalAvg: 27183,
  },
  {
    year: 2006,
    agricultural: 27835,
    household: 13714,
    other: 6780,
    totalLiability: 48329,
    nationalAvg: 27704,
  },
  {
    year: 2007,
    agricultural: 33040,
    household: 12362,
    other: 6231,
    totalLiability: 51633,
    nationalAvg: 29711,
  },
  {
    year: 2008,
    agricultural: 28207,
    household: 11493,
    other: 3859,
    totalLiability: 43559,
    nationalAvg: 25709,
  },
  {
    year: 2009,
    agricultural: 23659,
    household: 12861,
    other: 3652,
    totalLiability: 40172,
    nationalAvg: 25887,
  },
  {
    year: 2010,
    agricultural: 22883,
    household: 13772,
    other: 3883,
    totalLiability: 40538,
    nationalAvg: 26995,
  },
  {
    year: 2011,
    agricultural: 20813,
    household: 8708,
    other: 2521,
    totalLiability: 32042,
    nationalAvg: 26037,
  },
  {
    year: 2012,
    agricultural: 23876,
    household: 9895,
    other: 1822,
    totalLiability: 35593,
    nationalAvg: 26683,
  },
  {
    year: 2013,
    agricultural: 33154,
    household: 8600,
    other: 3469,
    totalLiability: 45223,
    nationalAvg: 25642,
  },
  {
    year: 2014,
    agricultural: 39595,
    household: 13138,
    other: 1822,
    totalLiability: 54555,
    nationalAvg: 25114,
  },
  {
    year: 2015,
    agricultural: 42223,
    household: 15884,
    other: 3747,
    totalLiability: 61854,
    nationalAvg: 23437,
  },
  {
    year: 2016,
    agricultural: 40202,
    household: 20580,
    other: 3182,
    totalLiability: 63964,
    nationalAvg: 24451,
  },
  {
    year: 2017,
    agricultural: 37399,
    household: 25196,
    other: 2644,
    totalLiability: 65239,
    nationalAvg: 23742,
  },
  {
    year: 2018,
    agricultural: 34955,
    household: 21255,
    other: 18375,
    totalLiability: 74585,
    nationalAvg: 30996,
  },
  {
    year: 2019,
    agricultural: 39783,
    household: 21252,
    other: 14092,
    totalLiability: 75127,
    nationalAvg: 32685,
  },
  {
    year: 2020,
    agricultural: 44604,
    household: 22134,
    other: 16828,
    totalLiability: 83566,
    nationalAvg: 32363,
  },
  {
    year: 2021,
    agricultural: 45941,
    household: 27818,
    other: 26237,
    totalLiability: 99996,
    nationalAvg: 31467,
  },
  {
    year: 2022,
    agricultural: 46790,
    household: 24469,
    other: 20396,
    totalLiability: 91655,
    nationalAvg: 30733,
  },
  {
    year: 2023,
    agricultural: 64833,
    household: 17789,
    other: 11854,
    totalLiability: 94476,
    nationalAvg: 35785,
  },
];

export default function FarmLiabilityTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={liabilityData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 14 }} tickCount={10} domain={["dataMin", "dataMax"]} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 14 }} domain={[0, 120000]} tickFormatter={(value) => `${value / 1000}백만`} />
        <Tooltip
          formatter={(value, name) => {
            const labels = {
              agricultural: "농업용",
              household: "가계용",
              other: "기타 및 겸업용",
              totalLiability: "부채(제주)",
              nationalAvg: "전국평균(제주제외)",
            };
            return [`${value.toLocaleString()} 천원`, labels[name] || name];
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
        <Bar dataKey="agricultural" name="농업용" stackId="a" fill="#4478c8" />
        <Bar dataKey="household" name="가계용" stackId="a" fill="#f97316" />
        <Bar dataKey="other" name="기타 및 겸업용" stackId="a" fill="#9ca3af" />
        <Line type="monotone" dataKey="totalLiability" name="부채(제주)" stroke="#1e3a8a" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="nationalAvg" name="전국평균(제주제외)" stroke="#22c55e" strokeWidth={2} dot={{ r: 2 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
