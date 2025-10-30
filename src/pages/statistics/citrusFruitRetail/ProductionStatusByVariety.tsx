import { useState } from "react";
import { useFetchStatsRange, useFetchStatsData } from "~/features/statistics/hooks";
import { StatisticsContainer, ChartSection, TableSection } from "~/features/statistics/components";
import { StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { ChartConfig, SelectField } from "~/features/statistics/components/ChartSection";
import { TableConfig } from "~/features/statistics/components/TableSection";

const QUALIFIED_NAME = "prdsts-vrty";
const UNIT = { 면적: "ha", 생산량: "톤" };

// 품종별 생산 현황
const ProductionStatusByVariety = () => {
  const [selectedYearRange, setSelectedYearRange] = useState<{ startYear: number; endYear: number }>({ startYear: 2011, endYear: 2020 });

  const yearRange: StatsRange = useFetchStatsRange(QUALIFIED_NAME);
  const data: YearlyStats = useFetchStatsData(QUALIFIED_NAME, selectedYearRange?.startYear, selectedYearRange?.endYear);

  const handleRangeChange = (value: { startYear: number; endYear: number }) => {
    setSelectedYearRange(value);
  };

  const getSelectFields = (): SelectField[] => {
    const usageField: SelectField = {
      field: "ITM_NM",
      options: ["면적", "생산량"],
      multiple: false,
    };

    // 기본 필드들 (변경되지 않는 필드)
    const baseFields: SelectField[] = [
      {
        field: "C1_NM",
        options: ["온주밀감", "만감"],
        multiple: false,
      },
    ];

    // usageField에 따라 dynamicField의 options 결정
    let dynamicOptions: string[] = ["노지", "하우스"];

    const dynamicField: SelectField = {
      field: "C2_NM",
      options: dynamicOptions,
      multiple: true,
    };

    return [usageField, ...baseFields, dynamicField];
  };

  const chartConfig: ChartConfig = {
    groupField: "C2_NM",
    getSelectFields: getSelectFields,
  };

  const tableConfig: TableConfig = {
    groupField: "ITM_NM",
    filterField: "C1_NM",
    filterOptions: ["온주밀감", "만감"],
    measureField: "C2_NM",
    measureOptions: ["노지", "하우스", "월동"],
  };

  return (
    <StatisticsContainer title="하우스감귤(온주) 재배 현황">
      <ChartSection data={data} config={chartConfig} unit={UNIT} yearRange={yearRange} selectedYearRange={selectedYearRange} handleRangeChange={handleRangeChange} />
      <TableSection data={data} config={tableConfig} unit={UNIT} />
    </StatisticsContainer>
  );
};

export default ProductionStatusByVariety;
