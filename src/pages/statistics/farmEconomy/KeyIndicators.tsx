import { useState } from "react";
import useFetchStatsRange from "~/features/statistics/hooks/useFetchStatsRange";
import useFetchStatsData from "~/features/statistics/hooks/useFetchStatsData";
import { ChartConfig, SelectField } from "~/features/statistics/components/ChartSection";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { ChartSection, StatisticsContainer, TableSection } from "~/features/statistics/components";
import { TableConfig } from "~/features/statistics/components/TableSection";

const QUALIFIED_NAME = "key-idct";
const UNIT = {
  "인구 및 노동력": "명",
  "농지 규모": "ha",
  "노동 시간": "시간",
  "소득 및 지출": "천원",
  "경제 비율 지표": "%",
};

// 농가경제 주요지표
const KeyIndicators = () => {
  const [selectedYearRange, setSelectedYearRange] = useState<{ startYear: number; endYear: number }>({ startYear: 2014, endYear: 2023 });

  const yearRange: StatsRange = useFetchStatsRange(QUALIFIED_NAME);
  const data: YearlyStats = useFetchStatsData(QUALIFIED_NAME, selectedYearRange?.startYear, selectedYearRange?.endYear);

  const handleRangeChange = (value: { startYear: number; endYear: number }) => {
    setSelectedYearRange(value);
  };

  const getSelectFields = (currentSelections: Record<string, string | string[]>): SelectField[] => {
    const usageField: SelectField = {
      field: "카테고리",
      options: ["인구 및 노동력", "농지 규모", "노동 시간", "소득 및 지출", "경제 비율 지표"],
      multiple: false,
    };

    // 기본 필드들 (변경되지 않는 필드)
    const baseFields: SelectField[] = [{ field: "C1_NM", options: ["제주도"], multiple: false, display: false }];

    // usageField에 따라 dynamicField의 options 결정
    const usage = currentSelections["카테고리"];
    let dynamicOptions: string[] = [];
    if (usage === "인구 및 노동력") {
      dynamicOptions = ["가구원", "농업상시종사자"];
    } else if (usage === "농지 규모") {
      dynamicOptions = ["경지면적"];
    } else if (usage === "노동 시간") {
      dynamicOptions = ["자영농업노동시간"];
    } else if (usage === "소득 및 지출") {
      dynamicOptions = [
        "농가소득(경상소득+비경상소득)",
        "경상소득(농가순소득+이전소득)",
        "농가순소득(농업소득+농외소득)",
        "농업소득",
        "농외소득",
        "이전소득",
        "비경상소득",
        "가계지출(소비지출+비소비지출)",
        "소비지출",
        "비소비지출",
        "농가처분가능소득",
        "농가경제잉여",
        "자산",
        "부채",
        "농업순생산",
      ];
    } else if (usage === "경제 비율 지표") {
      dynamicOptions = ["농업의존도", "농업소득의 가계비충족", "농업소득률"];
    } else {
      dynamicOptions = ["가구원", "농업상시종사자"];
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
    <StatisticsContainer title="농가경제 주요지표">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default KeyIndicators;
