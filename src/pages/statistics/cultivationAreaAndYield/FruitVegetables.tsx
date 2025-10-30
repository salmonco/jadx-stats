import { useState } from "react";
import useFetchStatsRange from "~/features/statistics/hooks/useFetchStatsRange";
import useFetchStatsData from "~/features/statistics/hooks/useFetchStatsData";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { ChartConfig, SelectField } from "~/features/statistics/components/ChartSection";
import { ChartSection, StatisticsContainer, TableSection } from "~/features/statistics/components";
import { TableConfig } from "~/features/statistics/components/TableSection";

const QUALIFIED_NAME = "frtvgt";
const UNIT = { 면적: "ha", 생산량: "톤", "10a당 생산량": "kg" };

// 채소류 - 과채류
const FruitVegetables = () => {
  const [selectedYearRange, setSelectedYearRange] = useState<{ startYear: number; endYear: number }>({ startYear: 2014, endYear: 2023 });

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
      dynamicOptions = ["과채류:면적", "수박:면적", "참외:면적", "딸기:면적", "오이:면적", "호박:면적", "토마토:면적"];
      defaultSelected = ["수박:면적", "참외:면적", "딸기:면적", "호박:면적", "토마토:면적"];
    } else if (usage === "생산량") {
      dynamicOptions = ["과채류:생산량", "수박:생산량", "참외:생산량", "딸기:생산량", "오이:생산량", "호박:생산량", "토마토:생산량"];
      defaultSelected = ["수박:생산량", "참외:생산량", "딸기:생산량", "호박:생산량", "토마토:생산량"];
    } else if (usage === "10a당 생산량") {
      dynamicOptions = [
        "노지수박:10a당 생산량",
        "시설수박:10a당 생산량",
        "노지참외:10a당 생산량",
        "시설참외:10a당 생산량",
        "노지딸기:10a당 생산량",
        "시설딸기:10a당 생산량",
        "노지오이:10a당 생산량",
        "시설오이:10a당 생산량",
        "노지호박:10a당 생산량",
        "시설호박:10a당 생산량",
        "시설토마토:10a당 생산량",
      ];
      defaultSelected = ["시설호박:10a당 생산량", "시설토마토:10a당 생산량", "시설수박:10a당 생산량", "시설참외:10a당 생산량", "시설딸기:10a당 생산량"];
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
    <StatisticsContainer title="채소류 - 과채류">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default FruitVegetables;
