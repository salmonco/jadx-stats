import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import downloadCsv, { CsvColumn } from "~/utils/downloadCsv";

interface TransposedRow {
  key: string;
  [region: string]: string | number;
}

interface ReportRow {
  key: string;
  region: string;
  total_area: string;
  area_change: string;
  rate_change: string;
}

interface Props {
  chartData: any;
  selectedCrop: string;
  year: number;
  isReportMode?: boolean;
}

const HibernationVegetableCultivationTable = ({ chartData, selectedCrop, year, isReportMode }: Props) => {
  if (!chartData || !selectedCrop) return null;

  const cropData = chartData[selectedCrop];
  if (!cropData || cropData.length === 0) return null;

  // Sort by current_area descending
  const sortedCropData = [...cropData].sort((a: any, b: any) => b.current_area - a.current_area);

  const maxColumns = 14;
  const limitedData = sortedCropData.slice(0, maxColumns);

  const regions = limitedData.map((d: any) => d.region_nm);

  const columns: ColumnsType<TransposedRow> = [
    {
      title: "품목 / 지역",
      dataIndex: "key",
      key: "key",
      align: "center" as const,
      width: "11%",
    },
    {
      title: "총 면적(ha)",
      dataIndex: "전체",
      key: "전체",
      align: "center" as const,
    },
    ...regions.map((region: string, index: number) => ({
      title: region,
      dataIndex: region,
      key: `${region}-${index}`,
      align: "center" as const,
    })),
  ];

  const totalArea = limitedData.reduce((sum: number, d: any) => sum + (d.current_area || 0), 0);
  const totalChange = limitedData.reduce((sum: number, d: any) => sum + (d.area_change || 0), 0);
  const totalRateChange = totalArea > 0 ? ((totalChange / (totalArea - totalChange)) * 100).toFixed(1) : "0.0";

  const totalAreaRow: TransposedRow = { key: selectedCrop };
  const areaChangeRow: TransposedRow = { key: "변화 추이 (면적, ha)" };
  const rateChangeRow: TransposedRow = { key: "변화 추이 (변화율, %)" };

  totalAreaRow["전체"] = totalArea.toFixed(1);
  areaChangeRow["전체"] = Number(totalChange) > 0 ? `+${totalChange.toFixed(1)}` : totalChange.toFixed(1);
  rateChangeRow["전체"] = Number(totalRateChange) > 0 ? `+${totalRateChange}%` : `${totalRateChange}%`;

  for (const d of limitedData) {
    totalAreaRow[d.region_nm] = d.current_area?.toFixed(1) ?? "-";
    const change = d.area_change ?? 0;
    areaChangeRow[d.region_nm] = change > 0 ? `+${change.toFixed(1)}` : change.toFixed(1);
    const rate = d.change_rate ?? 0;
    rateChangeRow[d.region_nm] = rate > 0 ? `+${rate.toFixed(1)}%` : `${rate.toFixed(1)}%`;
  }

  const renderCell = (value: any, rowKey: string) => {
    if (rowKey === "변화 추이 (면적, ha)" || rowKey === "변화 추이 (변화율, %)") {
      const isNegative = typeof value === "string" && value.startsWith("-");
      return <span style={{ color: isNegative ? "#FF1F1F" : "inherit" }}>{value}</span>;
    }
    return value;
  };

  const columnsWithRender = [
    { title: "품목 / 지역", dataIndex: "key", key: "key", align: "center" as const, width: "11%" },
    {
      title: "총 면적(ha)",
      dataIndex: "전체",
      key: "전체",
      align: "center" as const,
      render: (value: any, record: TransposedRow) => renderCell(value, record.key),
    },
    ...columns.slice(2).map((col) => ({
      ...col,
      render: (value: any, record: TransposedRow) => renderCell(value, record.key),
    })),
  ];

  const reportColumns: ColumnsType<ReportRow> = [
    { title: "품목 / 지역", dataIndex: "region", key: "region", align: "center" as const },
    {
      title: "총 면적(ha)",
      dataIndex: "total_area",
      key: "total_area",
      align: "center" as const,
      render: (value: string) => <span style={{ color: value.startsWith("-") ? "#FF1F1F" : "inherit" }}>{value}</span>,
    },
    {
      title: "변화 추이 (면적, ha)",
      dataIndex: "area_change",
      key: "area_change",
      align: "center" as const,
      render: (value: string) => <span style={{ color: value.startsWith("-") ? "#FF1F1F" : "inherit" }}>{value}</span>,
    },
    {
      title: "변화 추이 (변화율, %)",
      dataIndex: "rate_change",
      key: "rate_change",
      align: "center" as const,
      render: (value: string) => <span style={{ color: value.startsWith("-") ? "#FF1F1F" : "inherit" }}>{value}</span>,
    },
  ];

  const reportDataSource: ReportRow[] = [
    {
      key: selectedCrop,
      region: selectedCrop,
      total_area: totalArea.toFixed(1),
      area_change: Number(totalChange) > 0 ? `+${totalChange.toFixed(1)}` : totalChange.toFixed(1),
      rate_change: Number(totalRateChange) > 0 ? `+${totalRateChange}%` : `${totalRateChange}%`,
    },
    ...sortedCropData.map((d: any, index: number) => ({
      key: `${d.region_nm}-${index}`,
      region: d.region_nm,
      total_area: d.current_area?.toFixed(1) ?? "-",
      area_change: d.area_change > 0 ? `+${d.area_change.toFixed(1)}` : d.area_change.toFixed(1),
      rate_change: d.change_rate > 0 ? `+${d.change_rate.toFixed(1)}%` : `${d.change_rate.toFixed(1)}%`,
    })),
  ];

  const handleDownloadCsv = () => {
    const columns: CsvColumn[] = [
      { title: "품목 / 지역", dataIndex: "key" },
      { title: "총 면적(ha)", dataIndex: "전체" },
      ...sortedCropData.map((d: any) => ({ title: d.region_nm, dataIndex: d.region_nm })),
    ];

    const totalAreaRow = { key: selectedCrop, 전체: totalArea.toFixed(1) };
    const areaChangeRow = { key: "변화 추이 (면적, ha)", 전체: Number(totalChange) > 0 ? `+${totalChange.toFixed(1)}` : totalChange.toFixed(1) };
    const rateChangeRow = { key: "변화 추이 (변화율, %)", 전체: Number(totalRateChange) > 0 ? `+${totalRateChange}%` : `${totalRateChange}%` };

    for (const d of sortedCropData) {
      totalAreaRow[d.region_nm] = d.current_area?.toFixed(1) ?? "-";
      const change = d.area_change ?? 0;
      areaChangeRow[d.region_nm] = change > 0 ? `+${change.toFixed(1)}` : change.toFixed(1);
      const rate = d.change_rate ?? 0;
      rateChangeRow[d.region_nm] = rate > 0 ? `+${rate.toFixed(1)}%` : `${rate.toFixed(1)}%`;
    }

    const dataRows = [totalAreaRow, areaChangeRow, rateChangeRow];
    downloadCsv(columns, dataRows, `월동채소_재배면적_변화_${selectedCrop}_${year}.csv`);
  };

  if (isReportMode) {
    return (
      <div className="rounded-lg">
        <Table
          columns={reportColumns}
          dataSource={reportDataSource}
          size="middle"
          pagination={false}
          bordered={false}
          scroll={undefined}
          className="custom-report-table"
        />
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-[#43516D] p-5 pt-2">
      <div className="mb-2 flex justify-end">
        <Button type="primary" onClick={handleDownloadCsv}>
          CSV 다운로드
        </Button>
      </div>
      <Table
        columns={columnsWithRender}
        dataSource={[totalAreaRow, areaChangeRow, rateChangeRow]}
        size="middle"
        pagination={false}
        bordered={false}
        scroll={{ x: true }}
        className="custom-dark-table"
      />
    </div>
  );
};

export default HibernationVegetableCultivationTable;
