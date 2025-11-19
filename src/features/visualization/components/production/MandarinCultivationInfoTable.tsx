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
  selectedCropPummok: string;
  selectedCropGroup: string;
  selectedCropDetailGroup: string;
}

const MandarinCultivationInfoTable = ({ chartData, selectedCropPummok, selectedCropGroup, selectedCropDetailGroup }: Props) => {
  const { flattenedData, uniqueCropGroups, uniqueRegions } = useMemo(() => {
    if (!chartData || Object.keys(chartData).length === 0) {
      return { flattenedData: [], uniqueCropGroups: [], uniqueRegions: [] };
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

    return { flattenedData, uniqueCropGroups, uniqueRegions };
  }, [chartData]);

  const processedData = useMemo(() => {
    const maxRegions = 14;
    const limitedUniqueRegions = uniqueRegions.slice(0, maxRegions);

    const columns: ColumnsType<TransposedRow> = [
      {
        title: "품종 / 지역",
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
      ...limitedUniqueRegions.map((region) => ({
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

      let totalAreaForAllRegions = 0;
      for (const region of uniqueRegions) {
        const dataPoint = flattenedData.find((d) => d.prdct_nm === cropGroup && d.region === region);
        totalAreaForAllRegions += dataPoint?.total_area ?? 0;
      }
      row.totalArea = totalAreaForAllRegions / 10000;

      for (const region of limitedUniqueRegions) {
        const dataPoint = flattenedData.find((d) => d.prdct_nm === cropGroup && d.region === region);
        const areaInHa = (dataPoint?.total_area ?? 0) / 10000;
        row[region] = areaInHa;
      }

      return row;
    });

    return { columns, dataSource };
  }, [flattenedData, uniqueCropGroups, uniqueRegions]);

  const csvData = useMemo(() => {
    const columns: ColumnsType<TransposedRow> = [
      {
        title: "품목 / 지역",
        dataIndex: "key",
        key: "key",
      },
      {
        title: "총 면적(ha)",
        dataIndex: "totalArea",
        key: "totalArea",
      },
      ...uniqueRegions.map((region) => ({
        title: region,
        dataIndex: region,
        key: region,
      })),
    ];

    const dataSource: TransposedRow[] = uniqueCropGroups.map((cropGroup) => {
      const row: TransposedRow = {
        key: cropGroup,
        totalArea: 0,
      };
      let cropGroupTotalAreaInHa = 0;

      for (const region of uniqueRegions) {
        const dataPoint = flattenedData.find((d) => d.prdct_nm === cropGroup && d.region === region);
        const areaInHa = (dataPoint?.total_area ?? 0) / 10000;
        row[region] = areaInHa;
        cropGroupTotalAreaInHa += areaInHa;
      }
      row.totalArea = cropGroupTotalAreaInHa;
      return row;
    });

    return { columns, dataSource };
  }, [flattenedData, uniqueCropGroups, uniqueRegions]);

  const handleDownloadCsv = () => {
    if (!csvData.dataSource.length) return;

    const headers = csvData.columns.map((col) => col.title).join(",");
    const csvContent =
      headers +
      "\n" +
      csvData.dataSource
        .map((row) =>
          csvData.columns
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
    link.setAttribute("download", `품종_지역_데이터_${selectedCropPummok}_${selectedCropGroup}_${selectedCropDetailGroup}.csv`);
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
