import { useMemo } from "react";
import { colorsRed } from "~/utils/gisColors";

const AgingStatusLegend = ({ features }) => {
  const { minValue, maxValue } = useMemo(() => {
    if (!features || !Array.isArray(features.features)) return { minValue: 0, maxValue: 0 };

    let min = Infinity;
    let max = -Infinity;

    for (const feature of features.features) {
      const averageAge = feature?.properties?.stats?.avg_age;
      if (typeof averageAge === "number" && !isNaN(averageAge)) {
        min = Math.min(min, averageAge);
        max = Math.max(max, averageAge);
      }
    }

    return {
      minValue: min === Infinity ? 0 : min,
      maxValue: max === -Infinity ? 0 : max,
    };
  }, [features]);

  const gradientColors = [...colorsRed].reverse().join(", ");

  return (
    <div style={{ position: "absolute", top: 10, left: 10, zIndex: 100 }} className="flex w-[280px] flex-col gap-2 rounded-lg">
      <div className="rounded-lg border border-[#d9d9d9] bg-[#fff] px-[8px] py-[8px] pb-[4px]">
        <div
          className="h-[15px] rounded-md"
          style={{
            background: features?.features?.length === 1 ? colorsRed[6] : `linear-gradient(to right, ${gradientColors})`,
          }}
        />
        <div className="flex justify-between px-[2px] text-[14px] text-[#222]">
          {features?.features?.length === 1 ? (
            // 폴리곤 1개일 때: 중간값만 중앙에 표시
            <span className="w-full text-center">{((minValue + maxValue) / 2).toFixed(2)}세</span>
          ) : features?.features?.length === 2 ? (
            // 폴리곤 2개일 때: min, max만 표시
            <>
              <span>{minValue.toFixed(2)}세</span>
              <span>{maxValue.toFixed(2)}세</span>
            </>
          ) : (
            // 그 외: min, 중간, max
            <>
              <span>{minValue.toFixed(2)}세</span>
              <span>{((minValue + maxValue) / 2).toFixed(2)}세</span>
              <span>{maxValue.toFixed(2)}세</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgingStatusLegend;
