import { useMemo } from "react";
import VisualizationLegend from "~/features/visualization/components/common/VisualizationLegend";
import { HibernationFeatureCollection } from "~/features/visualization/layers/HibernationVegetableCultivationLayer";
import { CropType } from "~/maps/constants/hibernationVegetableCultivation";
import type { LegendColor, LegendOptions } from "~/maps/constants/visualizationSetting";

interface Props {
  features: HibernationFeatureCollection | null;
  selectedCrop: CropType;
  legendOptions: LegendOptions;
  onLevelChange?: (level: number) => void;
  onColorChange?: (color: LegendColor) => void;
  onPivotPointsChange?: (pivotPoints: number[]) => void;
}

const HibernationVegetableCultivationLegend = ({ features, selectedCrop, legendOptions, onLevelChange, onColorChange, onPivotPointsChange }: Props) => {
  const { minValue, maxValue } = useMemo(() => {
    if (!features || !Array.isArray(features.features)) return { minValue: 0, maxValue: 0 };

    const values = features.features
      .map((feature) => {
        const matter = feature?.properties?.area_chg.chg_mttr.find((m) => m.crop_nm === selectedCrop);
        if (!matter) return null;
        return matter.chg_cn / 10000;
      })
      .filter((v): v is number => v !== null);

    if (values.length === 0) return { minValue: 0, maxValue: 0 };

    const maxAbs = Math.max(...values.map(Math.abs));
    return { minValue: -maxAbs, maxValue: maxAbs };
  }, [features, selectedCrop]);

  return (
    <VisualizationLegend
      minValue={minValue}
      maxValue={maxValue}
      legendOptions={legendOptions}
      onLevelChange={onLevelChange}
      onColorChange={onColorChange}
      onPivotPointsChange={onPivotPointsChange}
    />
  );
};

export default HibernationVegetableCultivationLegend;
