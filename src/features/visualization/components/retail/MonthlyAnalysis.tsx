import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import visualizationApi from "~/services/apis/visualizationApi";
import { DefaultMarket, PriceDashboardMonthlyResponse } from "~/services/types/visualizationTypes";
import JejuOriginDailyChart from "~/features/visualization/components/retail/JejuOriginDailyChart";
import JejuOriginDailyTable from "~/features/visualization/components/retail/JejuOriginDailyTable";
import { downloadExcel } from "~/utils/downloadExcel";
import { Button, Radio, Select } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { ChartColumn, Table2 } from "lucide-react";
import dayjs from "dayjs";

type ChartType = "chart" | "table";

const MonthlyAnalysis = ({ pummok }: { pummok: string }) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  const defaultMonth = `${twoMonthsAgo.getMonth() + 1}`;
  const defaultYear = `${twoMonthsAgo.getFullYear()}`;

  const [year, setYear] = useState<string>(defaultYear);
  const [month, setMonth] = useState<string>(defaultMonth);
  const [region, setRegion] = useState<string>("서울가락");
  const [chartType, setChartType] = useState<ChartType>("chart");

  const { data } = useQuery<PriceDashboardMonthlyResponse>({
    queryKey: ["price-dashboard-monthly-data", pummok, year, month, region],
    queryFn: () => visualizationApi.getPriceDashboardMonthly({ pummok: pummok, target_year: parseInt(year), target_month: month, market_name: region }),
    retry: false,
  });

  // 조회 날짜 설정 (현재 월이면 어제 날짜, 외에는 해당 월 28일)
  const today = dayjs();
  const isCurrentMonth = today.year() === parseInt(year) && today.month() + 1 === parseInt(month);
  const queryDate = isCurrentMonth ? today.subtract(1, "day").format("YYYY-MM-DD") : dayjs(`${year}-${month.toString().padStart(2, "0")}-28`).format("YYYY-MM-DD");

  const { data: defaultMarketList } = useQuery<DefaultMarket[]>({
    queryKey: ["default-market-list", queryDate],
    queryFn: () => visualizationApi.getDefaultMarketList(queryDate),
    retry: false,
  });

  const handleExcelDownload = () => {
    const params = { pummok: pummok, target_year: parseInt(year), target_month: month, market_name: region };
    downloadExcel(visualizationApi.getPriceDashboardMonthlyExcel, params, "price_dashboard_monthly.xlsx");
  };

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-[16px]">
          <Select className="w-[120px]" value={year} onChange={(value) => setYear(value)}>
            {Array.from({ length: 6 }, (_, i) => {
              const yearValue = currentYear - i;
              return (
                <Select.Option key={yearValue} value={yearValue.toString()}>
                  {yearValue}년
                </Select.Option>
              );
            })}
          </Select>
          <Select className="w-[120px]" value={month} onChange={(value) => setMonth(value)}>
            {Array.from({ length: parseInt(year) === currentYear ? today.month() + 1 : 12 }, (_, i) => {
              const monthValue = (i + 1).toString();
              return (
                <Select.Option key={monthValue} value={monthValue}>
                  {monthValue}월
                </Select.Option>
              );
            })}
          </Select>
          <Select className="w-[120px]" value={region} onChange={(value) => setRegion(value)}>
            {defaultMarketList?.map((market) => (
              <Select.Option key={market.code} value={market.name}>
                {market.name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="flex items-center gap-[16px]">
          <Radio.Group value={chartType} onChange={(e) => setChartType(e.target.value as ChartType)} className="flex">
            <Radio.Button value="chart">
              <div className="flex items-center justify-center gap-[8px] text-[16px]">
                <ChartColumn width={18} height={18} strokeWidth={1.75} />
                차트
              </div>
            </Radio.Button>
            <Radio.Button value="table">
              <div className="flex items-center justify-center gap-[8px] text-[16px]">
                <Table2 width={18} height={18} strokeWidth={1.75} />
                테이블
              </div>
            </Radio.Button>
          </Radio.Group>
          <Button icon={<DownloadOutlined />} onClick={handleExcelDownload} className="text-[16px]" disabled={!data}>
            엑셀 다운로드
          </Button>
        </div>
      </div>
      <div className="space-y-[16px]">
        <span className="text-[22px] font-semibold">도매시장 일별 제주산 반입량 및 평균가 현황</span>
        {chartType === "chart" ? (
          <div className="h-[450px] w-full">
            <JejuOriginDailyChart data={data} />
          </div>
        ) : (
          <div className="w-full">
            <JejuOriginDailyTable selectedMarket={region} data={data} />
          </div>
        )}
      </div>
    </>
  );
};

export default MonthlyAnalysis;
