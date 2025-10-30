import { useState } from "react";
import { useFetchStatsRange, useFetchStatsData } from "~/features/statistics/hooks";
import { StatisticsContainer, ChartSection, TableSection } from "~/features/statistics/components";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { ChartConfig } from "~/features/statistics/components/ChartSection";
import { TableConfig } from "~/features/statistics/components/TableSection";

const QUALIFIED_NAME = "lblt";
const UNIT = { 제주특별자치도: "천원" };

// 농가 부채
const Liabilities = () => {
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
          "부채-연도말",
          "차입금-연도말",
          "미불금 및 선수금-연도말",
          "고정부채-연도말",
          "유동부채-연도말",
          "금융기관-연도말",
          "개인 등-연도말",
          "농업용-연도말",
          "가계용-연도말",
          "겸업용-연도말",
          "기타용-연도말",
        ],
        multiple: true,
        defaultSelected: ["부채-연도말"],
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
      { field: "부채-연도말", indent: 0 },
      { field: "", indent: 0, isGroup: true },
      { field: "차입금-연도말", indent: 1 },
      { field: "미불금 및 선수금-연도말", indent: 1 },
      { field: "", indent: 0, isGroup: true },
      { field: "고정부채-연도말", indent: 1 },
      { field: "유동부채-연도말", indent: 1 },
      { field: "", indent: 0, isGroup: true },
      { field: "금융기관-연도말", indent: 1 },
      { field: "개인 등-연도말", indent: 1 },
      { field: "", indent: 0, isGroup: true },
      { field: "농업용-연도말", indent: 1 },
      { field: "가계용-연도말", indent: 1 },
      { field: "겸업용-연도말", indent: 1 },
      { field: "기타용-연도말", indent: 1 },
    ],
  };

  return (
    <StatisticsContainer title="농가 부채">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default Liabilities;
