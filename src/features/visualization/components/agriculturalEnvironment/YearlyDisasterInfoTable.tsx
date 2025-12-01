import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo } from "react";
import downloadCsv, { CsvColumn } from "~/utils/downloadCsv";

const MAX_REGIONS = 14;

interface Props {
  features: any;
  selectedDisaster: string;
  selectedDisasterCategory: string;
  isReportMode?: boolean;
}

const YearlyDisasterInfoTable = ({ features, selectedDisaster, selectedDisasterCategory, isReportMode }: Props) => {
  const { columns, dataSource, sortedRegions, allRegionsData } = useMemo(() => {
    if (!features?.features || features.features.length === 0) {
      return { columns: [], dataSource: [], sortedRegions: [], allRegionsData: null };
    }

    const regionData: any = {};

    features.features.forEach((feature: any) => {
      const stats = feature.properties?.stats?.[0];
      const region = feature.properties?.vrbs_nm;
      if (region && stats) {
        regionData[region] = {
          supportAmount: stats.total_dstr_sprt_amt || 0,
          damageArea: stats.total_cfmtn_dmg_qnty || 0,
        };
      }
    });

    // Sort all regions by selected category
    const allRegions = Object.keys(regionData).sort((a, b) => {
      if (selectedDisasterCategory === "total_dstr_sprt_amt") {
        return regionData[b].supportAmount - regionData[a].supportAmount;
      }
      return regionData[b].damageArea - regionData[a].damageArea;
    });

    // Limit to top 14 for display
    const sortedRegions = allRegions.slice(0, MAX_REGIONS);

    const columns: ColumnsType<any> = [
      {
        title: "지표",
        dataIndex: "disaster",
        key: "disaster",
        align: "center" as const,
        fixed: "left" as const,
      },
      ...sortedRegions.map((region) => ({
        title: region,
        dataIndex: region,
        key: region,
        align: "center" as const,
        render: (value: number) => value?.toLocaleString() || "0",
      })),
    ];

    const row: any = {
      key: selectedDisaster,
      disaster: selectedDisaster,
    };

    sortedRegions.forEach((region) => {
      row[region] = selectedDisasterCategory === "total_dstr_sprt_amt" ? regionData[region].supportAmount : regionData[region].damageArea;
    });

    const dataSource = [row];

    return { columns, dataSource, sortedRegions, allRegionsData: { allRegions, regionData } };
  }, [features, selectedDisasterCategory, selectedDisaster]);

  const handleDownloadCsv = () => {
    if (!allRegionsData) return;

    const { allRegions, regionData } = allRegionsData;

    const csvColumns: CsvColumn[] = [{ title: "지표", dataIndex: "disaster" }, ...allRegions.map((region) => ({ title: region, dataIndex: region }))];

    const rowData: any = { disaster: selectedDisaster };
    allRegions.forEach((region) => {
      const value = selectedDisasterCategory === "total_dstr_sprt_amt" ? regionData[region].supportAmount : regionData[region].damageArea;
      rowData[region] = value.toLocaleString();
    });

    const categoryName = selectedDisasterCategory === "total_dstr_sprt_amt" ? "재난지원금" : "피해면적";
    downloadCsv(csvColumns, [rowData], `농업재해_${selectedDisaster}_${categoryName}.csv`);
  };

  if (isReportMode) {
    return (
      <div className="rounded-lg">
        <Table columns={columns} dataSource={dataSource} size="middle" pagination={false} bordered={false} scroll={undefined} className="custom-report-table" />
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
      <Table columns={columns} dataSource={dataSource} size="middle" pagination={false} bordered={false} scroll={{ x: true }} className="custom-dark-table" />
    </div>
  );
};

export default YearlyDisasterInfoTable;
