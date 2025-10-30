import { useState } from "react";
import { useFetchStatsRange, useFetchStatsData } from "~/features/statistics/hooks";
import { StatisticsContainer, ChartSection, TableSection } from "~/features/statistics/components";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { ChartConfig } from "~/features/statistics/components/ChartSection";
import { TableConfig } from "~/features/statistics/components/TableSection";

const QUALIFIED_NAME = "bsc-stats";
const UNIT = { 재배면적: "ha", 생산량: "톤", 농가수: "명", 재배농가: "가구", 조수입: "억원" };

// 감귤 기본통계
const BasicStatistics = () => {
  const [selectedYearRange, setSelectedYearRange] = useState<{ startYear: number; endYear: number }>({ startYear: 2012, endYear: 2023 });

  const yearRange: StatsRange = useFetchStatsRange(QUALIFIED_NAME);
  const data: YearlyStats = useFetchStatsData(QUALIFIED_NAME, selectedYearRange?.startYear, selectedYearRange?.endYear);

  const handleRangeChange = (value: { startYear: number; endYear: number }) => {
    setSelectedYearRange(value);
  };

  const chartConfig: ChartConfig = {
    groupField: "ITM_NM",
    selectFields: [
      {
        field: "ITM_NM",
        options: ["재배면적", "생산량", "농가수", "재배농가", "조수입"],
        multiple: false,
      },
    ],
  };

  const tableConfig: TableConfig = {
    groupField: "ITM_NM",
  };

  return (
    <StatisticsContainer title="감귤 기본통계">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default BasicStatistics;
