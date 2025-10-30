import { TrendingUp, BarChart3, PieChart, Scale } from "lucide-react";
import FarmAssetTrendChart from "./FarmAssetTrendChart";
import AssetCompositionChart from "./AssetCompositionChart";
import FarmLiabilityTrendChart from "./FarmLiabilityTrendChart";
import LiabilityCompositionChart from "./LiabilityCompositionChart";
import AssetLiabilityComparisonChart from "./AssetLiabilityComparisonChart";

export default function JejuFarmAssetsLiabilitiesReport() {
  return (
    <div className="relative min-h-screen text-lg">
      <section className="mb-8 rounded-lg border border-[#c2dfff] bg-[#e5f1ff] p-8 pb-4 shadow-sm">
        <h3 className="mb-4 text-xl font-bold text-gray-900">주요 요약</h3>
        <ul className="list-disc space-y-1 pl-5 text-gray-700">
          <li>2023년 제주 농가의 자산은 전년대비 8.85% 감소, 2003년 대비 약 200% 상승</li>
          <li>자산 중 고정자산은 전년대비 9.80% 감소, 유동자산은 전년대비 1.39% 감소</li>
          <li>2023년 제주 농가의 자산은 961,714천원으로 전국 평균보다 394,320천원 높음</li>
          <li>자산 구성은 고정자산 87.79%, 유동자산 12.21%로 현금화 가능한 자산이 제한적</li>
          <li>2023년 제주 농가의 부채는 전년대비 3.08% 증가, 2003년 대비 약 114.75% 상승</li>
          <li>부채 구성은 농업용 68.63%, 가계용 18.83%, 기타 및 겸업용 12.54%</li>
          <li>제주 농가 부채는 전국 평균의 2.6배 수준으로 시설투자와 운영자본이 높은 구조</li>
        </ul>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 pb-4 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <TrendingUp className="h-5 w-5 text-[#1e3a8a]" />
          제주 농가 자산 변화 추이
        </h3>

        <p>
          2023년 제주 농가의 평균 자산은 961,714천원으로, 전년(1,055,109천원) 대비 8.85% 감소하였다. 그러나 2003년(320,669천원)과 비교하면 약 200% 상승한 수치로,
          장기적으로는 자산 규모가 크게 확대되었음을 알 수 있다.
        </p>

        <div className="my-10">
          <div className="h-[500px]">
            <FarmAssetTrendChart />
          </div>
          <p className="mt-2 text-center text-sm text-gray-500">그림 1: 제주 농가 자산 변화 추이 (2003-2023)</p>
        </div>

        <p>
          자산 항목별로 살펴보면, 고정자산은 전년 대비 9.80% 감소한 반면, 유동자산은 1.39% 감소하였다. 특히 주목할 점은 2023년 제주 농가의 자산(961,714천원)이 전국
          평균(567,394천원)보다 394,320천원 높다는 것이다. 이는 제주 농가가 상대적으로 높은 자산 가치를 보유하고 있음을 의미한다.
        </p>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <PieChart className="h-5 w-5 text-[#1e3a8a]" />
              2023년 자산 구성비율
            </h3>
            <div className="h-[300px]">
              <AssetCompositionChart />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-gray-50 p-6">
              <h4 className="mb-4 font-medium text-gray-900">자산 구성 분석</h4>
              <p className="mb-4 text-gray-600">
                2023년 제주 농가의 자산 구성을 살펴보면 고정자산이 87.79%, 유동자산이 12.21%를 차지하고 있다. 유동자산의 비중이 12.21%에 불과해 현금화 가능한 자산이
                제한적인 구조를 보인다.
              </p>
              <p className="text-gray-600">
                특히 고정자산의 비율이 87.79%로 상당히 높은데, 이는 토지(과수원, 밭), 시설(하우스, 농기계 등)에 대부분의 가치가 집중되는 구조임을 보여준다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 pb-4 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <Scale className="h-5 w-5 text-[#1e3a8a]" />
          제주 농가 부채 변화 추이
        </h3>

        <p>
          2023년 제주 농가의 평균 부채는 94,476천원으로, 전년(91,655천원) 대비 3.08% 증가하였다. 2003년(43,994천원)과 비교하면 약 114.75% 상승한 수치로, 자산
          증가율(200%)보다는 낮지만 여전히 부채 부담이 장기적으로 확대되고 있음을 보여준다.
        </p>

        <div className="my-10">
          <div className="h-[500px]">
            <FarmLiabilityTrendChart />
          </div>
          <p className="mt-2 text-center text-sm text-gray-500">그림 3: 제주 농가 부채 변화 추이 (2003-2023)</p>
        </div>

        <p>
          2023년 제주 농가의 부채(94,476천원)는 전국 평균(35,785천원)보다 58,691천원 더 높은 것으로 나타났다. 이는 전국 평균 대비 약 2.6배에 달하는 수준으로, 제주 농가의
          부채 부담이 상대적으로 크다는 것을 의미한다.
        </p>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <PieChart className="h-5 w-5 text-[#1e3a8a]" />
              2023년 부채 구성비율
            </h3>
            <div className="h-[300px]">
              <LiabilityCompositionChart />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-gray-50 p-6">
              <h4 className="mb-4 font-medium text-gray-900">부채 구성 분석</h4>
              <p className="mb-4 text-gray-600">2023년 제주 농가의 부채 구성을 살펴보면 농업용이 68.63%, 가계용이 18.83%, 기타 및 겸업용이 12.54%를 차지하고 있다.</p>
              <p className="text-gray-600">
                전년과 비교하면, 농업용 부채의 비중이 확대되고 있으며, 비농업용 부채는 감소하는 추세를 보인다. 이는 농업 생산 기반 강화를 위한 투자가 지속되고 있음을
                시사한다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 pb-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <BarChart3 className="h-5 w-5 text-[#1e3a8a]" />
          자산 대비 부채 비율 분석
        </h3>

        <p>
          제주 농가의 자산 대비 부채 비율은 2023년 기준 약 9.8%로, 전국 평균(6.3%)보다 3.5%p 높은 수준이다. 2003년부터 2023년까지의 추이를 살펴보면, 제주 농가의
          부채비율은 전반적으로 감소 추세를 보이고 있으나, 여전히 전국 평균보다 높은 수준을 유지하고 있다. 특히 2013-2015년 기간에는 부채비율이 11% 이상으로 상승하기도
          했으며, 최근에는 9-10% 수준에서 등락을 반복하고 있다.
        </p>

        <div className="h-[400px]">
          <AssetLiabilityComparisonChart />
        </div>
        <p className="mt-2 text-center text-sm text-gray-500">그림 5: 제주 농가와 전국 평균 부채비율 비교 (2003-2023)</p>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 pb-4 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <TrendingUp className="h-5 w-5 text-[#1e3a8a]" />
          자산 기반은 탄탄, 구조·운영면에서는 점검 필요
        </h3>

        <p>
          2023년 제주 농가의 평균 자산은 961,714천 원으로, 전국 평균(567,394천 원)보다 394,320천 원 높은 수준을 기록하였다. 이는 2003년 대비 약 200% 상승한 수치이지만,
          전년 대비로는 9% 감소하여 일시적인 자산 조정이 있었던 것으로 보인다.
        </p>

        <p>
          자산 구성에서는 고정자산이 전체의 88%를 차지하며, 유동자산은 12.21%에 불과하다. 특히 고정자산은 전년 대비 10% 감소하였고, 유동자산도 1.39% 줄어들었다.
          고정자산의 높은 비율은 대부분의 자산이 토지(과수원, 밭), 시설(하우스, 농기계 등)에 집중되어 있는 구조임을 보여주며, 이는 농가의 자산이 상당 부분 현금화하기
          어려운 형태로 존재한다는 점을 의미한다.
        </p>

        <p>
          부채 측면에서는 2023년 기준 제주 농가의 평균 부채가 94,476천 원으로 나타났으며, 이는 전국 평균(35,785천 원)보다 58,691천 원 많은 수준이다. 전년 대비 3.08%,
          2003년 대비 약 114.75% 증가한 수치로, 장기적으로 부채 부담이 확대되고 있는 흐름을 보인다.
        </p>

        <p>
          부채의 성격을 보면, 농업용 부채가 전체의 69%를 차지하며 전년 대비 비중이 확대되었고, 비농업용 부채는 감소세를 보이고 있다. 그 외 가계용 부채는 19%, 기타 및
          겸업용 부채는 12%를 차지하고 있다.
        </p>

        <p>
          전국 평균 대비 약 2.6배에 달하는 높은 부채 수준은 제주 농업이 시설 투자와 운영 자본에 많은 비용을 지출하는 고정비 중심의 구조에 놓여 있음을 보여준다. 이는 생산
          기반 강화 측면에서는 긍정적일 수 있으나, 동시에 경기나 기후 변화에 따른 리스크에 더욱 취약해질 수 있는 재무 구조라는 점에서 면밀한 관리가 요구된다.
        </p>
      </section>

      <section className="rounded-lg border border-[#c2dfff] bg-[#e5f1ff] p-8 pb-4 shadow-sm">
        <h3 className="mb-2 items-center text-xl font-semibold">결론</h3>
        <p>
          제주 농가의 자산 및 부채 구조는 전국 평균과 비교할 때 규모면에서는 우위에 있으나, 구성면에서는 고정자산과 농업용 부채 비중이 높아 경영 유연성이 제한적인 특징을
          보인다. 자산 가치의 지속적 성장은 긍정적이나, 유동성 부족과 높은 부채 수준은 잠재적 위험 요소로 작용할 수 있다. 따라서 자산 구조의 다변화와 부채 관리 강화를
          통해 재무 안정성을 제고하는 노력이 필요하다.
        </p>
      </section>
    </div>
  );
}
