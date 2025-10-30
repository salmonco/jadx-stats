import { Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";

// 농가 소득 데이터 (1993-2023, 단위: 만원)
const incomeData = [
  { year: 1993, income: 4000, avgIncome: 2500, growthRate: 0 },
  { year: 1995, income: 4500, avgIncome: 2700, growthRate: 12.5 },
  { year: 1997, income: 5000, avgIncome: 3000, growthRate: 11.1 },
  { year: 1999, income: 5500, avgIncome: 3200, growthRate: 10.0 },
  { year: 2001, income: 6000, avgIncome: 3400, growthRate: 9.1 },
  { year: 2003, income: 6500, avgIncome: 3600, growthRate: 8.3 },
  { year: 2005, income: 7000, avgIncome: 3800, growthRate: 7.7 },
  { year: 2007, income: 7500, avgIncome: 4000, growthRate: 7.1 },
  { year: 2009, income: 8000, avgIncome: 4200, growthRate: 6.7 },
  { year: 2011, income: 8500, avgIncome: 4400, growthRate: 6.3 },
  { year: 2013, income: 9000, avgIncome: 4600, growthRate: 5.9 },
  { year: 2015, income: 9500, avgIncome: 4800, growthRate: 5.6 },
  { year: 2017, income: 10000, avgIncome: 5000, growthRate: 5.3 },
  { year: 2019, income: 11000, avgIncome: 5200, growthRate: 10.0 },
  { year: 2021, income: 12000, avgIncome: 5400, growthRate: 9.1 },
  { year: 2023, income: 13000, avgIncome: 5600, growthRate: 8.3 },
];

export default function FarmIncomeChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={incomeData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 14 }} tickCount={8} />
        <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 14 }} domain={[0, 15000]} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 14 }} domain={[0, 30]} tickFormatter={(value) => `${value}%`} />
        <Tooltip
          formatter={(value, name) => {
            if (name === "소득 증가율(%)") return [`${value}%`];
            return [`${value.toLocaleString()} 만원`];
          }}
          labelFormatter={(label) => `${label}년`}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #f0f0f0",
            borderRadius: "4px",
            padding: "10px",
          }}
        />
        <Legend formatter={(value) => <span style={{ fontSize: 14 }}>{value}</span>} />
        <Line type="monotone" dataKey="income" yAxisId="left" stroke="#1e3a8a" name="제주 농가소득(만원)" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        <Line
          type="monotone"
          dataKey="avgIncome"
          yAxisId="left"
          stroke="#9ca3af"
          name="전국 평균 농가소득(만원)"
          strokeWidth={1.5}
          strokeDasharray="5 5"
          dot={{ r: 3 }}
        />
        <Bar dataKey="growthRate" yAxisId="right" fill="#22c55e" name="소득 증가율(%)" radius={[4, 4, 0, 0]} opacity={0.6} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
