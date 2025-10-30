import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart } from "recharts";

// 농가인구 및 농가 수 데이터 (1993-2023) - 정확한 데이터로 업데이트
const farmData = [
  { year: 1993, population: 151450, farms: 40192 },
  { year: 1994, population: 147400, farms: 39820 },
  { year: 1995, population: 145579, farms: 39781 },
  { year: 1996, population: 142320, farms: 39485 },
  { year: 1997, population: 135193, farms: 40223 },
  { year: 1998, population: 133352, farms: 39821 },
  { year: 1999, population: 136209, farms: 40330 },
  { year: 2000, population: 129152, farms: 39114 },
  { year: 2001, population: 131404, farms: 40672 },
  { year: 2002, population: 118709, farms: 37850 },
  { year: 2003, population: 116967, farms: 37893 },
  { year: 2004, population: 109955, farms: 36366 },
  { year: 2005, population: 110281, farms: 36218 },
  { year: 2006, population: 105103, farms: 36465 },
  { year: 2007, population: 105004, farms: 35735 },
  { year: 2008, population: 102192, farms: 34645 },
  { year: 2009, population: 104802, farms: 35388 },
  { year: 2010, population: 114539, farms: 37893 },
  { year: 2011, population: 114062, farms: 38497 },
  { year: 2012, population: 113298, farms: 38208 },
  { year: 2013, population: 111745, farms: 38502 },
  { year: 2014, population: 109510, farms: 38444 },
  { year: 2015, population: 93404, farms: 33487 },
  { year: 2016, population: 88385, farms: 33109 },
  { year: 2017, population: 86463, farms: 32200 },
  { year: 2018, population: 82751, farms: 31208 },
  { year: 2019, population: 83133, farms: 31111 },
  { year: 2020, population: 79797, farms: 30365 },
  { year: 2021, population: 75548, farms: 31549 },
  { year: 2022, population: 74466, farms: 30452 },
  { year: 2023, population: 72985, farms: 30357 },
];

export default function FarmPopulationChart({ tickFontSize = 14 }: { tickFontSize?: number }) {
  const margin = tickFontSize > 14 ? { top: 10, right: 10, left: 10, bottom: 20 } : { top: 10, right: 0, left: 0, bottom: 5 };
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={farmData} margin={margin}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: tickFontSize }} tickCount={10} domain={["dataMin", "dataMax"]} interval="preserveStartEnd" />
        <YAxis yAxisId="left" orientation="left" tick={{ fontSize: tickFontSize }} domain={[60000, 160000]} tickFormatter={(value) => `${value.toLocaleString()}`} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: tickFontSize }} domain={[30000, 45000]} tickFormatter={(value) => `${value.toLocaleString()}`} />
        {tickFontSize > 14 && (
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
        )}
        <Legend formatter={(value) => <span style={{ fontSize: `${tickFontSize}px` }}>{value}</span>} />
        <Line type="monotone" dataKey="population" yAxisId="left" stroke="#1e3a8a" name="농가인구(명)" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="farms" yAxisId="right" stroke="#f97316" name="농가 수(호)" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
