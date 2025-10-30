import { useState } from "react";
import { useFetchStatsRange, useFetchStatsData } from "~/features/statistics/hooks";
import { StatisticsContainer, ChartSection, TableSection } from "~/features/statistics/components";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { ChartConfig } from "~/features/statistics/components/ChartSection";
import { TableConfig } from "~/features/statistics/components/TableSection";

const QUALIFIED_NAME = "crast";
const UNIT = { 제주도: "천원" };

// 농가 유동자산
const CurrentAssets = () => {
  const [selectedYearRange, setSelectedYearRange] = useState<{ startYear: number; endYear: number }>({ startYear: 2012, endYear: 2023 });

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
        options: ["제주도"],
        multiple: false,
        display: false,
      },
      {
        field: "ITM_NM",
        options: [
          "유동자산(재고및당좌)-연도말",
          "재고자산-연도말",
          "소동물-연도말",
          "농축산물-연도말",
          "농업생산자재-연도말",
          "당좌자산-연도말",
          "현금-연도말",
          "예금 등 금융자산-연도말",
          "미수금 및 선급금-연도말",
        ],
        multiple: true,
        defaultSelected: ["유동자산(재고및당좌)-연도말"],
      },
    ],
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
      "제주도",
    ],
  };

  return (
    <StatisticsContainer title="농가 유동자산">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default CurrentAssets;
