import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 제주 농가부채 구성 데이터 (2003-2023)
const compositionData = [
  { year: 2003, agricultural: 26, household: 13, other: 5 },
  { year: 2004, agricultural: 27, household: 14, other: 5 },
  { year: 2005, agricultural: 28, household: 15, other: 5 },
  { year: 2006, agricultural: 28, household: 14, other: 7 },
  { year: 2007, agricultural: 33, household: 12, other: 6 },
  { year: 2008, agricultural: 28, household: 11, other: 4 },
  { year: 2009, agricultural: 24, household: 13, other: 4 },
  { year: 2010, agricultural: 23, household: 14, other: 4 },
  { year: 2011, agricultural: 21, household: 9, other: 2 },
  { year: 2012, agricultural: 24, household: 10, other: 2 },
  { year: 2013, agricultural: 33, household: 9, other: 3 },
  { year: 2014, agricultural: 40, household: 13, other: 2 },
  { year: 2015, agricultural: 42, household: 16, other: 4 },
  { year: 2016, agricultural: 40, household: 21, other: 3 },
  { year: 2017, agricultural: 37, household: 25, other: 3 },
  { year: 2018, agricultural: 35, household: 21, other: 18 },
  { year: 2019, agricultural: 40, household: 21, other: 14 },
  { year: 2020, agricultural: 45, household: 22, other: 17 },
  { year: 2021, agricultural: 46, household: 28, other: 26 },
  { year: 2022, agricultural: 47, household: 24, other: 20 },
  { year: 2023, agricultural: 65, household: 18, other: 12 },
];

// 데이터 변환: 각 연도별 부채 구성 비율 계산
const processedData = compositionData.map((yearData) => {
  const total = yearData.agricultural + yearData.household + yearData.other;
  return {
    year: yearData.year,
    agricultural: yearData.agricultural / total,
    household: yearData.household / total,
    other: yearData.other / total,
  };
});

export default function DebtCompositionChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={processedData} margin={{ top: 20, right: 40, left: 20, bottom: 0 }} stackOffset="expand" barSize={25}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="#e2e8f0" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11, fill: "#475569" }}
          interval={1}
          angle={-45}
          textAnchor="end"
          height={70}
          axisLine={{ stroke: "#cbd5e1" }}
          tickLine={{ stroke: "#cbd5e1" }}
        />
        <YAxis
          tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
          tick={{ fontSize: 12, fill: "#475569" }}
          domain={[0, 1]}
          axisLine={{ stroke: "#cbd5e1" }}
          tickLine={{ stroke: "#cbd5e1" }}
        />
        <Tooltip
          formatter={(value: number, name: string) => {
            const percentage = (value * 100).toFixed(1);
            const labels = {
              agricultural: "농업용",
              household: "가계용",
              other: "겸업 및 기타",
            };
            return [`${percentage}%`, labels[name] || name];
          }}
          labelFormatter={(label) => `${label}년`}
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "13px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: "12px", color: "#475569" }}
          formatter={(value) => {
            const labels = {
              agricultural: "농업용",
              household: "가계용",
              other: "겸업 및 기타",
            };
            return labels[value] || value;
          }}
        />
        <Bar dataKey="agricultural" stackId="a" fill="#ef4444" name="agricultural" />
        <Bar dataKey="household" stackId="a" fill="#1e40af" name="household" />
        <Bar dataKey="other" stackId="a" fill="#f59e0b" name="other" />
      </BarChart>
    </ResponsiveContainer>
  );
}
