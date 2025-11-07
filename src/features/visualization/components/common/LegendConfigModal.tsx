import { useEffect, useRef, useState } from "react";
import type { LegendColor } from "~/maps/constants/visualizationSetting";
import { getColorGradient } from "~/utils/colorGradient";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  level: number;
  color: LegendColor;
  pivotPoints: number[];
  minValue: number;
  maxValue: number;
  onLevelChange: (level: number) => void;
  onPivotPointsChange: (pivotPoints: number[]) => void;
}

const LegendConfigModal = ({ isOpen, onClose, level, color, pivotPoints, minValue, maxValue, onLevelChange, onPivotPointsChange }: Props) => {
  const [isAuto, setIsAuto] = useState(pivotPoints.length === 0);
  const [localLevel, setLocalLevel] = useState(level);
  const [localPivotPoints, setLocalPivotPoints] = useState<number[]>([]);
  const paletteRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState(-1);

  useEffect(() => {
    if (isOpen) {
      setLocalLevel(level);
      setIsAuto(pivotPoints.length === 0);
      if (pivotPoints.length > 0) {
        setLocalPivotPoints([...pivotPoints]);
      } else {
        // 자동 모드일 때도 현재 level에 맞는 구간 생성
        const stepSize = (maxValue - minValue) / level;
        const points = Array.from({ length: level + 1 }, (_, i) => minValue + i * stepSize);
        setLocalPivotPoints(points);
      }
    }
  }, [isOpen, level, pivotPoints]);

  useEffect(() => {
    if (isAuto) {
      setLocalPivotPoints([]);
    } else {
      if (pivotPoints.length === 0 || localLevel !== level) {
        // Generate new pivot points when switching to custom mode or level changes
        const stepSize = (maxValue - minValue) / localLevel;
        const points = Array.from({ length: localLevel + 1 }, (_, i) => minValue + i * stepSize);
        setLocalPivotPoints(points);
      }
    }
  }, [isAuto, localLevel]);

  const colorGradient = getColorGradient(color);

  const handleMouseDown = (index: number, e: React.MouseEvent) => {
    if (index === 0 || index === localPivotPoints.length - 1) return; // Can't drag first/last
    setIsDragging(true);
    setDragIndex(index);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || dragIndex === -1 || !paletteRef.current) return;

    const rect = paletteRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newValue = minValue + percentage * (maxValue - minValue);

    const newPoints = [...localPivotPoints];
    newPoints[dragIndex] = newValue;

    // Ensure order is maintained
    newPoints.sort((a, b) => a - b);
    setLocalPivotPoints(newPoints);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragIndex(-1);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragIndex, localPivotPoints, minValue, maxValue]);

  const handleLevelChange = (newLevel: number) => {
    setLocalLevel(newLevel);

    if (!isAuto) {
      // Update pivot points when level changes in custom mode
      const stepSize = (maxValue - minValue) / newLevel;
      const points = Array.from({ length: newLevel + 1 }, (_, i) => minValue + i * stepSize);
      setLocalPivotPoints(points);
    }
  };

  const handleApply = () => {
    onLevelChange(localLevel);
    onPivotPointsChange(isAuto ? [] : localPivotPoints);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[80vh] w-96 overflow-y-auto rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">범례 구간 설정</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">단계 수</label>
            <select value={localLevel} onChange={(e) => handleLevelChange(Number(e.target.value))} className="w-full rounded border p-2">
              {[5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num}단계
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">구간 설정</label>
            <div className="mb-3 flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" checked={isAuto} onChange={() => setIsAuto(true)} />
                자동
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={!isAuto} onChange={() => setIsAuto(false)} />
                사용자 정의
              </label>
            </div>

            {!isAuto && (
              <div className="space-y-3">
                <div
                  ref={paletteRef}
                  className="relative h-8 cursor-pointer rounded border"
                  style={{
                    background: `linear-gradient(to right, ${Array.from({ length: 100 }, (_, i) => colorGradient(1 - i / 99)).join(", ")})`,
                  }}
                >
                  {localPivotPoints.map((point, index) => {
                    const percentage = ((point - minValue) / (maxValue - minValue)) * 100;
                    const canDrag = index !== 0 && index !== localPivotPoints.length - 1;

                    return (
                      <div
                        key={index}
                        className={`absolute top-0 h-full w-1 border border-gray-400 bg-white ${canDrag ? "cursor-ew-resize" : "cursor-default"}`}
                        style={{
                          left: index === 0 ? "0%" : index === localPivotPoints.length - 1 ? "100%" : `${percentage}%`,
                          transform: index === 0 || index === localPivotPoints.length - 1 ? "translateX(0)" : "translateX(-50%)",
                        }}
                        onMouseDown={canDrag ? (e) => handleMouseDown(index, e) : undefined}
                      />
                    );
                  })}
                </div>

                <div className="text-xs text-gray-600">구간 경계선을 드래그하여 조정할 수 있습니다.</div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded border border-gray-300 px-4 py-2 hover:bg-gray-50">
            취소
          </button>
          <button onClick={handleApply} className="flex-1 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            적용
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegendConfigModal;
