import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import statsApi from "~/services/apis/statsApi";
import { StatsSummaryGeneral } from "~/services/types/statsTypes";
import AnimatedCounter from "~/components/AnimateCounter";
import KeyIndicatorsChart from "~/pages/home/KeyIndicatorsChart";
import { Button, Carousel } from "antd";
import { LeftOutlined, LinkOutlined, RightOutlined } from "@ant-design/icons";
import { PlayIcon, PauseIcon, Info } from "lucide-react";
import banner from "~/assets/home-banner.png";
import people from "~/assets/people.png";
import houseTree from "~/assets/house-tree.png";
import tree from "~/assets/tree.png";
import calculator from "~/assets/calculator.png";
import banknote from "~/assets/banknote.png";
import coin from "~/assets/coin.png";
import { useNavigate } from "@tanstack/react-router";

const OverviewSection = () => {
  const carouselRef = useRef<any>(null);
  const [autoplay, setAutoplay] = useState(true);
  const navigate = useNavigate();

  const toggleAutoplay = () => {
    setAutoplay((prev) => !prev);
  };

  const { data } = useQuery<StatsSummaryGeneral>({
    queryKey: ["statsSummaryGeneral"],
    queryFn: () => statsApi.getStatsSummaryGeneral(2024),
  });

  const getLatestValue = (field: keyof (typeof data.data)[0]) => {
    if (!data?.data) return 0;

    // null이 아닌 최신 데이터 찾기
    const sortedData = [...data.data].sort((a, b) => b.year - a.year);
    for (const item of sortedData) {
      if (item[field] !== null) {
        return item[field];
      }
    }
    return 0;
  };

  const getChangeRate = (field: keyof (typeof data.data)[0]) => {
    if (!data?.data) return 0;

    // null이 아닌 데이터만 필터링하고 연도 내림차순 정렬
    const validData = data.data.filter((item) => item[field] !== null).sort((a, b) => b.year - a.year);

    if (validData.length < 2) return 0;

    const currentValue = validData[0][field] as number;
    const previousValue = validData[1][field] as number;

    if (previousValue === 0) return 0;

    // 증감률 계산 ((현재값 - 이전값) / 이전값 * 100)
    return Number((((currentValue - previousValue) / previousValue) * 100).toFixed(1));
  };

  const getTrendData = (field: keyof (typeof data.data)[0]) => {
    if (!data?.data) return [];

    // 오름차순 정렬
    const validData = data.data.filter((item) => item[field] !== null).sort((a, b) => a.year - b.year);

    return validData.map((item) => ({
      year: item.year,
      value: item[field] ?? 0,
    }));
  };

  const getLatestYear = (field: keyof (typeof data.data)[0]) => {
    if (!data?.data) return null;

    // null이 아닌 최신 데이터의 년도 찾기
    const sortedData = [...data.data].sort((a, b) => b.year - a.year);
    for (const item of sortedData) {
      if (item[field] !== null) {
        return item.year.toString();
      }
    }
    return null;
  };

  const indicators = [
    {
      icon: people,
      label: "농가인구",
      url: "/stats/bsc/frmhs/ppltn",
      unit: "명",
      value: getLatestValue("farmer_count"),
      change: getChangeRate("farmer_count"),
      trend: getTrendData("farmer_count"),
      year: getLatestYear("farmer_count"),
    },
    {
      icon: houseTree,
      label: "농가 수",
      url: "/stats/bsc/frmhs/ppltn",
      unit: "가구",
      value: getLatestValue("farmhouse_count"),
      change: getChangeRate("farmhouse_count"),
      trend: getTrendData("farmhouse_count"),
      year: getLatestYear("farmhouse_count"),
    },
    {
      icon: tree,
      label: "경지면적",
      url: "/stats/bsc/frmlnd/area",
      unit: "ha",
      value: getLatestValue("cultivation_area"),
      change: getChangeRate("cultivation_area"),
      trend: getTrendData("cultivation_area"),
      year: getLatestYear("cultivation_area"),
    },
    {
      icon: calculator,
      label: "농업총수입",
      url: "/stats/bsc/ecnm/grsincm",
      unit: "천원",
      value: getLatestValue("total_farming_income"),
      change: getChangeRate("total_farming_income"),
      trend: getTrendData("total_farming_income"),
      year: getLatestYear("total_farming_income"),
    },
    {
      icon: banknote,
      label: "농업소득",
      url: "/stats/bsc/ecnm/earn",
      unit: "천원",
      value: getLatestValue("farming_income"),
      change: getChangeRate("farming_income"),
      trend: getTrendData("farming_income"),
      year: getLatestYear("farming_income"),
    },
    {
      icon: coin,
      label: "농가판매가격지수",
      unit: "",
      value: getLatestValue("farming_sales_index"),
      change: getChangeRate("farming_sales_index"),
      trend: getTrendData("farming_sales_index"),
      year: getLatestYear("farming_sales_index"),
    },
    {
      icon: coin,
      label: "농가구입가격지수",
      unit: "",
      value: getLatestValue("farming_purchase_index"),
      change: getChangeRate("farming_purchase_index"),
      trend: getTrendData("farming_purchase_index"),
      year: getLatestYear("farming_purchase_index"),
    },
  ];

  const getPrevYearValue = (trend: { year: number; value: number }[]) => (trend.length >= 2 ? trend[trend.length - 2].value : null);

  return (
    <div className="relative flex min-h-[530px] w-full items-center overflow-hidden bg-white">
      <img src={banner} alt="background" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[#002872] opacity-[80%]" />
      <div className="relative mx-auto flex w-full max-w-[1400px] px-16 py-20 3xl:max-w-[1600px] 4xl:max-w-[1900px]">
        <div className="z-10 flex w-full flex-col gap-10">
          <div className="ml-1 flex gap-6">
            <div className="flex flex-col gap-2">
              <div className="text-4xl font-semibold text-white">제주 농업 통계 시스템</div>
              <div className="text-lg text-[#ededed]">제주 농업의 주요 통계 지표와 주제별 지도를 확인하세요.</div>
            </div>
          </div>

          <div className="flex w-full justify-between">
            <div className="relative flex w-[43%] max-w-[570px] flex-col justify-between py-1.5 3xl:w-[40%]">
              <div className="absolute right-[-2px] top-[-26px] flex items-center gap-[3px] text-[14px] text-[#e8e8e8]">
                <Info strokeWidth={2} size={14} className="mb-[2px]" /> 전년대비 증감
              </div>
              {indicators?.map((item, index) => {
                return (
                  <div key={index} className="flex items-center justify-between gap-2 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-fit rounded-full bg-white bg-opacity-25 p-2">
                        <img src={item?.icon} className="h-[15px] w-[15px]" />
                      </div>
                      <div className="flex w-[240px] items-center whitespace-nowrap text-[18px]">
                        {item?.year && <div className="mr-[4px]">(’{item?.year?.slice(-2)})</div>}
                        {item?.label}
                        {(item?.label === "농가판매가격지수" || item?.label === "농가구입가격지수") && <div className="ml-1 text-[15px] text-[#ededed]">(2020=100)</div>}
                        {item?.url && (
                          <Button type="link" onClick={() => navigate({ to: item?.url })} className="ml-[-10px]">
                            <LinkOutlined className="mb-[2px] text-[#ededed]" size={14} />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div>
                      -----<span className="hidden 3xl:inline">----</span>
                    </div>
                    <div className="flex w-[85px] items-center gap-1 whitespace-nowrap text-[19px]">
                      <AnimatedCounter start={0} end={item?.value} />
                      <div className="ml-[2px] text-[14px] text-[#ededed]">{item?.unit ? `(${item?.unit})` : ""}</div>
                    </div>
                    <div
                      className={`flex w-[88px] items-center gap-[4px] rounded-full border px-[12px] py-[2.5px] text-[16px] ${
                        item?.change < 0 ? "border-[#84BCFF] bg-[#A0D3FF]/15 text-white" : "border-[#EA002C] bg-[#FF93A7]/15 text-white"
                      }`}
                    >
                      <span className={`text-[15px] ${item?.change < 0 ? "text-[#A0D3FF]" : "text-[#FF93A7]"}`}>{item?.change > 0 ? "▲" : "▼"}</span>
                      <div className="flex-1 text-center">
                        <span>{Math.abs(item?.change)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative w-[57%] pl-10 3xl:w-[60%]">
              <div className="absolute right-[10px] top-[-50px] z-10 flex items-center gap-2">
                <button
                  onClick={() => carouselRef.current?.prev()}
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#32579D] p-1 text-white shadow transition-all duration-200 hover:scale-105 hover:bg-[#4A6FB5] active:scale-95"
                >
                  <LeftOutlined className="text-[16px]" />
                </button>
                <button
                  onClick={toggleAutoplay}
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#32579D] p-1 text-white shadow transition-all duration-200 hover:scale-105 hover:bg-[#4A6FB5] active:scale-95"
                >
                  {autoplay ? <PauseIcon className="w-[18px] stroke-[1.5]" /> : <PlayIcon className="w-[18px] stroke-[1.5]" />}
                </button>
                <button
                  onClick={() => carouselRef.current?.next()}
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#32579D] p-1 text-white shadow transition-all duration-200 hover:scale-105 hover:bg-[#4A6FB5] active:scale-95"
                >
                  <RightOutlined className="text-[16px]" />
                </button>
              </div>

              <Carousel ref={carouselRef} dots={false} arrows={false} draggable swipeToSlide infinite={true} autoplay={autoplay} autoplaySpeed={5000}>
                {Array.from({ length: 4 }).map((_, slideIdx) => (
                  <div key={slideIdx}>
                    <div className="mx-2.5 grid grid-cols-2 gap-5">
                      {indicators.slice(slideIdx * 2, slideIdx === 3 ? slideIdx * 2 + 1 : slideIdx * 2 + 2).map((item, idx) => (
                        <div key={idx} className="w-full rounded-xl bg-[#001E58] p-4">
                          <div className="flex flex-col items-center gap-3 rounded-lg px-4 py-5">
                            <div className="flex flex-col items-center gap-1 text-white">
                              <span className="flex items-center gap-1 text-[20px]">
                                {item?.label}
                                {(item?.label === "농가판매가격지수" || item?.label === "농가구입가격지수") && (
                                  <div className="text-[17px] text-[#ededed]">(2020=100)</div>
                                )}
                              </span>
                              <span className="text-[34px] font-semibold text-[#81DDFF]">
                                {Math.round(item.value)?.toLocaleString()}
                                <span className="ml-1 text-[20px] font-normal">{item.unit}</span>
                              </span>
                              <div className="flex items-center gap-1">
                                <span className="text-[16px]">
                                  <span className="mr-[4px] text-[#ededed]">(전년)</span>
                                  {(() => {
                                    const prev = getPrevYearValue(item.trend);
                                    return prev !== null ? Math.round(prev).toLocaleString() : "-";
                                  })()}
                                  {item.unit}
                                </span>
                                <div
                                  className={`ml-[8px] flex w-[84px] items-center gap-[4px] rounded-full border px-[10px] py-[2px] text-[16px] ${
                                    item?.change < 0 ? "border-[#84BCFF] bg-[#A0D3FF]/15 text-white" : "border-[#EA002C] bg-[#FF93A7]/15 text-white"
                                  }`}
                                >
                                  <span className={`text-[15px] ${item?.change < 0 ? "text-[#A0D3FF]" : "text-[#FF93A7]"}`}>{item?.change > 0 ? "▲" : "▼"}</span>
                                  <div className="flex-1 text-center">
                                    <span>{Math.abs(item?.change)}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <KeyIndicatorsChart trend={item.trend} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;
