import { Card, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { PriceDashboardRegionResponse } from "~/services/types/visualizationTypes";

interface RegionData {
  key: string;
  rank: number;
  region: string;
  marketCount: number;
  avgPrice: number;
  totalVolume: number;
}

const RegionalTable = ({ data }: { data: PriceDashboardRegionResponse }) => {
  if (!data || !data.length) return null;

  // 모든 날짜의 권역별 평균 및 시장 수 계산
  const regionAverages = data.reduce(
    (acc, dateData) => {
      dateData.data.forEach((item) => {
        if (item.average_price === null || item.average_weight === null) return;

        if (!acc[item.market_region_name]) {
          acc[item.market_region_name] = {
            totalPrice: 0,
            totalVolume: 0,
            count: 0,
            marketCount: item.market_count ?? 0,
          };
        }

        acc[item.market_region_name].totalPrice += item.average_price;
        acc[item.market_region_name].totalVolume += item.average_weight;
        acc[item.market_region_name].count += 1;
      });
      return acc;
    },
    {} as Record<string, { totalPrice: number; totalVolume: number; count: number; marketCount: number }>
  );

  const tableData: RegionData[] = Object.entries(regionAverages)
    .map(([region, stats]) => ({
      key: region,
      region,
      marketCount: stats.marketCount,
      avgPrice: stats.totalPrice / stats.count,
      totalVolume: stats.totalVolume / stats.count,
    }))
    .sort((a, b) => b.avgPrice - a.avgPrice)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

  const columns: ColumnsType<RegionData> = [
    {
      title: "순위",
      dataIndex: "rank",
      key: "rank",
      align: "center",
      width: 80,
      render: (value) => <strong>{value}</strong>,
    },
    {
      title: "권역",
      dataIndex: "region",
      key: "region",
      align: "center",
    },
    {
      title: "포함 시장 수",
      dataIndex: "marketCount",
      key: "marketCount",
      align: "center",
    },
    {
      title: "평균 가격 (원/kg)",
      dataIndex: "avgPrice",
      key: "avgPrice",
      align: "center",
      render: (value) => value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
    },
    {
      title: "평균 반입량 (kg)",
      dataIndex: "totalVolume",
      key: "totalVolume",
      align: "center",
      render: (value) => value.toLocaleString(),
    },
  ];

  const rowClassName = (record: RegionData) => {
    if (record.rank <= 3) return "bg-[#ECFDF5]";
    if (record.rank >= tableData.length - 2) return "bg-[#FEE2E2]";
    return "";
  };

  return (
    <Card>
      <Table dataSource={tableData} columns={columns} pagination={false} rowClassName={rowClassName} bordered rowHoverable={false} />
    </Card>
  );
};

export default RegionalTable;
