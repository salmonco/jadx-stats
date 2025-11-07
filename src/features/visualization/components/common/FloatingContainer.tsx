import FilterContainer from "./FilterContainer";
import VisualizationSettingContainer from "./VisualizationSettingContainer";

interface Props {
  filter?: React.ReactNode;
  visualizationSetting?: React.ReactNode;
}

const FloatingContainer = ({ filter, visualizationSetting }: Props) => {
  return (
    <div className="absolute bottom-4 left-4 top-16 flex w-[220px] flex-col gap-5">
      {filter && <FilterContainer isFixed>{filter}</FilterContainer>}
      {visualizationSetting && <VisualizationSettingContainer>{visualizationSetting}</VisualizationSettingContainer>}
    </div>
  );
};

export default FloatingContainer;
