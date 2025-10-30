import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 제주 농가자산 구성 데이터 (2003-2023)
const compositionData = [
  { year: 2003, fixed: 269, current: 52 },
  { year: 2004, fixed: 303, current: 66 },
  { year: 2005, fixed: 324, current: 91 },
  { year: 2006, fixed: 322, current: 94 },
  { year: 2007, fixed: 345, current: 109 },
  { year: 2008, fixed: 332, current: 63 },
  { year: 2009, fixed: 349, current: 73 },
  { year: 2010, fixed: 348, current: 93 },
  { year: 2011, fixed: 356, current: 100 },
  { year: 2012, fixed: 399, current: 122 },
  { year: 2013, fixed: 312, current: 99 },
  { year: 2014, fixed: 354, current: 119 },
  { year: 2015, fixed: 388, current: 155 },
  { year: 2016, fixed: 455, current: 167 },
  { year: 2017, fixed: 540, current: 172 },
  { year: 2018, fixed: 767, current: 90 },
  { year: 2019, fixed: 828, current: 93 },
  { year: 2020, fixed: 850, current: 98 },
  { year: 2021, fixed: 895, current: 111 },
  { year: 2022, fixed: 936, current: 119 },
  { year: 2023, fixed: 844, current: 117 },
];

// 데이터 변환: 각 연도별 자산 구성 비율 계산
const processedData = compositionData.map((yearData) => {
  const total = yearData.fixed + yearData.current;
  return {
    year: yearData.year,
    fixed: yearData.fixed / total,
    current: yearData.current / total,
  };
});

export default function AssetCompositionChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={processedData} margin={{ top: 20, right: 40, left: 20, bottom: 0 }} stackOffset="expand" barSize={25}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 14 }} interval={1} angle={-45} textAnchor="end" height={70} tickMargin={5} />
        <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} tick={{ fontSize: 14 }} domain={[0, 1]} tickMargin={10} />
        <Tooltip
          formatter={(value: number, name) => {
            const percentage = (value * 100).toFixed(1);
            const labels = {
              fixed: "고정자산",
              current: "유동자산",
            };
            return [`${percentage}%`, labels[name] || name];
          }}
          labelFormatter={(label) => `${label}년`}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "13px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: "12px" }}
          formatter={(value) => {
            const labels = {
              fixed: "고정자산",
              current: "유동자산",
            };
            return labels[value] || value;
          }}
        />
        <Bar dataKey="fixed" stackId="a" fill="#ef4444" name="fixed" />
        <Bar dataKey="current" stackId="a" fill="#1e40af" name="current" />
      </BarChart>
    </ResponsiveContainer>
  );
}
