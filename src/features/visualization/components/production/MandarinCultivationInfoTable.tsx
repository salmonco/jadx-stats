import { Button, Table } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import { useMemo } from "react";

interface MandarinCultivationChartData {
  [region: string]: {
    "prdct_nm": string;
    "total_area": number;
  }[];
}

interface TransposedRow {
  key: string; // 품목 / 지역
  totalArea: number; // 총 면적(ha)
  [region: string]: string | number; // 각 지역별 면적
}

interface Props {
  chartData: MandarinCultivationChartData | null;
}

const MandarinCultivationInfoTable = ({ chartData }: Props) => {
  const processedData = useMemo(() => {
    if (!chartData || Object.keys(chartData).length === 0) {
      return { columns: [], dataSource: [] };
    }

    const flattenedData: { region: string; prdct_nm: string; total_area: number }[] = [];
    const uniqueRegions: string[] = [];
    const uniqueCropGroups: string[] = [];

    for (const regionName in chartData) {
      uniqueRegions.push(regionName);
      chartData[regionName].forEach((item) => {
        flattenedData.push({ region: regionName, prdct_nm: item.prdct_nm, total_area: item.total_area });
        if (!uniqueCropGroups.includes(item.prdct_nm)) {
          uniqueCropGroups.push(item.prdct_nm);
        }
      });
    }

    uniqueCropGroups.sort();
    uniqueRegions.sort();

    const columns: ColumnsType<TransposedRow> = [
      {
        title: "품목 / 지역",
        dataIndex: "key",
        key: "key",
        align: "center" as const,
        width: "15%",
      },
      {
        title: "총 면적(ha)",
        dataIndex: "totalArea",
        key: "totalArea",
        align: "center" as const,
        width: "15%",
        render: (value: number) => value.toFixed(2),
      },
      ...uniqueRegions.map((region) => ({
        title: region,
        dataIndex: region,
        key: region,
        align: "center" as const,
        render: (value: number) => (value !== undefined ? value.toFixed(2) : "-"),
      })),
    ];

    const dataSource: TransposedRow[] = uniqueCropGroups.map((cropGroup) => {
      const row: TransposedRow = {
        key: cropGroup,
        totalArea: 0,
      };
      let cropGroupTotalArea = 0;

      for (const region of uniqueRegions) {
        const dataPoint = flattenedData.find((d) => d.prdct_nm === cropGroup && d.region === region);
        const area = dataPoint?.total_area ?? 0;
        row[region] = area;
        cropGroupTotalArea += area;
      }
      row.totalArea = cropGroupTotalArea;
      return row;
    });

    return { columns, dataSource };
  }, [chartData]);

  const handleDownloadCsv = () => {
    if (!processedData.dataSource.length) return;

    const headers = processedData.columns.map((col) => col.title).join(",");
    const csvContent =
      headers +
      "\n" +
      processedData.dataSource
        .map((row) =>
          processedData.columns
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
    link.setAttribute("download", `품종_지역_데이터.csv`);
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
      <Table
        columns={processedData.columns}
        dataSource={processedData.dataSource}
        size="middle"
        pagination={false}
        bordered={false}
        scroll={{ x: true }}
        className="custom-dark-table"
      />
    </div>
  );
};

export default MandarinCultivationInfoTable;
