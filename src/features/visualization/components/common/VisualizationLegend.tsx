import { useMemo, useState } from "react";
import type { LegendColor, LegendOptions } from "~/maps/constants/visualizationSetting";
import { getColorGradient } from "~/utils/colorGradient";
import LegendConfigModal from "./LegendConfigModal";

interface Props {
  minValue: number;
  maxValue: number;
  legendOptions: LegendOptions;
  onLevelChange?: (level: number) => void;
  onColorChange?: (color: LegendColor) => void;
  onPivotPointsChange?: (pivotPoints: number[]) => void;
}

const COLOR_OPTIONS: { value: LegendColor; baseColor: string }[] = [
  { value: "red", baseColor: "#ef4444" },
  { value: "green", baseColor: "#22c55e" },
  { value: "blue", baseColor: "#3b82f6" },
  { value: "purple", baseColor: "#a855f7" },
  { value: "indigo", baseColor: "#6366f1" },
  { value: "brown", baseColor: "#8b4513" },
];

const VisualizationLegend = ({ minValue, maxValue, legendOptions, onLevelChange, onColorChange, onPivotPointsChange }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { level, color, pivotPoints } = legendOptions;

  const steps = useMemo(() => {
    const colorGradient = getColorGradient(color);

    if (pivotPoints.length > 0) {
      const actualLevel = pivotPoints.length - 1;
      return Array.from({ length: actualLevel }, (_, i) => {
        const upperValue = pivotPoints[actualLevel - i];
        const lowerValue = pivotPoints[actualLevel - 1 - i];

        let rangeText;
        if (i === 0) {
          rangeText = `${lowerValue.toFixed(2)} 초과`;
        } else if (i === actualLevel - 1) {
          rangeText = `${upperValue.toFixed(2)} 이하`;
        } else {
          rangeText = `${lowerValue.toFixed(2)} ~ ${upperValue.toFixed(2)} 이하`;
        }

        return {
          value: rangeText,
          color: colorGradient(1 - i / (actualLevel - 1)),
          step: actualLevel - i,
        };
      });
    } else {
      const stepSize = (maxValue - minValue) / level;

      return Array.from({ length: level }, (_, i) => {
        const upperValue = maxValue - i * stepSize;
        const lowerValue = maxValue - (i + 1) * stepSize;

        let rangeText;
        if (i === 0) {
          rangeText = `${lowerValue.toFixed(2)} 초과`;
        } else if (i === level - 1) {
          rangeText = `${upperValue.toFixed(2)} 이하`;
        } else {
          rangeText = `${lowerValue.toFixed(2)} ~ ${upperValue.toFixed(2)} 이하`;
        }

        return {
          value: rangeText,
          color: colorGradient(1 - i / (level - 1)),
          step: level - i,
        };
      });
    }
  }, [minValue, maxValue, level, color, pivotPoints]);

  return (
    <div className="flex gap-3">
      {/* 범례 */}
      <div className="flex-1">
        <div className="flex flex-col">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <span className="w-full px-2 py-1 text-right text-xs" style={{ backgroundColor: step.color, color: "white" }}>
                {step.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 색상 선택 */}
      <div className="flex flex-col gap-1">
        {COLOR_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onColorChange?.(option.value)}
            className={`relative h-6 w-6 rounded-full border-2 ${color === option.value ? "border-blue-500" : "border-gray-300"}`}
            style={{ backgroundColor: option.baseColor }}
            title={option.value}
          >
            {color === option.value && <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">✓</span>}
          </button>
        ))}

        {/* 범례 설정 버튼 */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-xs text-white hover:bg-gray-600"
          title="범례 설정"
        >
          범례
        </button>
      </div>

      {onLevelChange && onPivotPointsChange && (
        <LegendConfigModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          level={level}
          color={color}
          pivotPoints={pivotPoints}
          minValue={minValue}
          maxValue={maxValue}
          onLevelChange={onLevelChange}
          onPivotPointsChange={onPivotPointsChange}
        />
      )}
    </div>
  );
};

export default VisualizationLegend;
