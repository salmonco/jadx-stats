import { Button } from "antd";
import { Download } from "lucide-react";
import { useMemo } from "react";
import { ScrollSelectorOption } from "~/features/visualization/components/common/OneDepthScrollSelector";
import { GroupedCountryYearData } from "~/features/visualization/hooks/useGroupedExportData";
import downloadCsv, { CsvColumn } from "~/utils/downloadCsv";

interface YearlyExportTableProps {
  yearlyData: GroupedCountryYearData;
  type: "totalAmount" | "totalWeight";
  countryOptions: ScrollSelectorOption[];
  selectedCountries: string[];
}

const metricConfig = {
  totalAmount: {
    title: "연도별 수출액",
    unit: "($)",
  },
  totalWeight: {
    title: "연도별 수출량",
    unit: "(ton)",
  },
};

const YearlyExportTable = ({ yearlyData, type, countryOptions, selectedCountries }: YearlyExportTableProps) => {
  const config = metricConfig[type];

  const { years, countries, tableData } = useMemo(() => {
    if (!yearlyData || Object.keys(yearlyData).length === 0) {
      return { years: [], countries: [], tableData: [] };
    }

    const yearSet = new Set<string>();
    Object.values(yearlyData).forEach((yearData) => {
      Object.keys(yearData).forEach((year) => yearSet.add(year));
    });
    const years = Array.from(yearSet).sort((a, b) => Number(b) - Number(a));

    const countries = selectedCountries;

    const tableData = countries.map((country) => {
      const row: { [key: string]: string | number } = { 지표: country };
      years.forEach((year) => {
        const value = yearlyData[country]?.[year]?.[type] ?? 0;
        row[year] = value.toLocaleString(undefined, { maximumFractionDigits: 0 });
      });
      return row;
    });

    return { years, countries, tableData };
  }, [yearlyData, type, selectedCountries]);

  const handleDownloadCsv = () => {
    const columns: CsvColumn[] = [{ title: "지표", dataIndex: "지표" }, ...years.map((year) => ({ title: `${year}년`, dataIndex: year }))];

    const filename = type === "totalAmount" ? "연도별_수출액.csv" : "연도별_수출량.csv";

    downloadCsv(columns, tableData, filename);
  };

  return (
    <div className="rounded-lg bg-[#43516D] p-5 text-white">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          {config.title} <span className="text-base font-normal">{config.unit}</span>
        </h3>

        <Button type="primary" icon={<Download size={16} />} onClick={handleDownloadCsv}>
          CSV 다운로드
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-center">
          <thead>
            <tr className="border-b border-gray-500">
              <th className="px-4 py-2">지표</th>
              {years.map((year) => (
                <th key={year} className="px-4 py-2">
                  {year}년
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index} className="border-b border-gray-600 last:border-b-0">
                <td className="px-4 py-2 font-semibold">{row.지표}</td>
                {years.map((year) => (
                  <td key={year} className="px-4 py-2">
                    {row[year]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default YearlyExportTable;
