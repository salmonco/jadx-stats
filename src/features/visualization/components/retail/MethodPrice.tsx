import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import visualizationApi from "~/services/apis/visualizationApi";
import { GarakMarketPriceMethodResponse } from "~/services/types/visualizationTypes";
import { downloadExcel } from "~/utils/downloadExcel";
import { Button, Pagination, Select, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getRowSpan } from "~/utils/common";
import { uniq } from "lodash";

interface Props {
  pummok: string;
  startDate: string;
  endDate: string;
}

const MethodPrice = ({ pummok, startDate, endDate }: Props) => {
  const [offset, setOffset] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);

  const { data } = useQuery<GarakMarketPriceMethodResponse>({
    queryKey: ["garak-market-price-method", pummok, startDate, endDate],
    queryFn: () => visualizationApi.getGarakMarketPriceMethod({ pummok: pummok, start_date: startDate, end_date: endDate }),
  });

  const tableData =
    data?.flatMap((entry) =>
      entry.data.map((item, idx) => ({
        key: `${entry.crtr_ymd}-${item.dealing_method}-${idx}`,
        crtr_ymd: dayjs(entry.crtr_ymd).format("YYYY-MM-DD"),
        pummok: item.pummok,
        dealing_method: item.dealing_method,
        high_price: item.high_price,
        middle_price: item.middle_price,
        low_price: item.low_price,
        price_range: item.price_range,
        weight: item.weight,
      }))
    ) ?? [];

  const uniqueDates = useMemo(() => {
    return uniq(tableData?.map((d) => d.crtr_ymd));
  }, [tableData]);

  // 페이지별로 보여줄 날짜들
  const pagedDates = useMemo(() => {
    const start = (offset - 1) * limit;
    const end = start + limit;
    return uniqueDates?.slice(start, end);
  }, [uniqueDates, offset, limit]);

  // 현재 페이지에 해당하는 row만 필터링
  const pagedData = useMemo(() => {
    return tableData?.filter((d) => pagedDates.includes(d.crtr_ymd));
  }, [tableData, pagedDates]);

  const columns: ColumnsType<(typeof tableData)[0]> = [
    {
      title: "일자",
      dataIndex: "crtr_ymd",
      key: "crtr_ymd",
      align: "center",
      render: (text, _, index) => ({
        children: text,
        props: { rowSpan: getRowSpan(pagedData, index, "crtr_ymd") },
      }),
    },
    {
      title: "작물",
      dataIndex: "pummok",
      key: "pummok",
      align: "center",
      render: (value) => <Tag className="text-[14px]">{value}</Tag>,
    },
    {
      title: "거래방법",
      dataIndex: "dealing_method",
      key: "dealing_method",
      align: "center",
    },
    {
      title: "고가 (원/kg)",
      dataIndex: "high_price",
      key: "high_price",
      align: "center",
      render: (value) => value?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
    },
    {
      title: "중가 (원/kg)",
      dataIndex: "middle_price",
      key: "middle_price",
      align: "center",
      render: (value) => value?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
    },
    {
      title: "저가 (원/kg)",
      dataIndex: "low_price",
      key: "low_price",
      align: "center",
      render: (value) => value?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
    },
    {
      title: "물량 (kg)",
      dataIndex: "weight",
      key: "weight",
      align: "center",
      render: (value) => value?.toLocaleString(),
    },
  ];

  const handleExcelDownload = () => {
    const params = { pummok: pummok, start_date: startDate, end_date: endDate };
    downloadExcel(visualizationApi.getGarakMarketPriceMethodExcel, params, "garak_market_price_method.xlsx");
  };

  return (
    <div className="space-y-[16px]">
      <div className="flex items-center justify-between">
        <span className="text-[20px] font-semibold">가락시장 거래방법별 가격 및 물량</span>
        <div className="flex items-center gap-[12px]">
          <Select
            value={limit}
            onChange={(value) => {
              setOffset(1);
              setLimit(value);
            }}
            className="w-[120px]"
          >
            <Select.Option value={5}>5일씩 보기</Select.Option>
            <Select.Option value={15}>15일씩 보기</Select.Option>
            <Select.Option value={30}>30일씩 보기</Select.Option>
          </Select>
          <Button icon={<DownloadOutlined />} onClick={handleExcelDownload} disabled={!data}>
            엑셀 다운로드
          </Button>
        </div>
      </div>
      <Table columns={columns} dataSource={pagedData} pagination={false} bordered />

      <div className="mt-[8px] flex justify-end">
        <Pagination current={offset} pageSize={limit} total={uniqueDates.length} onChange={(page) => setOffset(page)} showSizeChanger={false} />
      </div>
    </div>
  );
};

export default MethodPrice;
