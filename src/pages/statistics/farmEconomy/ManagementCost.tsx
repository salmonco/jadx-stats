import { useState } from "react";
import useFetchStatsRange from "~/features/statistics/hooks/useFetchStatsRange";
import useFetchStatsData from "~/features/statistics/hooks/useFetchStatsData";
import { ChartConfig } from "~/features/statistics/components/ChartSection";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { ChartSection, StatisticsContainer, TableSection } from "~/features/statistics/components";
import { TableConfig } from "~/features/statistics/components/TableSection";

const QUALIFIED_NAME = "mngmt-cost";
const UNIT = { 제주특별자치도: "천원" };

// 농업 경영비
const ManagementCost = () => {
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
          "농업경영비",
          "재료비",
          "종묘비",
          "비료비",
          "농약비",
          "동물비",
          "사료비",
          "기타재료비",
          "노무비",
          "경비",
          "광열비",
          "수선 및 농구비",
          "임차료",
          "수리비",
          "위탁비",
          "조세 및 부담금",
          "이자지급",
          "감가상각비",
          "농업부문 보험료",
          "유통비용및기타경비",
        ],
        multiple: true,
        defaultSelected: ["재료비", "노무비", "경비"],
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
      { field: "농업경영비", indent: 0 },
      { field: "재료비", indent: 1 },
      { field: "종묘비", indent: 2 },
      { field: "비료비", indent: 2 },
      { field: "농약비", indent: 2 },
      { field: "동물비", indent: 2 },
      { field: "사료비", indent: 2 },
      { field: "기타재료비", indent: 2 },
      { field: "노무비", indent: 1 },
      { field: "경비", indent: 1 },
      { field: "광열비", indent: 2 },
      { field: "수선 및 농구비", indent: 2 },
      { field: "임차료", indent: 2 },
      { field: "수리비", indent: 2 },
      { field: "위탁비", indent: 2 },
      { field: "조세 및 부담금", indent: 2 },
      { field: "이자지급", indent: 2 },
      { field: "감가상각비", indent: 2 },
      { field: "농업부문 보험료", indent: 2 },
      { field: "유통비용및기타경비", indent: 2 },
    ],
  };

  return (
    <StatisticsContainer title="농업 경영비">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default ManagementCost;
