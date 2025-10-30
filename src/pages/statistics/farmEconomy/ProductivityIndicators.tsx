import { useState } from "react";
import useFetchStatsRange from "~/features/statistics/hooks/useFetchStatsRange";
import useFetchStatsData from "~/features/statistics/hooks/useFetchStatsData";
import { ChartConfig, SelectField } from "~/features/statistics/components/ChartSection";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { ChartSection, StatisticsContainer, TableSection } from "~/features/statistics/components";
import { TableConfig } from "~/features/statistics/components/TableSection";

const QUALIFIED_NAME = "prdtv-idct";
const UNIT = { 수익성: "천원", 생산성: "천원", 안전성: "%" };

// 농업생산성지표
const ProductivityIndicators = () => {
  const [selectedYearRange, setSelectedYearRange] = useState<{ startYear: number; endYear: number }>({ startYear: 2013, endYear: 2024 });

  const yearRange: StatsRange = useFetchStatsRange(QUALIFIED_NAME);
  const data: YearlyStats = useFetchStatsData(QUALIFIED_NAME, selectedYearRange?.startYear, selectedYearRange?.endYear);

  const handleRangeChange = (value: { startYear: number; endYear: number }) => {
    setSelectedYearRange(value);
  };

  const getSelectFields = (currentSelections: Record<string, string | string[]>): SelectField[] => {
    const usageField: SelectField = {
      field: "카테고리",
      options: ["수익성", "생산성", "안전성"],
      multiple: false,
    };

    // 기본 필드들 (변경되지 않는 필드)
    const baseFields: SelectField[] = [{ field: "C1_NM", options: ["제주특별자치도"], multiple: false, display: false }];

    // usageField에 따라 dynamicField의 options 결정
    const usage = currentSelections["카테고리"];
    let dynamicOptions: string[] = [];
    let defaultSelected: string[] | undefined;

    if (usage === "수익성") {
      dynamicOptions = [
        "농업총수입",
        "농업유동재비",
        "농업부가가치",
        "농업자본투입액",
        "단위자본당(100만원) 농업소득",
        "단위자본당(100만원) 농업총수입",
        "단위면적당(10a) 농업소득",
        "단위면적당(10a) 농업총수입",
        "농업노동 1시간당 농업소득",
        "농업노동 1시간당 농업총수입",
      ];
      defaultSelected = ["농업총수입", "농업자본투입액"];
    } else if (usage === "생산성") {
      dynamicOptions = ["노동생산성", "토지생산성", "자본생산성", "자본집약도", "자본구성도"];
      defaultSelected = ["토지생산성", "자본생산성"];
    } else if (usage === "안전성") {
      dynamicOptions = ["유동비율", "부채비율", "자기자본비율", "자본부채비율", "고정비율", "고정장기적합률", "농기구자본비율"];
      defaultSelected = ["부채비율", "자기자본비율", "고정비율", "고정장기적합률", "농기구자본비율"];
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
      { field: "[수익성]", indent: 0, isGroup: true },
      { field: "농업총수입", indent: 0 },
      { field: "농업유동재비", indent: 1 },
      { field: "농업부가가치", indent: 1 },
      { field: "농업자본투입액", indent: 0 },
      { field: "농업노동1시간당농업소득", indent: 0 },
      { field: "농업노동1시간당농업총수입", indent: 0 },
      { field: "단위자본당(100만원)농업소득", indent: 0 },
      { field: "단위자본당(100만원)농업총수입", indent: 0 },
      { field: "단위면적당(10a)농업소득", indent: 0 },
      { field: "단위면적당(10a)농업총수입", indent: 0 },
      { field: "농업소득률", indent: 0 },
      { field: "[생산성]", indent: 0, isGroup: true },
      { field: "노동생산성", indent: 0 },
      { field: "토지생산성", indent: 0 },
      { field: "자본생산성", indent: 0 },
      { field: "노동집약도", indent: 0 },
      { field: "자본집약도", indent: 0 },
      { field: "자본구성도", indent: 0 },
      { field: "자본계수", indent: 0 },
      { field: "[안정성]", indent: 0, isGroup: true },
      { field: "유동비율", indent: 0 },
      { field: "부채비율", indent: 0 },
      { field: "자기자본비율", indent: 0 },
      { field: "자본부채비율", indent: 0 },
      { field: "고정비율", indent: 0 },
      { field: "고정장기적합률", indent: 0 },
      { field: "농기구자본비율", indent: 0 },
    ],
  };

  return (
    <StatisticsContainer title="농업 생산성지표">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default ProductivityIndicators;
