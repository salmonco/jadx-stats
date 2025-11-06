import { useMemo } from "react";
import { colorsRed } from "~/utils/gisColors";

const MandarinTreeAgeDistributionLegend = ({ features }) => {
  const { minValue, maxValue } = useMemo(() => {
    if (!features || !Array.isArray(features.features)) return { minValue: 0, maxValue: 0 };

    let min = Infinity;
    let max = -Infinity;

    for (const feature of features.features) {
      const averageAge = feature?.properties?.stats[0]?.total_area;
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

  // colorsRed 배열을 역순으로 사용하여 CSS gradient 생성 (높은 나이 = 진한 빨강)
  const gradientColors = [...colorsRed].reverse().join(", ");

  return (
    <div className="flex flex-col rounded-lg">
      <div className="rounded-lg border border-[#d9d9d9] bg-[#fff] px-[8px] py-[8px] pb-[4px]">
        <div
          style={{
            height: "15px",
            background: features?.features?.length === 1 ? colorsRed[6] : `linear-gradient(to right, ${gradientColors})`,
            borderRadius: "4px",
          }}
        />
        <div className="flex justify-between px-[2px] text-[14px] text-[#222]">
          {features?.features?.length === 1 ? (
            <span className="w-full text-center">{((minValue + maxValue) / 2 / 10000).toFixed(1)}ha</span>
          ) : features?.features?.length === 2 ? (
            <>
              <span>{(minValue / 10000).toFixed(1)}ha</span>
              <span>{(maxValue / 10000).toFixed(1)}ha</span>
            </>
          ) : (
            <>
              <span>{(minValue / 10000).toFixed(1)}ha</span>
              <span>{((minValue + maxValue) / 2 / 10000).toFixed(1)}ha</span>
              <span>{(maxValue / 10000).toFixed(1)}ha</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MandarinTreeAgeDistributionLegend;
