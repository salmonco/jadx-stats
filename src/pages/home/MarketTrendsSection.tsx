import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MarketTrendsChart from "~/pages/home/MarketTrendsChart";
import MarketTrendsTable from "~/pages/home/MarketTrendsTable";
import visualizationApi from "~/services/apis/visualizationApi";
import { StatsSummaryMarket, StatsSummaryMarketTable } from "~/services/types/statsTypes";
import statsApi from "~/services/apis/statsApi";
import { MonthlyComparisonData } from "~/pages/visualization/retail/CropTradeInfo";
import radish from "~/assets/radish.png";
import broccoli from "~/assets/broccoli.jpg";
import carrot from "~/assets/carrot.jpg";
import cabbage from "~/assets/cabbage.jpg";
// import mandarin from "~/assets/mandarin.jpg";
import { Info } from "lucide-react";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import { LinkOutlined, WarningOutlined } from "@ant-design/icons";

interface Item {
  name: string;
  image: string;
}

const items: Item[] = [
  { name: "무", image: radish },
  { name: "브로콜리", image: broccoli },
  { name: "당근", image: carrot },
  { name: "양배추", image: cabbage },
  // { name: "감귤", image: mandarin },
];

const formatChangeRate = (value?: number | null) => (typeof value === "number" ? `${value.toFixed(1)}%` : "-");

