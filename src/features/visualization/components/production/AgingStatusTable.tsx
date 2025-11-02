import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
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

  return (
    <div className="rounded-lg bg-[#43516D] p-5 pt-2">
      <Table columns={columns} dataSource={[avgAgeRow, countRow]} size="middle" pagination={false} bordered={false} scroll={{ x: true }} className="custom-dark-table" />
    </div>
  );
};

export default AgingStatusTransposedTable;
