import { ChartBarDecreasing, LineChartIcon } from "lucide-react";
import IndustrialStructureChart from "./IndustrialStructureChart";
import IndustrialComparisonChart from "./IndustrialComparisonChart";
import NationalIndustrialStructureChart from "./NationalIndustrialStructureChart";

export default function IndustrialStructure() {
  return (
    <div className="relative min-h-screen text-lg">
      <section className="mb-8 rounded-lg bg-[#e1efff] p-8 pb-4 shadow-sm">
        <h3 className="mb-2 items-center text-xl font-semibold">주요 요약</h3>
        <ul className="list-disc space-y-1 pl-5 text-gray-700">
          <li>제주도의 농림어업 부문은 오랫동안 지역경제의 중요한 축을 담당하여 왔음</li>
          <li>산업구조 변화, 관광산업의 성장 등 다양한 요인으로 인해 농림어업의 생산구조는 약화되고 있음</li>
          <li>1985년 전체산업 생산중 38.7%를 차지하였지만, 2023년 비중은 10.1%로 하락하였음</li>
          <li>
            농림어업의 부가가치 생산액 성장률은 2000년대 연평균 4.2% 성장, 2010년대 연평균 2.0% 성장하였으며, 2015~2023년 연평균 3.0% 성장은 경상가격 기준으로는 성장한
            것처럼 보이지만 물가상승 등 요인에 의한 현상이며 실질적으로는 성장이 축소되고 있음
          </li>
          <li>농림어업의 비중이 하락하긴 하였지만, 여전히 제조업, 건설업보다는 높은 수준을 유지하고 있는 제주의 주력산업임</li>
        </ul>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <LineChartIcon className="h-5 w-5 text-[#1e3a8a]" />
          제주 산업구조의 변화 추이
        </h3>

        <p>
          제주도의 농림어업 부문은 오랜 기간 지역경제의 핵심 축으로 기능해왔다. 그러나 산업구조의 다변화, 관광산업의 성장 등 다양한 외부 요인으로 인해 농림어업의
          생산구조는 점차 약화되는 추세를 보이고 있다. 1985년 전체 산업 생산 중 농림어업이 차지하는 비중은 38.7%에 달했으나, 2023년에는 10.1%로 크게 하락하였다.
        </p>

        <div className="my-10">
          <div className="h-[500px]">
            <IndustrialStructureChart />
          </div>
          <p className="mt-2 text-center text-sm text-gray-500">그림 1: 제주 산업별 생산구조 변화 추이 (1985-2023)</p>
        </div>

        <div className="my-10">
          <div className="h-[500px]">
            <NationalIndustrialStructureChart />
          </div>
          <p className="mt-2 text-center text-sm text-gray-500">그림 2: 전국(제주제외) 산업별 생산구조 변화 추이 (1985-2023)</p>
        </div>

        <p>
          위 두 그래프를 비교해보면, 제주와 전국의 산업구조 변화에 뚜렷한 차이가 있음을 알 수 있다. 특히 농림어업(빨간색 선)의 경우, 제주에서는 1985년 38.7%에서 2023년
          10.1%로 감소했지만 여전히 상당한 비중을 차지하고 있는 반면, 전국 평균은 1985년 7.7%에서 2023년 1.5%로 크게 감소하여 매우 낮은 수준을 보이고 있다. 또한
          제조업(회색 선)의 경우 전국에서는 주요 산업으로 30% 내외의 높은 비중을 유지하고 있으나, 제주에서는 5-6% 수준에 불과하여 산업구조의 지역적 특성이 뚜렷하게
          나타나고 있다.
        </p>

        <p className="mt-4">
          위 그래프에서 볼 수 있듯이, 제주의 산업구조는 지난 40여 년간 큰 변화를 겪었다. 특히 농림어업(빨간색 선)의 비중이 지속적으로 감소하는 반면, 서비스업(녹색 선)의
          비중은 꾸준히 증가하는 추세를 보이고 있다. 이는 산업구조가 서비스업 중심으로 재편되면서 나타난 자연스러운 변화이지만, 지역경제 내 농림어업의 역할 축소를
          의미하는 지표로도 해석될 수 있다.
        </p>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 pb-4 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <ChartBarDecreasing className="h-5 w-5 text-[#1e3a8a]" />
          농림어업 비중의 감소 추세
        </h3>

        <p>
          농림어업 부문의 부가가치 생산액 성장률을 보면, 2000년대에는 연평균 4.2%의 성장을 보였고, 2010년대에는 연평균 2.0%로 둔화되었다. 2015년부터 2023년까지는 연평균
          3.0%의 성장률을 기록했으나, 이는 경상가격 기준으로 물가 상승 요인이 포함된 수치이며, 실질적인 성장 측면에서는 오히려 축소되고 있는 경향으로 평가된다.
        </p>
        <p>
          제주의 산업구조 변화를 전국 평균과 비교해보면, 제주 지역의 특수성을 더욱 명확하게 파악할 수 있다. 아래 그래프는 2023년 기준 전국과 제주의 산업별 생산 비중을
          비교한 것이다.
        </p>

        <div className="my-10">
          <div className="h-[400px]">
            <IndustrialComparisonChart />
          </div>
          <p className="mt-2 text-center text-sm text-gray-500">그림 4: 전국과 제주의 산업별 생산 비중 비교 (2023년)</p>
        </div>

        <p>
          위 그래프에서 볼 수 있듯이, 제주는 전국 평균과 비교했을 때 농림어업과 서비스업의 비중이 상대적으로 높은 반면, 제조업의 비중은 현저히 낮은 특징을 보인다. 특히
          농림어업의 경우 전국 평균이 1.5%에 불과한 반면, 제주는 10.1%로 약 6.7배 높은 수준을 유지하고 있다. 이는 제주 경제에서 농림어업이 여전히 중요한 위치를 차지하고
          있음을 보여주는 지표이다.
        </p>
      </section>

      <section className="rounded-lg bg-[#e1efff] p-8 pb-4 shadow-sm">
        <h3 className="mb-2 flex items-center text-xl font-semibold">시사점 및 전망</h3>

        <p>
          이와 같은 경향을 종합하면, 제주 농림어업의 생산 비중은 장기적으로 지속적인 하락세를 보여왔음을 확인할 수 있다. 그럼에도 불구하고, 농림어업은 여전히 제조업이나
          건설업보다 높은 생산 비중을 차지하고 있으며, 제주 지역 산업구조 내에서 중심 산업 중 하나로서의 역할을 유지하고 있는 것도 사실이다.
        </p>

        <div className="my-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-[#1e3a8a]">농림어업의 고부가가치화 필요</h3>
            <p className="text-sm text-gray-600">
              농림어업의 비중 감소는 불가피한 산업구조 변화의 일환이지만, 생산성과 부가가치를 높이는 방향으로의 전환이 필요하다. 특히 제주의 청정 이미지를 활용한 프리미엄
              농수산물 개발, 6차 산업화를 통한 부가가치 창출 등의 전략이 요구된다.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-[#1e3a8a]">관광산업과의 연계 강화</h3>
            <p className="text-sm text-gray-600">
              제주의 주력 산업인 관광업과 농림어업의 연계를 강화하여 시너지 효과를 창출할 필요가 있다. 농촌 체험 관광, 로컬 푸드 활성화, 농수산물 직거래 시장 확대 등을
              통해 관광객들에게 제주 농림어업의 가치를 전달하고 새로운 수익원을 창출할 수 있다.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-[#1e3a8a]">지속가능한 농림어업 육성</h3>
            <p className="text-sm text-gray-600">
              기후변화, 환경오염 등 외부 위협 요인에 대응하여 지속가능한 농림어업 모델을 구축할 필요가 있다. 친환경 농업, 스마트팜 도입, 자원 순환형 어업 등 미래지향적
              접근을 통해 농림어업의 경쟁력을 강화해야 한다.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-[#1e3a8a]">정책적 지원 확대</h3>
            <p className="text-sm text-gray-600">
              농림어업의 중요성을 고려하여 정책적 지원을 확대할 필요가 있다. 특히 청년 농어업인 육성, R&D 투자 확대, 유통 구조 개선 등을 통해 농림어업의 경쟁력을 높이고
              지속가능한 성장 기반을 마련해야 한다.
            </p>
          </div>
        </div>

        <h3 className="mb-2 items-center text-xl font-semibold">결론</h3>
        <p className="mb-4">
          제주도의 산업구조는 지난 40여 년간 서비스업 중심으로 재편되면서 농림어업의 비중이 크게 감소했다. 그럼에도 불구하고 제주의 농림어업은 전국 평균(1.5%)보다 훨씬
          높은 10.1%의 비중을 차지하며, 여전히 지역경제의 중요한 축으로 기능하고 있다.
        </p>

        <p>
          제주 농림어업은 제조업이나 건설업보다 높은 생산 비중을 유지하고 있으나, 성장률 둔화와 실질적 성장 축소 경향이 나타나고 있다. 따라서 농림어업의 고부가가치화,
          관광산업과의 연계 강화, 지속가능한 발전 모델 구축 등을 통해 제주 농림어업의 경쟁력을 강화하는 전략적 접근이 필요하다.
        </p>
      </section>
    </div>
  );
}
