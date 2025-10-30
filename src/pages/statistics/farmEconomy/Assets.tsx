import { useState } from "react";
import { useFetchStatsRange, useFetchStatsData } from "~/features/statistics/hooks";
import { StatisticsContainer, ChartSection, TableSection } from "~/features/statistics/components";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { ChartConfig, SelectField } from "~/features/statistics/components/ChartSection";
import { TableConfig } from "~/features/statistics/components/TableSection";

// const QUALIFIED_NAME = "ast";
const QUALIFIED_NAME = "ast_crast";
const UNIT = { 자산: "천원", 면적: "m²" };

// 농가 자산
const Assets = () => {
  const [selectedYearRange, setSelectedYearRange] = useState<{ startYear: number; endYear: number }>({ startYear: 2012, endYear: 2023 });

  const yearRange: StatsRange = useFetchStatsRange(QUALIFIED_NAME);
  const data: YearlyStats = useFetchStatsData(QUALIFIED_NAME, selectedYearRange?.startYear, selectedYearRange?.endYear);

  const handleRangeChange = (value: { startYear: number; endYear: number }) => {
    setSelectedYearRange(value);
  };

  const getSelectFields = (currentSelections: Record<string, string | string[]>): SelectField[] => {
    const usageField: SelectField = {
      field: "카테고리",
      options: ["자산", "면적"],
      multiple: false,
    };

    // 기본 필드들 (변경되지 않는 필드)
    const baseFields: SelectField[] = [{ field: "C1_NM", options: ["제주도"], multiple: false, display: false }];

    // usageField에 따라 dynamicField의 options 결정
    const usage = currentSelections["카테고리"];
    let dynamicOptions: string[] = [];
    let defaultSelected: string[] | undefined;

    if (usage === "자산") {
      dynamicOptions = [
        "자산(고정+유동)-연도말",
        "고정자산-연도말",
        "토지-연도말(평가액)",
        "건물-연도말(평가액)",
        "구축물-연도말",
        "기계·기구·비품-연도말",
        "대동물-연도말",
        "대식물-연도말",
        "무형자산-연도말",
        "유동자산(재고및당좌)-연도말",
        "재고자산-연도말",
        "소동물-연도말",
        "농축산물-연도말",
        "농업생산자재-연도말",
        "당좌자산-연도말",
        "현금-연도말",
        "예금 등 금융자산-연도말",
        "미수금 및 선급금-연도말",
      ];
      defaultSelected = ["자산(고정+유동)-연도말", "유동자산(재고및당좌)-연도말"];
    } else if (usage === "면적") {
      dynamicOptions = ["토지-연도말(면적)", "건물-연도말(면적)"];
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
    margin: { left: 80 },
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
    hierarchy: [
      { field: "자산(고정+유동)-연도말", indent: 0 },
      { field: "고정자산-연도말", indent: 1 },
      { field: "토지-연도말(평가액)", indent: 2 },
      { field: "건물-연도말(평가액)", indent: 2 },
      { field: "구축물-연도말", indent: 2 },
      { field: "기계·기구·비품-연도말", indent: 2 },
      { field: "대동물-연도말", indent: 2 },
      { field: "대식물-연도말", indent: 2 },
      { field: "무형자산-연도말", indent: 2 },
      { field: "유동자산(재고및당좌)-연도말", indent: 1 },
      { field: "재고자산-연도말", indent: 2 },
      { field: "소동물-연도말", indent: 3 },
      { field: "농축산물-연도말", indent: 3 },
      { field: "농업생산자재-연도말", indent: 3 },
      { field: "당좌자산-연도말", indent: 2 },
      { field: "현금-연도말", indent: 3 },
      { field: "예금 등 금융자산-연도말", indent: 3 },
      { field: "미수금 및 선급금-연도말", indent: 3 },
      { field: "토지-연도말(면적)", indent: 0 },
      { field: "건물-연도말(면적)", indent: 0 },
    ],
  };

  return (
    <StatisticsContainer title="농가 자산">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default Assets;
