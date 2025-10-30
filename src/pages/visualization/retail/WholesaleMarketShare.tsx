import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import visualizationApi from "~/services/apis/visualizationApi";
import MarketPriceLineChart from "~/features/visualization/components/retail/MarketPriceLineChart";
import MarketQuantityBarLineChart from "~/features/visualization/components/retail/MarketQuantityBarLineChart";
import MarketQuantityPieChart from "~/features/visualization/components/retail/MarketQuantityPieChart";
import MarketShare from "~/features/visualization/components/retail/MarketShare";
import { options } from "~/features/visualization/utils/marketDataUilts";
import InfoTooltip from "~/components/InfoTooltip";
import { infoTooltipContents } from "~/utils/InfoTooltipContents";
import { Select } from "antd";

// 출하물량
export interface MarketQuantityData {
  amt: number; // 거래량
  intrvl: string; // 기간
  jeju_yn: boolean; // 제주 여부
  lhldy_yn: boolean; // 공휴일 여부
  mm_strt: number; // 시작 월
  rgn_nm: string; // 지역명
  vrty_clsf_nm: string; // 품종 분류명
  wght: number; // 중량
  wk_id: string; // 주차 ID
  wk_se: string; // 주차 구분
  yr: number; // 연도
  yr_strt: number; // 시작 연도
}

// 가격
export interface MarketPriceData {
  intrvl: string; // 기간
  lhldy_yn: boolean; // 공휴일 여부
  mm_strt: number; // 시작 월
  prc: number; // 가격
  vrty_clsf_nm: string; // 품종 분류명
  wk_id: string; // 주차 ID
  wk_se: string; // 주차 구분
  yr: number; // 연도
  yr_strt: number; // 시작 연도
}

export interface MarketStatsData {
  data: {
    yr: number;
    rgn_dlng_stts_amt: MarketQuantityData[];
    rgn_dlng_stts_prc: MarketPriceData[];
  };
}

const WholesaleMarketShare = () => {
  const [selectedTargetYear, setSelectedTargetYear] = useState<number>(2024);
  const [selectedTargetMonth, setSelectedTargetMonth] = useState<number>(1);
  const [selectedPummok, setSelectedPummok] = useState<string>(options[0].value);

  const { data: marketStatsData, isLoading } = useQuery({
    queryKey: ["marketStats", selectedTargetYear],
    initialData: null,
    queryFn: () => visualizationApi.getMarketStatsByYear(selectedTargetYear),
  });

  return (
    <div className="flex min-h-full flex-col gap-4 p-5">
      <div className="flex flex-1 flex-col gap-5 rounded-lg bg-[#37445E] p-5 text-white">
        <div className="flex items-center gap-6 rounded-lg bg-[#43516D] px-5 py-3">
          <div className="flex items-center gap-2.5">
            <p className="text-2xl font-semibold">도매시장 출하 점유율</p>
            <InfoTooltip content={infoTooltipContents["도매시장 출하 점유율"]} />
          </div>
          <div className="flex items-center gap-2.5">
            <p className="text-[20px] font-semibold text-white">연도</p>
            <Select
              className="w-[140px]"
              options={[2024, 2023, 2022, 2021, 2020].map((year) => ({ label: `${year}년`, value: year }))}
              value={selectedTargetYear}
              onChange={(value: number) => setSelectedTargetYear(value)}
              size="large"
            />
          </div>
          <div className="flex items-center gap-2.5">
            <p className="text-[20px] font-semibold text-white">월</p>
            <Select
              className="w-[140px]"
              options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => ({ label: `${month}월`, value: month }))}
              value={selectedTargetMonth}
              onChange={(value: number) => setSelectedTargetMonth(value)}
              size="large"
            />
          </div>
          <div className="flex items-center gap-2.5">
            <p className="text-[20px] font-semibold text-white">품목</p>
            <Select className="w-[140px]" options={options} value={selectedPummok} onChange={(value: string) => setSelectedPummok(value)} size="large" />
          </div>
        </div>
        <div className="flex flex-1 gap-5">
          <div className="flex flex-[6.7] flex-col gap-5 rounded-lg 3xl:flex-[6.5]">
            <div className="min-h-[341px]">
              <MarketQuantityBarLineChart marketQuantityData={marketStatsData?.data?.rgn_dlng_stts_amt} selectedPummok={selectedPummok} />
            </div>
            <div className="min-h-[341px]">
              <MarketPriceLineChart priceData={marketStatsData?.data?.rgn_dlng_stts_prc} selectedPummok={selectedPummok} />
            </div>
          </div>
          <div className="flex flex-[3.3] flex-col gap-5 3xl:flex-[3.5]">
            <div className="flex-[6]">
              <MarketShare
                quantityData={marketStatsData?.data?.rgn_dlng_stts_amt}
                selectedPummok={selectedPummok}
                selectedTargetYear={selectedTargetYear}
                selectedTargetMonth={selectedTargetMonth}
              />
            </div>
            <div className="flex-[4] rounded-lg bg-[#43516D]">
              <MarketQuantityPieChart
                quantityData={marketStatsData?.data?.rgn_dlng_stts_amt}
                selectedPummok={selectedPummok}
                selectedTargetYear={selectedTargetYear}
                selectedTargetMonth={selectedTargetMonth}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WholesaleMarketShare;
