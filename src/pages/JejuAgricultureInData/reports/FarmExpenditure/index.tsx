import FarmExpenditureTrendChart from "./FarmExpenditureTrendChart";
import ExpenditureCompositionChart from "./ExpenditureCompositionChart";
import ExpenditureComparisonChart from "./ExpenditureComparisonChart";
import { TrendingUp, PieChart } from "lucide-react";

export default function FarmExpenditure() {
  return (
    <div className="relative min-h-screen text-lg">
      <section className="mb-8 rounded-lg border border-[#c2dfff] bg-[#e5f1ff] p-8 pb-4 shadow-sm">
        <h3 className="mb-2 items-center text-xl font-semibold">주요 요약</h3>
        <ul className="list-disc space-y-1 pl-5 text-gray-700">
          <li>2023년 제주 농가의 가계지출은 47,327천원으로 2003년 대비 46.91% 증가</li>
          <li>제주 농가의 가계지출은 전국 평균보다 10,016천원 더 많음</li>
          <li>가계지출 구성에서 소비지출이 75.7%, 비소비지출이 24.3%를 차지</li>
          <li>최근 비소비지출(세금, 보험료 등) 항목의 증가세가 두드러짐</li>
          <li>소득 증가와 함께 지출 부담도 커지는 복합적 상황</li>
        </ul>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <TrendingUp className="h-5 w-5 text-[#1e3a8a]" />
          제주 농가 지출의 변화 흐름
        </h3>

        <p>
          2023년 기준 제주 농가의 연간 가계지출은 47,327천 원으로 나타났으며, 이는 2003년 대비 약 46.91% 증가한 수치이다. 전반적으로 제주 농가의 가계지출은 꾸준히
          상승세를 보이고 있으며, 특히 2013년 이후부터는 증가 폭이 더욱 뚜렷하게 나타나고 있다.
        </p>

        <div className="my-10">
          <div className="h-[500px]">
            <FarmExpenditureTrendChart />
          </div>
          <p className="mt-2 text-center text-sm text-gray-500">그림 1: 제주 농가 가계지출 추이 (2003-2023)</p>
        </div>

        <p>
          이러한 지출 수준은 전국 평균과 비교해도 차이가 크다. 2023년 전국 농가의 평균 가계지출은 37,311천 원으로, 제주 농가는 이보다 10,016천 원 더 높은 지출을
          기록하였다. 최근으로 올수록 이 격차는 더욱 확대되는 추세이며, 제주 농가의 생활비 부담이 상대적으로 높은 구조임을 보여준다.
        </p>

        <div className="mt-10">
          <div className="h-[400px]">
            <ExpenditureComparisonChart />
          </div>
          <p className="mt-2 text-center text-sm text-gray-500">그림 2: 제주 농가 가계지출과 전국 평균 비교 (2023)</p>
        </div>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 pb-4 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <PieChart className="h-5 w-5 text-[#1e3a8a]" />
          가계지출 구성 분석
        </h3>

        <p>
          가계지출 구성 면에서는 소비지출이 전체의 75.7%, 비소비지출이 24.3%를 차지하고 있다. 이 중 비소비지출, 즉 세금이나 보험료와 같은 항목은 최근 몇 년간 빠르게
          증가하고 있으며, 이는 단순한 생활 소비의 증가를 넘어 농가의 전반적인 지출 부담이 커지고 있다는 신호로 해석된다.
        </p>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <PieChart className="h-5 w-5 text-[#1e3a8a]" />
              2023년 가계지출 구성비
            </h3>
            <div className="h-[300px]">
              <ExpenditureCompositionChart />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-gray-50 p-6">
              <h4 className="mb-4 font-medium text-gray-900">지출 구성 분석</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-[#4478c8]"></span>
                  <span>
                    <strong>소비지출(75.7%)</strong>: 식료품, 주거, 교통, 교육, 의료 등 일상생활에 필요한 지출
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-[#f97316]"></span>
                  <span>
                    <strong>비소비지출(24.3%)</strong>: 세금, 사회보험료, 이자비용 등 의무적 성격의 지출
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-[#c2dfff] bg-[#e5f1ff] p-8 pb-4 shadow-sm">
        <h3 className="mb-2 flex items-center gap-2 text-xl font-semibold">시사점 및 전망</h3>
        <p>
          제주 농가의 가계지출 증가는 전반적인 소득 수준 향상과 일정 부분 연관되어 있으나, 지출의 구조를 자세히 들여다보면 단순히 소득이 늘어난 만큼 소비를 확대하는
          양상만은 아니다. 오히려 비소비성 항목의 부담 증가가 동시에 나타나고 있어, 가계경제에 있어 보다 복합적이고 구조적인 변화가 진행되고 있음을 시사한다.
        </p>
        <hr className="my-4" />
        <h3 className="mb-2 items-center text-xl font-semibold">결론</h3>
        <p>
          제주 농가의 가계지출은 지속적으로 증가하고 있으며, 전국 평균을 상회하는 수준을 보이고 있다. 특히 비소비지출 항목의 증가세가 두드러지는 것은 농가의 지출 부담이
          커지고 있음을 의미한다. 소득 증가와 함께 지출 구조의 변화를 종합적으로 고려한 정책적 접근이 필요하며, 이를 통해 제주 농가의 경제적 안정성을 제고해야 할 것이다.
        </p>
      </section>
    </div>
  );
}
