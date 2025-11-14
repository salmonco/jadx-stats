import { useState } from "react";
import { VisualType } from "~/maps/constants/visualizationSetting";
import DataVisualizationButton from "./DataVisualizationButton";
import FilterContainer from "./FilterContainer";
import VisualizationSettingContainer from "./VisualizationSettingContainer";

interface Props {
  filter?: React.ReactNode;
  visualizationSetting?: React.ReactNode;
  visualType?: VisualType;
  labelOptions?: { isShowValue: boolean; isShowRegion: boolean };
  opacity?: number;
  setVisualType?: (type: VisualType) => void;
  setLabelOptions?: (isShowValue: boolean, isShowRegion: boolean) => void;
  resetVisualizationSetting?: () => void;
  setOpacity?: (opacity: number) => void;
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
}: Props) => {
  const [isVisualizationOpen, setIsVisualizationOpen] = useState(false);

  return (
    <div className="absolute bottom-4 left-4 top-16 flex w-[220px] flex-col gap-5">
      {/* 필터 컨테이너 영역 */}
      {filter && <FilterContainer isFixed>{filter}</FilterContainer>}

      {/* 비주얼세팅 컨테이너 영역 */}
      {visualizationSetting && <VisualizationSettingContainer isOpen={isVisualizationOpen}>{isVisualizationOpen && visualizationSetting}</VisualizationSettingContainer>}

      {/* 데이터 시각화 버튼 - 절대 위치로 하단 고정 */}
      {visualizationSetting && (
        <div className="absolute bottom-3 left-0 right-0">
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
    </div>
  );
};

export default FloatingContainer;
