import { useState } from "react";
import useFetchStatsRange from "~/features/statistics/hooks/useFetchStatsRange";
import useFetchStatsData from "~/features/statistics/hooks/useFetchStatsData";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { ChartConfig, SelectField } from "~/features/statistics/components/ChartSection";
import { ChartSection, StatisticsContainer, TableSection } from "~/features/statistics/components";
import { TableConfig } from "~/features/statistics/components/TableSection";

const QUALIFIED_NAME = "cnvgt";
const UNIT = { 면적: "ha", 생산량: "톤", "10a당 생산량": "kg" };

// 채소류 - 조미채소
const RootVegetables = () => {
  const [selectedYearRange, setSelectedYearRange] = useState<{ startYear: number; endYear: number }>({ startYear: 2013, endYear: 2024 });

  const yearRange: StatsRange = useFetchStatsRange(QUALIFIED_NAME);
  const data: YearlyStats = useFetchStatsData(QUALIFIED_NAME, selectedYearRange?.startYear, selectedYearRange?.endYear);

  const handleRangeChange = (value: { startYear: number; endYear: number }) => {
    setSelectedYearRange(value);
  };

  const getSelectFields = (currentSelections: Record<string, string | string[]>): SelectField[] => {
    const usageField: SelectField = {
      field: "카테고리",
      options: ["면적", "생산량", "10a당 생산량"],
      multiple: false,
    };

    // 기본 필드들 (변경되지 않는 필드)
    const baseFields: SelectField[] = [{ field: "C1_NM", options: ["제주도"], multiple: false, display: false }];

    // usageField에 따라 dynamicField의 options 결정
    const usage = currentSelections["카테고리"];
    let dynamicOptions: string[] = [];
    let defaultSelected: string[] | undefined;

    if (usage === "면적") {
      dynamicOptions = ["조미채소:면적", "고추:면적", "건고추:면적", "풋고추:면적", "파:면적", "노지파:면적", "쪽파:면적", "노지쪽파:면적", "양파:면적", "마늘:면적"];
      defaultSelected = ["고추:면적", "파:면적", "쪽파:면적", "양파:면적", "마늘:면적"];
    } else if (usage === "생산량") {
      dynamicOptions = [
        "조미채소:생산량",
        "고추:생산량",
        "건고추:생산량",
        "풋고추:생산량",
        "파:생산량",
        "노지파:생산량",
        "쪽파:생산량",
        "노지쪽파:생산량",
        "양파:생산량",
        "마늘:생산량",
      ];
      defaultSelected = ["고추:생산량", "파:생산량", "쪽파:생산량", "양파:생산량", "마늘:생산량"];
    } else if (usage === "10a당 생산량") {
      dynamicOptions = [
        "건고추:10a당 생산량",
        "풋고추:10a당 생산량",
        "노지파:10a당 생산량",
        "쪽파:10a당 생산량",
        "노지쪽파:10a당 생산량",
        "양파:10a당 생산량",
        "마늘:10a당 생산량",
      ];
      defaultSelected = ["노지파:10a당 생산량", "쪽파:10a당 생산량", "양파:10a당 생산량", "마늘:10a당 생산량"];
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
    margin: { left: 65 },
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
    <StatisticsContainer title="채소류 - 조미채소">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default RootVegetables;
