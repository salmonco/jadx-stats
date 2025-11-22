import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ChartContainer from "~/features/visualization/components/common/ChartContainer";
import CultivationChangeDivergingBarChart from "~/features/visualization/components/production/CultivationChangeDivergingBarChart";
import { HibernationFeatureCollection } from "~/features/visualization/layers/HibernationVegetableCultivationLayer";
import HibernationVegetableCultivationMap from "~/maps/classes/HibernationVegetableCultivationMap";
import processedData from "~/maps/utils/hibernationVegetableCultivation/processedData";
import visualizationApi from "~/services/apis/visualizationApi";

interface Props {
  map: HibernationVegetableCultivationMap;
}

const HibernationVegetableCultivationChart = ({ map }: Props) => {
  const [chartData, setChartData] = useState<any>(null);

  const { data: features } = useQuery<HibernationFeatureCollection>({
    queryKey: ["hibernationVegetableCultivationFeatures", map.selectedTargetYear, map.getSelectedRegionLevel()],
    queryFn: () => visualizationApi.getHinatVgtblCltvarDclrFile(map.selectedTargetYear, map.selectedTargetYear - 1, map.getSelectedRegionLevel()),
    // TODO: 지도와 차트 간 ready 상태 공유
    // enabled: !!ready,
  });

  useEffect(() => {
    if (features) {
      const processed = processedData(features);
      setChartData(processed);
    }
  }, [features]);

  return (
    <ChartContainer cols={3} minHeight={500}>
      <CultivationChangeDivergingBarChart chartData={chartData} selectedCrop={map.selectedCrop} year={map.selectedTargetYear} viewType={"absolute"} />
      <CultivationChangeDivergingBarChart chartData={chartData} selectedCrop={map.selectedCrop} year={map.selectedTargetYear} viewType={"rate"} />
      <CultivationChangeDivergingBarChart chartData={chartData} selectedCrop={map.selectedCrop} year={map.selectedTargetYear} viewType={"area"} />
    </ChartContainer>
  );
};

export default HibernationVegetableCultivationChart;
