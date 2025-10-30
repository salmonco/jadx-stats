import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 가계지출 구성 데이터 (2003-2023)
const compositionData = [
  { year: 2003, consumption: 24, nonConsumption: 8 },
  { year: 2004, consumption: 24, nonConsumption: 8 },
  { year: 2005, consumption: 27, nonConsumption: 9 },
  { year: 2006, consumption: 26, nonConsumption: 10 },
  { year: 2007, consumption: 26, nonConsumption: 7 },
  { year: 2008, consumption: 25, nonConsumption: 7 },
  { year: 2009, consumption: 22, nonConsumption: 8 },
  { year: 2010, consumption: 23, nonConsumption: 7 },
  { year: 2011, consumption: 24, nonConsumption: 7 },
  { year: 2012, consumption: 26, nonConsumption: 7 },
  { year: 2013, consumption: 28, nonConsumption: 8 },
  { year: 2014, consumption: 30, nonConsumption: 8 },
  { year: 2015, consumption: 31, nonConsumption: 10 },
  { year: 2016, consumption: 34, nonConsumption: 9 },
  { year: 2017, consumption: 34, nonConsumption: 10 },
  { year: 2018, consumption: 31, nonConsumption: 12 },
  { year: 2019, consumption: 32, nonConsumption: 12 },
  { year: 2020, consumption: 31, nonConsumption: 12 },
  { year: 2021, consumption: 33, nonConsumption: 11 },
  { year: 2022, consumption: 33, nonConsumption: 12 },
  { year: 2023, consumption: 36, nonConsumption: 12 },
];

// 데이터 변환: 각 연도별 지출 구성 비율 계산
const processedData = compositionData.map((yearData) => {
  const total = yearData.consumption + yearData.nonConsumption;
  return {
    year: yearData.year,
    consumption: yearData.consumption / total,
    nonConsumption: yearData.nonConsumption / total,
  };
});

export default function ExpenditureCompositionChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={processedData} margin={{ top: 20, right: 40, left: 20, bottom: 0 }} stackOffset="expand" barSize={25}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 11 }} interval={1} angle={-45} textAnchor="end" height={70} />
        <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} tick={{ fontSize: 12 }} domain={[0, 1]} />
        <Tooltip
          formatter={(value: number, name: string) => {
            const percentage = (value * 100).toFixed(1);
            const labels = {
              consumption: "소비지출",
              nonConsumption: "비소비지출",
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
              consumption: "소비지출",
              nonConsumption: "비소비지출",
            };
            return labels[value] || value;
          }}
        />
        <Bar dataKey="consumption" stackId="a" fill="#ef4444" name="consumption" />
        <Bar dataKey="nonConsumption" stackId="a" fill="#1e40af" name="nonConsumption" />
      </BarChart>
    </ResponsiveContainer>
  );
}
