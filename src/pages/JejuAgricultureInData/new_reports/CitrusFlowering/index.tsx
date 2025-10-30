import FloweringTrendChart from "./FloweringTrendChart";
import FloweringHeatmap2023 from "~/assets/jeju-agriculture-in-data/flowering-heatmap-2023.png";
import FloweringHeatmap2016 from "~/assets/jeju-agriculture-in-data/flowering-heatmap-2016.png";

const CitrusFlowering = () => {
  return (
    <div className="relative mb-8 min-h-screen rounded-lg bg-white p-8 pb-4 text-lg shadow-sm">
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">제주시 개화시기 변화</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">4일 단축</div>
          <div className="text-sm text-gray-600">2016년 5월 4일 → 2024년 4월 30일</div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">서귀포시 개화시기 변화</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">5일 단축</div>
          <div className="text-sm text-gray-600">2016년 5월 3일 → 2024년 4월 28일</div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">2021년 이후 경향</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">4월 말</div>
          <div className="text-sm text-gray-600">대부분의 개화가 4월 말에 집중</div>
        </div>
      </div>

      <p className="leading-8">
        최근 제주시와 서귀포시를 포함한 제주 전역에서 개화 시기가 점차 앞당겨지는 경향이 관찰되고 있다. 제주시의 경우, 2016년 개화일은 5월 4일이었으나 2024년에는 4월
        30일로, 서귀포시는 같은 기간 동안 5월 3일에서 4월 28일로 앞당겨져 각각 4일, 5일 정도 빠르게 꽃이 피기 시작한 것으로 나타났다. 이러한 변화는 일시적인 변동이 아닌
        기후변화에 따른 장기적인 추세로 분석되고 있다. 특히 2021년 이후로는 대부분의 개화가 4월 말에 이뤄지고 있어, 개화 시기의 점진적인 조기화가 뚜렷하게 나타나는 모습을
        보인다. 기후 변화는 이미 농업의 일상 속에 깊숙이 영향을 미치고 있으며, 단기적 대응을 넘어 장기적 관점의 적응력 강화가 더욱 중요해진다고 볼 수있다.
      </p>

      <div className="my-10">
        <h2 className="mb-6 flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-[#2563eb]"></span>
          연도별 노지감귤 개화일자 추이 (해안)
        </h2>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
          <div className="h-[500px]">
            <FloweringTrendChart />
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-gray-500">그림 1: 연도별 노지감귤 개화일자 추이 (2016-2024)</p>
      </div>

      {/* 지역별 개화율 비교 */}
      <div className="mb-10">
        <h2 className="mb-6 flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-[#2563eb]"></span>
          지역별 개화율 비교 (2023년 vs 2016년)
        </h2>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
          <div className="flex items-start justify-center gap-8">
            <div className="text-center">
              <h3 className="mb-3 text-base font-semibold text-gray-800">2023년</h3>
              <img src={FloweringHeatmap2023} alt="2023년 지역별 개화율" className="h-[360px] w-auto rounded-lg shadow-sm" />
            </div>

            <div className="text-center">
              <h3 className="mb-3 text-base font-semibold text-gray-800">2016년</h3>
              <img src={FloweringHeatmap2016} alt="2016년 지역별 개화율" className="h-[360px] w-auto rounded-lg shadow-sm" />
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">그림 2-3: 지역별 월별 개화율 히트맵 비교 (2023년 vs 2016년)</p>
      </div>
    </div>
  );
};

export default CitrusFlowering;
