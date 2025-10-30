import { YearlyStats } from "~/services/types/statsTypes";
import { ChartConfig, SelectField, Selections } from "../components/ChartSection";

interface FilteredData {
  year: string;
  value: number;
}

export type ProcessedLineChartData = Record<string, FilteredData[]>;

/**
 * 주어진 연도별 데이터(YearlyStats)를 config.selectFields와 selections에 설정된 조건에 따라 필터링하고,
 * config.groupField에 해당하는 값으로 그룹핑하여, 각 그룹별 연도별 데이터를 반환합니다.
 *
 * @param data - 연도별 데이터 객체 (예: { "2022": [...], "2023": [...] })
 * @param config - 그룹핑 및 필터 조건을 포함하는 설정 객체
 *   - groupField: 데이터를 그룹화할 Stats의 필드 (예: "C2_NM")
 *   - selectFields: 필터 조건에 사용할 Stats 필드들의 배열 (예: ITM_NM, C1_NM, C2_NM 등)
 *   - filters: 추가로 적용할 필터 함수 배열 (선택 사항)
 * @param selections - 각 selectField에 대해 사용자가 선택한 값.
 *   (예: { ITM_NM: "귀농가구원수", C1_NM: "제주특별자치도", C2_NM: ["30대이하", "40대", ...] })
 * @returns ProcessedChartData - 그룹별로 정리된 차트 데이터
 */
export function processLineChartData(data: YearlyStats, config: ChartConfig, computedSelectFields: SelectField[], selections: Selections): ProcessedLineChartData {
  const { groupField, filters = [] } = config;

  if (!data || !computedSelectFields || !Array.isArray(computedSelectFields)) return {};

  const result: ProcessedLineChartData = {};

  // 각 연도별로 데이터 순회
  Object.entries(data).forEach(([year, records]) => {
    records.forEach((record) => {
      let passesSelect = true;

      // config.selectFields에 정의된 각 필드에 대해 사용자가 선택한 값과 비교
      for (const fieldConfig of computedSelectFields) {
        if (!(fieldConfig.field in record)) continue;
        if (fieldConfig.field === groupField) continue;

        const sel = selections[fieldConfig.field];
        // 선택값이 없으면 해당 필드는 필터링하지 않음.
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

      // 추가 필터 적용 (필요한 경우)
      for (const filterFn of filters) {
        if (!filterFn(record, selections)) {
          passesSelect = false;
          break;
        }
      }
      if (!passesSelect) return;

      // 그룹핑: config.groupField에 해당하는 값을 그룹 키로 사용
      const groupKey = record[groupField] as string;
      if (!groupKey) return;
      if (!result[groupKey]) {
        result[groupKey] = [];
      }

      // DT 값이 숫자가 아닌 경우 0으로 처리
      const value = record.DT && !isNaN(Number(record.DT)) ? parseFloat(record.DT) : 0;
      result[groupKey].push({ year, value });
    });
  });

  // 각 그룹별로 연도순 정렬 (예: "2010", "2011", ...)
  Object.values(result).forEach((entries) => {
    entries.sort((a, b) => a.year.localeCompare(b.year));
  });

  return result;
}
