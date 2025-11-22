import InsightCards from "./InsightCards";
import FarmPopulationChart from "~/pages/JejuAgricultureInData/reports/FarmPopulation/FarmPopulationChart";
import AgeDistributionChart from "~/pages/JejuAgricultureInData/reports/FarmPopulation/AgeDistributionChart";
import AnimatedPopulationPyramid from "./AnimatedPopulationPyramid";

export interface InsightItem {
  title: string;
  description: string;
  url?: string;
  chart?: React.ReactNode;
}

const InsightsSection = () => {
  const data: InsightItem[] = [
    {
      title: "제주 농가 수 및 농가인구 변화",
      description:
        "지난 30년간 제주 지역의 농가 인구와 농가 수는 지속적인 감소 추세를 보여 왔다. 통계에 따르면 1993년에는 151,350명이던 농가 인구가 2023년에는 72,985명으로 줄어들며 약 71%라는 급격한 감소율을 기록하였다.",
      url: "/jeju-agri/detail/1",
      chart: <FarmPopulationChart tickFontSize={13} />,
    },
    {
      title: "제주 농업의 생산가능인구 구성 변화",
      description:
        "생산가능 인구 구성 측면에서 세대별 비중 변화가 뚜렷하게 나타난다. 0세부터 14세까지의 유소년 인구는 1970년 전체 인구의 43%를 차지했으나, 이후 지속적으로 감소하여 2023년에는 6%로 급감하였다.",
      url: "/jeju-agri/detail/2",
      chart: <AgeDistributionChart tickFontSize={13} />,
    },
    {
      title: "제주 농가인구의 연령 피라미드 변화",
      description:
        "지난 34년간 제주 지역의 농가인구 구조는 급격한 변화를 겪어왔다. 1990년대 초반만 해도 상대적으로 균형잡힌 연령 분포를 보였던 제주 농가인구는 2024년 현재 전형적인 역피라미드 구조로 변화하였다.",
      url: "/jeju-agri/detail/11",
      // chart: <img src={populationPyramid} alt="인구피라미드" className="h-[95%] w-full" />,
      chart: <AnimatedPopulationPyramid />,
    },
  ];

  return (
    <div className="flex min-h-[530px] w-full items-center overflow-hidden bg-[#E2EEFC]">
      <div className="relative mx-auto flex h-full w-full max-w-[1300px] flex-col items-center gap-8 px-16 py-20 2xl:max-w-[1400px] 2xl:pb-28 3xl:max-w-[1600px] 4xl:max-w-[1900px]">
        <div className="flex w-full flex-col gap-2">
          <span className="text-[36px] font-semibold">데이터로 본 제주 농업</span>
          <div className="text-[20px] text-[#4a4a4a]">
            제주의 농업, 데이터로 읽고 흐름으로 이해합니다.
            <br />
            인구, 경제, 생산 등 제주 농업의 과거와 현재를 한눈에 확인해보세요.
          </div>
        </div>

        <div className="z-50 flex w-full gap-6">
          {data.map((item) => (
            <InsightCards key={item.title} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsightsSection;
