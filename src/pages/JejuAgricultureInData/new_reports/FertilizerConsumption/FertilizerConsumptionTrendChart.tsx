import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 비료소비량 데이터 (1975-2023)
const fertilizerData = [
  { year: 1975, jeju: 468, national: 396 },
  { year: 1976, jeju: 431, national: 327 },
  { year: 1977, jeju: 396, national: 67 },
  { year: 1978, jeju: 563, national: 388 },
  { year: 1979, jeju: 611, national: 388 },
  { year: 1980, jeju: 643, national: 375 },
  { year: 1981, jeju: 702, national: 379 },
  { year: 1982, jeju: 563, national: 292 },
  { year: 1983, jeju: 591, national: 315 },
  { year: 1984, jeju: 623, national: 353 },
  { year: 1985, jeju: 719, national: 375 },
  { year: 1986, jeju: 797, national: 387 },
  { year: 1987, jeju: 814, national: 392 },
  { year: 1988, jeju: 850, national: 400 },
  { year: 1989, jeju: 932, national: 469 },
  { year: 1990, jeju: 1032, national: 339 },
  { year: 1991, jeju: 789, national: 393 },
  { year: 1992, jeju: 1030, national: 401 },
  { year: 1993, jeju: 1065, national: 403 },
  { year: 1994, jeju: 1076, national: 399 },
  { year: 1995, jeju: 1041, national: 399 },
  { year: 1996, jeju: 970, national: 397 },
  { year: 1997, jeju: 890, national: 401 },
  { year: 1998, jeju: 887, national: 417 },
  { year: 1999, jeju: 768, national: 409 },
  { year: 2000, jeju: 645, national: 391 },
  { year: 2001, jeju: 560, national: 345 },
  { year: 2002, jeju: 504, national: 340 },
  { year: 2003, jeju: 528, national: 339 },
  { year: 2004, jeju: 553, national: 371 },
  { year: 2005, jeju: 599, national: 354 },
  { year: 2006, jeju: 310, national: 219 },
  { year: 2007, jeju: 389, national: 310 },
  { year: 2008, jeju: 339, national: 284 },
  { year: 2009, jeju: 320, national: 266 },
  { year: 2010, jeju: 320, national: 219 },
  { year: 2011, jeju: 400, national: 236 },
  { year: 2012, jeju: 381, national: 237 },
  { year: 2013, jeju: 351, national: 213 },
  { year: 2014, jeju: 362, national: 206 },
  { year: 2015, jeju: 370, national: 202 },
  { year: 2016, jeju: 384, national: 193 },
  { year: 2017, jeju: 391, national: 217 },
  { year: 2018, jeju: 492, national: 288 },
  { year: 2019, jeju: 488, national: 294 },
  { year: 2020, jeju: 536, national: 263 },
  { year: 2021, jeju: 416, national: 247 },
  { year: 2022, jeju: 414, national: 247 },
  { year: 2023, jeju: 414, national: 247 },
];

export default function FertilizerConsumptionTrendChart() {
  return (
    <div className="p-6">
      <div className="h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={fertilizerData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="year"
              height={60}
              tick={{ fontSize: 12 }}
              interval={4}
              tickFormatter={(value) => value.toString()}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              domain={[0, 1200]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}`}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={{ stroke: "#e5e7eb" }}
              label={{
                value: "kg/ha",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip
              formatter={(value, name) => [`${value} kg/ha`, name === "jeju" ? "제주" : "전국"]}
              labelFormatter={(label) => `${label}년`}
              contentStyle={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="line"
              wrapperStyle={{
                fontSize: "14px",
              }}
            />

            <Line
              type="monotone"
              dataKey="jeju"
              name="제주"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 3, fill: "#ef4444" }}
              activeDot={{ r: 5, stroke: "#ef4444", strokeWidth: 2, fill: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="national"
              name="전국"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3, fill: "#3b82f6" }}
              activeDot={{ r: 5, stroke: "#3b82f6", strokeWidth: 2, fill: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
