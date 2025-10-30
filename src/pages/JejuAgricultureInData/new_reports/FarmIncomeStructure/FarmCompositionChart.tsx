import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 농가소득 구성 데이터 (2003-2023)
const compositionData = [
  { year: 2003, agricultural: 9, nonAgricultural: 17, transfer: 2, nonRegular: 4, total: 31 },
  { year: 2004, agricultural: 13, nonAgricultural: 17, transfer: 2, nonRegular: 6, total: 39 },
  { year: 2005, agricultural: 16, nonAgricultural: 18, transfer: 3, nonRegular: 7, total: 45 },
  { year: 2006, agricultural: 15, nonAgricultural: 19, transfer: 3, nonRegular: 6, total: 42 },
  { year: 2007, agricultural: 15, nonAgricultural: 17, transfer: 4, nonRegular: 6, total: 41 },
  { year: 2008, agricultural: 15, nonAgricultural: 15, transfer: 3, nonRegular: 4, total: 38 },
  { year: 2009, agricultural: 10, nonAgricultural: 15, transfer: 6, nonRegular: 4, total: 35 },
  { year: 2010, agricultural: 18, nonAgricultural: 17, transfer: 4, nonRegular: 2, total: 41 },
  { year: 2011, agricultural: 11, nonAgricultural: 15, transfer: 5, nonRegular: 5, total: 36 },
  { year: 2012, agricultural: 12, nonAgricultural: 17, transfer: 7, nonRegular: 4, total: 39 },
  { year: 2013, agricultural: 10, nonAgricultural: 22, transfer: 6, nonRegular: 4, total: 42 },
  { year: 2014, agricultural: 9, nonAgricultural: 23, transfer: 7, nonRegular: 4, total: 43 },
  { year: 2015, agricultural: 8, nonAgricultural: 24, transfer: 8, nonRegular: 4, total: 44 },
  { year: 2016, agricultural: 8, nonAgricultural: 26, transfer: 8, nonRegular: 3, total: 46 },
  { year: 2017, agricultural: 13, nonAgricultural: 29, transfer: 8, nonRegular: 3, total: 53 },
  { year: 2018, agricultural: 16, nonAgricultural: 21, transfer: 10, nonRegular: 2, total: 49 },
  { year: 2019, agricultural: 15, nonAgricultural: 20, transfer: 12, nonRegular: 2, total: 49 },
  { year: 2020, agricultural: 12, nonAgricultural: 20, transfer: 15, nonRegular: 2, total: 49 },
  { year: 2021, agricultural: 13, nonAgricultural: 23, transfer: 15, nonRegular: 1, total: 48 },
  { year: 2022, agricultural: 15, nonAgricultural: 26, transfer: 15, nonRegular: 2, total: 58 },
  { year: 2023, agricultural: 15, nonAgricultural: 26, transfer: 15, nonRegular: 4, total: 61 },
];

// 데이터 변환: 각 연도별 소득 구성 비율 계산
const processedData = compositionData.map((yearData) => {
  const total = yearData.agricultural + yearData.nonAgricultural + yearData.transfer + yearData.nonRegular;
  return {
    year: yearData.year,
    agricultural: yearData.agricultural / total,
    nonAgricultural: yearData.nonAgricultural / total,
    transfer: yearData.transfer / total,
    nonRegular: yearData.nonRegular / total,
  };
});

export default function FarmIncomeCompositionChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={processedData} margin={{ top: 20, right: 40, left: 20, bottom: 80 }} stackOffset="expand" barSize={25}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 11 }} interval={1} angle={-45} textAnchor="end" height={70} />
        <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} tick={{ fontSize: 12 }} domain={[0, 1]} />
        <Tooltip
          formatter={(value: number, name) => {
            const percentage = (value * 100).toFixed(1);
            const labels = {
              agricultural: "농업소득",
              nonAgricultural: "농외소득",
              transfer: "이전소득",
              nonRegular: "비경상소득",
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
          wrapperStyle={{ paddingTop: "15px", fontSize: "12px" }}
          formatter={(value) => {
            const labels = {
              agricultural: "농업소득",
              nonAgricultural: "농외소득",
              transfer: "이전소득",
              nonRegular: "비경상소득",
            };
            return labels[value] || value;
          }}
        />
        <Bar dataKey="agricultural" stackId="a" fill="#6366f1" name="agricultural" />
        <Bar dataKey="nonAgricultural" stackId="a" fill="#06b6d4" name="nonAgricultural" />
        <Bar dataKey="transfer" stackId="a" fill="#10b981" name="transfer" />
        <Bar dataKey="nonRegular" stackId="a" fill="#f59e0b" name="nonRegular" />
      </BarChart>
    </ResponsiveContainer>
  );
}
