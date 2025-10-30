import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector } from "recharts";

// 2023년 작물별 재배면적 구성 데이터
const cropDistribution = [
  { name: "벼", value: 5, color: "#0ea5e9" },
  { name: "맥류", value: 1750, color: "#f97316" },
  { name: "두류", value: 1220, color: "#84cc16" },
  { name: "잡곡", value: 880, color: "#14b8a6" },
  { name: "서류", value: 5270, color: "#a3a3a3" },
  { name: "채소", value: 17668, color: "#22c55e" },
  { name: "특용작물", value: 1029, color: "#eab308" },
  { name: "과수", value: 22890, color: "#8b5cf6" },
  { name: "기타수원지", value: 1650, color: "#06b6d4" },
  { name: "기타작물", value: 9997, color: "#6b7280" },
];

// 총 재배면적 계산
const totalArea = cropDistribution.reduce((sum, item) => sum + item.value, 0);

// 비율 계산 및 데이터 가공
const cropDistributionWithPercentage = cropDistribution.map((item) => ({
  ...item,
  percentage: ((item.value / totalArea) * 100).toFixed(1),
}));

// 활성화된 섹터를 렌더링하기 위한 컴포넌트
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 10} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <text x={cx} y={cy - 15} dy={8} textAnchor="middle" fill="#333" fontSize={14} fontWeight="bold">
        {payload.name}
      </text>
      <text x={cx} y={cy + 15} textAnchor="middle" fill="#333" fontSize={12}>
        {value.toLocaleString()} ha ({(percent * 100).toFixed(1)}%)
      </text>
    </g>
  );
};

export default function CropDistributionPieChart() {
  const [activeIndex, setActiveIndex] = useState(null);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  // 커스텀 레이블 렌더링 함수
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // 작은 세그먼트는 레이블 표시 안함
    if (percent < 0.03) return null;

    return (
      <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="medium">
        {name}
      </text>
    );
  };

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={cropDistributionWithPercentage}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={130}
            paddingAngle={1}
            dataKey="value"
            labelLine={false}
            label={renderCustomizedLabel}
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
          >
            {cropDistributionWithPercentage.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={1} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => {
              return [`${value.toLocaleString()} ha (${props.payload.percentage}%)`, name];
            }}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #f0f0f0",
              borderRadius: "4px",
              padding: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconSize={10}
            iconType="circle"
            formatter={(value, entry) => {
              const payload = entry.payload as unknown as {
                index: number;
                percentage: string;
                color: string;
              };

              return (
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: activeIndex === payload.index ? "#000" : "#666",
                    fontWeight: activeIndex === payload.index ? "bold" : "normal",
                  }}
                >
                  {value} ({payload.percentage}%)
                </span>
              );
            }}
            onClick={(_, index) => {
              setActiveIndex(activeIndex === index ? null : index);
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
