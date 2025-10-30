import { useState } from "react";
import useFetchStatsRange from "~/features/statistics/hooks/useFetchStatsRange";
import useFetchStatsData from "~/features/statistics/hooks/useFetchStatsData";
import { ChartConfig } from "~/features/statistics/components/ChartSection";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { ChartSection, StatisticsContainer, TableSection } from "~/features/statistics/components";
import { TableConfig } from "~/features/statistics/components/TableSection";

const QUALIFIED_NAME = "frmlnd-scl";
const UNIT = { 제주특별자치도: "가구" };

// 경지규모별 농가
const PopulationByFarmlandScale = () => {
  const [selectedYearRange, setSelectedYearRange] = useState<{ startYear: number; endYear: number }>({ startYear: 2013, endYear: 2024 });

  const yearRange: StatsRange = useFetchStatsRange(QUALIFIED_NAME);
  const data: YearlyStats = useFetchStatsData(QUALIFIED_NAME, selectedYearRange?.startYear, selectedYearRange?.endYear);

  const handleRangeChange = (value: { startYear: number; endYear: number }) => {
    setSelectedYearRange(value);
  };

  const chartConfig: ChartConfig = {
    groupField: "ITM_NM",
    unitKey: "C1_NM",
    selectFields: [
      {
        field: "C1_NM",
        options: ["제주특별자치도"],
        multiple: false,
        display: false,
      },
      {
        field: "ITM_NM",
        options: [
          "경지있는 농가",
          "0.1ha 미만",
          "0.1~0.2ha 미만",
          "0.2~0.3ha 미만",
          "0.3~0.5ha 미만",
          "0.5~0.7ha 미만",
          "0.7~1.0ha 미만",
          "1.0~1.5ha 미만",
          "1.5~2.0ha 미만",
          "2.0~2.5ha 미만",
          "2.5~3.0ha 미만",
          "3.0~5.0ha 미만",
          "5.0~7.0ha 미만",
          "7.0~10.0ha 미만",
          "10.0ha 이상",
        ],
        multiple: true,
        defaultSelected: [
          "0.1ha 미만",
          "0.1~0.2ha 미만",
          "0.3~0.5ha 미만",
          "0.5~0.7ha 미만",
          "0.7~1.0ha 미만",
          "1.0~1.5ha 미만",
          "1.5~2.0ha 미만",
          "3.0~5.0ha 미만",
          "10.0ha 이상",
        ],
      },
    ],
    margin: { left: 50 },
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
      "제주시",
      "서귀포시",
    ],
  };

  return (
    <StatisticsContainer title="경지규모별 농가">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default PopulationByFarmlandScale;
