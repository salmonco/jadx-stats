import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart } from "recharts";

// 연령별 인구비율 데이터 (1990-2023)
const ageStructureData = [
  { year: 1990, young: 21, working: 72, elderly: 7 },
  { year: 1991, young: 20, working: 71, elderly: 9 },
  { year: 1992, young: 21, working: 71, elderly: 8 },
  { year: 1993, young: 20, working: 70, elderly: 10 },
  { year: 1994, young: 19, working: 71, elderly: 10 },
  { year: 1995, young: 17, working: 73, elderly: 10 },
  { year: 1996, young: 17, working: 71, elderly: 12 },
  { year: 1997, young: 17, working: 71, elderly: 12 },
  { year: 1998, young: 17, working: 71, elderly: 12 },
  { year: 1999, young: 17, working: 71, elderly: 13 },
  { year: 2000, young: 17, working: 70, elderly: 13 },
  { year: 2001, young: 17, working: 68, elderly: 15 },
  { year: 2002, young: 17, working: 68, elderly: 15 },
  { year: 2003, young: 17, working: 66, elderly: 17 },
  { year: 2004, young: 17, working: 65, elderly: 18 },
  { year: 2005, young: 16, working: 65, elderly: 19 },
  { year: 2006, young: 16, working: 62, elderly: 22 },
  { year: 2007, young: 15, working: 63, elderly: 22 },
  { year: 2008, young: 16, working: 62, elderly: 22 },
  { year: 2009, young: 15, working: 62, elderly: 23 },
  { year: 2010, young: 16, working: 63, elderly: 21 },
  { year: 2011, young: 15, working: 64, elderly: 21 },
  { year: 2012, young: 15, working: 63, elderly: 22 },
  { year: 2013, young: 14, working: 63, elderly: 23 },
  { year: 2014, young: 12, working: 64, elderly: 24 },
  { year: 2015, young: 12, working: 63, elderly: 26 },
  { year: 2016, young: 11, working: 59, elderly: 30 },
  { year: 2017, young: 10, working: 58, elderly: 32 },
  { year: 2018, young: 10, working: 57, elderly: 32 },
  { year: 2019, young: 9, working: 59, elderly: 32 },
  { year: 2020, young: 9, working: 62, elderly: 29 },
  { year: 2021, young: 7, working: 60, elderly: 33 },
  { year: 2022, young: 6, working: 59, elderly: 35 },
  { year: 2023, young: 6, working: 57, elderly: 38 },
];

export default function AgeStructureLineChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={ageStructureData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 11 }} tickCount={10} domain={["dataMin", "dataMax"]} interval="preserveStartEnd" />
        <YAxis
          tick={{ fontSize: 11 }}
          domain={[0, 80]}
          tickFormatter={(value) => `${value}%`}
          label={{ value: "비율(%)", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }}
        />
        <Tooltip
          formatter={(value, name) => {
            const labels = {
              young: "0-14세",
              working: "15-64세",
              elderly: "65세 이상",
            };
            return [`${value}%`, labels[name] || name];
          }}
          labelFormatter={(label) => `${label}년`}
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
        <Line type="monotone" dataKey="young" stroke="#eab308" name="young" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="working" stroke="#ef4444" name="working" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="elderly" stroke="#1e3a8a" name="elderly" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
