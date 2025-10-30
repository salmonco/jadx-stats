import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import visualizationApi from "~/services/apis/visualizationApi";
import { GarakMarketPriceMonthlyResponse } from "~/services/types/visualizationTypes";
import { getRowSpan } from "~/utils/common";
import { downloadExcel } from "~/utils/downloadExcel";
import { Button, Pagination, Select, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { DownloadOutlined } from "@ant-design/icons";
import { uniq } from "lodash";

interface Props {
  pummok: string;
  startDate: string;
  endDate: string;
}

const MonthlyPrice = ({ pummok, startDate, endDate }: Props) => {
  const [offset, setOffset] = useState<number>(1);
  const [limit, setLimit] = useState<number>(6);

  const { data } = useQuery<GarakMarketPriceMonthlyResponse>({
    queryKey: ["garak-market-price-monthly", pummok, startDate, endDate],
    queryFn: () => visualizationApi.getGarakMarketPriceMonthly({ pummok: pummok, start_date: startDate, end_date: endDate }),
  });

  const tableData = data
    ? data.flatMap((entry) =>
        entry.data.map((item) => ({
          key: `${entry.crtr_ymd}-${item.grade}`,
          crtr_ymd: entry.crtr_ymd,
          pummok: item.pummok,
          grade: item.grade,
          monthly_price: item.monthly_price,
          previous_year_price: item.previous_year_price,
          previous_year_diff_pct: item.previous_year_diff_pct,
          average_year_price: item.average_year_price,
        }))
      )
    : [];

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
      title: "월",
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
      title: "등급",
      dataIndex: "grade",
      key: "grade",
      align: "center",
    },
    {
      title: "금년 가격 (원/kg)",
      dataIndex: "monthly_price",
      key: "monthly_price",
      align: "center",
      render: (value) => value?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
    },
    {
      title: "전년 가격 (원/kg)",
      dataIndex: "previous_year_price",
      key: "previous_year_price",
      align: "center",
      render: (value) => value?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
    },
    {
      title: "평년 가격 (원/kg)",
      dataIndex: "average_year_price",
      key: "average_year_price",
      align: "center",
      render: (value) => value?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
    },
  ];

  const handleExcelDownload = () => {
    const params = { pummok: pummok, start_date: startDate, end_date: endDate };
    downloadExcel(visualizationApi.getGarakMarketPriceMonthlyExcel, params, "garak_market_price_monthly.xlsx");
  };

  return (
    <div className="space-y-[16px]">
      <div className="flex items-center justify-between">
        <span className="text-[20px] font-semibold">가락시장 월별/등급별 가격</span>
        <div className="flex items-center gap-[12px]">
          <Select
            value={limit}
            onChange={(value) => {
              setOffset(1);
              setLimit(value);
            }}
            className="w-[130px]"
          >
            <Select.Option value={6}>6개월씩 보기</Select.Option>
            <Select.Option value={12}>12개월씩 보기</Select.Option>
            <Select.Option value={24}>24개월씩 보기</Select.Option>
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

export default MonthlyPrice;
