import { useQuery } from "@tanstack/react-query";
import { BarChart3, Table } from "lucide-react";
import ChartContainer from "~/features/visualization/components/common/ChartContainer";
import MandarinCultivationBarChart from "~/features/visualization/components/production/MandarinCultivationBarChart";
import MandarinCultivationInfoTable from "~/features/visualization/components/production/MandarinCultivationInfoTable"; // Import the new table component
import MandarinCultivationPieChart from "~/features/visualization/components/production/MandarinCultivationPieChart";
import { DEFAULT_ALL_OPTION } from "~/features/visualization/utils/regionFilterOptions";
import MandarinCultivationInfoMap from "~/maps/classes/MandarinCultivationInfoMap";
import visualizationApi from "~/services/apis/visualizationApi";

interface Props {
  map: MandarinCultivationInfoMap;
  isReportMode?: boolean;
}

const MandarinCultivationInfoChart = ({ map, isReportMode }: Props) => {
  const { data: chartData } = useQuery({
    queryKey: ["mandarinCultivationInfoChart", map.getSelectedRegionLevel(), map.selectedCropPummok, map.selectedCropDetailGroup],
    queryFn: () =>
      visualizationApi.getMandarinCultivationInfoChart(
        map.getSelectedRegionLevel(),
        map.selectedCropGroup,
        map.selectedCropDetailGroup === DEFAULT_ALL_OPTION ? null : map.selectedCropDetailGroup
      ),
  });

  if (isReportMode) {
    return (
      <>
        <div className="mb-4 w-full p-4">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Table size={24} />
            <span>데이터 표</span>
          </h3>
          <MandarinCultivationInfoTable
            chartData={chartData}
            selectedCropPummok={map.selectedCropPummok}
            selectedCropGroup={map.selectedCropGroup}
            selectedCropDetailGroup={map.selectedCropDetailGroup}
            isReportMode={true}
          />
        </div>
        <div className="mb-4 w-full p-4">
          <div className="mb-4">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
              <BarChart3 size={24} />
              <span>데이터 그래프</span>
            </h3>
            <MandarinCultivationBarChart chartData={chartData} selectedVariety={map.selectedCropDetailGroup} isReportMode={true} />
          </div>
          <MandarinCultivationPieChart chartData={chartData} selectedVariety={map.selectedCropDetailGroup} isReportMode={true} />
        </div>
      </>
    );
  }

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
