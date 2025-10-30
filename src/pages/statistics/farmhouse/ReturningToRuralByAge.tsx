import { useState } from "react";
import useFetchStatsRange from "~/features/statistics/hooks/useFetchStatsRange";
import useFetchStatsData from "~/features/statistics/hooks/useFetchStatsData";
import ChartSection, { ChartConfig } from "~/features/statistics/components/ChartSection";
import TableSection, { TableConfig } from "~/features/statistics/components/TableSection";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { StatisticsContainer } from "~/features/statistics/components";

const QUALIFIED_NAME = "age-rtrrl";
const UNIT = { 귀촌가구주수: "명", 귀촌인수: "명" };

// 연령별 귀촌 가구 및 세대원
const ReturningToRuralByAge = () => {
  const [selectedYearRange, setSelectedYearRange] = useState<{ startYear: number; endYear: number }>({ startYear: 2014, endYear: 2023 });

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
        options: ["귀촌가구주수", "귀촌인수"],
        multiple: false,
      },
      {
        field: "C1_NM",
        options: ["제주특별자치도", "제주시", "서귀포시"],
        multiple: false,
      },
      {
        field: "C2_NM",
        options: ["0 - 29세", "30 - 39세", "40 - 49세", "50 - 59세", "60 - 69세", "70세 이상"],
        multiple: true,
      },
    ],
    margin: { left: 50 },
  };

  const tableConfig: TableConfig = {
    groupField: "C2_NM",
    filterField: "C1_NM",
    filterOptions: [
      "부산광역시",
      "대구광역시",
      "인천광역시",
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
      "제주특별자치도",
    ],
    measureField: "ITM_NM",
    measureOptions: ["귀촌가구주수", "귀촌인수", "동반가구원수"],
  };

  return (
    <StatisticsContainer title="연령별 귀촌 가구 및 세대원">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default ReturningToRuralByAge;
