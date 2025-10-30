import { YearlyStats } from "~/services/types/statsTypes";
import { ChartConfig, SelectField, Selections } from "../components/ChartSection";

interface BarChartDataPoint {
  category: string;
  value: number;
  year: string;
}

export type ProcessedBarChartData = Record<string, BarChartDataPoint[]>;

/**
 * 주어진 연도별 데이터(YearlyStats)를 막대 차트에 적합한 형태로 변환합니다.
 * 각 연도를 기준으로 카테고리별 값을 배열로 반환합니다.
 *
 * @param data - 연도별 데이터 객체 (예: { "2022": [...], "2023": [...] })
 * @param config - 그룹핑 및 필터 조건을 포함하는 설정 객체
 * @param computedSelectFields - 필터 조건에 사용할 Stats 필드들의 배열
 * @param selections - 각 selectField에 대해 사용자가 선택한 값
 * @returns ProcessedBarChartData - 연도별로 정리된 막대 차트 데이터
 */
export function processBarChartData(data: YearlyStats, config: ChartConfig, computedSelectFields: SelectField[], selections: Selections): ProcessedBarChartData {
  const { groupField, filters = [] } = config;

  if (!data || !computedSelectFields || !Array.isArray(computedSelectFields)) return {};

  const result: ProcessedBarChartData = {};

  // 각 연도별로 데이터 순회
  Object.entries(data).forEach(([year, records]) => {
    const yearData: BarChartDataPoint[] = [];

    records.forEach((record) => {
      let passesSelect = true;

      // config.selectFields에 정의된 각 필드에 대해 사용자가 선택한 값과 비교
      for (const fieldConfig of computedSelectFields) {
        if (!(fieldConfig.field in record)) continue;
        if (fieldConfig.field === groupField) continue;

        const sel = selections[fieldConfig.field];
        if (typeof sel === "string") {
          if (sel && record[fieldConfig.field] !== sel) {
            passesSelect = false;
            break;
          }
        } else if (Array.isArray(sel)) {
          if (sel.length > 0 && !sel.includes(record[fieldConfig.field] as string)) {
            passesSelect = false;
            break;
          }
        }
      }
      if (!passesSelect) return;

      // 추가 필터 적용
      for (const filterFn of filters) {
        if (!filterFn(record, selections)) {
          passesSelect = false;
          break;
        }
      }
      if (!passesSelect) return;

      const category = record[groupField] as string;
      if (!category) return;

      // DT 값이 숫자가 아닌 경우 0으로 처리
      const value = record.DT && !isNaN(Number(record.DT)) ? parseFloat(record.DT) : 0;
      yearData.push({ category, value, year });
    });

    // 해당 연도의 데이터가 있으면 결과에 추가
    if (yearData.length > 0) {
      result[year] = yearData;
    }
  });

  return result;
}
