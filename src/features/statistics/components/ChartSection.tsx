import { useState, useMemo } from "react";
import { Card, Segmented, Select } from "antd";
import { Stats, StatsRange, YearlyStats } from "~/services/types/statsTypes";
import { BaseLineChart, BaseBarChart, YearRangeSelector } from "~/features/statistics/components";
import { processLineChartData, ProcessedLineChartData } from "~/features/statistics/utils/processLineChartData";
import { processBarChartData, ProcessedBarChartData } from "~/features/statistics/utils/processBarChartData";
import * as d3 from "d3";

export interface SelectField {
  field: string;
  options: string[];
  multiple?: boolean;
  defaultSelected?: string[];
  display?: boolean;
}

export type Selections = Record<string, string | string[]>;

export interface ChartConfig {
  groupField: keyof Stats;
  usageKey?: string;
  unitKey?: string;
  filters?: Array<(record: Stats, selections: Selections) => boolean>;
  selectFields?: SelectField[];
  getSelectFields?: (currentSelections: Selections) => SelectField[];
  margin?: { top?: number; left?: number };
}

interface Props {
  data: YearlyStats;
  config: ChartConfig;
  unit?: Record<string, string>;
  yearRange: StatsRange;
  selectedYearRange: { startYear: number; endYear: number };
  handleRangeChange: (value: { startYear: number; endYear: number }) => void;
}

const ChartSection = ({ data, config, unit, yearRange, selectedYearRange, handleRangeChange }: Props) => {
  const usageKey = config.usageKey ?? "카테고리";
  const resolveSelectFields = (current: Selections) => config.getSelectFields?.(current) ?? config.selectFields ?? [];

  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const handleChartTypeChange = (value: "line" | "bar") => {
    // 차트 타입 변경 시 이전 차트의 ref 정리
    const svg = document.querySelector("svg");
    if (svg) {
      d3.select(svg).selectAll("*").remove();
    }
    setChartType(value);
  };

  const getInitialSelections = (): Selections => {
    const usageField = config.getSelectFields?.({})?.find((f) => f.field === usageKey);
    const base: Selections = usageField ? { [usageKey]: usageField.defaultSelected?.[0] ?? usageField.options[0] } : {};

    const resolved = resolveSelectFields(base);
    const selections: Selections = { ...base };

    resolved.forEach((f) => {
      if (f.field === usageKey) return;
      selections[f.field] = f.multiple ? (f.defaultSelected ?? f.options) : (f.defaultSelected?.[0] ?? f.options[0]);
    });

    return selections;
  };

  const [selections, setSelections] = useState<Selections>(() => getInitialSelections());
  const usageValue = selections[usageKey];

  const handleSelectChange = (key: string, value: string | string[]) => {
    setSelections((prev) => {
      const next = { ...prev, [key]: value };
      if (key === usageKey) {
        const fields = resolveSelectFields(next);
        fields.forEach((f) => {
          if (f.field === usageKey) return;
          next[f.field] = f.multiple ? (f.defaultSelected ?? f.options) : (f.defaultSelected?.[0] ?? f.options[0]);
        });
      }
      return next;
    });
  };

  const selectFields = useMemo(() => {
    const current = usageKey && usageValue ? { [usageKey]: usageValue } : {};
    return resolveSelectFields(current);
  }, [usageKey, usageValue, config.selectFields, config.getSelectFields]);

  const groupField = config.groupField;
  const allCategories = selectFields.find((f) => f.field === groupField)?.options ?? [];

  const initialVisibleCategories = useMemo(
    () => selectFields.filter((f) => f.multiple).flatMap((f) => (selections[f.field] as string[]) ?? []),
    [selections, selectFields]
  );

  const lineChartData: ProcessedLineChartData = useMemo(
    () => processLineChartData(data, { ...config, filters: config.filters ?? [] }, selectFields, selections),
    [data, config, selectFields, selections]
  );

  const barChartData: ProcessedBarChartData = useMemo(
    () => processBarChartData(data, { ...config, filters: config.filters ?? [] }, selectFields, selections),
    [data, config, selectFields, selections]
  );

  const currentUnit = useMemo(() => {
    const unitKey = config.unitKey;
    if (!unitKey || !unit) return "";
    const selected = selections[unitKey];
    return typeof selected === "string" ? (unit[selected] ?? "") : "";
  }, [config.unitKey, selections, unit]);

  return (
    <Card className="flex flex-col shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <YearRangeSelector range={yearRange} selectedYearRange={selectedYearRange} onChange={handleRangeChange} />
          <div className="flex flex-1 items-center gap-3">
            {selectFields
              .filter((f) => !f.multiple && f.display !== false)
              .map((f) => (
                <Select
                  key={f.field}
                  className="w-[140px]"
                  options={f.options.map((opt) => ({ label: opt, value: opt }))}
                  value={selections[f.field] as string}
                  onChange={(val) => handleSelectChange(f.field, val)}
                />
              ))}
          </div>
        </div>
        <Segmented
          options={[
            { value: "line", label: "선 그래프" },
            { value: "bar", label: "막대 그래프" },
          ]}
          value={chartType}
          onChange={(value) => handleChartTypeChange(value as "line" | "bar")}
          className="statistics-segmented"
        />
      </div>
      {chartType === "line" ? (
        <div key="line-chart">
          <BaseLineChart
            key={`line-${JSON.stringify(data)}`}
            data={lineChartData}
            margin={config.margin}
            unit={currentUnit}
            allCategories={allCategories}
            initialVisibleCategories={initialVisibleCategories}
          />
        </div>
      ) : (
        <div key="bar-chart">
          <BaseBarChart
            key={`bar-${JSON.stringify(data)}`}
            data={barChartData}
            margin={config.margin}
            unit={currentUnit}
            allCategories={allCategories}
            initialVisibleCategories={initialVisibleCategories}
          />
        </div>
      )}
    </Card>
  );
};

export default ChartSection;
