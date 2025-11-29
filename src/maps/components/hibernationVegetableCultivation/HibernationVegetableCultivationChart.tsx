import { useQuery } from "@tanstack/react-query";
import { BarChart3, Table } from "lucide-react";
import { useEffect, useState } from "react";
import ChartContainer from "~/features/visualization/components/common/ChartContainer";
import CultivationChangeDivergingBarChart from "~/features/visualization/components/production/CultivationChangeDivergingBarChart";
import HibernationVegetableCultivationPieChart from "~/features/visualization/components/production/HibernationVegetableCultivationPieChart";
import HibernationVegetableCultivationTable from "~/features/visualization/components/production/HibernationVegetableCultivationTable";
import { HibernationFeatureCollection } from "~/features/visualization/layers/HibernationVegetableCultivationLayer";
import HibernationVegetableCultivationMap from "~/maps/classes/HibernationVegetableCultivationMap";
import processedData from "~/maps/utils/hibernationVegetableCultivation/processedData";
import visualizationApi from "~/services/apis/visualizationApi";

interface Props {
  map: HibernationVegetableCultivationMap;
  isReportMode?: boolean;
}

const HibernationVegetableCultivationChart = ({ map, isReportMode }: Props) => {
  const [chartData, setChartData] = useState<any>(null);
  const [tableData, setTableData] = useState<any>(null);

  const { data: features } = useQuery<HibernationFeatureCollection>({
    queryKey: ["hibernationVegetableCultivationFeatures", map.selectedTargetYear, map.getSelectedRegionLevel()],
    queryFn: () => visualizationApi.getHinatVgtblCltvarDclrFile(map.selectedTargetYear, map.selectedTargetYear - 1, map.getSelectedRegionLevel()),
    // TODO: 지도와 차트 간 ready 상태 공유
    // enabled: !!ready,
  });

  useEffect(() => {
    if (features) {
      const processed = processedData(features);
      setChartData(processed.chartData);
      setTableData(processed.tableData);
    }
  }, [features]);

  if (isReportMode) {
    return (
      <>
        <div className="report-section w-full p-4">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Table size={24} />
            <span>데이터 표</span>
          </h3>
          <HibernationVegetableCultivationTable chartData={tableData} selectedCrop={map.selectedCrop} year={map.selectedTargetYear} isReportMode />
        </div>
        <div className="w-full p-4">
          <div className="report-section flex flex-col gap-2">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
              <BarChart3 size={24} />
              <span>데이터 그래프</span>
            </h3>
            <CultivationChangeDivergingBarChart chartData={chartData} selectedCrop={map.selectedCrop} year={map.selectedTargetYear} viewType={"absolute"} isReportMode />
          </div>
          <div className="report-section">
            <CultivationChangeDivergingBarChart chartData={chartData} selectedCrop={map.selectedCrop} year={map.selectedTargetYear} viewType={"rate"} isReportMode />
          </div>
          <div className="report-section">
            <CultivationChangeDivergingBarChart chartData={chartData} selectedCrop={map.selectedCrop} year={map.selectedTargetYear} viewType={"area"} isReportMode />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <HibernationVegetableCultivationTable chartData={tableData} selectedCrop={map.selectedCrop} year={map.selectedTargetYear} />
      <ChartContainer cols={2} minHeight={500}>
        <CultivationChangeDivergingBarChart chartData={chartData} selectedCrop={map.selectedCrop} year={map.selectedTargetYear} viewType={"absolute"} />
        <HibernationVegetableCultivationPieChart chartData={chartData} selectedCrop={map.selectedCrop} year={map.selectedTargetYear} />
      </ChartContainer>
      {/* <ChartContainer cols={1} minHeight={500}>
        <CultivationChangeDivergingBarChart chartData={chartData} selectedCrop={map.selectedCrop} year={map.selectedTargetYear} viewType={"rate"} />
      </ChartContainer> */}
    </div>
  );
};

export default HibernationVegetableCultivationChart;
