import { useQuery } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";
import { useMemo } from "react";
import ChartContainer from "~/features/visualization/components/common/ChartContainer";
import SimulatorResult from "~/features/visualization/components/observation/SimulatorResult";
import TreeAgeSimulationChart from "~/features/visualization/components/observation/TreeAgeSimulationChart";
import { MandarinTreeAgeDistributionFeatureCollection } from "~/features/visualization/layers/MandarinTreeAgeDistributionLayer";
import { DEFAULT_ALL_OPTION } from "~/features/visualization/utils/regionFilterOptions";
import MandarinTreeAgeDistributionMap from "~/maps/classes/MandarinTreeAgeDistributionMap";
import visualizationApi from "~/services/apis/visualizationApi";

interface Props {
  map: MandarinTreeAgeDistributionMap;
  isReportMode?: boolean;
}

const MandarinTreeAgeDistributionChart = ({ map, isReportMode }: Props) => {
  const { data: features } = useQuery<MandarinTreeAgeDistributionFeatureCollection>({
    queryKey: [
      "treeAgeDistributionFeatures",
      map.selectedTargetYear,
      map.getSelectedRegionLevel(),
      map.selectedCropGroup,
      map.selectedCropDetailGroup === DEFAULT_ALL_OPTION ? null : map.selectedCropDetailGroup,
    ],
    queryFn: () =>
      visualizationApi.getMandarinTreeAgeDistribution(
        map.selectedTargetYear,
        map.getSelectedRegionLevel(),
        map.selectedCropGroup,
        map.selectedCropDetailGroup === DEFAULT_ALL_OPTION ? null : map.selectedCropDetailGroup
      ),
  });

  const chartData = useMemo(() => {
    if (!features?.features) return [];

    return features.features
      .map((feature) => {
        const props = feature.properties;
        const ageGroups = props?.stats?.age_groups ?? {};
        const area20_29 = ageGroups["20~29년"]?.total_area || 0;
        const area30_39 = ageGroups["30~39년"]?.total_area || 0;

        return {
          region: `${props.vrbs_nm} (${props.id})`, // 고유 ID 조합
          label: props.vrbs_nm,
          value: area20_29 + area30_39 * 0.3,
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 20);
  }, [features]);

  if (isReportMode) {
    return (
      <div className="w-full p-4">
        <div className="report-section flex flex-col gap-2">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <BarChart3 size={24} />
            <span>데이터 그래프</span>
          </h3>
          <TreeAgeSimulationChart
            selectedTargetYear={map.selectedTargetYear}
            selectedPummok={map.selectedCropGroup}
            selectedVariety={map.selectedCropDetailGroup}
            isReportMode
          />
        </div>
        <div className="report-section">
          <SimulatorResult chartData={chartData} isReportMode />
        </div>
      </div>
    );
  }

  return (
    <ChartContainer minHeight={480} cols={2}>
      <TreeAgeSimulationChart selectedTargetYear={map.selectedTargetYear} selectedPummok={map.selectedCropGroup} selectedVariety={map.selectedCropDetailGroup} />
      <SimulatorResult chartData={chartData} />
    </ChartContainer>
  );
};

export default MandarinTreeAgeDistributionChart;
