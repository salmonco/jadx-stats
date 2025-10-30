import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 작물별 재배면적 구성 데이터 (2008-2023)
const cropData = [
  {
    year: 2008,
    rice: 945,
    barley: 2702,
    beans: 1250,
    miscGrain: 850,
    potato: 6597,
    vegetable: 19440,
    specialCrop: 2785,
    fruit: 22183,
    waterSource: 1200,
    others: 5605,
  },
  {
    year: 2009,
    rice: 1333,
    barley: 3016,
    beans: 1320,
    miscGrain: 920,
    potato: 8028,
    vegetable: 18230,
    specialCrop: 2989,
    fruit: 22325,
    waterSource: 1180,
    others: 6057,
  },
  {
    year: 2010,
    rice: 1119,
    barley: 2398,
    beans: 1450,
    miscGrain: 1100,
    potato: 6933,
    vegetable: 19953,
    specialCrop: 2516,
    fruit: 22230,
    waterSource: 1250,
    others: 9718,
  },
  {
    year: 2011,
    rice: 430,
    barley: 1390,
    beans: 1380,
    miscGrain: 1050,
    potato: 6027,
    vegetable: 21008,
    specialCrop: 1850,
    fruit: 22508,
    waterSource: 1300,
    others: 9125,
  },
  {
    year: 2012,
    rice: 522,
    barley: 770,
    beans: 1290,
    miscGrain: 980,
    potato: 6256,
    vegetable: 18209,
    specialCrop: 1824,
    fruit: 22522,
    waterSource: 1350,
    others: 8027,
  },
  {
    year: 2013,
    rice: 302,
    barley: 1024,
    beans: 1320,
    miscGrain: 1020,
    potato: 6084,
    vegetable: 20628,
    specialCrop: 1605,
    fruit: 22594,
    waterSource: 1380,
    others: 8456,
  },
  {
    year: 2014,
    rice: 214,
    barley: 1223,
    beans: 1280,
    miscGrain: 950,
    potato: 6040,
    vegetable: 19132,
    specialCrop: 1831,
    fruit: 22425,
    waterSource: 1400,
    others: 7280,
  },
  {
    year: 2015,
    rice: 128,
    barley: 2136,
    beans: 1240,
    miscGrain: 920,
    potato: 5107,
    vegetable: 17723,
    specialCrop: 1141,
    fruit: 22342,
    waterSource: 1420,
    others: 7067,
  },
  {
    year: 2016,
    rice: 127,
    barley: 2451,
    beans: 1350,
    miscGrain: 980,
    potato: 5582,
    vegetable: 18802,
    specialCrop: 1558,
    fruit: 22644,
    waterSource: 1450,
    others: 9885,
  },
  {
    year: 2017,
    rice: 113,
    barley: 2154,
    beans: 1320,
    miscGrain: 950,
    potato: 3592,
    vegetable: 20292,
    specialCrop: 1487,
    fruit: 22540,
    waterSource: 1480,
    others: 7693,
  },
  {
    year: 2018,
    rice: 81,
    barley: 2166,
    beans: 1290,
    miscGrain: 930,
    potato: 3668,
    vegetable: 21461,
    specialCrop: 1306,
    fruit: 22422,
    waterSource: 1510,
    others: 9063,
  },
  {
    year: 2019,
    rice: 45,
    barley: 2562,
    beans: 1260,
    miscGrain: 910,
    potato: 4035,
    vegetable: 18845,
    specialCrop: 865,
    fruit: 22031,
    waterSource: 1540,
    others: 9881,
  },
  {
    year: 2020,
    rice: 43,
    barley: 2599,
    beans: 1230,
    miscGrain: 890,
    potato: 3725,
    vegetable: 20500,
    specialCrop: 929,
    fruit: 22075,
    waterSource: 1570,
    others: 8583,
  },
  {
    year: 2021,
    rice: 65,
    barley: 1999,
    beans: 1280,
    miscGrain: 920,
    potato: 4754,
    vegetable: 19382,
    specialCrop: 1037,
    fruit: 22745,
    waterSource: 1600,
    others: 10030,
  },
  {
    year: 2022,
    rice: 70,
    barley: 1967,
    beans: 1250,
    miscGrain: 900,
    potato: 4940,
    vegetable: 17418,
    specialCrop: 986,
    fruit: 22903,
    waterSource: 1630,
    others: 9893,
  },
  {
    year: 2023,
    rice: 5,
    barley: 1750,
    beans: 1220,
    miscGrain: 880,
    potato: 5270,
    vegetable: 17668,
    specialCrop: 1029,
    fruit: 22890,
    waterSource: 1650,
    others: 9997,
  },
];

