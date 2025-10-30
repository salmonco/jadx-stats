import { Divider, Tooltip } from "antd";
import { formatData, gradeAveragePriceUnit } from "~/pages/home/MarketTrendsSection";
import { TradeStats } from "~/pages/visualization/retail/CropTradeInfo";

interface Props {
  pummok: string;
  tradeData: TradeStats;
}

const KeyProductionStats = ({ pummok, tradeData }: Props) => {
  const PriceChange = ({ value, tooltipContent }: { value: number | null; tooltipContent?: string }) => {
    if (value === null) return <span className="w-[60px] text-right 3xl:w-[68px]"></span>;

    const isPositive = value > 0;
    const arrow = isPositive ? "↑" : value < 0 ? "↓" : "-";
    const color = isPositive ? "#f86c6b" : value < 0 ? "#6099fd" : "#ccc";

    const valueStr = value?.toFixed(1).replace("-", "");

    return (
      <Tooltip title={`${tooltipContent}`} className="cursor-default">
        <span className={`flex w-[60px] justify-end text-right text-[14px] font-normal 3xl:w-[75px] 3xl:text-[16px]`} style={{ color }}>
          {valueStr}% {arrow}
        </span>
      </Tooltip>
    );
  };

  return (
    <div className="flex w-full flex-col gap-1.5 rounded-lg bg-[#43516D] p-4">
      <span className="text-[18px] font-medium text-white">가락시장 가격 현황</span>

      <div className="flex h-full flex-col justify-between">
        {/* 평균 가격 */}
        <div className="flex items-center justify-between">
          <span className="text-[15px]">평균 가격</span>
          <div className="flex items-center gap-[1px] text-[15px] font-semibold 3xl:text-[16px]">
            {formatData(tradeData?.target_average_price)}
            <span className="text-[14px] font-normal 3xl:text-[15px]">원/kg</span>
            <PriceChange value={null} tooltipContent="전일대비" />
          </div>
        </div>

        <Divider className="mb-[3px] mt-[0px] border-[#f9f9f9]" />

        {/* 전주 */}
        <div className="ml-[14px] flex items-center justify-between">
          <span className="text-[15px]">전일</span>
          <div className="flex items-center gap-[1px] text-[15px] font-semibold 3xl:text-[16px]">
            {formatData(tradeData?.previous_day_garak_average_price)}
            <span className="text-[14px] font-normal 3xl:text-[15px]">원/kg</span>
            <PriceChange value={tradeData?.previous_day_price_change_rate} tooltipContent="전일대비 평균 가격 증감율" />
          </div>
        </div>
        {/* 전주 */}
        <div className="ml-[14px] flex items-center justify-between">
          <span className="text-[15px]">전주</span>
          <div className="flex items-center gap-[1px] text-[15px] font-semibold 3xl:text-[16px]">
            {formatData(tradeData?.previous_week_garak_average_price)}
            <span className="text-[14px] font-normal 3xl:text-[15px]">원/kg</span>
            <PriceChange value={tradeData?.previous_week_price_change_rate} tooltipContent="전주대비 평균 가격 증감율" />
          </div>
        </div>
        {/* 전월 */}
        <div className="ml-[14px] flex items-center justify-between">
          <span className="text-[15px]">전월</span>
          <div className="flex items-center gap-[1px] text-[15px] font-semibold 3xl:text-[16px]">
            {formatData(tradeData?.previous_month_garak_average_price)}
            <span className="text-[14px] font-normal 3xl:text-[15px]">원/kg</span>
            <PriceChange value={tradeData?.previous_month_price_change_rate} tooltipContent="전월대비 평균 가격 증감율" />
          </div>
        </div>
        {/* 대표등급 가격 */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col 2xl:flex-row 2xl:gap-[4px]">
            <span className="text-[15px]">대표등급 가격</span>
            <span className="text-[14px] text-[#c5ccdd]">({gradeAveragePriceUnit[pummok]})</span>
          </div>
          <div className="flex items-center gap-[1px] text-[15px] font-semibold 3xl:text-[16px]">
            {formatData(tradeData?.target_garak_grade_price)}
            <span className="text-[14px] font-normal 3xl:text-[15px]">원</span>
            <PriceChange value={tradeData?.previous_garak_grade_price_change_rate} tooltipContent="전일대비 대표등급 가격 증감율" />
          </div>
        </div>
        {/* 제주산 반입량 */}
        <div className="flex items-center justify-between">
          <span className="text-[15px]">제주산 반입량</span>
          <div className="flex items-center gap-[1px] text-[15px] font-semibold 3xl:text-[16px]">
            {formatData(tradeData?.target_garak_jeju_weight, true)}
            <span className="text-[14px] font-normal 3xl:text-[15px]">톤</span>
            <PriceChange value={tradeData?.previous_garak_jeju_weight_change_rate} tooltipContent="전일대비 제주산 반입량 증감율" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyProductionStats;
