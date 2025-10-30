import { useState } from "react";
import useFetchStatsRange from "~/features/statistics/hooks/useFetchStatsRange";
import useFetchStatsData from "~/features/statistics/hooks/useFetchStatsData";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { ChartConfig, SelectField } from "~/features/statistics/components/ChartSection";
import { ChartSection, StatisticsContainer, TableSection } from "~/features/statistics/components";
import { TableConfig } from "~/features/statistics/components/TableSection";

const QUALIFIED_NAME = "rtcrp";
const UNIT = { 면적: "ha", 생산량: "톤", "10a당 생산량": "kg" };

// 식량작물 - 서류
const RootAndTuberCrops = () => {
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
      dynamicOptions = ["합계:면적", "고구마:면적", "감자:면적", "일반봄감자:면적", "고랭지감자:면적", "가을감자:면적"];
      defaultSelected = ["고구마:면적", "감자:면적"];
    } else if (usage === "생산량") {
      dynamicOptions = ["합계:생산량", "고구마:생산량", "감자:생산량", "일반봄감자:생산량", "고랭지감자:생산량", "가을감자:생산량"];
      defaultSelected = ["고구마:생산량", "감자:생산량"];
    } else if (usage === "10a당 생산량") {
      dynamicOptions = ["고구마:10a당 생산량", "감자:10a당 생산량", "일반봄감자:10a당 생산량", "고랭지감자:10a당 생산량", "가을감자:10a당 생산량"];
      defaultSelected = ["고구마:10a당 생산량", "감자:10a당 생산량"];
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
    <StatisticsContainer title="식량작물 - 서류">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default RootAndTuberCrops;
