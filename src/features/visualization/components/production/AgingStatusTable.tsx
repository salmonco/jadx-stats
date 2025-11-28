import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { AgingChartData } from "~/maps/components/agingStatus/AgingStatusChart";
import downloadCsv, { CsvColumn } from "~/utils/downloadCsv";

interface TransposedRow {
  key: string;
  [label: string]: string | number;
}

interface ReportRow {
  key: string;
  region: string;
  avg_age: string;
  count: string;
}

interface Props {
  chartData: AgingChartData[];
  isReportMode?: boolean;
}

const AgingStatusTransposedTable = ({ chartData, isReportMode }: Props) => {
  const maxColumns = 14;
  const limitedChartData = chartData.slice(0, maxColumns); // 최대 14개 지역까지만

  const labels = limitedChartData.map((d) => d.label);

  const columns: ColumnsType<TransposedRow> = [
    {
      title: "지표 / 지역",
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

  const reportColumns: ColumnsType<ReportRow> = [
    {
      title: "지역",
      dataIndex: "region",
      key: "region",
      align: "center" as const,
    },
    {
      title: "평균 연령(세)",
      dataIndex: "avg_age",
      key: "avg_age",
      align: "center" as const,
    },
    {
      title: "총 경영체 수(개)",
      dataIndex: "count",
      key: "count",
      align: "center" as const,
    },
  ];

  const reportDataSource: ReportRow[] = chartData.map((d) => ({
    key: d.label,
    region: d.label,
    avg_age: d.avg_age?.toFixed(2) ?? "-",
    count: d.count?.toLocaleString() ?? "-",
  }));

  const handleDownloadCsv = () => {
    const labels = chartData.map((d) => d.label);
    const columns: CsvColumn[] = [
      {
        title: "지표 / 지역",
        dataIndex: "key",
      },
      ...labels.map((label) => ({
        title: label,
        dataIndex: label,
      })),
    ];

    const avgAgeRow = {
      key: "평균 연령",
    };
    const countRow = {
      key: "총 경영체 수",
    };

    for (const d of chartData) {
      avgAgeRow[d.label] = d.avg_age?.toFixed(2) ?? "-";
      countRow[d.label] = d.count?.toLocaleString() ?? "-";
    }

    const dataRows = [avgAgeRow, countRow];
    downloadCsv(columns, dataRows, "경영체_연령_분포_현황.csv");
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
          className={"custom-report-table"}
        />
      </div>
    );
  }

  return (
    <div className={`rounded-lg bg-[#43516D] p-5 pt-2`}>
      <div className="mb-2 flex justify-end">
        <Button type="primary" onClick={handleDownloadCsv}>
          CSV 다운로드
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={[avgAgeRow, countRow]}
        size="middle"
        pagination={false}
        bordered={false}
        scroll={{ x: true }}
        className={"custom-dark-table"}
      />
    </div>
  );
};

export default AgingStatusTransposedTable;
