import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import ChartContainer from "~/features/visualization/components/common/ChartContainer";
import AgingStatusDivergingBarChart from "~/features/visualization/components/production/AgingStatusDivergingBarChart";
import AgingStatusTable from "~/features/visualization/components/production/AgingStatusTable";
import { useMapList } from "~/maps/hooks/useMapList";
import transformToChartData from "~/maps/utils/agingStatus/transformToChartData";
import visualizationApi from "~/services/apis/visualizationApi";

export interface AgingChartData {
  region: string;
  label: string;
  avg_age: number;
  count: number;
}

const AgingStatusChart = () => {
  const mapList = useMapList();
  const firstMap = mapList.getFirstMap();

  const { data: features } = useQuery({
    queryKey: ["agingStatus", firstMap.getSelectedRegionLevel(), firstMap.excludeDong],
    queryFn: () => visualizationApi.getAgingStatus(firstMap.getSelectedRegionLevel(), firstMap.excludeDong),
    enabled: !!firstMap.getSelectedRegionLevel(),
    retry: false,
  });

  const chartData: AgingChartData[] = useMemo(() => transformToChartData(features?.features ?? []), [features]);

  return (
    <div className="flex flex-col gap-4">
      <AgingStatusTable chartData={chartData} />
      <ChartContainer cols={2} minHeight={500}>
        <AgingStatusDivergingBarChart title={"평균 연령"} category={"avg_age"} chartData={chartData} />
        <AgingStatusDivergingBarChart title={"총 경영체 수"} category={"count"} chartData={chartData} />
      </ChartContainer>
    </div>
  );
};

export default AgingStatusChart;
