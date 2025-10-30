import { useState } from "react";
import useFetchStatsRange from "~/features/statistics/hooks/useFetchStatsRange";
import useFetchStatsData from "~/features/statistics/hooks/useFetchStatsData";
import { ChartConfig, SelectField } from "~/features/statistics/components/ChartSection";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { ChartSection, StatisticsContainer, TableSection } from "~/features/statistics/components";
import { TableConfig } from "~/features/statistics/components/TableSection";

const QUALIFIED_NAME = "utztn";
const UNIT = { 경지이용면적: "ha", 경지이용률: "%" };

// 경지이용
const Utilization = () => {
  const [selectedYearRange, setSelectedYearRange] = useState<{ startYear: number; endYear: number }>({ startYear: 2013, endYear: 2024 });

  const yearRange: StatsRange = useFetchStatsRange(QUALIFIED_NAME);
  const data: YearlyStats = useFetchStatsData(QUALIFIED_NAME, selectedYearRange?.startYear, selectedYearRange?.endYear);

  const handleRangeChange = (value: { startYear: number; endYear: number }) => {
    setSelectedYearRange(value);
  };

  const getSelectFields = (currentSelections: Record<string, string | string[]>): SelectField[] => {
    const usage = (currentSelections["카테고리"] ?? "경지이용면적") as string;

    const usageField: SelectField = {
      field: "카테고리",
      options: ["경지이용면적", "경지이용률"],
      multiple: false,
    };

    const baseFields: SelectField[] = [
      { field: "C2_NM", options: ["합계", "논", "밭"], multiple: false },
      { field: "C1_NM", options: ["제주도"], multiple: false, display: false },
    ];

    let dynamicOptions: string[] = [];
    let defaultSelected: string[] | undefined;

    if (usage === "경지이용면적") {
      dynamicOptions = ["작물재배면적(경지이용면적)", "식량작물", "채소", "특용약용작물", "과수", "기타수원지", "기타작물", "시설작물", "휴경면적"];
      defaultSelected = ["식량작물", "채소", "휴경면적", "시설작물", "기타작물", "기타수원지", "과수", "특용약용작물"];
    } else {
      dynamicOptions = [
        "전체 경지이용률 ", // <- 끝에 띄어쓰기 있어야함 주의
        "식량작물(경지이용률)",
        "채소(경지이용률)",
        "특용약용작물(경지이용률)",
        "과수(경지이용률)",
        "기타수원지(경지이용률)",
        "기타작물(경지이용률)",
        "시설작물(경지이용률)",
      ];
      defaultSelected = [
        "식량작물(경지이용률)",
        "채소(경지이용률)",
        "특용약용작물(경지이용률)",
        "과수(경지이용률)",
        "기타수원지(경지이용률)",
        "기타작물(경지이용률)",
        "시설작물(경지이용률)",
      ];
    }

    const dynamicField: SelectField = {
      field: "ITM_NM",
      options: dynamicOptions,
      multiple: true,
      ...(defaultSelected ? { defaultSelected } : {}),
    };

    return [usageField, ...baseFields, dynamicField];
  };

  const chartConfig: ChartConfig = {
    groupField: "ITM_NM",
    unitKey: "카테고리",
    getSelectFields: getSelectFields,
    margin: { left: 55 },
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
    measureField: "C2_NM",
    measureOptions: ["합계", "논", "밭"],
    unitMapping: {
      "경작가능면적(전년도말)": "ha",
      "작물재배면적(경지이용면적)": "ha",
      "전체 경지이용률 ": "%",
      "식량작물(경지이용률)": "%",
      "식량작물": "ha",
      "벼(경지이용률)": "%",
      "벼": "ha",
      "보리(맥류)(경지이용률)": "%",
      "보리(맥류)": "ha",
      "잡곡(경지이용률)": "%",
      "잡곡": "ha",
      "두류(경지이용률)": "%",
      "두류": "ha",
      "서류(경지이용률)": "%",
      "서류": "ha",
      "채소(경지이용률)": "%",
      "채소": "ha",
      "특용약용작물(경지이용률)": "%",
      "특용약용작물": "ha",
      "과수(경지이용률)": "%",
      "과수": "ha",
      "기타수원지(경지이용률)": "%",
      "기타수원지": "ha",
      "기타작물(경지이용률)": "%",
      "기타작물": "ha",
      "시설작물(경지이용률)": "%",
      "시설작물": "ha",
      "휴경면적": "ha",
    },
  };

  return (
    <StatisticsContainer title="경지이용">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default Utilization;
