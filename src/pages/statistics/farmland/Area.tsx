import { useState } from "react";
import useFetchStatsRange from "~/features/statistics/hooks/useFetchStatsRange";
import useFetchStatsData from "~/features/statistics/hooks/useFetchStatsData";
import ChartSection, { ChartConfig } from "~/features/statistics/components/ChartSection";
import TableSection, { TableConfig } from "~/features/statistics/components/TableSection";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { StatisticsContainer } from "~/features/statistics/components";

const QUALIFIED_NAME = "area";
const UNIT = { 경지면적: "헥타르" };

// 경지면적
const Area = () => {
  const [selectedYearRange, setSelectedYearRange] = useState<{ startYear: number; endYear: number }>({ startYear: 2013, endYear: 2024 });

  const yearRange: StatsRange = useFetchStatsRange(QUALIFIED_NAME);
  const data: YearlyStats = useFetchStatsData(QUALIFIED_NAME, selectedYearRange?.startYear, selectedYearRange?.endYear);

  const handleRangeChange = (value: { startYear: number; endYear: number }) => {
    setSelectedYearRange(value);
  };

  const chartConfig: ChartConfig = {
    groupField: "C2_NM",
    unitKey: "ITM_NM",
    selectFields: [
      {
        field: "ITM_NM",
        options: ["경지면적"],
        multiple: false,
        display: false,
      },
      {
        field: "C1_NM",
        options: ["제주도"],
        multiple: false,
        display: false,
      },
      {
        field: "C2_NM",
        options: ["논", "밭"],
        multiple: true,
        defaultSelected: ["밭"],
      },
    ],
    margin: { left: 60 },
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
      "강원도",
      "충청북도",
      "충청남도",
      "전라북도",
      "전라남도",
      "경상북도",
      "경상남도",
      "제주도",
    ],
  };

  return (
    <StatisticsContainer title="경지면적">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default Area;
