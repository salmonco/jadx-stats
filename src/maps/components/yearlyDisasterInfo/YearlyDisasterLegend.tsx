import { useMemo } from "react";
import VisualizationLegend from "~/features/visualization/components/common/VisualizationLegend";
import { YearlyDisasterFeatureCollection } from "~/features/visualization/layers/YearlyDisasterLayer";
import { LegendColor, LegendOptions } from "~/maps/constants/visualizationSetting";

interface Props {
  features: YearlyDisasterFeatureCollection | null;
  legendOptions: LegendOptions;
  selectedDisasterCategory: string;
  onLevelChange?: (level: number) => void;
  onColorChange?: (color: LegendColor) => void;
  onPivotPointsChange?: (pivotPoints: number[]) => void;
}

const YearlyDisasterLegend = ({ features, legendOptions, selectedDisasterCategory, onLevelChange, onColorChange, onPivotPointsChange }: Props) => {
  const { minValue, maxValue } = useMemo(() => {
    if (!features || !Array.isArray(features.features)) return { minValue: 0, maxValue: 0 };

    let min = Infinity;
    let max = -Infinity;

    for (const feature of features.features) {
      const amt = feature?.properties?.stats?.[0]?.[selectedDisasterCategory];
      if (typeof amt === "number" && amt > 0) {
        min = Math.min(min, amt);
        max = Math.max(max, amt);
      }
    }

    return {
      minValue: min === Infinity ? 0 : min,
      maxValue: max === -Infinity ? 0 : max,
    };
  }, [features, selectedDisasterCategory]);

  // TODO: 범례에 단위 표기
  // selectedDisasterCategory === "total_dstr_sprt_amt" ? "천원" : "m²"
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

export default YearlyDisasterLegend;
