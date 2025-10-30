"use client";

import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart } from "recharts";

// 1993년부터 2023년까지의 농가인구 및 농가 수 데이터
const farmData = [
  { year: 1993, population: 151450, households: 40192 },
  { year: 1994, population: 147400, households: 39820 },
  { year: 1995, population: 145579, households: 39781 },
  { year: 1996, population: 142320, households: 39485 },
  { year: 1997, population: 135193, households: 40223 },
  { year: 1998, population: 133352, households: 39821 },
  { year: 1999, population: 136209, households: 40330 },
  { year: 2000, population: 129152, households: 39114 },
  { year: 2001, population: 131404, households: 40672 },
  { year: 2002, population: 118709, households: 37850 },
  { year: 2003, population: 116967, households: 37893 },
  { year: 2004, population: 109955, households: 36366 },
  { year: 2005, population: 110281, households: 36218 },
  { year: 2006, population: 105103, households: 36465 },
  { year: 2007, population: 105004, households: 35735 },
  { year: 2008, population: 102192, households: 34645 },
  { year: 2009, population: 104802, households: 35388 },
  { year: 2010, population: 114539, households: 37893 },
  { year: 2011, population: 114062, households: 38497 },
  { year: 2012, population: 113298, households: 38208 },
  { year: 2013, population: 111745, households: 38502 },
  { year: 2014, population: 109510, households: 38444 },
  { year: 2015, population: 93404, households: 33487 },
  { year: 2016, population: 88385, households: 33109 },
  { year: 2017, population: 86463, households: 32200 },
  { year: 2018, population: 82751, households: 31208 },
  { year: 2019, population: 83133, households: 31111 },
  { year: 2020, population: 79797, households: 30365 },
  { year: 2021, population: 75548, households: 31549 },
  { year: 2022, population: 74466, households: 30452 },
  { year: 2023, population: 72985, households: 30357 },
];

export default function FarmPopulationHouseholdChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={farmData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 14 }} tickCount={10} domain={["dataMin", "dataMax"]} interval="preserveStartEnd" angle={-45} textAnchor="end" />
        <YAxis
          yAxisId="left"
          orientation="left"
          tick={{ fontSize: 14 }}
          domain={[60000, 160000]}
          tickFormatter={(value) => `${value.toLocaleString()}`}
          label={{
            value: "농가인구(명)",
            angle: -90,
            position: "insideLeft",
            offset: -20,
            dy: 30,
            style: {
              textAnchor: "middle",
              fill: "#1e3a8a",
              fontWeight: 500,
              fontSize: 14,
            },
          }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 14 }}
          domain={[30000, 45000]}
          tickFormatter={(value) => `${value.toLocaleString()}`}
          label={{
            value: "농가 수(호)",
            angle: 90,
            position: "insideRight",
            offset: -20,
            dy: 30,
            style: {
              textAnchor: "middle",
              fill: "#f97316",
              fontWeight: 500,
              fontSize: 14,
            },
          }}
        />
        <Tooltip
          formatter={(value) => value.toLocaleString()}
          labelFormatter={(label) => `${label}년`}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #f0f0f0",
            borderRadius: "4px",
            padding: "10px",
          }}
        />
        <Legend verticalAlign="bottom" align="center" wrapperStyle={{ marginBottom: "-20px" }} formatter={(value) => <span className="text-[14px]">{value}</span>} />
        <Line type="monotone" dataKey="population" yAxisId="left" stroke="#1e3a8a" name="농가인구(명)" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="households" yAxisId="right" stroke="#f97316" name="농가 수(호)" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
