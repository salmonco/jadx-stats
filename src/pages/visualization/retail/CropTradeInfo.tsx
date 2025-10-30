import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import visualizationApi from "~/services/apis/visualizationApi";
import { StatsSummaryMarket, StatsSummaryMarketTable } from "~/services/types/statsTypes";
import { MarketTradeRatioTableData } from "~/services/types/visualizationTypes";
import statsApi from "~/services/apis/statsApi";
import InfoTooltip from "~/components/InfoTooltip";
import KeyProductionStats from "~/features/visualization/components/retail/KeyProductionStats";
import RegionPriceQuantity from "~/features/visualization/components/retail/RegionPriceQuantity";
import PriceQuantitySummary from "~/features/visualization/components/retail/PriceQuantitySummary";
import MonthlyPriceTrendChart from "~/features/visualization/components/retail/MonthlyPriceTrendChart";
import MarketTrendsTable from "~/features/visualization/components/retail/MarketTrendsTable";
import { infoTooltipContents } from "~/utils/InfoTooltipContents";
import { Select, DatePicker } from "antd";
import dayjs from "dayjs";
import { LinkOutlined, WarningOutlined } from "@ant-design/icons";

export interface RegionStat {
  region_name: string;
  average_price: number;
}

export interface AverageStat extends RegionStat {
  total_weight: number;
  avg_price_pct_change: number;
  tot_weight_pct_change: number;
}

export interface TradeStats {
  target_average_price: number;
  previous_day_garak_average_price: number;
  previous_day_price_change_rate: number;
  previous_week_garak_average_price: number;
  previous_week_price_change_rate: number;
  previous_month_garak_average_price: number;
  previous_month_price_change_rate: number;
  target_garak_grade_price: number;
  previous_garak_grade_price_change_rate: number;
  target_garak_jeju_weight: number;
  previous_garak_jeju_weight_change_rate: number;
  stats: {
    highest: {
      region_name: string;
      average_price: number;
    };
    lowest: {
      region_name: string;
      average_price: number;
    };
    average: {
      region_name: string;
      average_price: number;
      total_weight: number;
      total_jeju_weight: number;
    };
  };
}

export interface MonthlyComparisonData {
  year: number;
  month: number;
  target_year: number | null;
  previous_year: number;
  five_year_avg: number;
  previous_pct_change: number | null;
  five_year_avg_pct_change: number | null;
}

const CropTradeInfo = () => {
  const yesterday = dayjs().subtract(1, "day");
  const defaultTargetDate = yesterday.day() === 0 ? yesterday.subtract(1, "day") : yesterday;

  const [selectedTargetDate, setSelectedTargetDate] = useState<string | null>(defaultTargetDate.format("YYYY-MM-DD"));
  const [selectedPummok, setSelectedPummok] = useState<string>("무");

  const { data: tradeData } = useQuery<TradeStats>({
    queryKey: ["tradeData", selectedTargetDate, selectedPummok],
    initialData: null,
    queryFn: () => visualizationApi.getHibernationVegetableMarketTrade(selectedTargetDate, selectedPummok),
    retry: false,
  });

  const { data: tradeChartData } = useQuery<MonthlyComparisonData[]>({
    queryKey: ["tradeChartData", selectedTargetDate, selectedPummok],
    initialData: null,
    queryFn: () => visualizationApi.getHibernationVegetableMarketTradeChart(selectedTargetDate, selectedPummok),
    retry: false,
  });

  const { data: marketData } = useQuery<StatsSummaryMarket>({
    queryKey: ["statsSummaryMarket", selectedTargetDate, selectedPummok],
    queryFn: () => statsApi.getStatsSummaryMarket(selectedTargetDate, selectedPummok),
    enabled: !!selectedPummok,
  });

  const { data: marketTableData } = useQuery<StatsSummaryMarketTable>({
    queryKey: ["statsSummaryMarketTable", selectedTargetDate, selectedPummok],
    queryFn: () => statsApi.getStatsSummaryMarketTable(selectedTargetDate, selectedPummok),
    enabled: !!selectedPummok,
  });

  const { data: marketTradeRatioTableData } = useQuery<MarketTradeRatioTableData[]>({
    queryKey: ["marketTradeRatioTable", selectedTargetDate, selectedPummok],
    queryFn: () => visualizationApi.getMarketTradeRatioTable(selectedTargetDate, selectedPummok),
    enabled: !!selectedPummok,
  });

  return (
    <div className="flex min-h-[calc(100vh-235px)] flex-col gap-4 p-5">
      <div className="flex flex-1 flex-col gap-5 rounded-lg bg-[#37445E] p-5 text-white">
        <div className="rounded-lg bg-slate-100 px-4 py-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-2">
              <WarningOutlined className="mt-0.5 text-[#37445E]" style={{ fontSize: "15px" }} />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#37445E]">
                  국가정보자원관리원 전산시설 화재로 인해 실시간 경락가격 정보는 우측 링크에서 임시 확인 가능하며, 정상화를 위해 신속히 조치중입니다.
                </p>
              </div>
            </div>
            <button
              onClick={() => window.open("https://at.agromarket.kr/domeinfo/marketTradeStatus.do", "_blank")}
              className="ml-4 flex items-center gap-2 rounded-md bg-[#37445E] px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-[#2a3347] hover:shadow-md"
            >
              <LinkOutlined style={{ fontSize: "13px" }} />
              바로가기
            </button>
          </div>
        </div>
        <div className="flex items-center gap-6 rounded-lg bg-[#43516D] px-5 py-3">
          <div className="flex items-center gap-2.5">
            <p className="text-2xl font-semibold">주요품목 도매시장 거래정보</p>
            <InfoTooltip content={infoTooltipContents["주요품목 도매시장 거래정보"]} />
          </div>
          <div className="flex items-center gap-2.5">
            <p className="text-[20px] font-semibold text-white">일자</p>
            <DatePicker
              className="w-[140px]"
              value={selectedTargetDate ? dayjs(selectedTargetDate) : null}
              onChange={(dt: dayjs.Dayjs | null, _: string) => {
                setSelectedTargetDate(dt ? dt.format("YYYY-MM-DD") : null);
              }}
              disabledDate={(current) => {
                // 오늘, 미래 날짜, 일요일 선태 불가
                const isAfterYesterday = current && current >= dayjs().startOf("day");
                const isSunday = current && current.day() === 0;
                return isAfterYesterday || isSunday;
              }}
              size="large"
            />
          </div>
          <div className="flex items-center gap-2.5">
            <p className="text-[20px] font-semibold text-white">품목</p>
            <Select
              className="w-[140px]"
              options={["무", "브로콜리", "당근", "양배추"]?.map((item) => ({ label: item, value: item }))}
              value={selectedPummok}
              onChange={(value: string) => setSelectedPummok(value)}
              size="large"
            />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="grid h-full gap-5 [grid-template-columns:2.4fr_5.0fr_2.6fr]">
            <KeyProductionStats pummok={selectedPummok} tradeData={tradeData} />
            <MarketTrendsTable pummok={selectedPummok} data={marketTableData} />
            <PriceQuantitySummary tradeData={tradeData} marketData={marketData} />
          </div>
          <div className="flex max-h-[650px] gap-5">
            <MonthlyPriceTrendChart pummok={selectedPummok} tradeChartData={tradeChartData} />
            <RegionPriceQuantity marketTradeRatioTableData={marketTradeRatioTableData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropTradeInfo;
