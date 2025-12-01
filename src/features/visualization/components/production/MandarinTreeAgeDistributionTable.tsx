import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo } from "react";
import downloadCsv, { CsvColumn } from "~/utils/downloadCsv";

interface TransposedRow {
  key: string;
  totalAvg: number;
  [region: string]: string | number;
}

interface Props {
  features: any;
  selectedCropGroup: string;
  selectedCropDetailGroup: string;
  isReportMode?: boolean;
}

const MandarinTreeAgeDistributionTable = ({ features, selectedCropGroup, selectedCropDetailGroup, isReportMode }: Props) => {
  const { flattenedData, uniqueRegions } = useMemo(() => {
    if (!features?.features || features.features.length === 0) {
      return { flattenedData: [], uniqueRegions: [] };
    }

    const flattenedData: { region: string; avgAge: number }[] = [];
    const regionMap: Map<string, number[]> = new Map();

    for (const feature of features.features) {
      const regionName = feature.properties.vrbs_nm;
      const avgAge = feature.properties.stats?.average_age || 0;

      if (!regionMap.has(regionName)) {
        regionMap.set(regionName, []);
      }
      regionMap.get(regionName)!.push(avgAge);
    }

    // Calculate average for each region
    regionMap.forEach((ages, region) => {
      const avgAge = ages.reduce((sum, age) => sum + age, 0) / ages.length;
      flattenedData.push({ region, avgAge });
    });

    // Sort by avgAge descending
    flattenedData.sort((a, b) => b.avgAge - a.avgAge);
    const sortedRegions = flattenedData.map((d) => d.region);

    return { flattenedData, uniqueRegions: sortedRegions };
  }, [features]);

  const processedData = useMemo(() => {
    const maxRegions = 14;
    const limitedUniqueRegions = uniqueRegions.slice(0, maxRegions);
    const varietyName = selectedCropDetailGroup === "전체" ? selectedCropGroup : selectedCropDetailGroup;

    if (isReportMode) {
      // Report mode: rows=regions, columns=variety
      const reportColumns: ColumnsType<any> = [
        {
          title: "지역 / 품종",
          dataIndex: "region",
          key: "region",
          align: "center" as const,
        },
        {
          title: varietyName,
          dataIndex: "avgAge",
          key: "avgAge",
          align: "center" as const,
          render: (value: number) => value.toFixed(1),
        },
      ];

      const reportDataSource = flattenedData.map((d) => ({
        key: d.region,
        region: d.region,
        avgAge: d.avgAge,
      }));

      return { columns: reportColumns, dataSource: reportDataSource };
    }

    // Normal mode: rows=variety, columns=regions
    const columns: ColumnsType<TransposedRow> = [
      {
        title: "품종 / 지역",
        dataIndex: "key",
        key: "key",
        align: "center" as const,
      },
      {
        title: "평균(년)",
        dataIndex: "totalAvg",
        key: "totalAvg",
        align: "center" as const,
        render: (value: number) => value.toFixed(1),
      },
      ...limitedUniqueRegions.map((region) => ({
        title: region,
        dataIndex: region,
        key: region,
        align: "center" as const,
        render: (value: number) => (value !== undefined ? value.toFixed(1) : "-"),
      })),
    ];

    const dataSource: TransposedRow[] = [
      {
        key: varietyName,
        totalAvg: flattenedData.reduce((sum, d) => sum + d.avgAge, 0) / (flattenedData.length || 1),
        ...Object.fromEntries(flattenedData.map((d) => [d.region, d.avgAge])),
      },
    ];

    return { columns, dataSource };
  }, [flattenedData, uniqueRegions, selectedCropGroup, selectedCropDetailGroup, isReportMode]);

  const csvData = useMemo(() => {
    const columns: CsvColumn[] = [
      {
        title: "품종 / 지역",
        dataIndex: "key",
      },
      {
        title: "평균(년)",
        dataIndex: "totalAvg",
      },
      ...uniqueRegions.map((region) => ({
        title: region,
        dataIndex: region,
      })),
    ];

    return { columns, dataSource: processedData.dataSource };
  }, [uniqueRegions, processedData.dataSource]);

  const handleDownloadCsv = () => {
    const dataRows = csvData.dataSource.map((row) => {
      const newRow: any = { key: row.key, totalAvg: row.totalAvg.toFixed(1) };
      uniqueRegions.forEach((region) => {
        newRow[region] = row[region] !== undefined ? (row[region] as number).toFixed(1) : "-";
      });
      return newRow;
    });

    downloadCsv(csvData.columns, dataRows, "감귤_수령_분포.csv");
  };

  if (isReportMode) {
    return (
      <div className="rounded-lg">
        <Table
          columns={processedData.columns}
          dataSource={processedData.dataSource}
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

export default MandarinTreeAgeDistributionTable;
