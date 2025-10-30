import { Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";

// 농가 자산 데이터 (2003-2023, 단위: 천원)
const assetData = [
  {
    year: 2003,
    fixedAsset: 268510,
    currentAsset: 52159,
    totalAsset: 320669,
    nationalAvg: 201848,
  },
  {
    year: 2004,
    fixedAsset: 303126,
    currentAsset: 65970,
    totalAsset: 369096,
    nationalAvg: 218837,
  },
  {
    year: 2005,
    fixedAsset: 324194,
    currentAsset: 90709,
    totalAsset: 414903,
    nationalAvg: 252101,
  },
  {
    year: 2006,
    fixedAsset: 321749,
    currentAsset: 93521,
    totalAsset: 415270,
    nationalAvg: 352431,
  },
  {
    year: 2007,
    fixedAsset: 344910,
    currentAsset: 109003,
    totalAsset: 453913,
    nationalAvg: 389634,
  },
  {
    year: 2008,
    fixedAsset: 331707,
    currentAsset: 63135,
    totalAsset: 394842,
    nationalAvg: 330544,
  },
  {
    year: 2009,
    fixedAsset: 348719,
    currentAsset: 72983,
    totalAsset: 421702,
    nationalAvg: 346237,
  },
  {
    year: 2010,
    fixedAsset: 347960,
    currentAsset: 92996,
    totalAsset: 440956,
    nationalAvg: 358742,
  },
  {
    year: 2011,
    fixedAsset: 356258,
    currentAsset: 100292,
    totalAsset: 456550,
    nationalAvg: 372496,
  },
  {
    year: 2012,
    fixedAsset: 398574,
    currentAsset: 121998,
    totalAsset: 520572,
    nationalAvg: 389780,
  },
  {
    year: 2013,
    fixedAsset: 311872,
    currentAsset: 98930,
    totalAsset: 410802,
    nationalAvg: 377910,
  },
  {
    year: 2014,
    fixedAsset: 353941,
    currentAsset: 118786,
    totalAsset: 472727,
    nationalAvg: 407104,
  },
  {
    year: 2015,
    fixedAsset: 388231,
    currentAsset: 155352,
    totalAsset: 543583,
    nationalAvg: 419972,
  },
  {
    year: 2016,
    fixedAsset: 455357,
    currentAsset: 167443,
    totalAsset: 622800,
    nationalAvg: 444307,
  },
  {
    year: 2017,
    fixedAsset: 540089,
    currentAsset: 172214,
    totalAsset: 712303,
    nationalAvg: 464185,
  },
  {
    year: 2018,
    fixedAsset: 767132,
    currentAsset: 90067,
    totalAsset: 857199,
    nationalAvg: 464983,
  },
  {
    year: 2019,
    fixedAsset: 828331,
    currentAsset: 93471,
    totalAsset: 921802,
    nationalAvg: 496622,
  },
  {
    year: 2020,
    fixedAsset: 849936,
    currentAsset: 98080,
    totalAsset: 948016,
    nationalAvg: 513710,
  },
  {
    year: 2021,
    fixedAsset: 895198,
    currentAsset: 110542,
    totalAsset: 1005740,
    nationalAvg: 539512,
  },
  {
    year: 2022,
    fixedAsset: 936005,
    currentAsset: 119104,
    totalAsset: 1055109,
    nationalAvg: 560613,
  },
  {
    year: 2023,
    fixedAsset: 844266,
    currentAsset: 117448,
    totalAsset: 961714,
    nationalAvg: 567394,
  },
];

export default function FarmAssetTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={assetData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 14 }} tickCount={10} domain={["dataMin", "dataMax"]} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 14 }} domain={[0, 1200000]} tickFormatter={(value) => `${value / 1000}백만`} />
        <Tooltip
          formatter={(value, name) => {
            const labels = {
              fixedAsset: "고정자산",
              currentAsset: "유동자산",
              totalAsset: "자산(제주)",
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
        <Bar dataKey="fixedAsset" name="고정자산" stackId="a" fill="#4478c8" />
        <Bar dataKey="currentAsset" name="유동자산" stackId="a" fill="#9ca3af" />
        <Line type="monotone" dataKey="totalAsset" name="자산(제주)" stroke="#1e3a8a" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="nationalAvg" name="전국평균(제주제외)" stroke="#f97316" strokeWidth={2} dot={{ r: 2 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
