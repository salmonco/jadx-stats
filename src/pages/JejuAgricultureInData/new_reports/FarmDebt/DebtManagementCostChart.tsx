import { Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";

// 농가부채와 농업경영비 데이터 (2003-2023)
const managementData = [
  { year: 2003, agriculturalDebt: 26, totalDebt: 44, managementCost: 18 },
  { year: 2004, agriculturalDebt: 27, totalDebt: 45, managementCost: 19 },
  { year: 2005, agriculturalDebt: 28, totalDebt: 48, managementCost: 19 },
  { year: 2006, agriculturalDebt: 28, totalDebt: 48, managementCost: 19 },
  { year: 2007, agriculturalDebt: 33, totalDebt: 52, managementCost: 25 },
  { year: 2008, agriculturalDebt: 28, totalDebt: 44, managementCost: 21 },
  { year: 2009, agriculturalDebt: 24, totalDebt: 40, managementCost: 19 },
  { year: 2010, agriculturalDebt: 23, totalDebt: 41, managementCost: 19 },
  { year: 2011, agriculturalDebt: 21, totalDebt: 32, managementCost: 21 },
  { year: 2012, agriculturalDebt: 24, totalDebt: 36, managementCost: 22 },
  { year: 2013, agriculturalDebt: 33, totalDebt: 45, managementCost: 32 },
  { year: 2014, agriculturalDebt: 40, totalDebt: 55, managementCost: 40 },
  { year: 2015, agriculturalDebt: 42, totalDebt: 62, managementCost: 48 },
  { year: 2016, agriculturalDebt: 40, totalDebt: 64, managementCost: 46 },
  { year: 2017, agriculturalDebt: 37, totalDebt: 65, managementCost: 42 },
  { year: 2018, agriculturalDebt: 35, totalDebt: 75, managementCost: 40 },
  { year: 2019, agriculturalDebt: 40, totalDebt: 75, managementCost: 45 },
  { year: 2020, agriculturalDebt: 45, totalDebt: 84, managementCost: 46 },
  { year: 2021, agriculturalDebt: 46, totalDebt: 100, managementCost: 47 },
  { year: 2022, agriculturalDebt: 47, totalDebt: 92, managementCost: 39 },
  { year: 2023, agriculturalDebt: 65, totalDebt: 94, managementCost: 48 },
];

export default function DebtManagementCostChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={managementData} margin={{ top: 20, right: 30, left: 40, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="#e2e8f0" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 12, fill: "#475569" }}
          tickCount={8}
          domain={["dataMin", "dataMax"]}
          interval="preserveStartEnd"
          axisLine={{ stroke: "#cbd5e1" }}
          tickLine={{ stroke: "#cbd5e1" }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#475569" }}
          domain={[0, 120]}
          tickFormatter={(value) => `${value}백만원`}
          width={80}
          axisLine={{ stroke: "#cbd5e1" }}
          tickLine={{ stroke: "#cbd5e1" }}
        />
        <Tooltip
          formatter={(value, name) => {
            const labels = {
              agriculturalDebt: "농업용 부채",
              totalDebt: "제주 농가부채",
              managementCost: "농업경영비",
            };
            return [`${value}백만원`, labels[name] || name];
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
          cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }}
        />
        <Legend
          wrapperStyle={{ fontSize: "13px", paddingTop: "15px", color: "#475569" }}
          formatter={(value) => {
            const labels = {
              agriculturalDebt: "농업용 부채",
              totalDebt: "제주 농가부채",
              managementCost: "농업경영비",
            };
            return labels[value] || value;
          }}
        />
        <Bar dataKey="agriculturalDebt" name="agriculturalDebt" fill="#f97316" radius={[2, 2, 0, 0]} />
        <Line
          type="monotone"
          dataKey="totalDebt"
          stroke="#ef4444"
          name="totalDebt"
          strokeWidth={3}
          dot={{ r: 4, fill: "#ef4444", strokeWidth: 2, stroke: "#ffffff" }}
          activeDot={{ r: 6, fill: "#ef4444", strokeWidth: 2, stroke: "#ffffff" }}
        />
        <Line
          type="monotone"
          dataKey="managementCost"
          stroke="#1e40af"
          name="managementCost"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ r: 3, fill: "#1e40af", strokeWidth: 2, stroke: "#ffffff" }}
          activeDot={{ r: 5, fill: "#1e40af", strokeWidth: 2, stroke: "#ffffff" }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
