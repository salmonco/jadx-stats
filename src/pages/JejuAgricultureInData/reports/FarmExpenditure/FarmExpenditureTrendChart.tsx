import { Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";

// 농가 지출 데이터 (2003-2023, 단위: 천원)
const expenditureData = [
  {
    year: 2003,
    consumption: 24155,
    nonConsumption: 8060,
    totalExpenditure: 32216,
    nationalAvg: 23489,
  },
  {
    year: 2004,
    consumption: 24377,
    nonConsumption: 7742,
    totalExpenditure: 32119,
    nationalAvg: 24178,
  },
  {
    year: 2005,
    consumption: 26726,
    nonConsumption: 9358,
    totalExpenditure: 36084,
    nationalAvg: 25998,
  },
  {
    year: 2006,
    consumption: 26455,
    nonConsumption: 10004,
    totalExpenditure: 36459,
    nationalAvg: 27703,
  },
  {
    year: 2007,
    consumption: 25646,
    nonConsumption: 7105,
    totalExpenditure: 32752,
    nationalAvg: 27727,
  },
  {
    year: 2008,
    consumption: 24559,
    nonConsumption: 7152,
    totalExpenditure: 31711,
    nationalAvg: 26755,
  },
  {
    year: 2009,
    consumption: 22458,
    nonConsumption: 8340,
    totalExpenditure: 30798,
    nationalAvg: 26533,
  },
  {
    year: 2010,
    consumption: 22710,
    nonConsumption: 7489,
    totalExpenditure: 30199,
    nationalAvg: 27487,
  },
  {
    year: 2011,
    consumption: 24407,
    nonConsumption: 6643,
    totalExpenditure: 31050,
    nationalAvg: 27751,
  },
  {
    year: 2012,
    consumption: 26195,
    nonConsumption: 7366,
    totalExpenditure: 33561,
    nationalAvg: 27157,
  },
  {
    year: 2013,
    consumption: 27633,
    nonConsumption: 7608,
    totalExpenditure: 35241,
    nationalAvg: 29570,
  },
  {
    year: 2014,
    consumption: 29734,
    nonConsumption: 8321,
    totalExpenditure: 38056,
    nationalAvg: 29658,
  },
  {
    year: 2015,
    consumption: 30800,
    nonConsumption: 9526,
    totalExpenditure: 40326,
    nationalAvg: 29753,
  },
  {
    year: 2016,
    consumption: 33509,
    nonConsumption: 9449,
    totalExpenditure: 42958,
    nationalAvg: 30185,
  },
  {
    year: 2017,
    consumption: 34148,
    nonConsumption: 9797,
    totalExpenditure: 43945,
    nationalAvg: 29871,
  },
  {
    year: 2018,
    consumption: 30969,
    nonConsumption: 12176,
    totalExpenditure: 43145,
    nationalAvg: 32953,
  },
  {
    year: 2019,
    consumption: 32138,
    nonConsumption: 11847,
    totalExpenditure: 43985,
    nationalAvg: 34592,
  },
  {
    year: 2020,
    consumption: 30872,
    nonConsumption: 11559,
    totalExpenditure: 42431,
    nationalAvg: 33543,
  },
  {
    year: 2021,
    consumption: 32748,
    nonConsumption: 11353,
    totalExpenditure: 44101,
    nationalAvg: 34592,
  },
  {
    year: 2022,
    consumption: 32862,
    nonConsumption: 12405,
    totalExpenditure: 45268,
    nationalAvg: 34733,
  },
  {
    year: 2023,
    consumption: 35825,
    nonConsumption: 11501,
    totalExpenditure: 47327,
    nationalAvg: 37311,
  },
];

export default function FarmExpenditureTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={expenditureData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 14 }} tickCount={10} domain={["dataMin", "dataMax"]} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 14 }} domain={[0, 50000]} tickFormatter={(value) => `${value.toLocaleString()}`} />
        <Tooltip
          formatter={(value, name) => {
            const labels = {
              consumption: "소비지출",
              nonConsumption: "비소비지출",
              totalExpenditure: "가계지출(제주)",
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
        <Bar dataKey="consumption" name="소비지출" stackId="a" fill="#f97316" />
        <Bar dataKey="nonConsumption" name="비소비지출" stackId="a" fill="#9ca3af" />
        <Line type="monotone" dataKey="totalExpenditure" name="가계지출(제주)" stroke="#4478c8" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="nationalAvg" name="전국평균(제주제외)" stroke="#eab308" strokeWidth={2} dot={{ r: 2 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
