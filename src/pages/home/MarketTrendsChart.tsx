import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { MonthlyComparisonData } from "~/pages/visualization/retail/CropTradeInfo";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { formatData } from "./MarketTrendsSection";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;

  const { month } = payload[0].payload;

  const current = payload.find((p) => p.name === "금년");
  const lastYear = payload.find((p) => p.name === "전년");
  const average = payload.find((p) => p.name === "평년");

  return (
    <div className="flex flex-col gap-2 text-[16px] shadow-xl">
      <div className="h-auto min-w-[160px] rounded-xl border border-[#e0e0e0] bg-white p-4 shadow-lg">
        <div className="font-bold text-[#2563eb]">{`2025년 ${month}월`}</div>
        <hr className="my-2 border-t border-gray-400" />
        <div className="mb-2 mt-3 text-gray-600">
          금년 : {current?.value ? formatData(current?.value) + "원/kg" : "-"}
          {(current?.name === "농가판매가격" || current?.name === "농가구입가격") && <span className="text-[12px] text-gray-600"> (2020=100)</span>}
        </div>
        <div className="mb-2 text-gray-600">
          전년 : {lastYear?.value ? formatData(lastYear?.value) + "원/kg" : "-"}
          {(lastYear?.name === "농가판매가격" || lastYear?.name === "농가구입가격") && <span className="text-[12px] text-gray-600"> (2020=100)</span>}
        </div>
        <div className="text-gray-600">
          평년 : {average?.value ? formatData(average?.value) + "원/kg" : "-"}
          {(average?.name === "농가판매가격" || average?.name === "농가구입가격") && <span className="text-[12px] text-gray-600"> (2020=100)</span>}
        </div>
      </div>
    </div>
  );
};

const MarketTrendsChart = ({ data }: { data: MonthlyComparisonData[] }) => {
  const [animationKey, setAnimationKey] = useState(0);

  const handleMouseEnter = () => {
    setAnimationKey((prev) => prev + 1);
  };

  // 데이터 형식 변환 및 월별 정렬
  const chartData = data
    ?.map((item) => ({
      year: item.year,
      month: item.month,
      monthDisplay: `${item.month}월`,
      current: item.target_year,
      lastYear: item.previous_year,
      average: item.five_year_avg,
    }))
    .sort((a, b) => a.month - b.month);

  if (!data) {
    return (
      <div className="h-[410px] w-full rounded-lg bg-white">
        <div className="flex h-full items-center justify-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 76 }} spin />} />
        </div>
      </div>
    );
  }

  return (
    <div onMouseEnter={handleMouseEnter}>
      <ResponsiveContainer width="100%" height={410} className="rounded-lg bg-white">
        <AreaChart data={chartData} margin={{ top: 55, right: 40, left: 15, bottom: 20 }}>
          <defs>
            <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9DF05E" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#9DF05E" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="lastYearGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="averageGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FBBF24" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#FBBF24" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#f0f0f0" />

          <XAxis
            dataKey="monthDisplay"
            tickLine={false}
            axisLine={false}
            tick={({ x, y, payload }) => (
              <text x={x} y={y} dy={15} textAnchor="middle" fill="#a9a9a9" fontSize={14}>
                {payload.value}
              </text>
            )}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={({ x, y, payload }) => (
              <text x={x} y={y} dx={-5} dy={2} textAnchor="end" fill="#a9a9a9" fontSize={14}>
                {payload?.value?.toLocaleString()}
              </text>
            )}
            label={{
              value: "(원/kg)",
              position: "insideTop",
              offset: -32.5,
              dx: -1,
              fill: "#a9a9a9",
              fontSize: 14,
            }}
          />

          <Tooltip content={CustomTooltip} />

          <Legend
            align="center"
            verticalAlign="bottom"
            iconType="circle"
            content={({ payload }) => {
              if (!payload) return null;

              const desiredOrder = ["금년", "전년", "평년"];
              const orderedPayload = desiredOrder.map((name) => payload.find((entry) => entry.value === name)).filter(Boolean);

              return (
                <div className="mt-[8px] flex justify-center gap-3">
                  {orderedPayload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-sm" style={{ color: entry.color }}>
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              );
            }}
          />

          <Area
            key={`average-${animationKey}`}
            type="monotone"
            dataKey="average"
            name="평년"
            stroke="#FBBF24"
            strokeWidth={2}
            fill="url(#averageGradient)"
            dot={{ fill: "#FBBF24", r: 2.5 }}
          />

          <Area
            key={`lastYear-${animationKey}`}
            type="monotone"
            dataKey="lastYear"
            name="전년"
            stroke="#60A5FA"
            strokeWidth={2}
            fill="url(#lastYearGradient)"
            dot={{ fill: "#60A5FA", r: 2.5 }}
          />

          <Area
            key={`current-${animationKey}`}
            type="monotone"
            dataKey="current"
            name="금년"
            stroke="#9DF05E"
            strokeWidth={2}
            fill="url(#currentGradient)"
            dot={{ fill: "#9DF05E", r: 2.5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketTrendsChart;
