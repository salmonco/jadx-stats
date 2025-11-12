import * as d3 from "d3";
import { useMemo } from "react";
import VisualizationLegend from "~/features/visualization/components/common/VisualizationLegend";
import { AgingStatusFeatureCollection } from "~/features/visualization/layers/AgingStatusLayer";
import type { LegendColor, LegendOptions } from "~/maps/constants/visualizationSetting";

interface Props {
  features: AgingStatusFeatureCollection | null;
  legendOptions: LegendOptions;
  onLevelChange?: (level: number) => void;
  onColorChange?: (color: LegendColor) => void;
  onPivotPointsChange?: (pivotPoints: number[]) => void;
}

const AgingStatusLegend = ({ features, legendOptions, onLevelChange, onColorChange, onPivotPointsChange }: Props) => {
  const { minValue, maxValue } = useMemo(() => {
    if (!features || !Array.isArray(features.features)) return { minValue: 0, maxValue: 0 };

    const values = features.features.map((feature) => feature?.properties?.stats?.avg_age).filter((v): v is number => v != null && typeof v === "number");

    if (values.length === 0) return { minValue: 0, maxValue: 0 };

    const [min, max] = d3.extent(values) as [number, number];
    return { minValue: min, maxValue: max };
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

export default AgingStatusLegend;
