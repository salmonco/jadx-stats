"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 제주 농업 생산가능 인구 구성 데이터 (1970-2023, 실제 인구수)
const populationData = [
  { year: 1970, young: 107319, working: 124785, elderly: 15874 },
  { year: 1980, young: 83286, working: 145880, elderly: 14010 },
  { year: 1990, young: 34423, working: 117846, elderly: 11854 },
  { year: 1991, young: 30824, working: 108360, elderly: 14096 },
  { year: 1992, young: 31394, working: 107894, elderly: 12805 },
  { year: 1993, young: 30498, working: 106482, elderly: 14468 },
  { year: 1994, young: 27838, working: 104396, elderly: 15166 },
  { year: 1995, young: 24937, working: 106569, elderly: 14073 },
  { year: 1996, young: 24515, working: 101342, elderly: 16465 },
  { year: 1997, young: 22335, working: 96381, elderly: 16477 },
  { year: 1998, young: 22851, working: 94262, elderly: 16238 },
  { year: 1999, young: 22980, working: 96090, elderly: 17137 },
  { year: 2000, young: 22373, working: 89894, elderly: 16885 },
  { year: 2001, young: 22331, working: 89957, elderly: 19116 },
  { year: 2002, young: 20514, working: 80850, elderly: 17346 },
  { year: 2003, young: 20195, working: 76671, elderly: 20103 },
  { year: 2004, young: 18573, working: 71174, elderly: 20209 },
  { year: 2005, young: 17895, working: 71752, elderly: 20634 },
  { year: 2006, young: 16641, working: 65503, elderly: 22957 },
  { year: 2007, young: 15881, working: 66073, elderly: 23052 },
  { year: 2008, young: 16370, working: 63119, elderly: 22703 },
  { year: 2009, young: 16099, working: 64537, elderly: 24165 },
  { year: 2010, young: 18535, working: 72503, elderly: 23501 },
  { year: 2011, young: 17548, working: 72690, elderly: 23825 },
  { year: 2012, young: 16431, working: 71774, elderly: 25091 },
  { year: 2013, young: 15136, working: 70922, elderly: 25688 },
  { year: 2014, young: 13634, working: 69807, elderly: 26070 },
  { year: 2015, young: 11035, working: 58419, elderly: 23950 },
  { year: 2016, young: 9584, working: 52058, elderly: 26744 },
  { year: 2017, young: 8937, working: 50251, elderly: 27275 },
  { year: 2018, young: 8321, working: 47545, elderly: 26884 },
  { year: 2019, young: 7691, working: 49133, elderly: 26310 },
  { year: 2020, young: 7042, working: 49789, elderly: 22966 },
  { year: 2021, young: 5508, working: 45109, elderly: 24930 },
  { year: 2022, young: 4773, working: 43770, elderly: 25921 },
  { year: 2023, young: 4172, working: 41268, elderly: 27545 },
];

export default function AgeStructureStackedChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={populationData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} stackOffset="expand" barSize={20}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 10 }} interval={2} angle={-45} textAnchor="end" height={60} />
        <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} tick={{ fontSize: 11 }} domain={[0, 1]} />
        <Tooltip
          formatter={(value: number, name, props) => {
            const total = props.payload.young + props.payload.working + props.payload.elderly;
            const percentage = ((value / total) * 100).toFixed(1);
            const labels = {
              young: "0-14세",
              working: "15-64세",
              elderly: "65세 이상",
            };
            return [`${value.toLocaleString()}명 (${percentage}%)`, labels[name] || name];
          }}
          labelFormatter={(label) => `${label}년 제주 농업 생산가능 인구`}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #f0f0f0",
            borderRadius: "4px",
            padding: "10px",
          }}
        />
        <Legend
          formatter={(value) => {
            const labels = {
              young: "0-14세",
              working: "15-64세",
              elderly: "65세 이상",
            };
            return labels[value] || value;
          }}
        />
        <Bar dataKey="young" stackId="a" fill="#eab308" name="young" />
        <Bar dataKey="working" stackId="a" fill="#ef4444" name="working" />
        <Bar dataKey="elderly" stackId="a" fill="#1e3a8a" name="elderly" />
      </BarChart>
    </ResponsiveContainer>
  );
}
