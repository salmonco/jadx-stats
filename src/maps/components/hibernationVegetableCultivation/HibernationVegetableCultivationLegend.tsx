import { interpolateRdYlBu } from "d3";
import { useMemo } from "react";
import { HibernationVegetableCultivationFeatureCollection } from "~/features/visualization/layers/HibernationVegetableCultivationLayer";
import { CropType } from "~/maps/constants/hibernationVegetableCultivation";

interface Props {
  features: HibernationVegetableCultivationFeatureCollection | null;
  selectedCrop: CropType;
}

const HibernationVegetableCultivationLegend = ({ features, selectedCrop }: Props) => {
  const maxAbsValue = useMemo(() => {
    if (!features || !Array.isArray(features.features)) return 0;

    let max = -Infinity;

    for (const feature of features.features) {
      const matters = feature?.properties?.area_chg.chg_mttr;
      if (!Array.isArray(matters)) continue;

      for (const matter of matters) {
        if (matter.crop_nm === selectedCrop) {
          const value = matter.chg_cn;
          if (typeof value === "number" && !isNaN(value)) {
            max = Math.max(max, Math.abs(value) / 10000);
          }
        }
      }
    }

    return max === -Infinity ? 0 : max;
  }, [features, selectedCrop]);

  const minValue = -maxAbsValue;
  const maxValue = maxAbsValue;
  const colorScale1 = (t) => interpolateRdYlBu(1 - t);

  const gradientSteps1 = Array.from({ length: 100 }, (_, i) => (
    <div
      key={i}
      style={{
        width: "1%",
        height: "15px",
        backgroundColor: colorScale1(i / 100),
        display: "inline-block",
      }}
    />
  ));

  return (
    <div style={{ position: "absolute", top: 10, left: 10, zIndex: 100 }} className="flex w-[280px] flex-col gap-2 rounded-lg">
      <div className="rounded-lg border border-[#d9d9d9] bg-[#fff] px-[8px] py-[8px] pb-[4px]">
        <div className="flex justify-center">{gradientSteps1}</div>
        <div className="flex justify-between px-[2px] text-[14px] text-[#222]">
          <span>{minValue.toFixed(1)}</span>
          <span>0</span>
          <span>{maxValue.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default HibernationVegetableCultivationLegend;
