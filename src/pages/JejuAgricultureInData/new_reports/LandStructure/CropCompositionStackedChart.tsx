import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 작물별 재배면적 구성 데이터 (2008-2023)
const cropCompositionData = [
  {
    year: 2008,
    rice: 945,
    barley: 2702,
    potato: 6597,
    grain: 1286,
    vegetable: 2755,
    fruit: 22183,
    special: 2785,
    other: 865,
    waterSource: 3337,
    etc: 212,
  },
  {
    year: 2009,
    rice: 1333,
    barley: 3016,
    potato: 8028,
    grain: 1419,
    vegetable: 2553,
    fruit: 22325,
    special: 2989,
    other: 1166,
    waterSource: 3357,
    etc: 262,
  },
  {
    year: 2010,
    rice: 1119,
    barley: 2398,
    potato: 6933,
    grain: 2672,
    vegetable: 2892,
    fruit: 22230,
    special: 2516,
    other: 1318,
    waterSource: 5736,
    etc: 644,
  },
  {
    year: 2011,
    rice: 430,
    barley: 1390,
    potato: 6027,
    grain: 3534,
    vegetable: 2900,
    fruit: 22508,
    special: 1850,
    other: 1299,
    waterSource: 5374,
    etc: 669,
  },
  {
    year: 2012,
    rice: 522,
    barley: 770,
    potato: 6256,
    grain: 3615,
    vegetable: 2687,
    fruit: 22522,
    special: 1824,
    other: 1358,
    waterSource: 4536,
    etc: 461,
  },
  {
    year: 2013,
    rice: 302,
    barley: 1024,
    potato: 6084,
    grain: 4122,
    vegetable: 1979,
    fruit: 22534,
    special: 1605,
    other: 1202,
    waterSource: 5276,
    etc: 587,
  },
  {
    year: 2014,
    rice: 214,
    barley: 1223,
    potato: 6040,
    grain: 4211,
    vegetable: 1439,
    fruit: 22425,
    special: 1831,
    other: 1190,
    waterSource: 4539,
    etc: 551,
  },
  {
    year: 2015,
    rice: 128,
    barley: 2136,
    potato: 5107,
    grain: 4079,
    vegetable: 1205,
    fruit: 22342,
    special: 1141,
    other: 1144,
    waterSource: 4590,
    etc: 433,
  },
  {
    year: 2016,
    rice: 127,
    barley: 2451,
    potato: 5582,
    grain: 5284,
    vegetable: 1986,
    fruit: 22644,
    special: 1558,
    other: 1174,
    waterSource: 5781,
    etc: 0,
  },
  {
    year: 2017,
    rice: 113,
    barley: 2154,
    potato: 3592,
    grain: 4029,
    vegetable: 1727,
    fruit: 22540,
    special: 1487,
    other: 1215,
    waterSource: 4995,
    etc: 577,
  },
  {
    year: 2018,
    rice: 81,
    barley: 2166,
    potato: 3668,
    grain: 3869,
    vegetable: 2201,
    fruit: 22422,
    special: 1306,
    other: 1175,
    waterSource: 5228,
    etc: 1430,
  },
  {
    year: 2019,
    rice: 45,
    barley: 2562,
    potato: 4035,
    grain: 5230,
    vegetable: 1760,
    fruit: 22031,
    special: 865,
    other: 1111,
    waterSource: 5081,
    etc: 1399,
  },
  {
    year: 2020,
    rice: 43,
    barley: 2599,
    potato: 3725,
    grain: 5247,
    vegetable: 1633,
    fruit: 22075,
    special: 929,
    other: 1106,
    waterSource: 4220,
    etc: 1236,
  },
  {
    year: 2021,
    rice: 65,
    barley: 1999,
    potato: 4754,
    grain: 5313,
    vegetable: 1858,
    fruit: 22745,
    special: 1037,
    other: 1301,
    waterSource: 4210,
    etc: 2268,
  },
  {
    year: 2022,
    rice: 70,
    barley: 1967,
    potato: 4940,
    grain: 6069,
    vegetable: 1856,
    fruit: 22903,
    special: 986,
    other: 1186,
    waterSource: 3851,
    etc: 1962,
  },
  {
    year: 2023,
    rice: 5,
    barley: 1750,
    potato: 5270,
    grain: 4849,
    vegetable: 1286,
    fruit: 22890,
    special: 1029,
    other: 1236,
    waterSource: 4189,
    etc: 3310,
  },
];

export default function CropCompositionStackedChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={cropCompositionData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }} stackOffset="expand" barSize={30}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="#e2e8f0" />
        <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#475569" }} interval={0} axisLine={{ stroke: "#cbd5e1" }} tickLine={{ stroke: "#cbd5e1" }} />
        <YAxis
          tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
          tick={{ fontSize: 12, fill: "#475569" }}
          domain={[0, 1]}
          axisLine={{ stroke: "#cbd5e1" }}
          tickLine={{ stroke: "#cbd5e1" }}
        />
        <Tooltip
          formatter={(value: number, name) => {
            const percentage = (value * 100).toFixed(1);
            const labels = {
              rice: "벼",
              barley: "맥류",
              potato: "서류",
              grain: "잡곡",
              vegetable: "채소",
              fruit: "과수",
              special: "특용작물",
              other: "기타수원지",
              waterSource: "기타작물",
              etc: "유휴경지",
            };
            return [`${percentage}%`, labels[name] || name];
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
        />
        <Legend
          wrapperStyle={{ paddingTop: "15px", fontSize: "14px", color: "#475569" }}
          formatter={(value) => {
            const labels = {
              rice: "벼",
              barley: "맥류",
              potato: "서류",
              grain: "잡곡",
              vegetable: "채소",
              fruit: "과수",
              special: "특용작물",
              other: "기타수원지",
              waterSource: "기타작물",
              etc: "유휴경지",
            };
            return labels[value] || value;
          }}
        />
        <Bar dataKey="rice" stackId="a" fill="#1e40af" name="rice" />
        <Bar dataKey="barley" stackId="a" fill="#f97316" name="barley" />
        <Bar dataKey="potato" stackId="a" fill="#9ca3af" name="potato" />
        <Bar dataKey="grain" stackId="a" fill="#eab308" name="grain" />
        <Bar dataKey="vegetable" stackId="a" fill="#22c55e" name="vegetable" />
        <Bar dataKey="fruit" stackId="a" fill="#8b5cf6" name="fruit" />
        <Bar dataKey="special" stackId="a" fill="#06b6d4" name="special" />
        <Bar dataKey="other" stackId="a" fill="#84cc16" name="other" />
        <Bar dataKey="waterSource" stackId="a" fill="#f59e0b" name="waterSource" />
        <Bar dataKey="etc" stackId="a" fill="#6b7280" name="etc" />
      </BarChart>
    </ResponsiveContainer>
  );
}
