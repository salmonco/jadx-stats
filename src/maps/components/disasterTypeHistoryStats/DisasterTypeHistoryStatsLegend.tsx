import { useMemo } from "react";
import VisualizationLegend from "~/features/visualization/components/common/VisualizationLegend";
import { DisasterTypeHistoryStatsFeatureCollection } from "~/features/visualization/layers/DisasterTypeHistoryStatsLayer";
import { CULTIVATION_TYPE, CultivationType } from "~/maps/constants/disasterTypeHistoryStats";
import { LegendColor, LegendOptions } from "~/maps/constants/visualizationSetting";

interface Props {
  features: DisasterTypeHistoryStatsFeatureCollection | null;
  legendOptions: LegendOptions;
  selectedCultivationType: CultivationType;
  onLevelChange?: (level: number) => void;
  onColorChange?: (color: LegendColor) => void;
  onPivotPointsChange?: (pivotPoints: number[]) => void;
}

const DisasterTypeHistoryStatsLegend = ({ features, legendOptions, selectedCultivationType, onLevelChange, onColorChange, onPivotPointsChange }: Props) => {
  const { minValue, maxValue } = useMemo(() => {
    if (!features || !Array.isArray(features.features)) return { minValue: 0, maxValue: 0 };

    let min = Infinity;
    let max = -Infinity;

    for (const feature of features.features) {
      let amt = 0;
      if (selectedCultivationType === CULTIVATION_TYPE.전체) {
        amt = feature?.properties?.stats?.[0]?.total_dstr_sprt_amt;
      }
      if (selectedCultivationType === CULTIVATION_TYPE.시설) {
        amt = feature?.properties?.stats?.[0]?.house_cifru_sprt_amt;
      }
      if (selectedCultivationType === CULTIVATION_TYPE.노지) {
        amt = feature?.properties?.stats?.[0]?.opf_cifru_sprt_amt;
      }
      if (typeof amt === "number" && amt > 0) {
        min = Math.min(min, amt);
        max = Math.max(max, amt);
      }
    }

    return {
      minValue: min === Infinity ? 0 : min,
      maxValue: max === -Infinity ? 0 : max,
    };
  }, [features, selectedCultivationType]);

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
