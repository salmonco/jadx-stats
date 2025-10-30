import FertilizerConsumptionChart from "./FertilizerConsumptionChart";
import FertilizerComparisonTable from "./FertilizerComparisonTable";
import { Leaf } from "lucide-react";

export default function JejuFertilizerReport() {
  return (
    <div className="relative min-h-screen text-lg">
      {/* 주요 요약 */}
      <section className="mb-8 rounded-lg border border-[#c2dfff] bg-[#e5f1ff] p-8 pb-4 shadow-sm">
        <h3 className="mb-4 text-xl font-bold text-gray-900">주요 요약</h3>
        <ul className="list-disc space-y-1 pl-5 text-lg text-gray-700">
          <li>제주도 경지면적은 1975년부터 2023년까지 약 5만 5천 헥타르 내외로 거의 변화가 없음</li>
          <li>1975년 제주도 단위면적당 비료 사용량은 468kg/ha로 전국 평균(396kg/ha)의 1.2배</li>
          <li>1994년 제주도 비료 사용량은 1,076kg/ha로 전국 평균(399kg/ha)의 2.7배로 최대 격차 기록</li>
          <li>1990년대 중반 이후 환경 문제와 지속가능한 농업에 대한 관심 증가로 비료 사용량 감소</li>
          <li>2023년 현재 제주도 비료 사용량은 414kg/ha로 전국 평균(247kg/ha)의 1.7배 수준</li>
        </ul>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 pb-4 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <Leaf className="h-6 w-6 text-[#1e3a8a]" />
          경지면적당 비료소비량 변화
        </h3>

        <p>
          1975년부터 2023년까지의 자료를 분석한 결과, 제주도의 경지면적은 전체 기간 동안 약 5만 5천 헥타르 내외를 유지하며 거의 변화가 없는 것으로 나타났다. 경지면적이
          고정된 상태에서도 비료 사용량에는 뚜렷한 등락이 발생하였는데, 특히 1975년 제주도의 단위면적당 비료 사용량은 468kg/ha로, 같은 해 전국 평균(396kg/ha)보다 약 1.2배
          높은 수준이었다.
        </p>

        <div className="my-10">
          <div className="h-[600px]">
            <FertilizerConsumptionChart />
          </div>
          <p className="mt-2 text-center text-sm text-gray-500">그림 1: 경지면적당(kg/ha) 비료소비량 변화 (1975-2023)</p>
        </div>

        <p>
          이후 1994년에는 제주도의 비료 사용량이 1,076kg/ha로 급증하며 전국 평균(399kg/ha)의 2.7배에 달하는 최대 격차를 기록하였다. 이는 당시 감귤 중심의 집약적 과수농업
          확대와 고투입 중심 영농방식의 보편화에서 비롯된 결과로 볼 수 있다.
        </p>

        <div className="my-6">
          <FertilizerComparisonTable />
        </div>

        <p>
          그러나 1990년대 중반 이후부터는 환경 문제와 지속가능한 농업에 대한 사회적 관심이 증가하면서, 제주도에서도 비료 사용량이 빠르게 감소하였다. 2005년에는 599kg/ha,
          2010년에는 320kg/ha까지 줄어들었으며, 같은 기간 전국 평균 역시 354kg/ha에서 219kg/ha로 감소하였다. 이는 면적 변화 없이도 단위면적당 투입량을 조절함으로써
          환경영향을 줄이고 농업 지속가능성을 제고한 대표 사례로 볼 수 있다.
        </p>

        <p>
          2023년 현재 제주도의 비료 사용량은 414kg/ha로 다시 반등하였고, 전국 평균(247kg/ha)과 비교할 때 여전히 약 1.7배 높은 수준을 유지하고 있다. 종합적으로 볼 때,
          제주지역의 경지면적당 비료 소비량 변화는 단순한 면적 증감이 아니라 농업방식, 정책, 환경요인의 변화에 의해 주도되어 왔다.
        </p>
      </section>

      <section className="rounded-lg border border-[#c2dfff] bg-[#e5f1ff] p-8 pb-4 shadow-sm">
        <h3 className="mb-2 flex items-center gap-2 text-xl font-semibold">시사점 및 향후 과제</h3>

        <p>제주도의 비료 사용량 변화 추이를 분석한 결과, 다음과 같은 시사점과 향후 과제를 도출할 수 있다.</p>

        <div className="my-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-[#1e3a8a]">작물별 정밀 시비 지도 필요</h3>
            <p className="text-[16px] text-gray-600">
              제주도는 감귤, 월동채소 등 특화 작물의 재배 비중이 높아 전국 평균보다 비료 사용량이 높은 특성이 있다. 따라서 작물별 특성을 고려한 정밀 시비 지도가 필요하며,
              특히 과수원의 경우 수령과 생산성을 고려한 맞춤형 시비 체계 구축이 요구된다.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-[#1e3a8a]">토양 특성을 고려한 시비 처방</h3>
            <p className="text-[16px] text-gray-600">
              제주도는 화산회토가 주를 이루는 특수한 토양 환경을 가지고 있어, 일반적인 시비 기준을 그대로 적용하기 어렵다. 토양의 물리화학적 특성을 고려한 시비 처방
              시스템 구축이 필요하며, 정기적인 토양 검정을 통한 과학적 접근이 중요하다.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-[#1e3a8a]">환경 영향 최소화 전략</h3>
            <p className="text-[16px] text-gray-600">
              제주도는 지하수 의존도가 높고 해안 생태계와 인접해 있어 비료 사용에 따른 환경 영향에 취약하다. 따라서 완효성 비료, 유기질 비료 활용 확대, 분시 방법 개선
              등을 통해 환경 부하를 최소화하는 전략이 필요하다.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-[#1e3a8a]">친환경 농업으로의 전환 지원</h3>
            <p className="text-[16px] text-gray-600">
              화학비료 의존도를 낮추고 유기질 비료, 녹비작물 등을 활용한 친환경 농업으로의 전환을 지원할 필요가 있다. 특히 제주도의 청정 이미지와 연계한 친환경 농산물
              생산은 부가가치 창출에도 기여할 수 있다.
            </p>
          </div>
        </div>

        <hr className="my-4" />
        <h3 className="mb-2 items-center text-xl font-semibold">결론</h3>
        <p>
          제주도의 경지면적당 비료 소비량은 1975년부터 2023년까지 다양한 변화를 겪어왔다. 1990년대 중반 최고치를 기록한 후 지속적으로 감소하여 현재는 안정적인 수준을
          유지하고 있으나, 여전히 전국 평균보다 높은 수준이다. 이는 제주도의 특수한 농업 환경과 작물 구성에 기인한 것으로, 단순히 비료 사용량을 줄이는 것보다는 과학적
          근거에 기반한 적정 시비 체계를 구축하는 것이 중요하다.
        </p>

        <p>
          향후 제주 농업의 지속가능성을 높이기 위해서는 작물별 정밀 시비 지도, 정확한 토양진단 기반 시비 처방 시스템, 환경 영향 최소화 전략, 친환경 농업으로의 전환 지원
          등이 종합적으로 고려되어야 할 것이다. 이를 통해 제주 농업의 생산성과 환경성을 동시에 제고할 수 있을 것으로 기대된다.
        </p>
      </section>
    </div>
  );
}
