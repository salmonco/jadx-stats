import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from "recharts";

// Props 타입 정의
interface PopulationData {
  age: string;
  male: number;
  female: number;
}

interface PopulationPyramidChartCoreProps {
  data: PopulationData[];
  showLabels?: boolean;
  height?: string | number;
  maxValue?: number;
  tickFontSize?: number;
}

// 고정된 최대값
const FIXED_MAX_VALUE = 13500;

export default function PopulationPyramidChartCore({
  data,
  showLabels = true,
  height = 600,
  maxValue = FIXED_MAX_VALUE,
  tickFontSize = 14,
}: PopulationPyramidChartCoreProps) {
  // 데이터 처리 - 피라미드 형태로 변환
  const processedData = useMemo(() => {
    if (!data) return [];

    return data.map((item) => ({
      age: item.age,
      male: item.male,
      female: item.female,
      maleAbs: Math.abs(item.male),
      femaleAbs: item.female,
    }));
  }, [data]);

  // 현재 연도 통계 계산
  const currentYearStats = useMemo(() => {
    if (!processedData.length) return { totalMale: 0, totalFemale: 0, total: 0 };

    const totalMale = processedData.reduce((sum, item) => sum + item.maleAbs, 0);
    const totalFemale = processedData.reduce((sum, item) => sum + item.femaleAbs, 0);
    const total = totalMale + totalFemale;

    return {
      totalMale,
      totalFemale,
      total,
    };
  }, [processedData]);

  // 커스텀 라벨 컴포넌트 (마우스 오버 시 값 표시)
  const CustomLabel = (props: any) => {
    const { x, y, width, height, value } = props;

    if (!value || Math.abs(value) < 500) return null;

    const displayValue = Math.abs(value);
    const isNegative = value < 0;

    // 남성(음수)도 width를 더해서 막대 끝에 label 위치
    const labelX = isNegative
      ? Number(x) + Number(width) - 8 // ← width를 더해줘야 막대 끝!
      : Number(x) + Number(width) + 8;
    const labelY = Number(y) + Number(height) / 2;

    return (
      <text x={labelX} y={labelY} fill="#666" textAnchor={isNegative ? "end" : "start"} dy={3} fontSize="12" fontWeight="500" opacity={0.8}>
        {displayValue >= 1000 ? `${(displayValue / 1000).toFixed(1)}k` : displayValue}
      </text>
    );
  };

  // 커스텀 툴팁 (더 상세한 정보 표시)
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const maleValue = payload[0] ? Math.abs(payload[0].value) : 0;
      const femaleValue = payload[1] ? payload[1].value : 0;
      const total = maleValue + femaleValue;
      const malePercent = total > 0 ? Math.round((maleValue / total) * 100) : 0;
      const femalePercent = total > 0 ? Math.round((femaleValue / total) * 100) : 0;

      // 전체 인구 대비 비율 계산
      const totalPopulation = currentYearStats.total;
      const ageGroupPercent = totalPopulation > 0 ? Math.round((total / totalPopulation) * 100 * 10) / 10 : 0;

      return (
        <div className="min-w-[280px] rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <p className="mb-3 border-b pb-2 text-center font-semibold text-gray-800">{label}</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center font-medium text-[#0088fe]">
                <span className="mr-2 h-3 w-3 rounded-full bg-[#0088fe]"></span>👨 남성:
              </span>
              <span className="text-right font-bold">
                {maleValue.toLocaleString()}명<div className="text-xs text-gray-500">({malePercent}%)</div>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center font-medium text-[#ff7300]">
                <span className="mr-2 h-3 w-3 rounded-full bg-[#ff7300]"></span>👩 여성:
              </span>
              <span className="text-right font-bold">
                {femaleValue.toLocaleString()}명<div className="text-xs text-gray-500">({femalePercent}%)</div>
              </span>
            </div>

            <div className="mt-3 border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">연령대 총계:</span>
                <span className="font-bold text-gray-800">{total.toLocaleString()}명</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm text-gray-500">전체 인구 대비:</span>
                <span className="font-semibold text-blue-600">{ageGroupPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const margin = tickFontSize > 14 ? { top: 20, right: 50, left: 0, bottom: 5 } : { top: 10, right: 40, left: -10, bottom: 0 };

  return (
    <div className="w-full">
      <div style={{ height: typeof height === "number" ? `${height}px` : height }}>
        {processedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData} layout="vertical" margin={margin}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis type="number" domain={[-maxValue, maxValue]} tickFormatter={(value) => `${Math.abs(value).toLocaleString()}`} tick={{ fontSize: tickFontSize }} />
              <YAxis dataKey="age" type="category" width={90} tick={{ fontSize: tickFontSize }} axisLine={{ stroke: "#ccc" }} />
              {tickFontSize > 14 && <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />}
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ fontSize: `${tickFontSize}px`, paddingLeft: "110px" }}
                formatter={(value) => <span className="text-sm font-medium">{value}</span>}
              />
              <Bar dataKey="male" name="남성" fill="#0088fe" radius={[0, 4, 4, 0]} label={showLabels ? <CustomLabel /> : false} />
              <Bar dataKey="female" name="여성" fill="#ff7300" radius={[4, 0, 0, 4]} label={showLabels ? <CustomLabel /> : false} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-gray-500">데이터를 불러오는 중...</div>
          </div>
        )}
      </div>
    </div>
  );
}

// 타입들도 export
export type { PopulationData, PopulationPyramidChartCoreProps };
