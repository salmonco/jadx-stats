import { useState } from "react";
import type { LegendColor } from "~/maps/constants/visualizationSetting";

interface Props {
  level: number;
  color: LegendColor;
  pivotPoints: number[];
  onLevelChange: (level: number) => void;
  onColorChange: (color: LegendColor) => void;
  onPivotPointsChange: (pivotPoints: number[]) => void;
}

const COLOR_OPTIONS: { value: LegendColor; label: string; color: string }[] = [
  { value: "red", label: "빨강", color: "#ef4444" },
  { value: "green", label: "초록", color: "#22c55e" },
  { value: "blue", label: "파랑", color: "#3b82f6" },
  { value: "purple", label: "보라", color: "#a855f7" },
  { value: "indigo", label: "남색", color: "#6366f1" },
  { value: "brown", label: "갈색", color: "#a3a3a3" },
];

const LegendSettings = ({ level, color, pivotPoints, onLevelChange, onColorChange, onPivotPointsChange }: Props) => {
  const [isAuto, setIsAuto] = useState(pivotPoints.length === 0);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="mb-1 block text-sm font-medium">단계 수</label>
        <select value={level} onChange={(e) => onLevelChange(Number(e.target.value))} className="w-full rounded border p-1 text-sm">
          {[5, 6, 7, 8, 9, 10].map((num) => (
            <option key={num} value={num}>
              {num}단계
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">색상</label>
        <div className="grid grid-cols-3 gap-1">
          {COLOR_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onColorChange(option.value)}
              className={`flex items-center gap-1 rounded border p-1 text-xs ${color === option.value ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
            >
              <div className="h-3 w-3 rounded" style={{ backgroundColor: option.color }} />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">구간 설정</label>
        <div className="flex gap-2">
          <label className="flex items-center gap-1 text-xs">
            <input
              type="radio"
              checked={isAuto}
              onChange={() => {
                setIsAuto(true);
                onPivotPointsChange([]);
              }}
            />
            자동
          </label>
          <label className="flex items-center gap-1 text-xs">
            <input type="radio" checked={!isAuto} onChange={() => setIsAuto(false)} />
            사용자 정의
          </label>
        </div>
      </div>
    </div>
  );
};

export default LegendSettings;
