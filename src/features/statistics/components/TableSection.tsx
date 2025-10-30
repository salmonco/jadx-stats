import { useState } from "react";
import { Card, Select } from "antd";
import { Stats, YearlyStats } from "~/services/types/statsTypes";
import { processTableData, ProcessedTableData } from "~/features/statistics/utils/processTableData";
import BaseTable from "~/features/statistics/components/BaseTable";

export interface TableConfig {
  groupField: keyof Stats;
  filterField?: keyof Stats;
  filterOptions?: string[];
  measureField?: keyof Stats;
  measureOptions?: string[];
  hierarchy?: {
    field: string;
    indent: number;
    isGroup?: boolean;
  }[];
  excludeField?: string;
  excludeOptions?: string[];
  unitMapping?: Record<string, string>;
}

interface Props {
  data: YearlyStats;
  config: TableConfig;
  unit?: Record<string, string>;
}

const TableSection = ({ data, config }: Props) => {
  const { filterOptions } = config;
  const safeFilterOptions = filterOptions ?? [];
  const initialFilter = safeFilterOptions.includes("제주특별자치도") ? "제주특별자치도" : safeFilterOptions.includes("제주도") ? "제주도" : safeFilterOptions[0] || "";
  const [filterValue, setFilterValue] = useState<string>(initialFilter);

  const { columns, rows }: ProcessedTableData = processTableData({
    data,
    filterValue,
    tableConfig: config,
  });

  const columnsWithHierarchy = {
    ...columns,
    hierarchy: config.hierarchy,
    unitMapping: config.unitMapping,
  };

  return (
    <Card className="flex min-h-[300px] flex-col shadow-sm">
      <div className="mb-[16px] flex items-center gap-[16px]">
        <p className="text-[20px] font-semibold">통계표 데이터</p>
        {safeFilterOptions?.length > 0 && (
          <Select
            options={safeFilterOptions.map((option) => ({ label: option, value: option }))}
            value={filterValue}
            onChange={(value) => setFilterValue(value)}
            className="w-[140px]"
          />
        )}
      </div>
      {rows?.length > 0 ? <BaseTable columns={columnsWithHierarchy} data={rows} /> : null}
    </Card>
  );
};

export default TableSection;
