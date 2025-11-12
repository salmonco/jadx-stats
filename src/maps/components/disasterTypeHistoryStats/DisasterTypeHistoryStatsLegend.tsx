import { useMemo } from "react";
import VisualizationLegend from "~/features/visualization/components/common/VisualizationLegend";
import { DisasterTypeHistoryStatsFeatureCollection } from "~/features/visualization/layers/DisasterTypeHistoryStatsLayer";
import { LegendColor, LegendOptions } from "~/maps/constants/visualizationSetting";

interface Props {
  features: DisasterTypeHistoryStatsFeatureCollection | null;
  legendOptions: LegendOptions;
  onLevelChange?: (level: number) => void;
  onColorChange?: (color: LegendColor) => void;
  onPivotPointsChange?: (pivotPoints: number[]) => void;
}

const DisasterTypeHistoryStatsLegend = ({ features, legendOptions, onLevelChange, onColorChange, onPivotPointsChange }: Props) => {
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
      minValue: min === Infinity ? 0 : min / 10_000,
      maxValue: max === -Infinity ? 0 : max / 10_000,
    };
  }, [features]);

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

export default DisasterTypeHistoryStatsLegend;
