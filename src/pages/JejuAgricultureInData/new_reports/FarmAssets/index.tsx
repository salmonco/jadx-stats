import AssetComparisonChart from "./AssetComparisonChart";
import AssetCompositionChart from "./AssetCompositionChart";
import AssetCompositionPieChart from "./AssetCompositionPieChart";
import FarmAssetsTrendChart from "./FarmAssetsTrendChart";

const FarmAssets = () => {
  return (
    <div className="relative mb-8 min-h-screen rounded-lg bg-white p-8 pb-4 text-lg shadow-sm">
      <p className="leading-8">
        2023년 제주 농가의 평균 자산은 <strong className="text-[#ef4444]">962백만원</strong>으로, 전국 평균 567백만원보다 394백만원 높은 수준을 기록하였다. 이는 2003년
        대비 약 200% 상승한 수치이지만, 전년 대비로는 9% 감소하여 일시적인 자산 조정이 있었던 것으로 보인다. 제주 농가의 2023년 자산 구성에서는 고정자산이 전체의 88%를
        차지하며, 유동자산은 12%에 불과하다. 특히 고정자산은 전년 대비 10% 감소하였고, 유동자산도 1.4% 줄어들었다. 고정자산의 높은 비율은 대부분의 자산이 토지(과수원,
        밭), 시설(하우스, 농기계 등)에 집중되어 있는 구조로 보인다.
      </p>

      <div className="my-10">
        <h2 className="mb-3 flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-[#2563eb]"></span>
          농가자산 변화 (2003-2023)
        </h2>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
          <div className="h-[400px]">
            <FarmAssetsTrendChart />
          </div>
        </div>
        <p className="mt-3 text-center text-sm font-medium text-gray-500">그림 1: 농가자산 변화 (2003-2023, 백만원)</p>
      </div>

      {/* 제주 농가자산 구성 변화 차트 */}
      <div className="mb-10">
        <h2 className="mb-3 flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-[#2563eb]"></span>
          제주 농가자산 구성 변화 (2003-2023)
        </h2>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
          <div className="h-[500px]">
            <AssetCompositionChart />
          </div>
        </div>
        <p className="mt-3 text-center text-sm font-medium text-gray-500">그림 2: 제주 농가자산 구성 변화 (2003-2023, %)</p>
      </div>

      {/* 2023년 자산 구성비와 제주-전국 비교 */}
      <div className="mb-10 grid grid-cols-2 gap-8">
        <div>
          <h2 className="mb-3 flex items-center gap-3">
            <span className="h-8 w-1 rounded-full bg-[#2563eb]"></span>
            2023년 제주 농가자산 구성비
          </h2>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
            <div className="h-[400px]">
              <AssetCompositionPieChart />
            </div>
          </div>
          <p className="mt-3 text-center text-sm font-medium text-gray-500">그림 3: 2023년 자산 구성비</p>
        </div>

        <div>
          <h2 className="mb-3 flex items-center gap-3">
            <span className="h-8 w-1 rounded-full bg-[#2563eb]"></span>
            제주 농가자산과 전국 평균 비교 (2023)
          </h2>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
            <div className="h-[400px]">
              <AssetComparisonChart />
            </div>
          </div>
          <p className="mt-3 text-center text-sm font-medium text-gray-500">그림 4: 제주 농가자산과 전국 평균 비교 (2023년)</p>
        </div>
      </div>
    </div>
  );
};

export default FarmAssets;
