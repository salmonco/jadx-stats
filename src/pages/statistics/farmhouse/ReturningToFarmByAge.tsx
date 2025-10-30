import { useState } from "react";
import { Segmented } from "antd";
import useFetchStatsRange from "~/features/statistics/hooks/useFetchStatsRange";
import useFetchStatsData from "~/features/statistics/hooks/useFetchStatsData";
import ChartSection, { ChartConfig } from "~/features/statistics/components/ChartSection";
import { StatisticsContainer, TableSection } from "~/features/statistics/components";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { TableConfig } from "~/features/statistics/components/TableSection";

// 귀농, 귀촌 페이지 합쳐달라는 요구 사항 -> 데이터 합치려다가 그냥 탭으로 분리
const configs = {
  "연령별 귀농 가구 및 세대원": {
    qualifiedName: "age-rtfrm",
    unit: { 귀농가구원수: "명", 귀농인수: "명" },
    chartConfig: {
      groupField: "C2_NM",
      unitKey: "ITM_NM",
      selectFields: [
        { field: "ITM_NM", options: ["귀농가구원수", "귀농인수"], multiple: false },
        { field: "C1_NM", options: ["제주특별자치도", "제주시", "서귀포시"], multiple: false },
        {
          field: "C2_NM",
          options: ["계", "30대이하", "40대", "50대", "60대", "70대이상"],
          defaultSelected: ["30대이하", "40대", "50대", "60대", "70대이상"],
          multiple: true,
        },
      ],
      margin: { left: 35 },
    } as ChartConfig,
    tableConfig: {
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
      measureOptions: ["귀농가구원수", "귀농인수", "동반가구원수"],
    } as TableConfig,
  },
  "연령별 귀촌 가구 및 세대원": {
    qualifiedName: "age-rtrrl",
    unit: { 귀촌가구주수: "명", 귀촌인수: "명" },
    chartConfig: {
      groupField: "C2_NM",
      unitKey: "ITM_NM",
      selectFields: [
        { field: "ITM_NM", options: ["귀촌가구주수", "귀촌인수"], multiple: false },
        { field: "C1_NM", options: ["제주특별자치도", "제주시", "서귀포시"], multiple: false },
        {
          field: "C2_NM",
          options: ["계", "0 - 29세", "30 - 39세", "40 - 49세", "50 - 59세", "60 - 69세", "70세 이상"],
          defaultSelected: ["0 - 29세", "30 - 39세", "40 - 49세", "50 - 59세", "60 - 69세", "70세 이상"],
          multiple: true,
        },
      ],
      margin: { left: 50 },
    } as ChartConfig,
    tableConfig: {
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
    } as TableConfig,
  },
} as const;

const ReturningToFarmByAge = () => {
  const [selectedSubject, setSelectedSubject] = useState<"연령별 귀농 가구 및 세대원" | "연령별 귀촌 가구 및 세대원">("연령별 귀농 가구 및 세대원");
  const [selectedYearRange, setSelectedYearRange] = useState({ startYear: 2013, endYear: 2024 });

  const { qualifiedName, unit, chartConfig, tableConfig } = configs[selectedSubject];

  const yearRange: StatsRange = useFetchStatsRange(qualifiedName);
  const data: YearlyStats = useFetchStatsData(qualifiedName, selectedYearRange.startYear, selectedYearRange.endYear);

  const handleRangeChange = (range: { startYear: number; endYear: number }) => {
    setSelectedYearRange(range);
  };

  return (
    <StatisticsContainer title="연령별 귀농/귀촌 가구 및 세대원" subject={selectedSubject}>
      <Segmented
        options={[
          { label: "귀농", value: "연령별 귀농 가구 및 세대원" },
          { label: "귀촌", value: "연령별 귀촌 가구 및 세대원" },
        ]}
        block
        size="large"
        value={selectedSubject}
        onChange={(value) => setSelectedSubject(value as "연령별 귀농 가구 및 세대원" | "연령별 귀촌 가구 및 세대원")}
        className="statistics-segmented"
      />
      <ChartSection
        key={`chart-${selectedSubject}`}
        data={data}
        config={chartConfig}
        unit={unit}
        yearRange={yearRange}
        selectedYearRange={selectedYearRange}
        handleRangeChange={handleRangeChange}
      />
      <TableSection key={`table-${selectedSubject}`} data={data} config={tableConfig} unit={unit} />
    </StatisticsContainer>
  );
};

export default ReturningToFarmByAge;
