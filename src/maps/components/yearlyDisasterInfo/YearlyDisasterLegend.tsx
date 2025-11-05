import { useMemo } from "react";
import YearlyDisasterInfoMap from "~/maps/classes/YearlyDisasterInfoMap";
import { useMapList } from "~/maps/hooks/useMapList";
import { colorsRed } from "~/utils/gisColors";

const YearlyDisasterLegend = ({ mapId, features }) => {
  const mapList = useMapList<YearlyDisasterInfoMap>();
  const map = mapList.getMapById(mapId);

  const { minValue, maxValue } = useMemo(() => {
    if (!features || !Array.isArray(features.features)) return { minValue: 0, maxValue: 0 };

    let min = Infinity;
    let max = -Infinity;

    for (const feature of features.features) {
      const amt = feature?.properties?.stats?.[0]?.[map.selectedDisasterCategory];
      if (typeof amt === "number" && amt > 0) {
        min = Math.min(min, amt);
        max = Math.max(max, amt);
      }
    }

    return {
      minValue: min === Infinity ? 0 : min,
      maxValue: max === -Infinity ? 0 : max,
    };
  }, [features]);

  const gradientColors = [...colorsRed].reverse().join(", ");

  return (
    <div className="absolute left-[10px] top-[10px] flex w-[300px] flex-col gap-2 rounded-lg">
      <div className="rounded-lg border border-[#d9d9d9] bg-white px-[8px] py-[8px] pb-[4px] shadow">
        <div
          className="h-[15px] rounded-md"
          style={{
            background: features?.features?.length === 1 ? colorsRed[6] : `linear-gradient(to right, ${gradientColors})`,
          }}
        />

        <div className="mt-1 flex justify-between px-[2px] text-[14px] text-[#222]">
          {features?.features?.length === 1 ? (
            <span className="w-full text-center">
              {minValue?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              {map.selectedDisasterCategory === "total_dstr_sprt_amt" ? "천원" : "m²"}
            </span>
          ) : features?.features?.length === 2 ? (
            <>
              <span>
                {minValue?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                {map.selectedDisasterCategory === "total_dstr_sprt_amt" ? "천원" : "m²"}
              </span>
              <span>
                {maxValue?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                {map.selectedDisasterCategory === "total_dstr_sprt_amt" ? "천원" : "m²"}
              </span>
            </>
          ) : (
            <>
              <span>
                {minValue?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                {map.selectedDisasterCategory === "total_dstr_sprt_amt" ? "천원" : "m²"}
              </span>
              <span>
                {((minValue + maxValue) / 2)?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                {map.selectedDisasterCategory === "total_dstr_sprt_amt" ? "천원" : "m²"}
              </span>
              <span>
                {maxValue?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                {map.selectedDisasterCategory === "total_dstr_sprt_amt" ? "천원" : "m²"}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default YearlyDisasterLegend;
