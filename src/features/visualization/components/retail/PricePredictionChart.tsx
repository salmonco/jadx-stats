import { ModelType } from "~/pages/visualization/retail/PricePrediction";
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Bar } from "recharts";
import dayjs from "dayjs";

interface Props {
  model: ModelType;
  market: string;
  results: any[] | null;
  baseDate: string | null;
  holidays: string[] | null;
}

const getDayLabels = (model: ModelType) => {
  if (model === "3일 예상 가격") return ["1일 후", "2일 후", "3일 후"];
  if (model === "7일 예상 가격") return ["1일 후", "2일 후", "3일 후", "4일 후", "5일 후", "6일 후", "7일 후"];
  if (model === "1개월 예상 가격") return ["1주 후", "2주 후", "3주 후", "4주 후"];
  return [];
};

const getPriceKeys = (model: ModelType) => {
  if (model === "3일 예상 가격" || model === "7일 예상 가격") {
    return [
      "predc_prc_day_1",
      "predc_prc_day_2",
      "predc_prc_day_3",
      ...(model === "7일 예상 가격" ? ["predc_prc_day_4", "predc_prc_day_5", "predc_prc_day_6", "predc_prc_day_7"] : []),
    ];
  }
  if (model === "1개월 예상 가격") {
    return ["predc_prc_wkly_1", "predc_prc_wkly_2", "predc_prc_wkly_3", "predc_prc_wkly_4"];
  }
  return [];
};

const dayKeyMap = {
  "1일 후": "next_day1",
  "2일 후": "next_day2",
  "3일 후": "next_day3",
  "4일 후": "next_day4",
  "5일 후": "next_day5",
  "6일 후": "next_day6",
  "7일 후": "next_day7",
  "1주 후": "next_week1",
  "2주 후": "next_week2",
  "3주 후": "next_week3",
  "4주 후": "next_week4",
};

const PricePredictionChart = ({ model, market, results, baseDate, holidays }: Props) => {
  if (!results || results.length === 0) return null;

  const labels = getDayLabels(model);
  const keys = getPriceKeys(model);

  const getSeries = (type: "예측 가격" | "반입량 적용") => {
    const found = results.find((r) => r.type === type);
    const row = found?.data?.[market];
    if (!row) return Array(keys.length).fill(null);
    return keys.map((k) => {
      const v = row[k as keyof typeof row];
      return typeof v === "number" ? v : null;
    });
  };

  const predict = getSeries("예측 가격");
  const adjust = results.some((r) => r.type === "반입량 적용") ? getSeries("반입량 적용") : predict;
  const tot_vol = results.find((r) => r.type === "예측 가격")?.data?.[market]?.tot_vol;
  const actl_prc = results.find((r) => r.type === "예측 가격")?.data?.[market]?.actl_prc;

  const chartData = labels.map((label, i) => {
    const data: any = {
      label,
      predict: predict[i],
      adjust: adjust[i],
    };

    const key = dayKeyMap[label];

    if (actl_prc && typeof actl_prc === "object" && key) {
      data.actl_prc = actl_prc[key] ?? null;
    } else if (actl_prc != null && typeof actl_prc !== "object") {
      data.actl_prc = actl_prc;
    }

    if (tot_vol && typeof tot_vol === "object" && key) {
      data.tot_vol = tot_vol[key] ?? null;
    } else if (tot_vol != null && typeof tot_vol !== "object") {
      data.tot_vol = tot_vol;
    }

    if (baseDate) {
      const base = dayjs(baseDate);
      const timeUnit = model.includes("일") ? "day" : "week";
      const dateStr = base.add(i + 1, timeUnit).format("YYYY-MM-DD");
      const shortDate = base.add(i + 1, timeUnit).format("MM-DD");
      const isSunday = base.add(i + 1, timeUnit).day() === 0;
      const isHoliday = holidays?.includes(dateStr) || isSunday;

      data.isHoliday = isHoliday;
      data.date = dateStr;
      data.label = `${label}(${shortDate})`;
    }

    return data;
  });

  return (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart data={chartData} margin={{ top: 20, right: 0, bottom: 10, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tick={({ x, y, payload }) => {
            const data = chartData.find((item) => item.label === payload.value);
            const isHoliday = data?.isHoliday;

            return (
              <text x={x} y={y} dy={12} fill={isHoliday ? "red" : "#666"} textAnchor="middle" fontSize={14}>
                {payload.value}
              </text>
            );
          }}
        />

        <YAxis yAxisId="left" orientation="left" tickFormatter={(v) => `${v?.toLocaleString()}원`} />
        <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${(v / 1000).toFixed(1).toLocaleString()}톤`} />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload || !payload.length) return null;

            const data = chartData.find((item) => item.label === label);
            const isHoliday = data?.isHoliday;

            return (
              <div className="flex flex-col gap-[4px] rounded border bg-white px-[12px] py-[8px] shadow">
                <div className="label mb-[4px] flex items-center gap-[4px] font-medium">
                  {label} {isHoliday && <p className="text-sm text-red-500">(공휴일)</p>}
                </div>
                {payload.map((entry: any, idx: number) => (
                  <p key={idx} className="text-sm" style={{ color: entry.color }}>
                    {entry.name} :{" "}
                    {entry.dataKey === "tot_vol"
                      ? `${(entry.value / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}`
                      : `${Number(entry.value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                  </p>
                ))}
              </div>
            );
          }}
        />

        <Legend />
        <Bar yAxisId="left" dataKey="predict" fill="#3b82f6" name="예측 가격(원/kg)" barSize={20} />
        <Bar yAxisId="left" dataKey="adjust" fill="#52c41a" name="반입량 적용 예측 가격(원/kg)" barSize={20} />
        <Bar yAxisId="left" dataKey="actl_prc" fill="#e11d48" name="실 가격(원/kg)" barSize={20} />
        {/* <Line yAxisId="right" type="monotone" dataKey="tot_vol" stroke="#f59e0b" strokeWidth={3} dot={{ r: 3 }} name="반입량" /> */}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default PricePredictionChart;
