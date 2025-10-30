import { MarketTradeRatioTableData } from "~/services/types/visualizationTypes";
import { formatData } from "~/pages/home/MarketTrendsSection";
import { Empty, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

const REGION_ORDER = ["서울", "인천", "경기", "전북 강원", "충북", "대전 충남", "광주 전남", "대구 경북", "부산 울산"];

interface Props {
  marketTradeRatioTableData: MarketTradeRatioTableData[];
}

interface RegionPriceData {
  key: string;
  region: string;
  avgPrice: string;
  gradePrice: string;
  quantity: string;
  ratio: string;
}

const columns: ColumnsType<RegionPriceData> = [
  {
    title: "권역",
    dataIndex: "region",
    key: "region",
    align: "center",
    // width: "17%",
    render: (text) => <span className="font-medium text-white">{text?.replace(" ", "/")}</span>,
  },
  {
    title: "평균 가격",
    dataIndex: "avgPrice",
    key: "avgPrice",
    align: "center",
    // width: "19%",
    render: (value) => <span className="text-white">{value}</span>,
  },
  {
    title: "대표등급 가격",
    dataIndex: "gradePrice",
    key: "gradePrice",
    align: "center",
    // width: "24%",
    render: (value) => <span className="text-white">{value}</span>,
  },
  {
    title: "제주산 반입량",
    dataIndex: "quantity",
    key: "quantity",
    align: "center",
    // width: "22%",
    render: (value) => <span className="text-white">{value}</span>,
  },
  {
    title: "반입 비율",
    dataIndex: "ratio",
    key: "ratio",
    align: "center",
    // width: "18%",
    render: (value) => <span className="text-white">{value}%</span>,
  },
];

const RegionPriceQuantity = ({ marketTradeRatioTableData }: Props) => {
  const orderIndex: Record<string, number> = REGION_ORDER.reduce((acc, region, idx) => ({ ...acc, [region]: idx }), {});

  const tableData: RegionPriceData[] = marketTradeRatioTableData
    ?.map((item) => ({
      key: item.region,
      region: item.region,
      avgPrice: item.target_average_price ? `${formatData(item.target_average_price)}원/kg` : "-",
      gradePrice: item.grade_average_price ? `${formatData(item.grade_average_price)}원` : "-",
      quantity: item.target_jeju_weight ? `${formatData(item.target_jeju_weight, true)}톤` : "-",
      ratio: item.weight_ratio.toFixed(1),
      _ratioValue: item.weight_ratio,
    }))
    .sort((a, b) => {
      const idxA = orderIndex[a.region];
      const idxB = orderIndex[b.region];

      if (idxA !== undefined && idxB !== undefined) return idxA - idxB;

      if (idxA === undefined && idxB !== undefined) return 1;
      if (idxA !== undefined && idxB === undefined) return -1;

      return b._ratioValue - a._ratioValue;
    })
    .map(({ _ratioValue, ...rest }) => rest);

  return (
    <div className="flex w-full max-w-[575px] flex-1 flex-col rounded-lg bg-[#43516D] p-5 pr-3">
      <div className="flex items-center justify-between">
        <p className="text-[20px] font-semibold">지역별 가격 및 반입량</p>
      </div>
      <div className="h-full">
        <div className="custom-dark-scroll overflow-y-auto">
          {marketTradeRatioTableData?.length === 0 || !marketTradeRatioTableData ? (
            <div className="flex h-full items-center justify-center">
              <Empty description={<div className="pt-2 text-[18px] text-white">데이터가 없습니다.</div>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          ) : (
            <Table columns={columns} dataSource={tableData} pagination={false} bordered={false} className="custom-dark-table" />
          )}
        </div>
      </div>
    </div>
  );
};

export default RegionPriceQuantity;
