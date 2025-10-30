import { useState } from "react";
import { useFetchStatsRange, useFetchStatsData } from "~/features/statistics/hooks";
import { StatisticsContainer, ChartSection, TableSection } from "~/features/statistics/components";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { ChartConfig } from "~/features/statistics/components/ChartSection";
import { TableConfig } from "~/features/statistics/components/TableSection";

const QUALIFIED_NAME = "age-ppltn";
const UNIT = { 농가인구: "명" };

const PopulationByAge = () => {
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
        options: ["농가인구"],
        multiple: false,
        display: false,
      },
      {
        field: "C1_NM",
        options: ["제주특별자치도"],
        multiple: false,
        display: false,
      },
      {
        field: "C2_NM",
        options: [
          "0~4세",
          "5~9세",
          "10~14세",
          "15~19세",
          "20~24세",
          "25~29세",
          "30~34세",
          "35~39세",
          "40~44세",
          "45~49세",
          "50~54세",
          "55~59세",
          "60~64세",
          "65~69세",
          "70~74세",
          "75~79세",
          "80세이상",
        ],
        defaultSelected: ["0~4세", "10~14세", "20~24세", "30~34세", "40~44세", "50~54세", "60~64세", "70~74세", "80세이상"],
        multiple: true,
      },
    ],
    margin: { left: 55 },
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
      "제주특별자치도",
    ],
    measureField: "ITM_NM",
    measureOptions: ["농가인구", "농가인구(남)", "농가인구(여)"],
  };

  return (
    <StatisticsContainer title="연령별 농가인구">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default PopulationByAge;
