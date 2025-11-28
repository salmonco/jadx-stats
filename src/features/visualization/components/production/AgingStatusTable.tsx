import { Button, Table } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import { AgingChartData } from "~/maps/components/agingStatus/AgingStatusChart";

interface TransposedRow {
  key: string;
  [label: string]: string | number;
}

interface Props {
  chartData: AgingChartData[];
}

const AgingStatusTransposedTable = ({ chartData }: Props) => {
  const maxColumns = 14;
  const limitedChartData = chartData.slice(0, maxColumns); // 최대 14개 지역까지만

  const labels = limitedChartData.map((d) => d.label);

  const columns: ColumnsType<TransposedRow> = [
    {
      title: "지표",
      dataIndex: "key",
      key: "key",
      align: "center" as const,
      width: "11%",
      render: (value) => {
        if (value === "평균 연령") return "평균 연령(세)";
        if (value === "총 경영체 수") return "총 경영체 수(개)";
        return value;
      },
    },
    ...labels.map((label) => ({
      title: label,
      dataIndex: label,
      key: label,
      align: "center" as const,
    })),
  ];

  const avgAgeRow: TransposedRow = {
    key: "평균 연령",
  };
  const countRow: TransposedRow = {
    key: "총 경영체 수",
  };

  for (const d of limitedChartData) {
    avgAgeRow[d.label] = d.avg_age?.toFixed(2) ?? "-";
    countRow[d.label] = d.count?.toLocaleString() ?? "-";
  }

  const handleDownloadCsv = () => {
    const fullLabels = chartData.map((d) => d.label);
    const fullColumns: ColumnsType<TransposedRow> = [
      {
        title: "지표",
        dataIndex: "key",
        key: "key",
      },
      ...fullLabels.map((label) => ({
        title: label,
        dataIndex: label,
        key: label,
      })),
    ];

    const fullAvgAgeRow: TransposedRow = {
      key: "평균 연령",
    };
    const fullCountRow: TransposedRow = {
      key: "총 경영체 수",
    };

    for (const d of chartData) {
      fullAvgAgeRow[d.label] = d.avg_age?.toFixed(2) ?? "-";
      fullCountRow[d.label] = d.count?.toLocaleString() ?? "-";
    }

    const header = fullColumns.map((col) => col.title).join(",");
    const dataRows = [fullAvgAgeRow, fullCountRow];

    const csvContent =
      header +
      "\n" +
      dataRows
        .map((row) =>
          fullColumns
            .map((col) => {
              const column = col as ColumnType<TransposedRow>;
              const value = row[column.dataIndex as string];
              return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value;
            })
            .join(",")
        )
        .join("\n");

    const blob = new Blob(["\ufeff", csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "경영체_연령_분포_현황.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-lg bg-[#43516D] p-5 pt-2">
      <div className="mb-2 flex justify-end">
        <Button type="primary" onClick={handleDownloadCsv}>
          CSV 다운로드
        </Button>
      </div>
      <Table columns={columns} dataSource={[avgAgeRow, countRow]} size="middle" pagination={false} bordered={false} scroll={{ x: true }} className="custom-dark-table" />
    </div>
  );
};

export default AgingStatusTransposedTable;
