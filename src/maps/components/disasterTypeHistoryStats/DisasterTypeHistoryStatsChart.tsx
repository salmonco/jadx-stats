import { PieChart, Table } from "lucide-react";
import DisasterTypeHistoryStatsAreaPieChart from "~/features/visualization/components/agriculturalEnvironment/DisasterTypeHistoryStatsAreaPieChart";
import DisasterTypeHistoryStatsPieChart from "~/features/visualization/components/agriculturalEnvironment/DisasterTypeHistoryStatsPieChart";
import DisasterTypeHistoryStatsTable from "~/features/visualization/components/agriculturalEnvironment/DisasterTypeHistoryStatsTable";
import DisasterTypeHistoryStatsMap from "~/maps/classes/DisasterTypeHistoryStatsMap";
import { DISASTER_TYPE_HISTORY_MOCK_DATA } from "~/maps/constants/disasterTypeHistoryMockData";

interface Props {
  map: DisasterTypeHistoryStatsMap;
  isReportMode?: boolean;
}

const DisasterTypeHistoryStatsChart = ({ map, isReportMode }: Props) => {
  // TODO: 실제 API로 교체 필요
  const features = DISASTER_TYPE_HISTORY_MOCK_DATA;

  if (isReportMode) {
    return (
      <>
        <div className="report-section w-full p-4">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Table size={24} />
            <span>데이터 표</span>
          </h3>
          <DisasterTypeHistoryStatsTable
            features={features}
            startDate={map.selectedStartDate}
            endDate={map.selectedEndDate}
            selectedDisaster={map.selectedDisaster}
            selectedCropPummok={map.selectedCropPummok}
            selectedCropGroup={map.selectedCropGroup}
            selectedCropDetailGroup={map.selectedCropDetailGroup}
            isReportMode
          />
        </div>
        <div className="w-full p-4">
          <div className="report-section">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
              <PieChart size={24} />
              <span>지역별 피해 통계</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <DisasterTypeHistoryStatsPieChart
                features={features}
                startDate={map.selectedStartDate}
                endDate={map.selectedEndDate}
                selectedDisaster={map.selectedDisaster}
                selectedCropPummok={map.selectedCropPummok}
                isReportMode
              />
              <DisasterTypeHistoryStatsAreaPieChart
                features={features}
                startDate={map.selectedStartDate}
                endDate={map.selectedEndDate}
                selectedDisaster={map.selectedDisaster}
                selectedCropPummok={map.selectedCropPummok}
                isReportMode
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <DisasterTypeHistoryStatsTable
        features={features}
        startDate={map.selectedStartDate}
        endDate={map.selectedEndDate}
        selectedDisaster={map.selectedDisaster}
        selectedCropPummok={map.selectedCropPummok}
        selectedCropGroup={map.selectedCropGroup}
        selectedCropDetailGroup={map.selectedCropDetailGroup}
      />
      <div className="grid h-[500px] grid-cols-2 gap-4">
        <div className="rounded-lg bg-[#43516D] p-5">
          <DisasterTypeHistoryStatsPieChart
            features={features}
            startDate={map.selectedStartDate}
            endDate={map.selectedEndDate}
            selectedDisaster={map.selectedDisaster}
            selectedCropPummok={map.selectedCropPummok}
          />
        </div>
        <div className="rounded-lg bg-[#43516D] p-5">
          <DisasterTypeHistoryStatsAreaPieChart
            features={features}
            startDate={map.selectedStartDate}
            endDate={map.selectedEndDate}
            selectedDisaster={map.selectedDisaster}
            selectedCropPummok={map.selectedCropPummok}
          />
        </div>
      </div>
    </div>
  );
};

export default DisasterTypeHistoryStatsChart;
