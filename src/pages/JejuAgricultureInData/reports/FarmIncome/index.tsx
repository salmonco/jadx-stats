import FarmIncomeTrendChart from "./FarmIncomeTrendChart";
import IncomeCompositionChart from "./IncomeCompositionChart";
import IncomeGrowthChart from "./IncomeGrowthChart";
import IncomeComparisonChart from "./IncomeComparisonChart";
import { TrendingUp, BarChart3, PieChart } from "lucide-react";

export default function JejuFarmIncomeReport() {
  return (
    <div className="relative min-h-screen text-lg">
      <section className="mb-8 rounded-lg border border-[#c2dfff] bg-[#e5f1ff] p-8 pb-6 shadow-sm">
        <h3 className="mb-4 text-xl font-bold text-gray-900">주요 요약</h3>
        <ul className="list-disc space-y-1 pl-5 text-gray-700">
          <li>2023년 제주 농가의 연평균 소득은 60,531천원으로, 전년 58,240천원 대비 3.93% 증가</li>
          <li>제주의 농가소득은 2003년이후 꾸준히 증가하는 추세를 보이며, 2023년 30,849천원 대비 약 96.22% 증가</li>
          <li>2023년 기준 제주의 농가소득은 전국평균 대비 9,887천원 높음</li>
          <li>농업소득 비중은 25.16%에 불과하며, 농외소득(43.40%)과 이전소득(25.17%)이 대부분을 차지</li>
          <li>농업 본연의 경쟁력 강화를 위한 전략적 접근 필요</li>
        </ul>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 pb-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <TrendingUp className="h-5 w-5 text-[#1e3a8a]" />
          농가소득의 증가와 소득구조 변화
        </h3>

        <p>
          2023년 기준 제주 지역 농가의 연평균 소득은 60,531천 원으로, 전년(58,240천 원) 대비 4% 증가하였다. 이는 2003년(30,849천 원)과 비교했을 때 약 96% 상승한 수치로,
          제주 농가의 소득은 장기적으로 지속적인 증가 추세를 이어가고 있음을 보여준다.
        </p>

        <p>
          같은 해 제주 농가의 평균 소득은 전국 평균보다 9,887천 원 높아 상대적인 우위를 보이고 있다. 하지만 그 구성 내용을 살펴보면, 농업소득 비중은 전체의 25%에
          불과하며, 농외소득(43%)과 이전소득(25%)이 대부분을 차지하고 있어, 실질적으로 농업 외 소득 중심의 구조가 고착화되고 있는 것으로 분석된다.
        </p>

        <div className="my-10">
          <div className="h-[500px]">
            <FarmIncomeTrendChart />
          </div>
          <p className="mt-2 text-center text-sm text-gray-500">그림 1: 소득 종류별 농가소득 추이 (2003-2023)</p>
        </div>

        <p>
          소득 항목별 증감률을 보면, 농업소득은 전년 대비 1.18% 감소한 반면, 농외소득은 1.58% 증가하였다. 이전소득 또한 3.92% 증가하였으며, 비경상소득은 무려 64.79%의
          증가율을 보이며 가장 큰 폭으로 상승하였다. 이러한 결과는 일시적인 외부 지원이나 보조금, 자산 처분 등 비정기적 요인에 의존하는 소득 항목이 일부 농가 소득에 크게
          기여했음을 시사한다.
        </p>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 py-2 shadow-sm">
        <div className="my-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <BarChart3 className="h-5 w-5 text-[#1e3a8a]" />
              소득 종류별 전년대비 증감률 (2023)
            </h3>
            <div className="h-[300px]">
              <IncomeGrowthChart />
            </div>
          </div>
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <PieChart className="h-5 w-5 text-[#1e3a8a]" />
              2023년 소득종류별 구성비율
            </h3>
            <div className="h-[300px]">
              <IncomeCompositionChart />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <BarChart3 className="h-5 w-5 text-[#1e3a8a]" />
          제주 농가소득과 전국 평균 비교
        </h3>

        <p>
          2023년 기준 제주의 농가소득은 전국평균 대비 9,887천원 높은 것으로 나타났다. 특히 농외소득에서 가장 큰 차이를 보이고 있으며, 이는 제주도의 관광업과 연계된
          부가적인 소득 창출 기회가 많기 때문으로 분석된다.
        </p>

        <div className="mt-4 h-[400px]">
          <IncomeComparisonChart />
        </div>
        <p className="mt-3 text-center text-sm text-gray-500">그림 4: 제주 농가소득과 전국 평균 비교 (2023)</p>
      </section>

      <section className="rounded-lg border border-[#c2dfff] bg-[#e5f1ff] p-8 pb-6 shadow-sm">
        <h3 className="mb-2 text-xl font-bold text-gray-900">시사점 및 정책 제언</h3>
        <p>
          제주도는 전국평균대비 농가소득에서 우위를 보이고 있으나, 농업외 소득 중심의 구조를 가지고 있다. 이처럼 농업소득이 줄고 농업 외 소득의 비중이 커지는 현상은
          농업의 수익성 약화를 의미하며, 장기적으로는 농업 본연의 경쟁력 저하로 이어질 수 있다.
        </p>
        <p>따라서 제주 농업의 지속가능성을 확보하기 위해서는 전략적 접근이 필요하다.</p>
        <hr className="my-5" />
        <h3 className="mb-2 items-center text-xl font-semibold">결론</h3>
        <p>
          제주 농가의 소득은 지속적으로 증가하고 있으나, 그 구성에 있어 농업소득의 비중이 낮고 농외소득과 이전소득에 대한 의존도가 높은 구조적 문제를 안고 있다. 농업
          본연의 경쟁력 강화를 위한 전략이 요구되며, 이를 통해 제주 농업의 지속가능한 발전을 도모해야 할 것이다.
        </p>
      </section>
    </div>
  );
}
