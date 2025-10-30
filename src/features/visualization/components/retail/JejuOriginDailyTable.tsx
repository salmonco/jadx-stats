import { QuestionCircleOutlined } from "@ant-design/icons";
import { Table, Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { PriceDashboardMonthlyResponse } from "~/services/types/visualizationTypes";
import { getRowSpan } from "~/utils/common";

const formatNumber = (n: number | null | undefined) => {
  if (n == null) return "-";
  return Number(n).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const transformToTableData = (data: PriceDashboardMonthlyResponse, selectedMarket: string) => {
  return data?.flatMap((entry) => {
    const date = `${entry.crtr_ymd.slice(6, 8)}일`;
    return entry.data
      .filter((d) => selectedMarket === "전체" || d.market_name === selectedMarket)
      .map((d, i) => ({
        key: `${entry.crtr_ymd}_${d.market_name}_${i}`,
        date,
        market: d.market_name,
        region: d.market_region_name,
        is9Market: d.nine_wholesale_market_yn,
        todayVolume: `${formatNumber(d.total_weight)}`,
        todayPrice: `${formatNumber(d.average_price)}`,
        prevDay: formatNumber(d.previous_day_price),
        prevWeek: formatNumber(d.previous_week_price),
        prevMonth: formatNumber(d.previous_month_price),
        prevYearSameMonth: formatNumber(d.previous_year_price),
        avgYearSameMonth: formatNumber(d.average_year_price),
        isRealWeight: d.is_real_weight,
        isRealPrice: d.is_real_price,
      }));
  });
};

const JejuOriginDailyTable = ({ selectedMarket, data }: { selectedMarket: string; data: PriceDashboardMonthlyResponse }) => {
  const dataSource = transformToTableData(data, selectedMarket);

  const columns: ColumnsType<any> = [
    {
      title: "일자",
      dataIndex: "date",
      align: "center",
      key: "date",
      render: (text, _, index) => ({
        children: text,
        props: { rowSpan: getRowSpan(dataSource, index, "date") },
      }),
    },
    {
      title: "도매시장",
      dataIndex: "market",
      align: "center",
      key: "market",
    },
    {
      title: "지역",
      dataIndex: "region",
      align: "center",
      key: "region",
    },
    {
      title: () => (
        <span>
          9대
          <br />
          도매시장 여부
        </span>
      ),
      dataIndex: "is9Market",
      align: "center",
      key: "is9Market",
    },
    {
      title: () => (
        <div className="flex items-center justify-center gap-1">
          오늘
          <Tooltip title="당일 기준 경매원천정보 업데이트 전까지는 실시간 경매정보 데이터로 대체하여 표출">
            <QuestionCircleOutlined className="text-gray-500" />
          </Tooltip>
        </div>
      ),
      children: [
        {
          title: "반입량(kg)",
          dataIndex: "todayVolume",
          key: "todayVolume",
          align: "center",
          render: (text, record) => (
            <div className="flex items-center justify-center gap-1">
              {text}
              {text !== "-" && record.isRealWeight && <Tag color="blue">실시간</Tag>}
            </div>
          ),
        },
        {
          title: "평균가(원/kg)",
          dataIndex: "todayPrice",
          key: "todayPrice",
          align: "center",
          render: (text, record) => (
            <div className="flex items-center justify-center gap-1">
              {text}
              {text !== "-" && record.isRealPrice && <Tag color="blue">실시간</Tag>}
            </div>
          ),
        },
      ],
    },
    {
      title: "평균가 비교 (원/kg)",
      children: [
        {
          title: "전일",
          dataIndex: "prevDay",
          key: "prevDay",
          align: "center",
        },
        {
          title: "전주",
          dataIndex: "prevWeek",
          key: "prevWeek",
          align: "center",
        },
        {
          title: "전월",
          dataIndex: "prevMonth",
          key: "prevMonth",
          align: "center",
        },
        {
          title: "전년 동월",
          dataIndex: "prevYearSameMonth",
          key: "prevYearSameMonth",
          align: "center",
        },
        {
          title: "평년 동월",
          dataIndex: "avgYearSameMonth",
          key: "avgYearSameMonth",
          align: "center",
        },
      ],
    },
  ];

  return <Table columns={columns} dataSource={dataSource} pagination={false} scroll={{ x: 1200 }} bordered size="middle" />;
};

export default JejuOriginDailyTable;
