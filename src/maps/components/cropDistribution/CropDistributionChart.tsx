import { BarChart3 } from "lucide-react";
import { useMemo } from "react";
import ChartContainer from "~/features/visualization/components/common/ChartContainer";
import CropDistributionBarChart from "~/features/visualization/components/production/CropDistributionBarChart";
import CropDistributionTreemap from "~/features/visualization/components/production/CropDistributionTreemap";
import { CROP_MOCK_DATA } from "~/maps/constants/cropMockData";

interface Props {
  isReportMode?: boolean;
}

const CropDistributionChart = ({ isReportMode }: Props) => {
  const chartData = useMemo(() => {
    if (!CROP_MOCK_DATA) return {};

    const cropAreaByRegion: { [crop: string]: { [region: string]: number } } = {};

    CROP_MOCK_DATA.features.forEach((feature) => {
      const crop = feature.properties.top_pummok;
      const region = feature.properties.vrbs_nm;
      const area = feature.properties.mandarin_area / 10_000; // Convert to ha

      if (!cropAreaByRegion[crop]) {
        cropAreaByRegion[crop] = {};
      }

      if (!cropAreaByRegion[crop][region]) {
        cropAreaByRegion[crop][region] = 0;
      }

      cropAreaByRegion[crop][region] += area;
    });

    return cropAreaByRegion;
  }, []);

  if (isReportMode) {
    return (
      <div className="w-full p-4">
        <div className="report-section flex flex-col gap-2">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <BarChart3 size={24} />
            <span>데이터 그래프</span>
          </h3>
          <CropDistributionBarChart chartData={chartData} isReportMode />
        </div>
        <div className="report-section">
          <CropDistributionTreemap chartData={chartData} isReportMode />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ChartContainer cols={2} minHeight={500}>
        <CropDistributionBarChart chartData={chartData} />
        <CropDistributionTreemap chartData={chartData} />
      </ChartContainer>
    </div>
  );
};

export default CropDistributionChart;
