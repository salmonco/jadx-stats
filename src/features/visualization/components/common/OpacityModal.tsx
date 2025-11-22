import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  opacity: number;
  onApply: (opacity: number) => void;
}

const OpacityModal = ({ isOpen, onClose, opacity, onApply }: Props) => {
  const [selectedOpacity, setSelectedOpacity] = useState(opacity);

  // 모달이 열릴 때 현재 투명도 값으로 초기화
  useEffect(() => {
    if (isOpen) {
      setSelectedOpacity(opacity);
    }
  }, [isOpen, opacity]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(selectedOpacity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-80 rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">투명도 설정</h3>

        <div className="mb-6">
          <div className="mb-2 flex justify-between text-sm text-gray-600">
            <span>0%</span>
            <span className="font-medium">{Math.round(selectedOpacity * 100)}%</span>
            <span>100%</span>
          </div>

          <div className="relative">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={selectedOpacity}
              onChange={(e) => setSelectedOpacity(parseFloat(e.target.value))}
              className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400">
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

export default OpacityModal;