export const formatData = (value?: number | null, isWeight = false) => {
  if (!value) return "-";
  if (isWeight) return (value / 1000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return value?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

export const gradeAveragePriceUnit = {
  무: "상/20kg",
  브로코리: "상/8kg",
  브로콜리: "상/8kg",
  당근: "상/20kg",
  양배추: "상/8kg",
};

const MarketTrendsSection = () => {
  const yesterday = dayjs().subtract(1, "day");
  const defaultTargetDate = yesterday.day() === 0 ? yesterday.subtract(1, "day") : yesterday;

  const [selectedDate, setSelectedDate] = useState<string>(defaultTargetDate.format("YYYY-MM-DD"));
  const [selectedItem, setSelectedItem] = useState<Item>(items[0]);

  const { data: marketData, isLoading: isMarketLoading } = useQuery<StatsSummaryMarket>({
    queryKey: ["statsSummaryMarket", selectedDate, selectedItem],
    queryFn: () => statsApi.getStatsSummaryMarket(selectedDate, selectedItem?.name),
    enabled: !!selectedItem,
  });

  const { data: marketChartData } = useQuery<MonthlyComparisonData[]>({
    queryKey: ["marketStats", selectedDate, selectedItem],
    queryFn: () => visualizationApi.getHibernationVegetableMarketTradeChart(selectedDate, selectedItem?.name),
    enabled: !!selectedItem,
  });

  const { data: marketTableData } = useQuery<StatsSummaryMarketTable>({
    queryKey: ["statsSummaryMarketTable", selectedDate, selectedItem],
    queryFn: () => statsApi.getStatsSummaryMarketTable(selectedDate, selectedItem?.name),
    enabled: !!selectedItem,
  });

  const StatsCard = ({ title, data, rate, unit, isLoading }: { title: string; data: any; rate: number; unit: string; isLoading: boolean }) => {
    return (
      <div className="flex w-full flex-col gap-2 rounded-xl bg-white p-[15px] px-[16px]">
        <span className="text-[18px] font-medium">{title}</span>
        <div className="flex items-center justify-between">
          <div
            className={`min-w-[66px] rounded-md px-2 py-1 text-center text-[16px] text-white ${
              rate == null ? "bg-gray-400" : rate > 0 ? "bg-red-500" : rate < 0 ? "bg-blue-500" : "bg-gray-400"
            }`}
          >
            {isLoading ? "-" : formatChangeRate(rate)}
          </div>
          <span className="text-[22px] font-bold">
            {isLoading ? "-" : formatData(data, unit === "톤")}
            <span className="ml-[1px] text-[18px] font-medium">{unit}</span>
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-[530px] w-full items-center bg-white">
      <div className="relative mx-auto flex h-full w-full max-w-[1300px] flex-col gap-4 px-16 py-20 2xl:max-w-[1400px] 3xl:max-w-[1600px] 4xl:max-w-[1900px]">
        <div className="flex flex-col gap-2">
          <div className="mb-2 rounded-lg border-l-4 border-[#43516D] bg-slate-100 px-4 py-2.5 shadow-sm">
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

          <span className="text-3xl font-semibold">도매시장 실시간 가격 및 거래량 동향</span>
          <span className="text-xl text-[#4a4a4a]">제주 농산물의 실시간 가격및 거래 동향을 확인하세요.</span>
        </div>

        <div className="mb-5 mt-2 flex gap-5">
          {items.map((item) => (
            <button
              key={item.name}
              onClick={() => setSelectedItem(item)}
              className={`w-[120px] rounded-full py-2.5 text-center text-[20px] transition-all ${selectedItem === item ? "border border-[#337EFE] bg-[#e3ecfc] text-[#337EFE]" : "border border-[#cbcbcb] bg-white text-[#636363]"} `}
            >
              <span className="text-[18px]">{item.name === "브로코리" ? "브로콜리" : item.name}</span>
            </button>
          ))}
        </div>

        <div className="flex w-full gap-5">
          <div className="flex w-[33%] flex-col items-center gap-4 rounded-lg bg-[#E2EEFC] p-6">
            <DatePicker
              value={dayjs(selectedDate)}
              onChange={(date) => setSelectedDate(date?.format("YYYY-MM-DD"))}
              disabledDate={(current) => {
                // 오늘, 미래 날짜, 일요일 선태 불가
                const isAfterYesterday = current && current >= dayjs().startOf("day");
                const isSunday = current && current.day() === 0;
                return isAfterYesterday || isSunday;
              }}
              size="large"
              className="my-[2px] border-none"
            />
            <div className="flex flex-col items-center">
              <img src={selectedItem?.image} alt="radish" className="my-1 h-[138px] w-[138px] rounded-full" />
              <span className="mt-[8px] text-[20px] font-medium">{selectedItem?.name === "브로코리" ? "브로콜리" : selectedItem?.name}</span>
            </div>
            <div className="relative flex w-full flex-col gap-4">
              <StatsCard
                title="가락시장 대표등급 가격"
                data={marketData?.garak_grade_price}
                rate={marketData?.garak_grade_price_change_rate}
                unit={`원 (${gradeAveragePriceUnit[selectedItem?.name]})`}
                isLoading={isMarketLoading}
              />

              <StatsCard
                title="가락시장 평균가"
                data={marketData?.garak_average_price}
                rate={marketData?.garak_average_price_change_rate}
                unit="원/kg"
                isLoading={isMarketLoading}
              />

              <StatsCard
                title="전국 평균가"
                data={marketData?.total_average_price}
                rate={marketData?.total_average_price_change_rate}
                unit="원/kg"
                isLoading={isMarketLoading}
              />

              <StatsCard title="제주산 총 반입량" data={marketData?.jeju_weight} rate={marketData?.jeju_weight_change_rate} unit="톤" isLoading={isMarketLoading} />

              <StatsCard title="전국 거래량" data={marketData?.total_weight} rate={marketData?.total_weight_change_rate} unit="톤" isLoading={isMarketLoading} />

              <div className="absolute top-[-28px] flex w-full items-center gap-[3px] text-[14px] text-gray-700">
                <Info strokeWidth={2} size={14} className="mb-[2px]" /> 전일대비 증감
              </div>
            </div>
          </div>
          <div className="flex w-[67%] flex-col gap-5 rounded-lg bg-[#E2EEFC]">
            <div className="p-6 pb-0">
              <p className="mb-2 text-[20px] font-semibold">전국 {selectedItem?.name === "브로코리" ? "브로콜리" : selectedItem?.name} 가격 (월평균)</p>
              <MarketTrendsChart data={marketChartData} />
            </div>
            <div className="px-3.5 pb-6 pt-0">
              <p className="mb-2 px-2.5 text-[20px] font-semibold">도매시장 {selectedItem?.name === "브로코리" ? "브로콜리" : selectedItem?.name} 가격</p>
              <MarketTrendsTable data={marketTableData} pummok={selectedItem?.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketTrendsSection;
