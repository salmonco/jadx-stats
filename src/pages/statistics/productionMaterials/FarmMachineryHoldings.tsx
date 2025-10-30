import { useState } from "react";
import useFetchStatsRange from "~/features/statistics/hooks/useFetchStatsRange";
import useFetchStatsData from "~/features/statistics/hooks/useFetchStatsData";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { ChartConfig } from "~/features/statistics/components/ChartSection";
import { ChartSection, StatisticsContainer, TableSection } from "~/features/statistics/components";
import { TableConfig } from "~/features/statistics/components/TableSection";

const QUALIFIED_NAME = "frmcn-hld";
const UNIT = { 제주특별자치도: "대" };

// 농기계 보유 현황
const FarmMachineryHoldings = () => {
  const [selectedYearRange, setSelectedYearRange] = useState<{ startYear: number; endYear: number }>({ startYear: 2013, endYear: 2024 });

  const yearRange: StatsRange = useFetchStatsRange(QUALIFIED_NAME);
  const data: YearlyStats = useFetchStatsData(QUALIFIED_NAME, selectedYearRange?.startYear, selectedYearRange?.endYear);

  const handleRangeChange = (value: { startYear: number; endYear: number }) => {
    setSelectedYearRange(value);
  };

  const chartConfig: ChartConfig = {
    groupField: "C2_NM",
    unitKey: "C1_NM",
    selectFields: [
      {
        field: "C1_NM",
        options: ["제주특별자치도"],
        multiple: false,
        display: false,
      },
      {
        field: "C2_NM",
        options: [
          "동력경운기",
          "농용트랙터 계",
          "스피드스프레이어",
          "동력이앙기 계",
          "관리기 계",
          "콤바인 계",
          "곡물건조기",
          "농산물건조기",
          "파종기",
          "정식기",
          "수확기",
          "농업용멀티콥터",
          "농업용고소작업차",
          "농업용동력운반차",
          "주행형농업용방제기",
        ],
        multiple: true,
        defaultSelected: ["스피드스프레이어", "곡물건조기", "농산물건조기", "동력이앙기 계", "콤바인 계"],
      },
    ],
    margin: { left: 50 },
  };

  const tableConfig: TableConfig = {
    groupField: "C2_NM",
    filterField: "C1_NM",
    filterOptions: [
      "서울특별시",
      "부산광역시",
      "대구광역시",
      "인천광역시",
      "광주광역시",
      "대전광역시",
      "울산광역시",
      "세종특별자치시",
      "경기도",
      "충청북도",
      "충청남도",
      "전라남도",
      "경상북도",
      "경상남도",
      "제주특별자치도",
    ],
    hierarchy: [
      { field: "동력경운기", indent: 0 },
      { field: "농용트랙터 계", indent: 0 },
      { field: "소형", indent: 1 },
      { field: "중형", indent: 1 },
      { field: "대형", indent: 1 },
      { field: "스피드스프레이어", indent: 0 },
      { field: "동력이앙기 계", indent: 0 },
      { field: "동력이앙기 보행형", indent: 1 },
      { field: "동력이앙기 승용형", indent: 1 },
      { field: "관리기 계", indent: 0 },
      { field: "관리기 보행형", indent: 1 },
      { field: "관리기 승용형", indent: 1 },
      { field: "콤바인 계", indent: 0 },
      { field: "3조 이하", indent: 1 },
      { field: "4조", indent: 1 },
      { field: "5조 이상", indent: 1 },
      { field: "곡물건조기", indent: 0 },
      { field: "농산물건조기", indent: 0 },
      { field: "파종기", indent: 0 },
      { field: "정식기", indent: 0 },
      { field: "수확기", indent: 0 },
      { field: "농업용멀티콥터", indent: 0 },
      { field: "농업용고소작업차", indent: 0 },
      { field: "농업용동력운반차", indent: 0 },
      { field: "주행형농업용방제기", indent: 0 },
      { field: "기타", indent: 0 },
    ],
  };

  return (
    <StatisticsContainer title="농기계 보유 현황">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default FarmMachineryHoldings;
