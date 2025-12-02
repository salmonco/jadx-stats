import { Table } from "lucide-react";
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
    </div>
  );
};

export default DisasterTypeHistoryStatsChart;
