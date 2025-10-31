import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ChartContainer from "~/features/visualization/components/common/ChartContainer";
import CultivationChangeDivergingBarChart from "~/features/visualization/components/production/CultivationChangeDivergingBarChart";
import { HibernationVegetableCultivationFeatureCollection } from "~/features/visualization/layers/HibernationVegetableCultivationLayer";
import { RegionLevelOptions } from "~/features/visualization/utils/regionLevelOptions";
import { CropType } from "~/maps/constants/hibernationVegetableCultivation";
import processedData from "~/maps/utils/hibernationVegetableCultivation/processedData";
import visualizationApi from "~/services/apis/visualizationApi";

interface Props {
  selectedRegionLevel: RegionLevelOptions;
  selectedTargetYear: number;
  selectedCrops: CropType;
}

const HibernationVegetableCultivationChart = ({ selectedRegionLevel, selectedTargetYear, selectedCrops }: Props) => {
  const [chartData, setChartData] = useState<any>(null);

  const { data: features } = useQuery<HibernationVegetableCultivationFeatureCollection>({
    queryKey: ["hibernationVegetableCultivationFeatures", selectedTargetYear, selectedRegionLevel],
    queryFn: () => visualizationApi.getHinatVgtblCltvarDclrFile(selectedTargetYear, selectedTargetYear - 1, selectedRegionLevel),
    // TODO: 지도와 차트 간 ready 상태 공유
    // enabled: !!ready,
  });

  // features 차트 데이터로 가공
  useEffect(() => {
    if (features) {
      const processed = processedData(features);
      setChartData(processed);
    }
  }, [features]);

  return (
    <ChartContainer cols={3} minHeight={500}>
      <CultivationChangeDivergingBarChart chartData={chartData} selectedCrops={selectedCrops} year={selectedTargetYear} viewType={"absolute"} />
      <CultivationChangeDivergingBarChart chartData={chartData} selectedCrops={selectedCrops} year={selectedTargetYear} viewType={"rate"} />
      <CultivationChangeDivergingBarChart chartData={chartData} selectedCrops={selectedCrops} year={selectedTargetYear} viewType={"area"} />
    </ChartContainer>
  );
};

export default HibernationVegetableCultivationChart;
