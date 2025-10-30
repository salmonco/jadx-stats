import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 연령별 인구 분포 데이터 (1970-2023)
const ageData = [
  { year: 1970, young: 43.32, middle: 43.44, elderly: 13.24 },
  { year: 1980, young: 34.43, middle: 51.47, elderly: 14.1 },
  { year: 1985, young: 31.24, middle: 54.72, elderly: 14.04 },
  { year: 1990, young: 24.08, middle: 59.88, elderly: 16.04 },
  { year: 1991, young: 22.94, middle: 61.0, elderly: 16.06 },
  { year: 1992, young: 21.88, middle: 62.07, elderly: 16.05 },
  { year: 1993, young: 20.98, middle: 63.54, elderly: 15.48 },
  { year: 1994, young: 19.37, middle: 64.95, elderly: 15.68 },
  { year: 1995, young: 17.97, middle: 66.34, elderly: 15.69 },
  { year: 1996, young: 17.35, middle: 66.16, elderly: 16.49 },
  { year: 1997, young: 16.91, middle: 66.42, elderly: 16.67 },
  { year: 1998, young: 16.5, middle: 66.81, elderly: 16.69 },
  { year: 1999, young: 16.0, middle: 66.72, elderly: 17.28 },
  { year: 2000, young: 15.73, middle: 66.9, elderly: 17.37 },
  { year: 2001, young: 15.31, middle: 66.84, elderly: 17.85 },
  { year: 2002, young: 14.94, middle: 65.9, elderly: 19.16 },
  { year: 2003, young: 14.95, middle: 64.72, elderly: 20.33 },
  { year: 2004, young: 14.73, middle: 63.04, elderly: 22.23 },
  { year: 2005, young: 14.41, middle: 61.35, elderly: 24.24 },
  { year: 2006, young: 14.11, middle: 59.32, elderly: 26.57 },
  { year: 2007, young: 13.7, middle: 58.73, elderly: 27.57 },
  { year: 2008, young: 13.39, middle: 58.04, elderly: 28.57 },
  { year: 2009, young: 13.11, middle: 57.32, elderly: 29.57 },
  { year: 2010, young: 12.7, middle: 57.65, elderly: 29.65 },
  { year: 2011, young: 12.33, middle: 56.97, elderly: 30.7 },
  { year: 2012, young: 11.89, middle: 55.93, elderly: 32.18 },
  { year: 2013, young: 11.36, middle: 54.89, elderly: 33.75 },
  { year: 2014, young: 10.94, middle: 53.85, elderly: 35.21 },
  { year: 2015, young: 10.35, middle: 52.95, elderly: 36.7 },
  { year: 2016, young: 9.54, middle: 52.58, elderly: 37.88 },
  { year: 2017, young: 8.97, middle: 51.91, elderly: 39.12 },
  { year: 2018, young: 8.31, middle: 50.85, elderly: 40.84 },
  { year: 2019, young: 7.82, middle: 49.33, elderly: 42.85 },
  { year: 2020, young: 7.32, middle: 48.39, elderly: 44.29 },
  { year: 2021, young: 6.58, middle: 47.73, elderly: 45.69 },
  { year: 2022, young: 5.86, middle: 46.79, elderly: 47.35 },
  { year: 2023, young: 5.12, middle: 45.93, elderly: 48.95 },
];

export default function AgeDistributionChart({ tickFontSize = 14 }: { tickFontSize?: number }) {
  // Custom tooltip formatter to show percentages
  const tooltipFormatter = (value) => [`${value.toFixed(1)}%`];

  const margin = tickFontSize > 14 ? { top: 20, right: 30, left: 0, bottom: 10 } : { top: 5, right: 10, left: -15, bottom: 0 };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={ageData} margin={margin} stackOffset="expand" barSize={16}>
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: tickFontSize }} interval={4} axisLine={{ stroke: "#E0E0E0" }} />
        <YAxis tickFormatter={(value) => `${Math.round(value * 100)}%`} tick={{ fontSize: tickFontSize }} axisLine={{ stroke: "#E0E0E0" }} domain={[0, 1]} />
        {tickFontSize > 14 && (
          <Tooltip
            formatter={tooltipFormatter}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "6px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              border: "1px solid #f0f0f0",
            }}
            itemStyle={{ padding: "2px 0" }}
            labelStyle={{ fontWeight: "bold", marginBottom: "5px" }}
          />
        )}
        <Legend align="center" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: `${tickFontSize}px`, paddingTop: "10px" }} />
        <Bar dataKey="young" stackId="a" fill="#3b82f6" name="0-14세" animationDuration={1500} animationEasing="ease-out" />
        <Bar dataKey="middle" stackId="a" fill="#f97316" name="15-64세" animationDuration={1500} animationEasing="ease-out" animationBegin={300} />
        <Bar dataKey="elderly" stackId="a" fill="#9ca3af" name="65세 이상" animationDuration={1500} animationEasing="ease-out" animationBegin={600} />
      </BarChart>
    </ResponsiveContainer>
  );
}
