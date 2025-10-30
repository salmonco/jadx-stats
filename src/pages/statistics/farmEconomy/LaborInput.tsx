import { useState } from "react";
import useFetchStatsRange from "~/features/statistics/hooks/useFetchStatsRange";
import useFetchStatsData from "~/features/statistics/hooks/useFetchStatsData";
import { ChartConfig, SelectField } from "~/features/statistics/components/ChartSection";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { ChartSection, StatisticsContainer, TableSection } from "~/features/statistics/components";
import { TableConfig } from "~/features/statistics/components/TableSection";

const QUALIFIED_NAME = "lbrinp";
const UNIT = { 인구: "명", 시간: "시간" };

// 농가 노동 투하량
const LaborInput = () => {
  const [selectedYearRange, setSelectedYearRange] = useState<{ startYear: number; endYear: number }>({ startYear: 2013, endYear: 2024 });

  const yearRange: StatsRange = useFetchStatsRange(QUALIFIED_NAME);
  const data: YearlyStats = useFetchStatsData(QUALIFIED_NAME, selectedYearRange?.startYear, selectedYearRange?.endYear);

  const handleRangeChange = (value: { startYear: number; endYear: number }) => {
    setSelectedYearRange(value);
  };

  const getSelectFields = (currentSelections: Record<string, string | string[]>): SelectField[] => {
    const usageField: SelectField = {
      field: "카테고리",
      options: ["인구", "시간"],
      multiple: false,
    };

    // 기본 필드들 (변경되지 않는 필드)
    const baseFields: SelectField[] = [{ field: "C1_NM", options: ["제주특별자치도"], multiple: false, display: false }];

    // usageField에 따라 dynamicField의 options 결정
    const usage = currentSelections["카테고리"];
    let dynamicOptions: string[] = [];
    let defaultSelected: string[] | undefined;

    if (usage === "인구") {
      dynamicOptions = ["가구원", "가족농업 종사자", "상시종사자", "임시종사자"];
    } else if (usage === "시간") {
      dynamicOptions = ["자영농업노동투하량", "가족노동(품앗이포함)", "고용노동(일손돕기포함)", "직접노동", "간접노동"];
      defaultSelected = ["가족노동(품앗이포함)", "고용노동(일손돕기포함)", "직접노동", "간접노동"];
    }

    const dynamicField: SelectField = {
      field: "ITM_NM",
      options: dynamicOptions,
      multiple: true,
    };

    return [usageField, ...baseFields, dynamicField];
  };

  const chartConfig: ChartConfig = {
    groupField: "ITM_NM",
    unitKey: "카테고리",
    getSelectFields: getSelectFields,
    margin: { left: 50 },
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
      { field: "가구원", indent: 0 },
      { field: "가족농업 종사자", indent: 0 },
      { field: "상시종사자", indent: 0 },
      { field: "임시종사자", indent: 0 },
      { field: "자영농업노동투하량", indent: 0 },
      { field: "가족노동(품앗이포함)", indent: 0 },
      { field: "가족노동", indent: 1 },
      { field: "가족노동-남자", indent: 2 },
      { field: "가족노동-여자", indent: 2 },
      { field: "품앗이", indent: 1 },
      { field: "품앗이-남자", indent: 2 },
      { field: "품앗이-여자", indent: 2 },
      { field: "고용노동(일손돕기포함)", indent: 0 },
      { field: "고용노동", indent: 1 },
      { field: "고용노동-남자", indent: 2 },
      { field: "고용노동-여자", indent: 2 },
      { field: "일손돕기", indent: 1 },
      { field: "일손돕기-남자", indent: 2 },
      { field: "일손돕기-여자", indent: 2 },
      { field: "직접노동", indent: 0 },
      { field: "간접노동", indent: 0 },
    ],
  };

  return (
    <StatisticsContainer title="농가 노동투하량">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default LaborInput;