// 작물별 색상
const cropColors = {
  rice: "#0ea5e9",
  barley: "#f97316",
  beans: "#84cc16",
  miscGrain: "#14b8a6",
  potato: "#a3a3a3",
  vegetable: "#22c55e",
  fruit: "#8b5cf6",
  specialCrop: "#eab308",
  waterSource: "#06b6d4",
  others: "#6b7280",
};

// 한글 레이블
const koreanLabels = {
  rice: "벼",
  barley: "맥류",
  beans: "두류",
  miscGrain: "잡곡",
  potato: "서류",
  vegetable: "채소",
  fruit: "과수",
  specialCrop: "특용작물",
  waterSource: "기타수원지",
  others: "기타작물",
};

export default function CropCompositionChart() {
  // 데이터 변환: 각 연도별 작물 비율 계산
  const processedData = cropData.map((yearData) => {
    const total = Object.keys(yearData).reduce((sum, key) => {
      if (key !== "year") {
        return sum + yearData[key];
      }
      return sum;
    }, 0);

    const result = { year: yearData.year };
    Object.keys(yearData).forEach((key) => {
      if (key !== "year") {
        result[key] = yearData[key] / total;
      }
    });

    return result;
  });

  // 연도별 원본 데이터를 찾는 함수
  const findOriginalData = (year) => {
    return cropData.find((item) => item.year === year) || {};
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }} stackOffset="expand" barSize={30}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 14 }} interval={0} />
        <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} tick={{ fontSize: 14 }} />
        <Tooltip
          formatter={(value, name, props) => {
            // 안전하게 원본 데이터 접근
            const year = props.payload.year;
            const originalData = findOriginalData(year);
            const originalValue = originalData[name] || 0;
            const percentage = (Number(value) * 100).toFixed(1);
            return [`${originalValue.toLocaleString()} ha (${percentage}%)`, koreanLabels[name] || name];
          }}
          labelFormatter={(label) => `${label}년 작물별 재배면적`}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #f0f0f0",
            borderRadius: "4px",
            padding: "10px",
          }}
          itemStyle={{ padding: "2px 0" }}
        />
        <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ paddingLeft: 20 }} formatter={(value) => koreanLabels[value] || value} />
        <Bar dataKey="rice" stackId="a" fill={cropColors.rice} />
        <Bar dataKey="barley" stackId="a" fill={cropColors.barley} />
        <Bar dataKey="beans" stackId="a" fill={cropColors.beans} />
        <Bar dataKey="miscGrain" stackId="a" fill={cropColors.miscGrain} />
        <Bar dataKey="potato" stackId="a" fill={cropColors.potato} />
        <Bar dataKey="vegetable" stackId="a" fill={cropColors.vegetable} />
        <Bar dataKey="specialCrop" stackId="a" fill={cropColors.specialCrop} />
        <Bar dataKey="fruit" stackId="a" fill={cropColors.fruit} />
        <Bar dataKey="waterSource" stackId="a" fill={cropColors.waterSource} />
        <Bar dataKey="others" stackId="a" fill={cropColors.others} />
      </BarChart>
    </ResponsiveContainer>
  );
}
