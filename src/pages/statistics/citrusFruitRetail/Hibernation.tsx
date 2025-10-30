import { useState } from "react";
import { useFetchStatsRange, useFetchStatsData } from "~/features/statistics/hooks";
import { StatisticsContainer, ChartSection, TableSection } from "~/features/statistics/components";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { ChartConfig } from "~/features/statistics/components/ChartSection";
import { TableConfig } from "~/features/statistics/components/TableSection";

const QUALIFIED_NAME = "hinat-cifru";
const UNIT = { 면적: "ha", 생산량: "톤", 조수입: "백만원", 재배농가: "명", kg당가격: "원" };

// 월동감귤(온주) 재배 현황
const Hibernation = () => {
  const [selectedYearRange, setSelectedYearRange] = useState<{ startYear: number; endYear: number }>({ startYear: 2011, endYear: 2020 });

  const yearRange: StatsRange = useFetchStatsRange(QUALIFIED_NAME);
  const data: YearlyStats = useFetchStatsData(QUALIFIED_NAME, selectedYearRange?.startYear, selectedYearRange?.endYear);

  const handleRangeChange = (value: { startYear: number; endYear: number }) => {
    setSelectedYearRange(value);
  };

  const chartConfig: ChartConfig = {
    groupField: "C1_NM",
    selectFields: [
      {
        field: "C1_NM",
        options: ["면적", "생산량", "조수입", "재배농가", "kg당가격"],
        multiple: false,
      },
    ],
  };

  const tableConfig: TableConfig = {
    groupField: "C1_NM",
  };

  return (
    <StatisticsContainer title="월동감귤(온주) 재배 현황">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default Hibernation;
