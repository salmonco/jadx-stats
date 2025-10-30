import { YearlyStats } from "~/services/types/statsTypes";
import { TableConfig } from "~/features/statistics/components/TableSection";

export interface ProcessedTableData {
  columns: {
    years: string[];
    groupField: string;
    isMulti: boolean;
    measureOptions?: string[];
    hierarchy?: {
      field: string;
      indent: number;
      isGroup?: boolean;
    }[];
  };
  rows: Record<string, any>[];
}

/**
 * 주어진 연도별 데이터(YearlyStats)와 TableConfig, 그리고 선택된 필터값(filterValue)을 받아
 * 그룹(행) 및 열(년도별 데이터) 정보를 생성합니다.
 *
 * - [다중 모드] measureField와 measureOptions가 제공된 경우:
 *    각 그룹(예: 그룹필드 값)에 대해, 각 측정 옵션별로 연도별 DT 값을 "측정옵션-연도" 키로 저장합니다.
 *
 * - [단순 모드] measureField가 제공되지 않거나 measureOptions가 없으면:
 *    각 그룹별로 각 연도에 해당하는 DT 값(예를 들어 합산한 값)을 출력합니다.
 */
export function processTableData({
  data,
  filterValue,
  tableConfig,
}: {
  data: YearlyStats | undefined;
  filterValue: string;
  tableConfig: TableConfig;
}): ProcessedTableData {
  if (!data) {
    return { columns: { years: [], groupField: "", isMulti: false, hierarchy: [] }, rows: [] };
  }

  const { groupField, filterField, measureField, measureOptions } = tableConfig;
  const years = Object.keys(data).sort();
  const result: Record<string, any> = {};

  const multiMode = measureField !== undefined && measureOptions !== undefined && measureOptions.length > 0;

  years.forEach((year) => {
    const yearData = data[year];
    yearData.forEach((entry) => {
      // 제외할 필드의 값이 제외할 옵션에 포함되어 있으면 제외
      if (tableConfig.excludeField && tableConfig.excludeOptions && tableConfig.excludeOptions.includes(entry[tableConfig.excludeField])) return;

      if (!filterField || entry[filterField] === filterValue) {
        const groupKey = entry[groupField] as string;
        if (!groupKey) return;
        if (!result[groupKey]) {
          result[groupKey] = { [groupField]: groupKey, UNIT_NM: entry.UNIT_NM };
        }
        if (multiMode) {
          measureOptions!.forEach((measure) => {
            if (entry[measureField!] === measure) {
              if (!result[groupKey][measure]) {
                result[groupKey][measure] = {};
              }
              const value = entry.DT && !isNaN(Number(entry.DT)) ? parseFloat(entry.DT) : 0;
              result[groupKey][measure][year] = value;
            }
          });
        } else {
          const currentValue = result[groupKey][year];
          const value = entry.DT && !isNaN(Number(entry.DT)) ? parseFloat(entry.DT) : 0;
          result[groupKey][year] = currentValue !== undefined ? (parseFloat(currentValue) || 0) + value : value;
        }
      }
    });
  });

  let rows: Record<string, any>[] = [];
  let columns;
  if (multiMode) {
    rows = Object.values(result).map((entry: any) => {
      const row: Record<string, any> = {};
      row[String(groupField)] = entry[groupField];
      row["UNIT_NM"] = entry.UNIT_NM;
      measureOptions!.forEach((measure) => {
        years.forEach((year) => {
          row[`${measure}-${year}`] = entry[measure]?.[year] || "-";
        });
      });
      return row;
    });
    columns = {
      years,
      groupField: String(groupField),
      isMulti: true,
      measureOptions,
      hierarchy: tableConfig.hierarchy,
    };
  } else {
    rows = Object.values(result).map((entry: any) => {
      const row: Record<string, any> = {};
      row[String(groupField)] = entry[groupField];
      row["UNIT_NM"] = entry.UNIT_NM;
      years.forEach((year) => {
        row[year] = entry[year] !== undefined ? entry[year] : "-";
      });
      return row;
    });
    columns = {
      years,
      groupField: String(groupField),
      isMulti: false,
      hierarchy: tableConfig.hierarchy,
    };
  }

  // hierarchy가 있는 경우 정의된 순서대로 정렬
  if (tableConfig.hierarchy) {
    const hierarchyMap = new Map(tableConfig.hierarchy.map((h, index) => [h.field, index]));
    rows.sort((a, b) => {
      const aIndex = hierarchyMap.get(a[groupField]) ?? Infinity;
      const bIndex = hierarchyMap.get(b[groupField]) ?? Infinity;
      return aIndex - bIndex;
    });

    // 그룹 헤더 행 추가
    const processedRows: Record<string, any>[] = [];
    let currentGroup: Record<string, any> | null = null;

    tableConfig.hierarchy.forEach((item) => {
      if (item.isGroup) {
        // 그룹 헤더 행 추가
        currentGroup = {
          [groupField]: item.field,
          isGroupHeader: true,
        };
        processedRows.push(currentGroup);
      } else {
        // 실제 데이터 행 찾기
        const dataRow = rows.find((row) => row[groupField] === item.field);
        if (dataRow) {
          processedRows.push(dataRow);
        }
      }
    });

    rows = processedRows;
  }

  return { columns, rows };
}
