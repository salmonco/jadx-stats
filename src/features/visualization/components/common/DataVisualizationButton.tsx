import { useRef, useState } from "react";
import { useLabelSettings } from "~/features/visualization/hooks/useLabelSettings";
import { useVisualTypeSettings } from "~/features/visualization/hooks/useVisualTypeSettings";
import { LabelType, VISUAL_SETTING_BUTTONS, VisualSettingButtonId, VisualType } from "~/maps/constants/visualizationSetting";
import OpacityModal from "./OpacityModal";

interface Props {
  onMenuClick: () => void;
  setLabelOptions: (isShowValue: boolean, isShowRegion: boolean) => void;
  labelOptions: { isShowValue: boolean; isShowRegion: boolean };
  resetVisualizationSetting: () => void;
  setOpacity: (opacity: number) => void;
  opacity: number;
  visualType: VisualType;
  setVisualType: (type: VisualType) => void;
}

const DataVisualizationButton = ({ onMenuClick, setLabelOptions, labelOptions, resetVisualizationSetting, setOpacity, opacity, visualType, setVisualType }: Props) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<VisualSettingButtonId | null>(null);
  const [isOpacityModalOpen, setIsOpacityModalOpen] = useState(false);

  const { visualTypeMenu, onClickVisualTypeItem, checkIsVisualTypeSelected } = useVisualTypeSettings({ visualType, setVisualType });

  const { labelTypes, onClickLabelItem, checkIsLabelSelected } = useLabelSettings({
    labelOptions,
    setLabelOptions,
  });

  const buttonRef = useRef<HTMLDivElement>(null);

  const handleButtonClick = (buttonId: VisualSettingButtonId) => {
    if (buttonId === VISUAL_SETTING_BUTTONS.초기화) {
      resetVisualizationSetting();
      return;
    }

    if (buttonId === VISUAL_SETTING_BUTTONS["투명도 설정"]) {
      setIsOpacityModalOpen(true);
      return;
    }

    // 타입, 레이블 버튼은 서브메뉴 토글
    setOpenSubMenu(openSubMenu === buttonId ? null : buttonId);
  };

  const renderSubMenu = (buttonId: VisualSettingButtonId) => {
    if (openSubMenu !== buttonId) return null;

    let items = [];
    if (buttonId === VISUAL_SETTING_BUTTONS.타입) {
      items = visualTypeMenu;
    } else if (buttonId === VISUAL_SETTING_BUTTONS.레이블) {
      items = labelTypes;
    }

    const handleItemClick = (itemId: string) => {
      if (buttonId === VISUAL_SETTING_BUTTONS.타입) {
        onClickVisualTypeItem(itemId as VisualType);
      } else if (buttonId === VISUAL_SETTING_BUTTONS.레이블) {
        onClickLabelItem(itemId as LabelType);
      }
    };

    const isSelected = (itemId: string) => {
      if (buttonId === VISUAL_SETTING_BUTTONS.타입) {
        return checkIsVisualTypeSelected(itemId as VisualType);
      } else if (buttonId === VISUAL_SETTING_BUTTONS.레이블) {
        return checkIsLabelSelected(itemId as LabelType);
      }
      return false;
    };

    return (
      <div className="absolute bottom-14 left-1/2 flex -translate-x-1/2 transform flex-col gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-xs text-white shadow-lg transition-transform hover:scale-105 ${
              isSelected(item.id) ? "bg-blue-500" : "bg-gray-400"
            }`}
            onClick={() => handleItemClick(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <div ref={buttonRef} className="relative mx-2 flex items-center justify-between rounded-[5px] bg-[#3D4B7B] px-4 py-2 shadow-sm">
        {/* 메뉴 아이콘 */}
        <button onClick={onMenuClick} className="flex items-center justify-center text-white hover:text-gray-800" title="범례 설정">
          ☰
        </button>

        {/* 텍스트 */}
        <span className="mx-4 text-sm font-medium text-white">데이터 시각화</span>

        {/* 설정 아이콘 */}
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="flex items-center justify-center text-lg text-white hover:text-gray-800"
          title="시각화 설정"
        >
          ⚙
        </button>
      </div>

      {/* 설정 버튼들 */}
      {isSettingsOpen && (
        <div className="absolute bottom-0 left-[240px] flex gap-2">
          {Object.entries(VISUAL_SETTING_BUTTONS).map(([label, id]) => (
            <div key={id} className="relative">
              <button
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-700 text-sm text-white shadow-lg transition-transform hover:scale-105"
                onClick={() => handleButtonClick(id)}
              >
                {label}
              </button>
              {renderSubMenu(id)}
            </div>
          ))}
        </div>
      )}

      <OpacityModal isOpen={isOpacityModalOpen} onClose={() => setIsOpacityModalOpen(false)} opacity={opacity} onApply={setOpacity} />
    </>
  );
};

export default DataVisualizationButton;
