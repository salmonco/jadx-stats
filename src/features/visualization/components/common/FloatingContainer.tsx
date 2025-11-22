import { useState } from "react";
import { VisualType } from "~/maps/constants/visualizationSetting";
import DataVisualizationButton from "./DataVisualizationButton";
import FilterContainer from "./FilterContainer";
import VisualizationSettingContainer from "./VisualizationSettingContainer";

export interface FloatingContainerProps {
  filter?: React.ReactNode;
  visualizationSetting?: React.ReactNode;
  visualType?: VisualType;
  labelOptions?: { isShowValue: boolean; isShowRegion: boolean };
  opacity?: number;
  setVisualType?: (type: VisualType) => void;
  setLabelOptions?: (isShowValue: boolean, isShowRegion: boolean) => void;
  resetVisualizationSetting?: () => void;
  setOpacity?: (opacity: number) => void;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
}

const FloatingContainer = ({
  filter,
  visualizationSetting,
  setLabelOptions,
  labelOptions,
  resetVisualizationSetting,
  setOpacity,
  opacity,
  visualType,
  setVisualType,
  getPopupContainer,
}: FloatingContainerProps) => {
  const [isVisualizationOpen, setIsVisualizationOpen] = useState(true);

  return (
    <>
      {/* 필터 컨테이너 영역 */}
      {filter && (
        <div className="absolute left-4 top-16 w-[220px]">
          <FilterContainer isFixed={!!visualizationSetting} getPopupContainer={getPopupContainer}>
            {filter}
          </FilterContainer>
        </div>
      )}

      {/* 비주얼세팅 컨테이너 영역 */}
      {visualizationSetting && (
        <div className="absolute bottom-4 left-4 h-[280px] w-[220px]">
          <VisualizationSettingContainer isOpen={isVisualizationOpen}>{isVisualizationOpen && visualizationSetting}</VisualizationSettingContainer>
        </div>
      )}

      {/* 데이터 시각화 버튼 - 절대 위치로 하단 고정 */}
      {visualizationSetting && (
        <div className="absolute bottom-7 left-4 w-[220px]">
          <DataVisualizationButton
            onMenuClick={() => setIsVisualizationOpen((prev) => !prev)}
            setLabelOptions={setLabelOptions}
            labelOptions={labelOptions}
            resetVisualizationSetting={resetVisualizationSetting}
            setOpacity={setOpacity}
            opacity={opacity}
            visualType={visualType}
            setVisualType={setVisualType}
          />
        </div>
      )}
    </>
  );
};

export default FloatingContainer;
