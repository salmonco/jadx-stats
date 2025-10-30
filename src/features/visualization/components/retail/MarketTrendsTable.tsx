import { useRef } from "react";
import { LeftOutlined, LoadingOutlined, RightOutlined } from "@ant-design/icons";
import { StatsSummaryMarketTable, MarketPriceData } from "~/services/types/statsTypes";
import { formatData, gradeAveragePriceUnit } from "~/pages/home/MarketTrendsSection";
import { Carousel, Spin } from "antd";

const REGION_ORDER = ["서울", "인천", "경기", "전북 강원", "충북", "대전 충남", "광주 전남", "대구 경북", "부산 울산"];

const MarketTrendsTable = ({ pummok, data }: { pummok: string; data: StatsSummaryMarketTable }) => {
  const carouselRef = useRef<any>(null);

  // 데이터 4개씩 나누기
  const splitMarkets = (markets: MarketPriceData[]) => {
    const result = [];
    for (let i = 0; i < markets.length; i += 4) {
      result.push(markets.slice(i, i + 4));
    }
    return result;
  };

  function sortRegionObject(data: Record<string, MarketPriceData[]>): Record<string, MarketPriceData[]> {
    if (!data) return {};

    const sorted: Record<string, MarketPriceData[]> = {};

    for (const region of REGION_ORDER) {
      if (data[region]) {
        sorted[region] = data[region];
      }
    }

    // 원본에 있지만 REGION_ORDER에 없는 지역도 뒤에 붙임 (예외 처리용)
    for (const key of Object.keys(data)) {
      if (!sorted[key]) {
        sorted[key] = data[key];
      }
    }

    return sorted;
  }

  const sortedEntries = sortRegionObject(data);

  // 캐러셀 아이템 생성
  const carouselItems = sortedEntries
    ? Object.entries(sortedEntries).flatMap(([region, markets]) => {
        const splitData = splitMarkets(markets);
        return splitData.map((marketGroup, groupIndex) => (
          <div key={`${region}-${groupIndex}`} className="h-full w-full rounded-xl bg-[#43516D] text-[#cdd3e2]">
            <div className="flex flex-col rounded-lg px-2 3xl:gap-2">
              <span className="text-[18px] font-medium text-[#fff]">
                지역 도매시장별 가격 현황 - {region?.replace(" ", "/")}
                <span className="text-[18px]">{splitData.length > 1 && `(${groupIndex + 1}/${splitData.length})`}</span>
              </span>
              <table className="w-full table-auto border-collapse text-center text-sm">
                <colgroup>
                  <col width="12%" />
                  <col width="14%" />
                  <col width="20%" />
                  <col width="14%" />
                  <col width="14%" />
                  <col width="16%" />
                </colgroup>
                <thead>
                  <tr className="border-b border-[#ffffff] bg-[#43516D] text-white">
                    <th className="py-[8px] font-semibold 3xl:py-[11.5px]">시장명</th>
                    <th className="py-[8px] font-semibold 3xl:py-[11.5px]">평균가격</th>
                    <th className="py-[8px] font-semibold 3xl:py-[11.5px]">대표 등급 가격</th>
                    <th className="py-[8px] font-semibold 3xl:py-[11.5px]">전주</th>
                    <th className="py-[8px] font-semibold 3xl:py-[11.5px]">전년동월</th>
                    <th className="py-[8px] font-semibold 3xl:py-[11.5px]">제주산 반입량</th>
                  </tr>
                </thead>
                <tbody>
                  {marketGroup.map((market: MarketPriceData, idx: number) => (
                    <tr key={idx} className="border-b border-[#7387a6] text-white">
                      <td className="py-[8px] 3xl:py-[11.5px]">{market.whlsl_mrkt_nm}</td>
                      <td className="py-[8px] 3xl:py-[11.5px]">{market.target_average_price ? formatData(market.target_average_price) + "원/kg" : "-"}</td>
                      <td className="py-[8px] 3xl:py-[11.5px]">
                        {market.target_grade_price ? formatData(market.target_grade_price) + "원" + `(${gradeAveragePriceUnit[pummok]})` : "-"}
                      </td>
                      <td className="py-[8px] 3xl:py-[11.5px]">{market.week_average_price ? formatData(market.week_average_price) + "원/kg" : "-"}</td>
                      <td className="py-[8px] 3xl:py-[11.5px]">{market.year_average_price ? formatData(market.year_average_price) + "원/kg" : "-"}</td>
                      <td className="py-[8px] 3xl:py-[11.5px]">{market.jeju_total_weight ? formatData(market.jeju_total_weight, true) + "톤" : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ));
      })
    : [];

  return (
    <div className="w-full min-w-0 rounded-lg bg-[#43516D] py-3">
      {data ? (
        <Carousel
          ref={carouselRef}
          dots={false}
          arrows={true}
          draggable
          swipeToSlide
          infinite={true}
          autoplay={false}
          autoplaySpeed={5000}
          nextArrow={<RightOutlined />}
          prevArrow={<LeftOutlined />}
          className="[&_.slick-slide]:px-2.5"
        >
          {carouselItems.length > 0 ? (
            carouselItems
          ) : (
            <div className="h-[270px] w-full rounded-xl bg-[#43516D] p-2">
              <div className="flex h-full items-center justify-center">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 76 }} spin />} />
              </div>
            </div>
          )}
        </Carousel>
      ) : (
        <div className="flex h-full items-center justify-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 76 }} spin />} />
        </div>
      )}
    </div>
  );
};

export default MarketTrendsTable;
