import { useState } from "react";
import { useFetchStatsRange, useFetchStatsData } from "~/features/statistics/hooks";
import { StatisticsContainer, ChartSection, TableSection } from "~/features/statistics/components";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { ChartConfig } from "~/features/statistics/components/ChartSection";
import { TableConfig } from "~/features/statistics/components/TableSection";

const QUALIFIED_NAME = "earn";
const UNIT = { 제주특별자치도: "천원" };
// 농가 소득
const Earnings = () => {
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
          "농가소득",
          "농가순소득",
          "농업소득",
          "농업총수입",
          "농업경영비",
          "농외소득",
          "겸업소득",
          "겸업수입",
          "겸업지출",
          "사업외소득",
          "사업외수입",
          "사업외지출",
          "이전소득",
          "비경상소득",
          "가계지출",
          "소비지출",
          "비소비지출",
          "농가처분가능소득",
          "농가경제잉여",
        ],
        multiple: true,
        defaultSelected: ["농가소득", "가계지출", "농가처분가능소득", "농가경제잉여"],
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
      { field: "농가소득", indent: 0 },
      { field: "농가순소득", indent: 1 },
      { field: "농업소득", indent: 2 },
      { field: "농업총수입", indent: 2 },
      { field: "농업경영비", indent: 2 },
      { field: "농외소득", indent: 2 },
      { field: "겸업소득", indent: 2 },
      { field: "겸업수입", indent: 3 },
      { field: "겸업지출", indent: 3 },
      { field: "사업외소득", indent: 2 },
      { field: "사업외수입", indent: 3 },
      { field: "사업외지출", indent: 3 },
      { field: "이전소득", indent: 1 },
      { field: "비경상소득", indent: 1 },
      { field: "가계지출", indent: 0 },
      { field: "소비지출", indent: 1 },
      { field: "비소비지출", indent: 1 },
      { field: "농가처분가능소득", indent: 0 },
      { field: "농가경제잉여", indent: 0 },
    ],
  };

  return (
    <StatisticsContainer title="농가 소득">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default Earnings;
