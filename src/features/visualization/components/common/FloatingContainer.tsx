import { useState } from "react";
import DataVisualizationButton from "./DataVisualizationButton";
import FilterContainer from "./FilterContainer";
import VisualizationSettingContainer from "./VisualizationSettingContainer";

interface Props {
  filter?: React.ReactNode;
  visualizationSetting?: React.ReactNode;
}

const FloatingContainer = ({ filter, visualizationSetting }: Props) => {
  const [isVisualizationOpen, setIsVisualizationOpen] = useState(false);

  return (
    <div className="absolute bottom-4 left-4 top-16 flex w-[220px] flex-col gap-5">
      {/* 필터 컨테이너 영역 */}
      {filter && <FilterContainer isFixed>{filter}</FilterContainer>}

      {/* 비주얼세팅 컨테이너 영역 */}
      <VisualizationSettingContainer isOpen={isVisualizationOpen}>
        <div className="flex h-full flex-col">
          <div className="scrollbar-hide flex-1 overflow-y-auto">{isVisualizationOpen && visualizationSetting}</div>

          <DataVisualizationButton onMenuClick={() => setIsVisualizationOpen((prev) => !prev)} isMenuOpen={isVisualizationOpen} />
        </div>
      </VisualizationSettingContainer>
    </div>
  );
};

export default FloatingContainer;
