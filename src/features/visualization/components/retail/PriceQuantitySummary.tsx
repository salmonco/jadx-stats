import { Package, DollarSign, TrendingUp, TrendingDown, Truck } from "lucide-react";
import { formatData } from "~/pages/home/MarketTrendsSection";
import { TradeStats } from "~/pages/visualization/retail/CropTradeInfo";
import { StatsSummaryMarket } from "~/services/types/statsTypes";

interface Props {
  tradeData: TradeStats;
  marketData: StatsSummaryMarket;
}

const PriceQuantitySummary = ({ tradeData, marketData }: Props) => {
  return (
    <div className="flex w-full flex-col justify-between rounded-lg bg-[#43516D] p-5 px-4">
      {/* 전국 평균 가격 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 3xl:gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2e6ddb]">
            <DollarSign size={14} />
          </div>
          <span className="text-[15px]">전국 평균 가격</span>
        </div>
        <div className="flex items-center gap-2 text-[16px] font-semibold">
          {tradeData?.stats?.average?.average_price != null ? (
            <div className="flex items-center gap-0.5">
              {formatData(tradeData.stats.average.average_price)}
              <span className="text-[14px] font-normal 3xl:text-[15px]">원/kg</span>
            </div>
          ) : (
            <span className="text-[#bbbbbb]">-</span>
          )}
        </div>
      </div>
      {/* 전국 최고 가격 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 3xl:gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2e6ddb]">
            <TrendingUp size={14} />
          </div>
          <span className="text-[15px]">전국 최고 가격</span>
        </div>
        <div className="flex items-center gap-1 text-[16px] font-semibold">
          {tradeData?.stats?.highest?.average_price != null ? (
            <div className="flex items-center gap-0.5">
              <span className="pr-[1px] text-[14px] font-normal">
                {tradeData?.stats?.highest?.region_name ? `(${tradeData.stats.highest.region_name?.replace(" ", "/")})` : ""}
              </span>
              {formatData(tradeData.stats.highest.average_price)}
              <span className="text-[14px] font-normal 3xl:text-[15px]">원/kg</span>
            </div>
          ) : (
            <span className="text-[#bbbbbb]">-</span>
          )}
        </div>
      </div>
      {/* 전국 최저 가격 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 3xl:gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#de3232]">
            <TrendingDown size={14} />
          </div>
          <span className="text-[15px]">전국 최저 가격</span>
        </div>
        <div className="flex items-center gap-2 text-[16px] font-semibold">
          {tradeData?.stats?.lowest?.average_price != null ? (
            <div className="flex items-center gap-0.5">
              <span className="pr-[1px] text-[14px] font-normal">
                {tradeData?.stats?.lowest?.region_name ? `(${tradeData.stats.lowest.region_name?.replace(" ", "/")})` : ""}
              </span>
              {formatData(tradeData.stats.lowest.average_price)}
              <span className="text-[14px] font-normal 3xl:text-[15px]">원/kg</span>
            </div>
          ) : (
            <span className="text-[#bbbbbb]">-</span>
          )}
        </div>
      </div>
      {/* 전국 총 거래량 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 3xl:gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#de3232]">
            <Truck size={14} />
          </div>
          <span className="text-[15px]">전국 총 거래량</span>
        </div>
        <div className="flex items-center gap-2 text-[16px] font-semibold">
          {marketData?.total_weight != null ? (
            <div className="flex items-center gap-0.5">
              {formatData(marketData.total_weight, true)}
              <span className="text-[14px] font-normal 3xl:text-[15px]">톤</span>
            </div>
          ) : (
            <span className="text-[#bbbbbb]">-</span>
          )}
        </div>
      </div>
      {/* 제주산 총 반입량 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 3xl:gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#de3232]">
            <Package size={14} />
          </div>
          <span className="text-[15px]">제주산 총 반입량</span>
        </div>
        <div className="flex items-center gap-2 text-[16px] font-semibold">
          {marketData?.jeju_weight != null ? (
            <div className="flex items-center gap-0.5">
              {formatData(marketData.jeju_weight, true)}
              <span className="text-[14px] font-normal 3xl:text-[15px]">톤</span>
            </div>
          ) : (
            <span className="text-[#bbbbbb]">-</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceQuantitySummary;
