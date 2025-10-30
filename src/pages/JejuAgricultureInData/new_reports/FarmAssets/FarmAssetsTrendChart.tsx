import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart } from "recharts";

// 농가자산 변화 데이터 (2003-2023, 백만원)
const assetData = [
  { year: 2003, jeju: 321, national: 201 },
  { year: 2004, jeju: 369, national: 239 },
  { year: 2005, jeju: 415, national: 292 },
  { year: 2006, jeju: 415, national: 352 },
  { year: 2007, jeju: 454, national: 390 },
  { year: 2008, jeju: 395, national: 331 },
  { year: 2009, jeju: 422, national: 346 },
  { year: 2010, jeju: 441, national: 359 },
  { year: 2011, jeju: 457, national: 372 },
  { year: 2012, jeju: 521, national: 390 },
  { year: 2013, jeju: 411, national: 378 },
  { year: 2014, jeju: 473, national: 407 },
  { year: 2015, jeju: 544, national: 420 },
  { year: 2016, jeju: 623, national: 444 },
  { year: 2017, jeju: 712, national: 464 },
  { year: 2018, jeju: 857, national: 465 },
  { year: 2019, jeju: 922, national: 497 },
  { year: 2020, jeju: 948, national: 514 },
  { year: 2021, jeju: 1006, national: 539 },
  { year: 2022, jeju: 1055, national: 561 },
  { year: 2023, jeju: 962, national: 567 },
];

export default function FarmAssetsTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={assetData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="year" tick={{ fontSize: 14 }} tickCount={8} domain={["dataMin", "dataMax"]} interval="preserveStartEnd" tickMargin={10} />
        <YAxis tick={{ fontSize: 14 }} domain={[0, 1200]} tickFormatter={(value) => `${value}백만원`} width={80} tickMargin={10} />
        <Tooltip
          formatter={(value, name) => [`${value}백만원`, name === "jeju" ? "제주" : "전국(제주제외)"]}
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
        <Legend wrapperStyle={{ fontSize: "13px", paddingTop: "10px" }} formatter={(value) => (value === "jeju" ? "제주" : "전국(제주제외)")} />
        <Line type="monotone" dataKey="jeju" stroke="#ef4444" name="jeju" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="national" stroke="#1e40af" name="national" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
