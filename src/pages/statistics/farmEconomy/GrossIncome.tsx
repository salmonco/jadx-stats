import { useState } from "react";
import { useFetchStatsRange, useFetchStatsData } from "~/features/statistics/hooks";
import { StatisticsContainer, ChartSection, TableSection } from "~/features/statistics/components";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { ChartConfig } from "~/features/statistics/components/ChartSection";
import { TableConfig } from "~/features/statistics/components/TableSection";

const QUALIFIED_NAME = "grsincm";
const UNIT = { 제주특별자치도: "천원" };

// 농업 총(조) 수입
const GrossIncome = () => {
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
          "농업총수입",
          "농작물수입",
          "미곡",
          "맥류",
          "잡곡",
          "두류",
          "서류",
          "채소",
          "과수",
          "화훼",
          "특작및기타",
          "농작물부산물",
          "축산수입",
          "대동물",
          "소동물",
          "축산물",
          "축산부산물",
          "농업잡수입",
          "소득보상금",
          "기타",
        ],
        multiple: true,
        defaultSelected: ["농작물수입", "축산수입", "농업잡수입"],
      },
    ],
    margin: { left: 60 },
  };

  const tableConfig: TableConfig = {
    groupField: "ITM_NM",
    filterField: "C1_NM",
    filterOptions: [
      // "서울특별시",
      // "부산광역시",
      // "대구광역시",
      // "인천광역시",
      // "광주광역시",
      // "대전광역시",
      // "울산광역시",
      // "세종특별자치시",
      "경기도",
      "강원특별자치도",
      "충청북도",
      "충청남도",
      "전북특별자치도",
      "전라남도",
      "경상북도",
      "경상남도",
      "제주특별자치도",
    ],
    hierarchy: [
      { field: "농업총수입", indent: 0 },
      { field: "농작물수입", indent: 1 },
      { field: "미곡", indent: 2 },
      { field: "맥류", indent: 2 },
      { field: "잡곡", indent: 2 },
      { field: "두류", indent: 2 },
      { field: "서류", indent: 2 },
      { field: "채소", indent: 2 },
      { field: "과수", indent: 2 },
      { field: "화훼", indent: 2 },
      { field: "특작및기타", indent: 2 },
      { field: "농작물부산물", indent: 2 },
      { field: "축산수입", indent: 1 },
      { field: "대동물", indent: 2 },
      { field: "소동물", indent: 2 },
      { field: "축산물", indent: 2 },
      { field: "축산부산물", indent: 2 },
      { field: "농업잡수입", indent: 1 },
      { field: "소득보상금", indent: 2 },
      { field: "기타", indent: 2 },
    ],
  };

  return (
    <StatisticsContainer title="농업 총(조) 수입">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default GrossIncome;
