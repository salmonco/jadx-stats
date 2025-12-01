import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo } from "react";
import downloadCsv, { CsvColumn } from "~/utils/downloadCsv";

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
  isReportMode?: boolean;
}

const MandarinCultivationInfoTable = ({ chartData, selectedCropPummok, selectedCropGroup, selectedCropDetailGroup, isReportMode }: Props) => {
  const { flattenedData, uniqueCropGroups, uniqueRegions } = useMemo(() => {
    if (!chartData || Object.keys(chartData).length === 0) {
      return { flattenedData: [], uniqueCropGroups: [], uniqueRegions: [] };
    }

    const flattenedData: { region: string; prdct_nm: string; total_area: number }[] = [];
    const regionTotals: Map<string, number> = new Map();
    const cropGroupTotals: Map<string, number> = new Map();

    for (const regionName in chartData) {
      let regionTotal = 0;
      chartData[regionName].forEach((item) => {
        flattenedData.push({ region: regionName, prdct_nm: item.prdct_nm, total_area: item.total_area });
        regionTotal += item.total_area;
        cropGroupTotals.set(item.prdct_nm, (cropGroupTotals.get(item.prdct_nm) || 0) + item.total_area);
      });
      regionTotals.set(regionName, regionTotal);
    }

    // Sort by total area descending
    const uniqueRegions = Array.from(regionTotals.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([region]) => region);

    const uniqueCropGroups = Array.from(cropGroupTotals.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([crop]) => crop);

    return { flattenedData, uniqueCropGroups, uniqueRegions };
  }, [chartData]);

  const processedData = useMemo(() => {
    const maxRegions = 14;
    const limitedUniqueRegions = uniqueRegions.slice(0, maxRegions);

    // isReportMode일 때: 행=지역, 열=품종
    if (isReportMode) {
      const columns: ColumnsType<any> = [
        {
          title: "지역 / 품종",
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
        ...uniqueCropGroups.map((cropGroup) => ({
          title: cropGroup,
          dataIndex: cropGroup,
          key: cropGroup,
          align: "center" as const,
          render: (value: number) => (value !== undefined ? value.toFixed(2) : "-"),
        })),
      ];

      const dataSource: any[] = limitedUniqueRegions.map((region) => {
        const row: any = {
          key: region,
          totalArea: 0,
        };

        let totalAreaForRegion = 0;
        for (const cropGroup of uniqueCropGroups) {
          const dataPoint = flattenedData.find((d) => d.prdct_nm === cropGroup && d.region === region);
          const areaInHa = (dataPoint?.total_area ?? 0) / 10000;
          row[cropGroup] = areaInHa;
          totalAreaForRegion += areaInHa;
        }
        row.totalArea = totalAreaForRegion;

        return row;
      });

      return { columns, dataSource };
    }

    // 일반 모드: 행=품종, 열=지역
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
  }, [flattenedData, uniqueCropGroups, uniqueRegions, isReportMode]);

  const csvData = useMemo(() => {
    const columns: CsvColumn[] = [
      {
        title: "품목 / 지역",
        dataIndex: "key",
      },
      {
        title: "총 면적(ha)",
        dataIndex: "totalArea",
      },
      ...uniqueRegions.map((region) => ({
        title: region,
        dataIndex: region,
      })),
    ];

    const dataSource: TransposedRow[] = uniqueCropGroups.map((cropGroup) => {
      const row = {
        key: cropGroup,
        totalArea: 0,
      };
      let cropGroupTotalAreaInHa = 0;

      for (const region of uniqueRegions) {
        const dataPoint = flattenedData.find((d) => d.prdct_nm === cropGroup && d.region === region);
        const areaInHa = (dataPoint?.total_area ?? 0) / 10_000;
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
    downloadCsv(csvData.columns, csvData.dataSource, `품종_지역_데이터_${selectedCropPummok}_${selectedCropGroup}_${selectedCropDetailGroup}.csv`);
  };

  return (
    <div className={`rounded-lg p-5 pt-2 ${isReportMode ? "bg-transparent" : "bg-[#43516D]"}`}>
      {!isReportMode && (
        <div className="mb-2 flex justify-end">
          <Button type="primary" onClick={handleDownloadCsv}>
            CSV 다운로드
          </Button>
        </div>
      )}
      <Table
        columns={processedData.columns}
        dataSource={processedData.dataSource}
        size="middle"
        pagination={false}
        bordered={false}
        scroll={{ x: true }}
        className={isReportMode ? "" : "custom-dark-table"}
      />
    </div>
  );
};

export default MandarinCultivationInfoTable;
