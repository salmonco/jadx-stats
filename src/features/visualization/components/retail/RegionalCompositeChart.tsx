import { Card } from "antd";
import { ComposedChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Bar, Line, Cell } from "recharts";
import { PriceDashboardRegionResponse } from "~/services/types/visualizationTypes";

const RegionalCompositeChart = ({ data }: { data: PriceDashboardRegionResponse }) => {
  if (!data || !data.length) return null;

  // 모든 날짜의 권역별 평균 계산
  const regionAverages = data.reduce(
    (acc, dateData) => {
      dateData.data.forEach((item) => {
        if (item.average_price === null || item.average_weight === null) return;

        if (!acc[item.market_region_name]) {
          acc[item.market_region_name] = {
            totalPrice: 0,
            totalVolume: 0,
            count: 0,
          };
        }

        acc[item.market_region_name].totalPrice += item.average_price;
        acc[item.market_region_name].totalVolume += item.average_weight;
        acc[item.market_region_name].count += 1;
      });
      return acc;
    },
    {} as Record<string, { totalPrice: number; totalVolume: number; count: number }>
  );

  // 평균값 계산 및 정렬
  const sortedData = Object.entries(regionAverages)
    .map(([region, stats]) => ({
      region,
      price: stats.totalPrice / stats.count,
      volume: stats.totalVolume / stats.count,
    }))
    .sort((a, b) => b.volume - a.volume);

  // 차트 데이터 가공
  const chartData = sortedData.map((item, index) => {
    // 상위 30%, 중위 40%, 하위 30%로 구분
    let color;
    if (index < sortedData.length * 0.3) {
      color = "#4CAF50";
    } else if (index < sortedData.length * 0.7) {
      color = "#FFB74D";
    } else {
      color = "#EF5350";
    }

    return {
      region: item.region,
      price: item.price,
      volume: item.volume,
      color,
    };
  });

  return (
    <Card>
      <ResponsiveContainer width="100%" height={450}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 45, bottom: 5, left: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="region" />
          <YAxis yAxisId="right" orientation="right" label={{ value: "반입량(kg)", angle: 90, position: "middle", dx: 55 }} />
          <YAxis yAxisId="left" orientation="left" label={{ value: "평균 가격(원/kg)", angle: -90, position: "middle", dx: -40 }} />
          <Tooltip
            formatter={(value: number, name: string) => {
              const nameWithUnit = name === "반입량" ? `${name}(kg)` : `${name}(원/kg)`;
              return [
                name.includes("반입량") ? `${value.toLocaleString()}` : `${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                nameWithUnit,
              ];
            }}
          />

          <Legend
            payload={[
              { value: "평균가(원/kg)", type: "line", color: "#3f51b5" },
              { value: "반입량(kg) 상위 30%", type: "square", color: "#4CAF50" },
              { value: "반입량(kg) 중위 40%", type: "square", color: "#FFB74D" },
              { value: "반입량(kg) 하위 30%", type: "square", color: "#EF5350" },
            ]}
          />

          <Bar name="반입량" dataKey="volume" yAxisId="right" barSize={50} radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
          <Line
            type="monotone"
            name="평균가"
            dataKey="price"
            yAxisId="left"
            stroke="#3f51b5"
            strokeWidth={2}
            dot={{ r: 4, stroke: "#3f51b5", strokeWidth: 2, fill: "#fff" }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RegionalCompositeChart;
