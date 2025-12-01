import { useQuery } from "@tanstack/react-query";
import { BarChart3, Table } from "lucide-react";
import DisasterSpectrumChart from "~/features/visualization/components/agriculturalEnvironment/DisasterSpectrumChart";
import YearlyDisasterInfoTable from "~/features/visualization/components/agriculturalEnvironment/YearlyDisasterInfoTable";
import { YearlyDisasterFeatureCollection } from "~/features/visualization/layers/YearlyDisasterLayer";
import YearlyDisasterInfoMap from "~/maps/classes/YearlyDisasterInfoMap";
import visualizationApi from "~/services/apis/visualizationApi";

interface Props {
  map: YearlyDisasterInfoMap;
  isReportMode?: boolean;
}

const YearlyDisasterInfoChart = ({ map, isReportMode }: Props) => {
  const { data: features } = useQuery<YearlyDisasterFeatureCollection>({
    queryKey: ["yearlyDisasterInfo", map.selectedTargetYear, map.getSelectedRegionLevel(), map.selectedDisaster],
    queryFn: () => visualizationApi.getDisasterFeatures(map.selectedTargetYear, map.getSelectedRegionLevel(), map.selectedDisaster),
  });

  if (isReportMode) {
    return (
      <>
        <div className="report-section w-full p-4">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Table size={24} />
            <span>데이터 표</span>
          </h3>
          <YearlyDisasterInfoTable features={features} selectedDisaster={map.selectedDisaster} selectedDisasterCategory={map.selectedDisasterCategory} isReportMode />
        </div>
        <div className="w-full p-4">
          <div className="report-section">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
              <BarChart3 size={24} />
              <span>데이터 그래프</span>
            </h3>
            <DisasterSpectrumChart features={features} selectedDisaster={map.selectedDisaster} selectedDisasterCategory={map.selectedDisasterCategory} isReportMode />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <YearlyDisasterInfoTable features={features} selectedDisaster={map.selectedDisaster} selectedDisasterCategory={map.selectedDisasterCategory} />
      <DisasterSpectrumChart features={features} selectedDisaster={map.selectedDisaster} selectedDisasterCategory={map.selectedDisasterCategory} />
    </div>
  );
};

export default YearlyDisasterInfoChart;
