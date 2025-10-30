import { BarChart3, PieChart, TrendingUp } from "lucide-react";
import FarmSizeTrendChart from "./FarmSizeTrendChart";
import FarmSizeDistributionChart from "./FarmSizeDistributionChart";
import FarmSizeComparisonChart from "./FarmSizeComparisonChart";

export default function FarmSize() {
  return (
    <div className="relative min-h-screen text-lg">
      <section className="mb-8 rounded-lg border border-[#c2dfff] bg-[#e5f1ff] p-8 pb-4 shadow-sm">
        <h3 className="mb-4 text-xl font-bold text-gray-900">주요 요약</h3>
        <ul className="list-disc space-y-1 pl-5 text-gray-700">
          <li>
            제주 농업은 지난 수십년간 뚜렷한 변화를 이어온 모습을 보인다. 1980년대까지만 해도 50%이상의 농가가 0.5ha 미만의 소규모 경지를 경작했지만, 이제는 0.5ha~2ha
            사이의 중규모 농가가 제주 농업의 중심축이 되었다.
          </li>
          <li>소규모 농가(0.5ha 미만): 1980년 50.6% → 2024년 33.0%</li>
          <li>중규모 농가(0.5~2ha 미만): 1980년 42.4% → 2024년 53.4%</li>
          <li>대규모 농가(2ha 이상): 1980년 7.0% → 2024년 13.5%</li>
          <li>특히 2010년 이후 중규모 농가 비중이 꾸준히 50%를 상회하며, 제주의 농업 기반이 보다 안정적인 경영 구조로 이동 중임을 보여준다.</li>
          <li>
            반면 2ha 이상의 대규모 농가는 일정 수준까지 확대되었다가 다시 정체된 모습을 보인다. 이러한 변화는 제주 농업이 급격한 대규모화보다는 중규모 농가를 중심으로
            점차적으로 규모화되는 방향으로 구조 전환이 이루어지고 있음을 보여준다.
          </li>
        </ul>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 pb-4 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <TrendingUp className="h-5 w-5 text-[#1e3a8a]" />
          제주 농가수와 경지규모의 변화 흐름
        </h3>

        <p>
          제주 농업은 지난 수십년간 뚜렷한 변화를 이어온 모습을 보인다. 1980년대까지만 해도 50%이상의 농가가 0.5ha 미만의 소규모 경지를 경작했지만, 이제는 0.5ha~2ha
          사이의 중규모 농가가 제주 농업의 중심축이 되었다.
        </p>

        <div className="my-10">
          <div className="h-[500px]">
            <FarmSizeTrendChart />
          </div>
          <p className="mt-2 text-center text-sm text-gray-500">그림 1: 제주 경지규모별 농가수 변화 추이 (1980-2024)</p>
        </div>

        <p className="mb-4">
          위 그래프에서 볼 수 있듯이, 제주 농업의 구조는 지난 40여 년간 큰 변화를 겪었다. 특히 0.5ha 미만의 소규모 농가(파란색)의 비중이 1980년 50.6%에서 2024년 33.0%로
          크게 감소한 반면, 0.5ha~2ha 미만의 중규모 농가(주황색)는 같은 기간 42.4%에서 53.4%로 증가했다. 또한 2ha 이상의 대규모 농가(회색)도 7.0%에서 13.5%로 증가하여,
          전반적으로 농업 경영의 규모화가 진행되고 있음을 확인할 수 있다.
        </p>

        <p>
          특히 주목할 점은 2010년을 기점으로 중규모 농가의 비중이 50%를 넘어서면서 제주 농업의 중심축으로 자리잡았다는 것이다. 이는 제주 농업이 영세 소농 중심에서 보다
          안정적인 중규모 경영 구조로 전환되고 있음을 보여주는 중요한 지표이다.
        </p>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <PieChart className="h-5 w-5 text-[#1e3a8a]" />
          2024년 제주 경지규모별 농가 현황
        </h3>

        <p>2024년 현재 제주 지역의 경지규모별 농가 분포를 살펴보면, 중규모 농가가 전체의 절반 이상을 차지하며 제주 농업의 중심축을 형성하고 있음을 확인할 수 있다.</p>

        <div className="my-10 grid grid-cols-1 gap-0 md:grid-cols-2">
          <div>
            <div className="h-[400px]">
              <FarmSizeDistributionChart />
            </div>
            <p className="mt-2 text-center text-sm text-gray-500">그림 2: 2024년 제주 경지규모별 농가수 비중</p>
          </div>
          <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-gray-50 p-6">
              <h4 className="mb-4 font-medium text-gray-900">2024년 경지규모별 농가 현황</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-[#4478c8]"></span>
                  <span>
                    <strong>소규모 농가(0.5ha 미만):</strong> 8,423호 (33.0%)
                    <br />
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-[#f97316]"></span>
                  <span>
                    <strong>중규모 농가(0.5~2ha 미만):</strong> 13,614호 (53.4%)
                    <br />
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-[#9ca3af]"></span>
                  <span>
                    <strong>대규모 농가(2ha 이상):</strong> 3,449호 (13.5%)
                    <br />
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p>
          위 그래프에서 볼 수 있듯이, 2024년 현재 제주 지역 농가의 53.4%가 0.5~2ha 미만의 중규모 농가로, 전체 농가의 절반 이상을 차지하고 있다. 소규모 농가는 33.0%,
          대규모 농가는 13.5%로, 중규모 농가 중심의 구조가 뚜렷하게 나타나고 있다.
        </p>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <BarChart3 className="h-5 w-5 text-[#1e3a8a]" />
          시대별 경지규모 변화 비교
        </h3>

        <p>
          제주 농업의 구조 변화를 보다 명확히 파악하기 위해 1980년, 2000년, 2024년의 경지규모별 농가 비중을 비교해보면, 소규모 농가의 감소와 중규모 농가의 증가라는 장기적
          추세를 확인할 수 있다.
        </p>

        <div className="my-10">
          <div className="h-[400px]">
            <FarmSizeComparisonChart />
          </div>
          <p className="mt-2 text-center text-sm text-gray-500">그림 3: 1980년, 2000년, 2024년 경지규모별 농가 비중 비교</p>
        </div>

        <p className="mb-4">
          위 그래프는 1980년, 2000년, 2024년의 경지규모별 농가 비중을 비교한 것으로, 시간이 흐름에 따라 소규모 농가의 비중이 감소하고 중규모 및 대규모 농가의 비중이
          증가하는 추세를 명확히 보여준다. 특히 1980년에는 소규모 농가가 전체의 절반 이상을 차지했으나, 2024년에는 중규모 농가가 가장 큰 비중을 차지하게 되었다.
        </p>
        <p className="mb-4">
          이러한 변화는 농업 기계화의 진전, 농촌 인구의 고령화와 감소, 농업 경영의 효율화 요구 등 다양한 요인이 복합적으로 작용한 결과로 볼 수 있다. 특히 소규모 농가의
          경우 경영 효율성과 수익성 측면에서 한계가 있어, 점차 중규모 이상의 농가로 통합되거나 농업 활동을 중단하는 경향이 나타나고 있다.
        </p>
        <p>
          제주 농업이 전체적으로는 농가수가 감소하는 가운데, 상대적으로 중규모 및 대규모 농가의 비중이 증가하는 구조적 변화를 겪고 있음을 보여준다. 특히 소규모 농가의
          급격한 감소는 농촌 인구의 고령화와 이농 현상, 그리고 농업 경영의 규모화 추세를 반영하는 것으로 볼 수 있다.
        </p>
      </section>

      <section className="rounded-lg border border-[#c2dfff] bg-[#e5f1ff] p-8 shadow-sm">
        <h3 className="mb-2 flex items-center gap-2 text-xl font-semibold">시사점 및 전망</h3>

        <p>제주 농업의 경지규모별 농가수 변화 추이를 종합적으로 분석한 결과, 다음과 같은 시사점과 전망을 도출할 수 있다.</p>

        <div className="my-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-[#1e3a8a]">중규모 농가 중심의 안정적 구조 형성</h3>
            <p className="text-sm text-gray-600">
              제주 농업은 0.5~2ha 규모의 중규모 농가를 중심으로 안정적인 구조를 형성하고 있다. 이는 제주의 지리적 특성과 주요 작물인 감귤, 월동채소 등의 재배 특성에
              적합한 규모로, 앞으로도 이러한 중규모 농가 중심의 구조가 유지될 것으로 전망된다.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-[#1e3a8a]">소규모 농가의 지속적 감소 예상</h3>
            <p className="text-sm text-gray-600">
              0.5ha 미만의 소규모 농가는 농촌 인구의 고령화, 농업 수익성 저하 등의 요인으로 인해 앞으로도 지속적으로 감소할 것으로 예상된다. 이들 농가의 경영 안정화와
              소득 보전을 위한 정책적 지원이 필요하다.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-[#1e3a8a]">대규모 농가의 성장 한계</h3>
            <p className="text-sm text-gray-600">
              2ha 이상의 대규모 농가는 일정 수준까지 증가한 후 정체되는 모습을 보이고 있다. 이는 제주의 지형적 특성, 토지 가용성의 한계, 노동력 확보의 어려움 등이
              복합적으로 작용한 결과로, 급격한 대규모화보다는 중규모 농가의 경쟁력 강화가 더 현실적인 방향으로 보인다.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-[#1e3a8a]">농업 경영의 질적 성장 필요</h3>
            <p className="text-sm text-gray-600">
              단순한 경지 규모의 확대보다는 스마트팜 도입, 고부가가치 작물 재배, 6차 산업화 등을 통한 농업 경영의 질적 성장이 중요하다. 특히 중규모 농가를 중심으로 기술
              혁신과 경영 다각화를 통한 경쟁력 강화가 필요하다.
            </p>
          </div>
        </div>

        <h3 className="mb-2 items-center text-xl font-semibold">결론</h3>
        <p className="mb-4">
          제주 농업은 지난 40여 년간 소규모 농가 중심에서 중규모 농가 중심으로 구조적 전환을 이루어왔다. 이러한 변화는 농업 환경의 변화, 기술 발전, 경제적 요인 등이
          복합적으로 작용한 결과로, 제주 농업이 보다 안정적이고 경쟁력 있는 구조로 발전해 가는 과정으로 볼 수 있다.
        </p>

        <p className="mb-4">
          특히 0.5~2ha 규모의 중규모 농가가 전체의 53.4%를 차지하며 제주 농업의 중심축으로 자리잡은 것은, 제주의 지리적 특성과 주요 작물의 재배 특성에 적합한 규모로서의
          중규모 농가의 경쟁력을 보여주는 것이다. 앞으로도 이러한 중규모 농가를 중심으로 한 안정적인 구조가 유지되면서, 기술 혁신과 경영 다각화를 통한 질적 성장이
          이루어질 것으로 전망된다.
        </p>

        <p>
          다만, 농촌 인구의 고령화와 감소, 기후변화, 시장 개방 등 다양한 도전 요인에 대응하기 위해서는 단순한 규모 확대보다는 스마트팜 도입, 고부가가치 작물 재배, 6차
          산업화 등을 통한 농업의 질적 성장이 더욱 중요해질 것이다. 이를 위해 농업 기술 혁신, 인력 양성, 마케팅 강화 등 다양한 측면에서의 정책적 지원이 필요하다.
        </p>
      </section>
    </div>
  );
}
