import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Dayjs } from "dayjs";
import { useMemo } from "react";
import downloadCsv, { CsvColumn } from "~/utils/downloadCsv";

interface Props {
  features: any;
  startDate: Dayjs;
  endDate: Dayjs;
  selectedDisaster: string;
  selectedCropPummok: string;
  selectedCropGroup: string;
  selectedCropDetailGroup: string;
  isReportMode?: boolean;
}

const DisasterTypeHistoryStatsTable = ({
  features,
  startDate,
  endDate,
  selectedDisaster,
  selectedCropPummok,
  selectedCropGroup,
  selectedCropDetailGroup,
  isReportMode,
}: Props) => {
  const { columns, dataSource, regionNames } = useMemo(() => {
    if (!features?.features || features.features.length === 0) {
      return { columns: [], dataSource: [], regionNames: [] };
    }

    // 작물 정보 조합
    const cropParts = [selectedCropPummok];
    if (selectedCropGroup && selectedCropGroup !== "전체") {
      cropParts.push(selectedCropGroup);
    }
    if (selectedCropDetailGroup && selectedCropDetailGroup !== "전체") {
      cropParts.push(selectedCropDetailGroup);
    }
    const cropText = cropParts.join(" > ");

    // 지역명 수집
    const regionNames: string[] = [];
    features.features.forEach((feature: any) => {
      const region = feature.properties?.vrbs_nm;
      if (region && !regionNames.includes(region)) {
        regionNames.push(region);
      }
    });

    // 컬럼 정의: 기간, 재해 구분, 작물 품목, 지역, 지역명들...
    const columns: ColumnsType<any> = [
      {
        title: "기간",
        dataIndex: "period",
        key: "period",
        align: "center" as const,
        fixed: "left" as const,
      },
      {
        title: "재해 구분",
        dataIndex: "disaster",
        key: "disaster",
        align: "center" as const,
        fixed: "left" as const,
      },
      {
        title: "작물 종류",
        dataIndex: "crop",
        key: "crop",
        align: "center" as const,
        fixed: "left" as const,
      },
      {
        title: "지역",
        dataIndex: "category",
        key: "category",
        align: "center" as const,
        fixed: "left" as const,
      },
      ...regionNames.map((region) => ({
        title: region,
        dataIndex: region,
        key: region,
        align: "center" as const,
        render: (value: number) => (value !== undefined ? value.toLocaleString() : "-"),
      })),
    ];

    // 지역별 데이터 수집
    const regionData: Record<string, { damageArea: number; damageHouseholds: number }> = {};

    features.features.forEach((feature: any) => {
      const stats = feature.properties?.stats?.[0];
      const region = feature.properties?.vrbs_nm;
      if (region && stats) {
        regionData[region] = {
          damageArea: stats.total_dstr_sprt_amt || 0, // 피해면적
          damageHouseholds: stats.total_frmhs_qnty || 0, // 피해 농가수
        };
      }
    });

    // 기간 텍스트
    const periodText = `${startDate.format("YYYY-MM-DD")} ~ ${endDate.format("YYYY-MM-DD")}`;

    // 두 개의 행 생성: 피해면적, 피해 농가수
    const damageAreaRow: any = {
      key: "damageArea",
      period: periodText,
      disaster: selectedDisaster,
      crop: cropText,
      category: "피해면적(ha)",
    };

    const damageHouseholdsRow: any = {
      key: "damageHouseholds",
      period: periodText,
      disaster: selectedDisaster,
      crop: cropText,
      category: "피해 농가수(개)",
    };

    regionNames.forEach((region) => {
      damageAreaRow[region] = regionData[region]?.damageArea;
      damageHouseholdsRow[region] = regionData[region]?.damageHouseholds;
    });

    const dataSource = [damageAreaRow, damageHouseholdsRow];

    return { columns, dataSource, regionNames };
  }, [features, startDate, endDate, selectedDisaster, selectedCropPummok, selectedCropGroup, selectedCropDetailGroup]);

  const handleDownloadCsv = () => {
    if (dataSource.length === 0) return;

    const csvColumns: CsvColumn[] = [
      { title: "기간", dataIndex: "period" },
      { title: "재해 구분", dataIndex: "disaster" },
      { title: "작물 종류", dataIndex: "crop" },
      { title: "지역", dataIndex: "category" },
      ...regionNames.map((region) => ({ title: region, dataIndex: region })),
    ];

    const csvData = dataSource.map((row) => {
      const rowData: any = {
        period: row.period,
        disaster: row.disaster,
        crop: row.crop,
        category: row.category,
      };
      regionNames.forEach((region) => {
        rowData[region] = row[region] !== undefined ? row[region].toLocaleString() : "-";
      });
      return rowData;
    });

    const cropFileName = dataSource[0]?.crop?.replace(/\s>/g, "_") || "전체";
    downloadCsv(csvColumns, csvData, `농업재해_유형별_과거통계_${selectedDisaster}_${cropFileName}.csv`);
  };

  if (isReportMode) {
    // 보고서 모드에서는 지역명을 행으로 변환
    const reportColumns: ColumnsType<any> = [
      {
        title: "지역명",
        dataIndex: "region",
        key: "region",
        align: "center" as const,
      },
      {
        title: "피해면적(ha)",
        dataIndex: "damageArea",
        key: "damageArea",
        align: "center" as const,
        render: (value: number) => (value !== undefined ? value.toLocaleString() : "-"),
      },
      {
        title: "피해 농가수(개)",
        dataIndex: "damageHouseholds",
        key: "damageHouseholds",
        align: "center" as const,
        render: (value: number) => (value !== undefined ? value.toLocaleString() : "-"),
      },
    ];

    const reportDataSource = regionNames.map((region) => ({
      key: region,
      region,
      damageArea: dataSource[0]?.[region],
      damageHouseholds: dataSource[1]?.[region],
    }));

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
      <Table columns={columns} dataSource={dataSource} size="middle" pagination={false} bordered={false} scroll={{ x: true }} className="custom-dark-table" />
    </div>
  );
};

export default DisasterTypeHistoryStatsTable;
