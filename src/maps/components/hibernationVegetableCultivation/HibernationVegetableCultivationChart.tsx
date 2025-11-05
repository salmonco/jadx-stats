import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ChartContainer from "~/features/visualization/components/common/ChartContainer";
import CultivationChangeDivergingBarChart from "~/features/visualization/components/production/CultivationChangeDivergingBarChart";
import { HibernationVegetableCultivationFeatureCollection } from "~/features/visualization/layers/HibernationVegetableCultivationLayer";
import HibernationVegetableCultivationMap from "~/maps/classes/HibernationVegetableCultivationMap";
import { useMapList } from "~/maps/hooks/useMapList";
import processedData from "~/maps/utils/hibernationVegetableCultivation/processedData";
import visualizationApi from "~/services/apis/visualizationApi";

const HibernationVegetableCultivationChart = () => {
  const mapList = useMapList<HibernationVegetableCultivationMap>();
  const firstMap = mapList.getFirstMap();

  const [chartData, setChartData] = useState<any>(null);

  const { data: features } = useQuery<HibernationVegetableCultivationFeatureCollection>({
    queryKey: ["hibernationVegetableCultivationFeatures", firstMap.selectedTargetYear, firstMap.getSelectedRegionLevel()],
    queryFn: () => visualizationApi.getHinatVgtblCltvarDclrFile(firstMap.selectedTargetYear, firstMap.selectedTargetYear - 1, firstMap.getSelectedRegionLevel()),
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
      <CultivationChangeDivergingBarChart chartData={chartData} selectedCrop={firstMap.selectedCrop} year={firstMap.selectedTargetYear} viewType={"absolute"} />
      <CultivationChangeDivergingBarChart chartData={chartData} selectedCrop={firstMap.selectedCrop} year={firstMap.selectedTargetYear} viewType={"rate"} />
      <CultivationChangeDivergingBarChart chartData={chartData} selectedCrop={firstMap.selectedCrop} year={firstMap.selectedTargetYear} viewType={"area"} />
    </ChartContainer>
  );
};

export default HibernationVegetableCultivationChart;
