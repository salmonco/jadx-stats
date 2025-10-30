import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from "recharts";
import { Card } from "antd";
import { PriceDashboardRegionResponse } from "~/services/types/visualizationTypes";

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 10} startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
};

const RegionalPieChart = ({ data }: { data: PriceDashboardRegionResponse }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!data || !data.length) return null;

  const regionVolumes = data.reduce(
    (acc, dateData) => {
      dateData.data.forEach((item) => {
        if (item.average_weight === null) return;
        if (!acc[item.market_region_name]) acc[item.market_region_name] = 0;
        acc[item.market_region_name] += item.average_weight;
      });
      return acc;
    },
    {} as Record<string, number>
  );

  const totalVolume = Object.values(regionVolumes).reduce((sum, v) => sum + v, 0);
  const sortedEntries = Object.entries(regionVolumes).sort((a, b) => b[1] - a[1]);

  const chartData = sortedEntries.map(([region, volume], index) => {
    const percent = totalVolume ? (volume / totalVolume) * 100 : 0;
    let color;
    if (index < sortedEntries.length * 0.3) color = "#4CAF50";
    else if (index < sortedEntries.length * 0.7) color = "#FFB74D";
    else color = "#EF5350";

    return { region, volume, volumePercent: percent, color };
  });

  return (
    <Card>
      <ResponsiveContainer width="100%" height={450}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="volume"
            nameKey="region"
            cx="50%"
            cy="50%"
            outerRadius={160}
            innerRadius={100}
            activeIndex={activeIndex ?? undefined}
            activeShape={renderActiveShape}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            label={({ region, volumePercent }) => (volumePercent >= 5 ? `${region} (${volumePercent.toFixed(1)}%)` : "")}
            labelLine={(props: any) => (props.payload.volumePercent >= 5 ? <path {...props} /> : null)}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, _, props: any) => {
              const nameWithUnit = `${props.payload.region} 반입량(kg)`;
              return [`${value.toLocaleString()}`, nameWithUnit];
            }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ top: 0, right: 0, fontSize: 16 }}
            formatter={(value, entry: any) => {
              const percent = entry.payload.volumePercent?.toFixed(1) ?? "0";
              return `${value} (${percent}%)`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RegionalPieChart;
