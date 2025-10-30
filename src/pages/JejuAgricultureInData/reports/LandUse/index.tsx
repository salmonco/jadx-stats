import CropCompositionChart from "./CropCompositionChart";
import CropDistributionPieChart from "./CropDistributionPieChart";
import LandAreaTrendChart from "./LandAreaTrendChart";
import PaddyFieldDeclineChart from "./PaddyFieldDeclineChart";
import { Mountain, TrendingDown, TrendingUp, BarChart3, PieChart } from "lucide-react";

export default function LandUse() {
  return (
    <div className="relative min-h-screen text-lg">
      <section className="mb-8 rounded-lg border border-[#c2dfff] bg-[#e5f1ff] p-8 pb-4 shadow-sm">
        <h3 className="mb-4 text-xl font-bold text-gray-900">주요 요약</h3>
        <ul className="list-disc space-y-1 pl-5 text-gray-700">
          <li>제주는 용암지형 기반의 화산섬으로 토양의 투수성이 높아 논농업에 불리한 환경</li>
          <li>논면적은 1975년 1,062ha에서 2023년 12ha로 98.87% 감소하여 사실상 소멸단계</li>
          <li>밭면적은 1975년 48,436ha에서 2023년 55,593ha로 14.78% 증가</li>
          <li>지난 50년간 밭중심 농업으로 전환되어 감귤, 월동채소 등 고부가가치 작물 재배에 적합한 환경 제공</li>
          <li>작물별 재배면적 구성에서 채소와 과수가 2023년 기준 64.01%로 지속적 우위 유지</li>
        </ul>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <Mountain className="h-5 w-5 text-[#1e3a8a]" />
          제주 농지의 자연환경적 특성
        </h3>

        <p>
          제주는 용암지형에 기반한 화산섬으로, 토양의 투수성이 매우 높아 물을 오래 가두기 어려운 특성이 있다. 이러한 물리적 제약으로 인해 논농업에 필수적인 담수 유지가
          곤란하며, 상대적으로 온화한 겨울 기후 또한 논에서 재배되는 벼보다는 밭작물의 생육에 더욱 적합한 환경을 제공하고 있다.
        </p>

        <p>
          이러한 자연환경적 특성은 제주 농업의 방향성을 결정짓는 중요한 요인으로 작용해왔으며, 장기적으로 농지 구조의 변화를 이끌어내는 근본적인 배경이 되었다. 특히
          제주의 아열대성 기후는 감귤이나 월동채소와 같은 기후 적응형 고부가가치 작물 재배에 적합한 환경을 제공하며, 밭작물 중심의 농업이 자연스럽게 발전할 수 있는 토대를
          마련했다.
        </p>

        <div className="mt-6 h-[500px]">
          <LandAreaTrendChart />
        </div>
        <p className="mt-2 text-center text-sm text-gray-500">그림 1: 제주 경지면적 변화 추이 (1975-2023)</p>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 pb-4 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <TrendingDown className="h-6 w-6 text-[#1e3a8a]" />
          논농업의 소멸: 98.87%의 급격한 감소
        </h3>

        <p>
          제주의 논 면적은 1975년 1,062ha에서 2023년 12ha로 줄어들며, 무려 98.87% 감소하였다. 이는 사실상 제주에서 논농업이 소멸 단계에 진입했음을 의미한다. 특히 1990년대
          초반까지는 완만한 감소세를 보이다가 1992년부터 1993년 사이에 급격한 감소가 일어났으며, 이후로도 지속적인 감소 추세가 이어졌다.
        </p>

        <div className="my-10">
          <div className="h-[400px]">
            <PaddyFieldDeclineChart />
          </div>
          <p className="mt-2 text-center text-sm text-gray-500">그림 2: 제주 논면적의 급격한 감소 추이 (1975-2023)</p>
        </div>

        <p>
          이러한 논농업의 급격한 감소는 단순히 자연환경적 제약뿐만 아니라, 농업 경제성과 정책적 요인이 복합적으로 작용한 결과로 볼 수 있다. 특히 1990년대 이후 제주 농업이
          감귤과 같은 고소득 작물로 전환되면서, 상대적으로 수익성이 낮은 벼농사는 점차 경쟁력을 잃게 되었다.
        </p>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 pb-4 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <TrendingUp className="h-6 w-6 text-[#1e3a8a]" />
          밭농업의 확대: 14.78%의 지속적 성장
        </h3>

        <p>
          논면적이 급격히 감소한 반면, 같은 기간 동안 밭 면적은 48,436ha에서 55,593ha로 14.78% 증가하면서, 제주의 농업 구조가 명확히 밭 중심으로 전환되었음을 보여준다.
          특히 1980년대 중반부터 1990년대 초반까지 밭 면적이 크게 증가하였으며, 2010년대 초반에도 증가세가 두드러졌다.
        </p>

        <p>
          이러한 밭 면적의 증가는 제주 농업의 방향성 변화를 단적으로 보여주는 지표로, 감귤과 월동채소 등 제주의 기후에 적합한 고부가가치 작물 재배가 확대되면서 나타난
          자연스러운 현상이라 할 수 있다. 특히 2000년대 이후에는 밭 면적이 전체 경지면적의 99% 이상을 차지하면서, 제주 농업이 완전히 밭작물 중심으로 재편되었음을 확인할
          수 있다.
        </p>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 pb-4 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <BarChart3 className="h-6 w-6 text-[#1e3a8a]" />
          작물별 재배면적 구성 변화
        </h3>

        <p>
          제주의 작물별 재배면적 구성에서도 밭작물 중심의 농업 구조가 뚜렷하게 드러난다. 채소와 과수는 2009년 전체 재배면적의 65.96%를 차지하였으며, 2023년에도 여전히
          64.01%를 차지하면서 타 작물 대비 지속적인 우위를 점하고 있다.
        </p>

        <div className="my-5">
          <div className="h-[400px]">
            <CropCompositionChart />
          </div>
          <p className="mt-2 text-center text-sm text-gray-500">그림 3: 작물별 재배면적 구성 변화 (2008-2023)</p>
          <p className="mb-2 mt-6">
            <span className="font-medium">주요 변화:</span> 2008년부터 2023년까지 제주 농업의 작물 구성비는 과수와 채소 중심으로 유지되었으며, 벼 재배는 거의
            사라졌습니다. 특히 2023년에는 과수(36.1%)와 채소(27.9%)가 전체의 64%를 차지하고 있습니다.
          </p>
        </div>

        <p>
          특히 과수(주로 감귤)의 경우 2023년 기준 전체 재배면적의 36.09%를 차지하며 가장 높은 비중을 보이고 있으며, 채소류가 27.92%로 그 뒤를 잇고 있다. 이는 제주의
          기후적 특성을 활용한 작물 선택이 농업 구조에 반영된 결과로, 밭작물 중심의 농업이 단순한 면적 확대를 넘어 주요 소득 작물로서의 비중과 중요성에서도 확고히
          자리매김하고 있음을 보여준다.
        </p>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 shadow-sm">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <PieChart className="h-5 w-5 text-[#1e3a8a]" />
              2023년 작물별 재배면적 구성비
            </h3>
            <div className="h-[300px]">
              <CropDistributionPieChart />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-gray-50 p-6">
              <h4 className="mb-4 font-medium text-gray-900">2023년 주요 작물 재배 현황</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-[#4478c8]"></span>
                  <span>
                    <strong>과수(36.09%)</strong>: 주로 감귤류로 구성되며, 제주 농업의 핵심 소득원
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-[#f97316]"></span>
                  <span>
                    <strong>채소(27.92%)</strong>: 월동채소를 중심으로 한 다양한 채소류 재배
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-[#22c55e]"></span>
                  <span>
                    <strong>감자(8.32%)</strong>: 제주의 대표적인 밭작물 중 하나로 안정적 재배
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-[#eab308]"></span>
                  <span>
                    <strong>특용작물(7.65%)</strong>: 약용작물 등 고부가가치 특수 작물
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
          제주 농지의 구조 변화는 단순한 면적 변화를 넘어, 제주 농업의 본질적인 변화를 보여주는 중요한 지표이다. 지난 50년간의 변화는 제주의 자연환경적 특성이 농업 구조에
          미친 영향을 명확히 보여주며, 이러한 변화는 앞으로도 지속될 것으로 전망된다.
        </p>
        <p>
          특히 기후변화로 인한 아열대화가 가속화되면서, 제주의 밭농업은 더욱 다양한 아열대 작물로 확대될 가능성이 높다. 또한 감귤과 월동채소 등 기존의 주력 작물도 재배
          기술의 발전과 품종 개량을 통해 경쟁력을 더욱 강화해 나갈 것으로 예상된다.
        </p>
        <hr className="my-4" />
        <h3 className="mb-2 items-center text-xl font-semibold">결론</h3>
        <p>
          제주의 농지 구조는 지난 50년간 논농업의 소멸과 밭농업의 확대라는 뚜렷한 변화를 겪었다. 이러한 변화는 제주의 자연환경적 특성이 농업 구조에 반영된 결과로, 감귤과
          월동채소 등 제주의 기후에 적합한 고부가가치 작물 중심의 농업 구조가 확립되었음을 보여준다. 앞으로도 제주 농업은 이러한 밭농업 중심의 구조를 더욱 강화하면서,
          기후변화에 대응한 새로운 작물과 재배 기술의 도입을 통해 지속가능한 발전을 이어나갈 것으로 전망된다.
        </p>
      </section>
    </div>
  );
}
