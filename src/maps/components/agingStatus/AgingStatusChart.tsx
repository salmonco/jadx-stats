import { useQuery } from "@tanstack/react-query";
import { BarChart3, Table } from "lucide-react";
import { useMemo } from "react";
import ChartContainer from "~/features/visualization/components/common/ChartContainer";
import AgingStatusDivergingBarChart from "~/features/visualization/components/production/AgingStatusDivergingBarChart";
import AgingStatusTable from "~/features/visualization/components/production/AgingStatusTable";
import AgingStatusMap from "~/maps/classes/AgingStatusMap";
import transformToChartData from "~/maps/utils/agingStatus/transformToChartData";
import visualizationApi from "~/services/apis/visualizationApi";

export interface AgingChartData {
  region: string;
  label: string;
  avg_age: number;
  count: number;
}

interface Props {
  map: AgingStatusMap;
  isReportMode?: boolean;
}

const AgingStatusChart = ({ map, isReportMode }: Props) => {
  const { data: features } = useQuery({
    queryKey: ["agingStatus", map.getSelectedRegionLevel(), map.excludeDong],
    queryFn: () => visualizationApi.getAgingStatus(map.getSelectedRegionLevel(), map.excludeDong),
    enabled: !!map.getSelectedRegionLevel(),
    retry: false,
  });

  const chartData: AgingChartData[] = useMemo(() => transformToChartData(features?.features ?? []), [features]);

  if (isReportMode) {
    return (
      <>
        <div className="mb-4 w-full p-4">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Table size={24} />
            <span>데이터 표</span>
          </h3>
          <AgingStatusTable chartData={chartData} isReportMode={true} />
        </div>
        <div className="mb-4 w-full p-4">
          <div className="mb-4">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
              <BarChart3 size={24} />
              <span>데이터 그래프</span>
            </h3>
            <AgingStatusDivergingBarChart title={"평균 연령"} category={"avg_age"} chartData={chartData} isReportMode={true} />
          </div>
          <AgingStatusDivergingBarChart title={"총 경영체 수"} category={"count"} chartData={chartData} isReportMode={true} />
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <AgingStatusTable chartData={chartData} isReportMode={isReportMode} />
      <ChartContainer cols={2} minHeight={500}>
        <AgingStatusDivergingBarChart title={"평균 연령"} category={"avg_age"} chartData={chartData} isReportMode={isReportMode} />
        <AgingStatusDivergingBarChart title={"총 경영체 수"} category={"count"} chartData={chartData} isReportMode={isReportMode} />
      </ChartContainer>
    </div>
  );
};

export default AgingStatusChart;
