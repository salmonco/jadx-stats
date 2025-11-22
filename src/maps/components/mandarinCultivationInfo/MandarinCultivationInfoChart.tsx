import { useQuery } from "@tanstack/react-query";
import ChartContainer from "~/features/visualization/components/common/ChartContainer";
import MandarinCultivationBarChart from "~/features/visualization/components/production/MandarinCultivationBarChart";
import MandarinCultivationInfoTable from "~/features/visualization/components/production/MandarinCultivationInfoTable"; // Import the new table component
import MandarinCultivationPieChart from "~/features/visualization/components/production/MandarinCultivationPieChart";
import { DEFAULT_ALL_OPTION } from "~/features/visualization/utils/regionFilterOptions";
import MandarinCultivationInfoMap from "~/maps/classes/MandarinCultivationInfoMap";
import visualizationApi from "~/services/apis/visualizationApi";

interface Props {
  map: MandarinCultivationInfoMap;
}

const MandarinCultivationInfoChart = ({ map }: Props) => {
  const { data: chartData } = useQuery({
    queryKey: ["mandarinCultivationInfoChart", map.getSelectedRegionLevel(), map.selectedCropPummok, map.selectedCropDetailGroup],
    queryFn: () =>
      visualizationApi.getMandarinCultivationInfoChart(
        map.getSelectedRegionLevel(),
        map.selectedCropGroup,
        map.selectedCropDetailGroup === DEFAULT_ALL_OPTION ? null : map.selectedCropDetailGroup
      ),
  });

  return (
    <div className="flex flex-col gap-4">
      <MandarinCultivationInfoTable
        chartData={chartData}
        selectedCropPummok={map.selectedCropPummok}
        selectedCropGroup={map.selectedCropGroup}
        selectedCropDetailGroup={map.selectedCropDetailGroup}
      />
      <ChartContainer cols={2} minHeight={500}>
        <MandarinCultivationBarChart chartData={chartData} selectedVariety={map.selectedCropDetailGroup} />
        <MandarinCultivationPieChart chartData={chartData} selectedVariety={map.selectedCropDetailGroup} />
      </ChartContainer>
    </div>
  );
};

export default MandarinCultivationInfoChart;
