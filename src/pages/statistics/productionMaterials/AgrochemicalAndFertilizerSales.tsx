import { useState } from "react";
import { useFetchStatsRange, useFetchStatsData } from "~/features/statistics/hooks";
import { StatisticsContainer, ChartSection, TableSection } from "~/features/statistics/components";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { ChartConfig, SelectField } from "~/features/statistics/components/ChartSection";
import { TableConfig } from "~/features/statistics/components/TableSection";

const QUALIFIED_NAME = "agrchm-frtlzr-ntsl";
const UNIT = { 수도용: "톤", 원예용: "톤", 제초제: "톤", 친환경농약: "톤", 기타: "톤", 화학비료: "톤", "유기질 및 기타비료": "톤" };

// 농약, 비료 판매 현황
const AgrochemicalAndFertilizerSales = () => {
  const [selectedYearRange, setSelectedYearRange] = useState<{ startYear: number; endYear: number }>({ startYear: 2012, endYear: 2023 });

  const yearRange: StatsRange = useFetchStatsRange(QUALIFIED_NAME);
  const data: YearlyStats = useFetchStatsData(QUALIFIED_NAME, selectedYearRange?.startYear, selectedYearRange?.endYear);

  const handleRangeChange = (value: { startYear: number; endYear: number }) => {
    setSelectedYearRange(value);
  };

  const getSelectFields = (currentSelections: Record<string, string | string[]>): SelectField[] => {
    const usageField: SelectField = {
      field: "C1_NM",
      options: ["수도용", "원예용", "제초제", "친환경농약", "기타", "화학비료", "유기질 및 기타비료"],
      multiple: false,
    };

    // 기본 필드들 (변경되지 않는 필드)
    const baseFields: SelectField[] = [];

    // usageField에 따라 dynamicField의 options 결정
    const usage = currentSelections["C1_NM"] ?? "수도용";
    let dynamicOptions: string[] = [];
    let defaultSelected: string[] | undefined;

    if (usage === "수도용") {
      dynamicOptions = ["살균제", "살충제"];
    } else if (usage === "원예용") {
      dynamicOptions = ["살균제", "살충제"];
    } else if (usage === "제초제") {
      dynamicOptions = ["제초제"];
    } else if (usage === "친환경농약") {
      dynamicOptions = ["친환경농약"];
    } else if (usage === "기타") {
      dynamicOptions = ["기타"];
    } else if (usage === "화학비료") {
      dynamicOptions = ["요소", "용성인비", "용과린", "염화가리", "복합비료", "유안"];
      defaultSelected = ["요소", "용성인비", "복합비료", "염화가리"];
    } else if (usage === "유기질 및 기타비료") {
      dynamicOptions = ["유기복합비료", "유기질비료", "석회질비료", "부산물비료", "미량요소", "기타"];
      defaultSelected = ["유기복합비료", "유기질비료", "석회질비료", "부산물비료", "미량요소"];
    }

    const dynamicField: SelectField = {
      field: "C2_NM",
      options: dynamicOptions,
      multiple: true,
      ...(defaultSelected ? { defaultSelected } : {}),
    };

    return [usageField, ...baseFields, dynamicField];
  };

  const chartConfig: ChartConfig = {
    groupField: "C2_NM",
    usageKey: "C1_NM",
    unitKey: "C1_NM",
    getSelectFields: getSelectFields,
    margin: { left: 55 },
  };

  const tableConfig: TableConfig = {
    groupField: "C2_NM",
    filterField: "C1_NM",
    filterOptions: ["수도용", "원예용", "제초제", "친환경농약", "기타", "화학비료", "유기질 및 기타비료"],
  };

  return (
    <StatisticsContainer title="농약, 비료 판매 현황">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default AgrochemicalAndFertilizerSales;
