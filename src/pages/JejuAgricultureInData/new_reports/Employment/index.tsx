import { TrendingDown, BarChart3, Users } from "lucide-react";
import EmploymentTrendChart from "./EmploymentTrendChart";
import NationalEmploymentTrendChart from "./EmploymentTrendChart";
import IndustryComparisonChart from "./EmploymentTrendChart";

export default function JejuEmploymentReport() {
  return (
    <div className="relative min-h-screen text-lg">
      <section className="mb-8 rounded-lg bg-white p-8 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <Users className="h-5 w-5 text-[#1e3a8a]" />
          산업별 취업자수로 본 제주농업의 현재와 위치
        </h3>

        <p className="mb-4">
          2024년 기준 제주특별자치도 농업부문의 노동투입 구조를 산업별 취업자 수 관점에서 살펴보면, 농림어업 분야의 취업자 수는 약 5만 명으로 전체 산업 취업자의 12.5%를
          차지한다. 이는 같은 해 전국 평균인 5.1%에 비해 2배 이상 높은 수치로, 제주 지역에서 농업이 여전히 주요 고용 기반이자 핵심 산업으로 기능하고 있음을 방증한다.
        </p>

        <p>
          이러한 수치는 단순한 산업 비중 이상의 의미를 갖는다. 농업은 지역 경제 내 고용 안전판으로서의 기능뿐만 아니라, 전통적인 삶의 방식과 식량안보, 환경보전 등
          다차원적인 공익적 가치를 동시에 수행하고 있기 때문이다. 특히 제주도는 지리적 특수성과 함께 타 지역에 비해 상대적으로 농업 기반이 견고하게 유지되어 왔다.
        </p>

        <div className="my-10">
          <div className="h-[500px]">
            <EmploymentTrendChart />
          </div>
          <p className="mt-2 text-center text-sm text-gray-500">그림 1: 제주도의 산업별 취업자 추이 (1989-2024)</p>
        </div>

        <p>
          그러나 최근 수년간 전국적으로 농업의 고용 비중이 지속적으로 축적되는 가운데, 제주는 여전히 두 자릿수 비중을 유지하고 있다는 점에서 그 구조적 특이성이 부각된다.
          반면, 2010년 이후에는 3차 산업 특히 관광 및 서비스업 중심의 산업이 급격한 성장세를 보이며 취업자 수가 빠르게 증가하였다.
        </p>

        <div className="my-10">
          <div className="h-[500px]">
            <NationalEmploymentTrendChart />
          </div>
          <p className="mt-2 text-center text-sm text-gray-500">그림 2: 전국(제주제외) 산업별 취업자 추이 (1989-2024)</p>
        </div>

        <p>
          이는 제주를 제외한 전국이 보이는 산업구조 변화와는 상이한 양상으로, 제주만의 독자적인 고용·산업 분포를 형성하고 있다. 이러한 변화는 농업부문의 전략적 중요성을
          재조명하는 계기가 된다. 즉, 농업이 단순한 1차 산업이 아닌 지역경제의 균형과 지속가능성을 유지하는 중심축으로 여전히 중요한 역할을 수행하고 있다는 점인 것이다.
        </p>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <BarChart3 className="h-5 w-5 text-[#1e3a8a]" />
          제주와 전국의 산업별 취업자 구조 비교
        </h3>

        <p>
          제주와 전국의 산업별 취업자 구조를 비교해보면, 제주의 농림어업 부문이 차지하는 비중이 전국 평균보다 현저히 높다는 특징이 두드러진다. 2024년 기준 제주의 농림어업
          취업자 비중은 12.5%로, 전국 평균 5.1%의 약 2.5배에 달한다.
        </p>

        <div className="my-10">
          <div className="h-[400px]">
            <IndustryComparisonChart />
          </div>
          <p className="mt-2 text-center text-sm text-gray-500">그림 3: 제주와 전국의 산업별 취업자 비중 비교 (2024년)</p>
        </div>

        <p>
          또한 제주는 SOC 및 기타 서비스업의 비중이 59.5%로 전국 평균(56.7%)보다 높은 반면, 광공업 비중은 3.2%로 전국 평균(15.1%)보다 현저히 낮다. 이는 제주의 산업구조가
          농업과 서비스업 중심으로 형성되어 있으며, 제조업 기반이 상대적으로 취약함을 보여준다.
        </p>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <TrendingDown className="h-5 w-5 text-[#1e3a8a]" />
          농림어업 취업자 비중의 변화 추이
        </h3>

        <p className="mb-4">
          제주 농림어업 취업자 비중은 1989년 44.0%에서 2024년 12.5%로 크게 감소했다. 특히 1990년대 초반까지 40% 이상을 유지하던 농림어업 취업자 비중이 1990년대 중반 이후
          급격히 감소하여 2000년대 초반에는 25% 수준으로, 2010년대에는 20% 이하로 떨어졌다.
        </p>

        <p className="mb-4">
          이러한 감소 추세는 전국적인 현상이지만, 제주의 경우 감소 속도가 더 빠르게 나타났다. 전국의 농림어업 취업자 비중은 1989년 17.6%에서 2024년 5.1%로 감소했으며,
          감소폭은 12.5%p인 반면, 제주는 31.5%p로 훨씬 큰 감소폭을 보였다.
        </p>

        <p>
          그러나 주목할 점은 2015년 이후 제주의 농림어업 취업자 비중이 12~15% 수준에서 상대적으로 안정화되는 경향을 보인다는 것이다. 이는 제주 농업이 일정 수준의 고용
          기반을 유지하면서 지역 경제 내에서 안정적인 위치를 확보하고 있음을 시사한다.
        </p>
      </section>

      <section className="rounded-lg border border-gray-200 bg-gray-50 p-8 pb-4 shadow-sm">
        <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">※ 한국표준산업분류 11차개정(2024년) 기준</h3>
        <ul className="space-y-2 text-gray-800">
          <li>
            <strong>사회간접자본 및 기타서비스업</strong> = soc건설업(F) + 도소매·숙박음식점업 + 사업·개인·공공서비스 및 기타 + 전기·운수·통신·금융
          </li>
          <li>
            <strong>도소매·숙박음식점업</strong> = 도매 및 소매업(G) + 숙박 및 음식점업(I)
          </li>
          <li>
            <strong>사업·개인·공공서비스 및 기타</strong> = 수도·하수·폐기물처리,원료재생업(E) + 부동산업(L) + 전문,과학 및 기술서비스업(M) + 사업시설관리,
            사업지원서비스및임대업(N) + 공공행정,국방 및 사회보장행정(O) + 교육서비스업(P) + 보건업 및 사회복지서비스업(Q) + 예술,스포츠 및 여가관련 서비스업(R) +협회 및
            단체, 수리 및 기타 개인서비스업(S) + 가구내 고용활동 및 달리분류되지 않은 자가소비 생산활동(T) + 국제 및 외국기관(U)
          </li>
          <li>
            <strong>전기·운수·통신·금융</strong> = 전기,가스,증기 및 공기조절공급(D) + 운수및창고업(H) + 정보통신업(J) + 금융 및 보험업(K)
          </li>
        </ul>
      </section>
    </div>
  );
}
