import { useState } from "react";
import { useFetchStatsRange, useFetchStatsData } from "~/features/statistics/hooks";
import { StatisticsContainer, ChartSection, TableSection } from "~/features/statistics/components";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { ChartConfig } from "~/features/statistics/components/ChartSection";
import { TableConfig } from "~/features/statistics/components/TableSection";

const QUALIFIED_NAME = "cifruhyb";
const UNIT = { 면적: "ha", 농가수: "가구", 생산량: "톤" };

// 만감류 재배 현황
const Hybrid = () => {
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
        field: "ITM_NM",
        options: ["면적", "농가수", "생산량"],
        multiple: false,
      },
      {
        field: "C1_NM",
        options: ["한라봉", "천혜향", "청견", "진지향", "기타", "금감", "레드향", "황금향"],
        multiple: true,
      },
    ],
  };

  const tableConfig: TableConfig = {
    groupField: "ITM_NM",
    measureField: "C1_NM",
    measureOptions: ["한라봉", "천혜향", "청견", "진지향", "기타", "금감", "레드향", "황금향"],
  };

  return (
    <StatisticsContainer title="만감류 재배 현황">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default Hybrid;
