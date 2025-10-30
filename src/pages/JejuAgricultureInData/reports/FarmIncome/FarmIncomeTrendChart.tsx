import { Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";

// 농가 소득 데이터 (2003-2023, 단위: 천원)
const incomeData = [
  {
    year: 2003,
    farmIncome: 8340,
    nonFarmIncome: 16506,
    transferIncome: 3675,
    nonRegularIncome: 2328,
    totalIncome: 30849,
    nationalAvg: 27121,
  },
  {
    year: 2004,
    farmIncome: 11362,
    nonFarmIncome: 16401,
    transferIncome: 5246,
    nonRegularIncome: 5995,
    totalIncome: 39004,
    nationalAvg: 28769,
  },
  {
    year: 2005,
    farmIncome: 16238,
    nonFarmIncome: 18495,
    transferIncome: 3246,
    nonRegularIncome: 6840,
    totalIncome: 44819,
    nationalAvg: 29770,
  },
  {
    year: 2006,
    farmIncome: 14897,
    nonFarmIncome: 18057,
    transferIncome: 2836,
    nonRegularIncome: 6259,
    totalIncome: 42049,
    nationalAvg: 31746,
  },
  {
    year: 2007,
    farmIncome: 14847,
    nonFarmIncome: 16351,
    transferIncome: 4957,
    nonRegularIncome: 5034,
    totalIncome: 41189,
    nationalAvg: 31723,
  },
  {
    year: 2008,
    farmIncome: 15287,
    nonFarmIncome: 15968,
    transferIncome: 2861,
    nonRegularIncome: 3556,
    totalIncome: 37672,
    nationalAvg: 30458,
  },
  {
    year: 2009,
    farmIncome: 10427,
    nonFarmIncome: 15178,
    transferIncome: 6519,
    nonRegularIncome: 2913,
    totalIncome: 35037,
    nationalAvg: 31057,
  },
  {
    year: 2010,
    farmIncome: 17367,
    nonFarmIncome: 15286,
    transferIncome: 5113,
    nonRegularIncome: 3323,
    totalIncome: 41089,
    nationalAvg: 31796,
  },
  {
    year: 2011,
    farmIncome: 11246,
    nonFarmIncome: 15299,
    transferIncome: 5711,
    nonRegularIncome: 4119,
    totalIncome: 36375,
    nationalAvg: 30189,
  },
  {
    year: 2012,
    farmIncome: 12005,
    nonFarmIncome: 16541,
    transferIncome: 6600,
    nonRegularIncome: 4021,
    totalIncome: 39167,
    nationalAvg: 30497,
  },
  {
    year: 2013,
    farmIncome: 10037,
    nonFarmIncome: 22478,
    transferIncome: 6593,
    nonRegularIncome: 2532,
    totalIncome: 41640,
    nationalAvg: 33961,
  },
  {
    year: 2014,
    farmIncome: 9051,
    nonFarmIncome: 22737,
    transferIncome: 7701,
    nonRegularIncome: 3211,
    totalIncome: 42700,
    nationalAvg: 34302,
  },
  {
    year: 2015,
    farmIncome: 7712,
    nonFarmIncome: 24354,
    transferIncome: 7701,
    nonRegularIncome: 4044,
    totalIncome: 43811,
    nationalAvg: 36920,
  },
  {
    year: 2016,
    farmIncome: 8198,
    nonFarmIncome: 26962,
    transferIncome: 5964,
    nonRegularIncome: 4718,
    totalIncome: 45842,
    nationalAvg: 36918,
  },
  {
    year: 2017,
    farmIncome: 11902,
    nonFarmIncome: 26760,
    transferIncome: 7651,
    nonRegularIncome: 6609,
    totalIncome: 52922,
    nationalAvg: 37722,
  },
  {
    year: 2018,
    farmIncome: 15919,
    nonFarmIncome: 21208,
    transferIncome: 8437,
    nonRegularIncome: 3066,
    totalIncome: 48630,
    nationalAvg: 41587,
  },
  {
    year: 2019,
    farmIncome: 15277,
    nonFarmIncome: 21380,
    transferIncome: 9306,
    nonRegularIncome: 3000,
    totalIncome: 48963,
    nationalAvg: 40943,
  },
  {
    year: 2020,
    farmIncome: 12086,
    nonFarmIncome: 19737,
    transferIncome: 14564,
    nonRegularIncome: 2736,
    totalIncome: 49123,
    nationalAvg: 44791,
  },
  {
    year: 2021,
    farmIncome: 11391,
    nonFarmIncome: 20498,
    transferIncome: 14550,
    nonRegularIncome: 1361,
    totalIncome: 47800,
    nationalAvg: 47800,
  },
  {
    year: 2022,
    farmIncome: 15413,
    nonFarmIncome: 21230,
    transferIncome: 14550,
    nonRegularIncome: 7047,
    totalIncome: 58240,
    nationalAvg: 45664,
  },
  {
    year: 2023,
    farmIncome: 15231,
    nonFarmIncome: 26271,
    transferIncome: 15231,
    nonRegularIncome: 3798,
    totalIncome: 60531,
    nationalAvg: 50644,
  },
];

export default function FarmIncomeTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={incomeData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 14 }} tickCount={10} domain={["dataMin", "dataMax"]} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 14 }} domain={[0, 70000]} tickFormatter={(value) => `${value.toLocaleString()}`} />
        <Tooltip
          formatter={(value, name) => {
            const labels = {
              farmIncome: "농업소득",
              nonFarmIncome: "농외소득",
              transferIncome: "이전소득",
              nonRegularIncome: "비경상소득",
              totalIncome: "농가소득(제주)",
              nationalAvg: "전국농가소득(제주제외)",
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
        <Bar dataKey="farmIncome" name="농업소득" stackId="a" fill="#4478c8" />
        <Bar dataKey="nonFarmIncome" name="농외소득" stackId="a" fill="#f97316" />
        <Bar dataKey="transferIncome" name="이전소득" stackId="a" fill="#9ca3af" />
        <Bar dataKey="nonRegularIncome" name="비경상소득" stackId="a" fill="#eab308" />
        <Line type="monotone" dataKey="totalIncome" name="농가소득(제주)" stroke="#1e3a8a" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="nationalAvg" name="전국농가소득(제주제외)" stroke="#22c55e" strokeWidth={2} dot={{ r: 2 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
