import { useRef, useState } from "react";

interface Props {
  onMenuClick: () => void;
}

const DataVisualizationButton = ({ onMenuClick }: Props) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const settingButtons = [
    { id: "type", label: "타입" },
    { id: "label", label: "레이블" },
    { id: "reset", label: "초기화" },
    { id: "transparency", label: "투명도 설정" },
  ];

  return (
    <>
      <div ref={buttonRef} className="relative mx-2 flex items-center justify-between rounded-full border border-gray-300 bg-white px-4 py-2 shadow-sm">
        {/* 메뉴 아이콘 */}
        <button onClick={onMenuClick} className="flex items-center justify-center text-gray-600 hover:text-gray-800" title="범례 설정">
          ☰
        </button>

        {/* 텍스트 */}
        <span className="mx-4 text-sm font-medium text-gray-700">데이터 시각화</span>

        {/* 설정 아이콘 */}
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="flex items-center justify-center text-lg text-gray-600 hover:text-gray-800"
          title="시각화 설정"
        >
          ⚙
        </button>
      </div>

      {/* 설정 버튼들 */}
      {isSettingsOpen && (
        <div className="absolute bottom-0 left-[240px] flex gap-2">
          {settingButtons.map((button) => (
            <button
              key={button.id}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-300 bg-white text-xs font-medium text-gray-700 shadow-lg hover:shadow-xl"
              onClick={() => console.log(`${button.label} clicked`)}
            >
              {button.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default DataVisualizationButton;
