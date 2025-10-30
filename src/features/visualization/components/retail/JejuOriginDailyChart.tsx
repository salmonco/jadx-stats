import { ResponsiveContainer, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Line } from "recharts";
import { PriceDashboardMonthlyResponse } from "~/services/types/visualizationTypes";

const JejuOriginDailyChart = ({ data }: { data: PriceDashboardMonthlyResponse }) => {
  const processedData = data?.map((entry) => {
    const d = entry.data?.[0];
    return {
      day: entry.crtr_ymd.slice(6, 8) + "일",
      total_weight: d?.total_weight ?? 0,
      average_price: d?.average_price ?? null,
      previous_day_price: d?.previous_day_price?.toFixed(0) ?? null,
      previous_week_price: d?.previous_week_price?.toFixed(0) ?? null,
      previous_month_price: d?.previous_month_price?.toFixed(0) ?? null,
      previous_year_price: d?.previous_year_price?.toFixed(0) ?? null,
      average_year_price: d?.average_year_price?.toFixed(0) ?? null,
      market_total_weight: d?.market_total_weight ?? null,
    };
  });

  const formatNumber = (value: number | null | undefined) => {
    if (value == null || isNaN(value)) return "-";
    return (Math.round(value * 10) / 10).toLocaleString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="rounded border bg-white p-2 text-sm shadow">
        <div className="mb-1 font-semibold">{label}</div>
        {payload.map((entry: any, index: number) => (
          <div key={index} style={{ color: entry.color }}>
            {entry.name}: {formatNumber(entry.value)}
            {/* {entry.name.includes("반입량") ? "kg" : "원"} */}
          </div>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={440}>
      <ComposedChart data={processedData} margin={{ top: 20, right: 50, left: 40, bottom: 0 }}>
        <XAxis dataKey="day" />
        <YAxis yAxisId="left" label={{ value: "반입량(kg)", angle: -90, position: "middle", dx: -55 }} stroke="#888888" tickFormatter={formatNumber} />
        <YAxis
          yAxisId="right"
          orientation="right"
          label={{ value: "평균가(원/kg)", angle: 90, position: "middle", dx: 40 }}
          stroke="#888888"
          tickFormatter={formatNumber}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />

        <Bar yAxisId="left" dataKey="total_weight" name="시장 반입량(kg)" fill="#FF8042" barSize={20} radius={[4, 4, 0, 0]} />
        <Bar yAxisId="left" dataKey="market_total_weight" name="전국 반입량(kg)" fill="#a9a9a9" barSize={20} radius={[4, 4, 0, 0]} />

        <Line yAxisId="right" type="monotone" dataKey="average_price" name="금일 정산 평균가(원/kg)" stroke="#0000FF" strokeWidth={2} />
        <Line yAxisId="right" type="monotone" dataKey="previous_day_price" name="전일 평균가(원/kg)" stroke="#C71585" strokeWidth={2} />
        <Line yAxisId="right" type="monotone" dataKey="previous_week_price" name="전주 평균가(원/kg)" stroke="#4B0082" strokeWidth={2} />
        <Line yAxisId="right" type="monotone" dataKey="previous_month_price" name="전월 평균가(원/kg)" stroke="#008080" strokeWidth={2} />
        <Line yAxisId="right" type="monotone" dataKey="previous_year_price" name="전년 동월 평균가(원/kg)" stroke="#FFA500" strokeWidth={2} />
        <Line yAxisId="right" type="monotone" dataKey="average_year_price" name="평년 동월 평균가(원/kg)" stroke="#228B22" strokeWidth={2} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default JejuOriginDailyChart;
