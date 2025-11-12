import { useQuery } from "@tanstack/react-query";
import ChartContainer from "~/features/visualization/components/common/ChartContainer";
import MandarinCultivationBarChart from "~/features/visualization/components/production/MandarinCultivationBarChart";
import MandarinCultivationPieChart from "~/features/visualization/components/production/MandarinCultivationPieChart";
import { DEFAULT_ALL_OPTION } from "~/features/visualization/utils/regionFilterOptions";
import MandarinCultivationInfoMap from "~/maps/classes/MandarinCultivationInfoMap";
import { useMapList } from "~/maps/hooks/useMapList";
import visualizationApi from "~/services/apis/visualizationApi";

const MandarinCultivationInfoChart = () => {
  const mapList = useMapList<MandarinCultivationInfoMap>();
  const map = mapList.getFirstMap();

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
    <ChartContainer cols={2} minHeight={500}>
      <MandarinCultivationBarChart chartData={chartData} selectedVariety={map.selectedCropDetailGroup} />
      <MandarinCultivationPieChart chartData={chartData} selectedVariety={map.selectedCropDetailGroup} />
    </ChartContainer>
  );
};

export default MandarinCultivationInfoChart;
