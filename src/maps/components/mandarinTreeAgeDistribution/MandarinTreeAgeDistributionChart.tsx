import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import ChartContainer from "~/features/visualization/components/common/ChartContainer";
import SimulatorResult from "~/features/visualization/components/observation/SimulatorResult";
import TreeAgeSimulationChart from "~/features/visualization/components/observation/TreeAgeSimulationChart";
import { MandarinTreeAgeDistributionFeatureCollection } from "~/features/visualization/layers/MandarinTreeAgeDistributionLayer";
import MandarinTreeAgeDistributionMap from "~/maps/classes/MandarinTreeAgeDistributionMap";
import { useMapList } from "~/maps/hooks/useMapList";
import visualizationApi from "~/services/apis/visualizationApi";

const MandarinTreeAgeDistributionChart = () => {
  const mapList = useMapList<MandarinTreeAgeDistributionMap>();
  const map = mapList.getFirstMap();

  const { data: features } = useQuery<MandarinTreeAgeDistributionFeatureCollection>({
    queryKey: [
      "treeAgeDistributionFeatures",
      map.selectedTargetYear,
      map.getSelectedRegionLevel(),
      map.selectedCropPummok,
      map.selectedCropDetailGroup === "전체" ? undefined : map.selectedCropDetailGroup,
    ],
    queryFn: () =>
      visualizationApi.getMandarinTreeAgeDistribution(
        map.selectedTargetYear,
        map.getSelectedRegionLevel(),
        map.selectedCropPummok,
        map.selectedCropDetailGroup === "전체" ? undefined : map.selectedCropDetailGroup
      ),
    // enabled: !!ready,
  });

  const chartData = useMemo(() => {
    return features?.features
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

  return (
    <ChartContainer minHeight={480} cols={2}>
      <TreeAgeSimulationChart selectedTargetYear={map.selectedTargetYear} selectedPummok={map.selectedCropPummok} selectedVariety={map.selectedCropDetailGroup} />
      <SimulatorResult chartData={chartData} />
    </ChartContainer>
  );
};

export default MandarinTreeAgeDistributionChart;
