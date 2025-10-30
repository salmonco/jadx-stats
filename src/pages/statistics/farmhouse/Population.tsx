import { useState } from "react";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { useFetchStatsRange, useFetchStatsData } from "~/features/statistics/hooks";
import { StatisticsContainer, TableSection, ChartSection } from "~/features/statistics/components";
import { ChartConfig } from "~/features/statistics/components/ChartSection";
import { TableConfig } from "~/features/statistics/components/TableSection";
import { Select } from "antd";

const QUALIFIED_NAME = "ppltn";
const UNIT = { 농가: "가구", 농가인구: "명" };

// 농가 및 농가 인구
const Population = () => {
  const [selectedYearRange, setSelectedYearRange] = useState<{ startYear: number; endYear: number }>({ startYear: 2013, endYear: 2024 });

  const yearRange: StatsRange = useFetchStatsRange(QUALIFIED_NAME);
  const data: YearlyStats = useFetchStatsData(QUALIFIED_NAME, selectedYearRange?.startYear, selectedYearRange?.endYear);

  const handleRangeChange = (value: { startYear: number; endYear: number }) => {
    setSelectedYearRange(value);
  };

  const chartConfig: ChartConfig = {
    groupField: "C1_NM",
    unitKey: "ITM_NM",
    selectFields: [
      {
        field: "ITM_NM",
        options: ["농가", "농가인구"],
        multiple: false,
      },
      {
        field: "C1_NM",
        options: ["제주특별자치도", "제주시", "서귀포시"],
        defaultSelected: ["제주시", "서귀포시"],
        multiple: true,
      },
    ],
    margin: { left: 60 },
  };

  const tableConfig: TableConfig = {
    groupField: "ITM_NM",
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
      "제주특별자치도",
    ],
    excludeField: "ITM_NM",
    excludeOptions: ["상대표준오차", "상대표준오차(농가인구)"],
  };

  return (
    <StatisticsContainer title="농가 및 농가인구">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default Population;
