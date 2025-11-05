import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import ChartContainer from "~/features/visualization/components/common/ChartContainer";
import AgingStatusDivergingBarChart from "~/features/visualization/components/production/AgingStatusDivergingBarChart";
import AgingStatusTable from "~/features/visualization/components/production/AgingStatusTable";
import { RegionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";
import transformToChartData from "~/maps/utils/agingStatus/transformToChartData";
import visualizationApi from "~/services/apis/visualizationApi";

export interface AgingChartData {
  region: string;
  label: string;
  avg_age: number;
  count: number;
}

interface Props {
  selectedRegionLevel: RegionLevelOptions;
  excludeDong: boolean;
}

const AgingStatusChart = ({ selectedRegionLevel, excludeDong }: Props) => {
  const { data: features } = useQuery({
    queryKey: ["agingStatus", selectedRegionLevel, excludeDong],
    queryFn: () => visualizationApi.getAgingStatus(selectedRegionLevel, excludeDong),
    enabled: !!selectedRegionLevel,
    retry: false,
  });

  const chartData: AgingChartData[] = useMemo(() => transformToChartData(features?.features ?? []), [features]);

  return (
    <div className="flex flex-col gap-4">
      <AgingStatusTable chartData={chartData} />
      <ChartContainer cols={2} minHeight={500}>
        <AgingStatusDivergingBarChart title={"평균 연령"} category={"avg_age"} chartData={chartData} selectedLevel={selectedRegionLevel} />
        <AgingStatusDivergingBarChart title={"총 경영체 수"} category={"count"} chartData={chartData} selectedLevel={selectedRegionLevel} />
      </ChartContainer>
    </div>
  );
};

export default AgingStatusChart;
