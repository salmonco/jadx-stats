import FarmIncomeCompositionChart from "./FarmCompositionChart";
import FarmIncomeTrendChart from "./FarmIncomeTrendChart";
import IncomeCompositionPieChart from "./IncomeCompositionChart";
import JejuNationalComparisonChart from "./JejuNationalComparisonChart";

const FarmIncomeStructure = () => {
  return (
    <div className="relative mb-8 min-h-screen rounded-lg bg-white p-8 pb-4 text-lg shadow-sm">
      <p className="leading-8">
        2023년 기준 제주 지역 농가의 연평균 소득은 <strong className="text-[#6366f1]">60,531천원</strong>으로, 전국평균 50,644천원 대비
        <strong className="text-[#10b981]"> 19.5% 높은</strong> 수준을 보였다. 농가소득의 구성을 살펴보면, 농업소득 비중은 전체의 25.2%에 불과하며, 농외소득 43.4%와
        이전소득 25.2%가 대부분을 차지하고 있어, 실질적으로 농업 외 소득 중심의 구조를 보인다.
      </p>

      <div className="my-10">
        <h2 className="mb-3 flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-[#2563eb]"></span>
          농가소득 추이 (2003-2023)
        </h2>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
          <div className="h-[400px]">
            <FarmIncomeTrendChart />
          </div>
        </div>
        <p className="mt-3 text-center text-sm font-medium text-gray-500">그림 1: 제주 농가소득 및 전국평균 추이 (2003-2023, 백만원)</p>
      </div>

      {/* 농가소득 구성 변화 차트 */}
      <div className="mb-10">
        <h2 className="mb-3 flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-[#2563eb]"></span>
          농가소득 구성 변화 (2003-2023)
        </h2>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
          <div className="h-[500px]">
            <FarmIncomeCompositionChart />
          </div>
        </div>
        <p className="mt-3 text-center text-sm font-medium text-gray-500">그림 2: 제주 농가소득 구성 변화 (2003-2023, %)</p>
      </div>

      {/* 2023년 소득 증감률과 구성비 */}
      <div className="mb-10 grid grid-cols-2 gap-8">
        <div>
          <h2 className="mb-3 flex items-center gap-3">
            <span className="h-8 w-1 rounded-full bg-[#2563eb]"></span>
            소득 종류별 전년대비 증감률 (2023)
          </h2>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              {/* 농업소득 */}
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-semibold text-gray-700">농업소득</h4>
                  <div className="flex items-center gap-1">
                    <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-bold text-red-500">-8.2%</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-red-500" style={{ width: "41%" }}></div>
                </div>
              </div>

              {/* 농외소득 */}
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-semibold text-gray-700">농외소득</h4>
                  <div className="flex items-center gap-1">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-bold text-green-500">+12.5%</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: "62.5%" }}></div>
                </div>
              </div>

              {/* 이전소득 */}
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-semibold text-gray-700">이전소득</h4>
                  <div className="flex items-center gap-1">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-bold text-green-500">+15.3%</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: "76.5%" }}></div>
                </div>
              </div>

              {/* 비경상소득 */}
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-semibold text-gray-700">비경상소득</h4>
                  <div className="flex items-center gap-1">
                    <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-bold text-red-500">-3.7%</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-red-500" style={{ width: "18.5%" }}></div>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-sm font-medium text-gray-500">그림 3: 소득 종류별 전년대비 증감률</p>
        </div>

        <div>
          <h2 className="mb-3 flex items-center gap-3">
            <span className="h-8 w-1 rounded-full bg-[#2563eb]"></span>
            2023년 소득 종류별 구성비율
          </h2>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
            <div className="h-[350px]">
              <IncomeCompositionPieChart />
            </div>
          </div>
          <p className="mt-3 text-center text-sm font-medium text-gray-500">그림 4: 2023년 소득 구성비율</p>
        </div>
      </div>

      {/* 제주와 전국 평균 비교 */}
      <div className="mb-10">
        <h2 className="mb-3 flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-[#2563eb]"></span>
          제주 농가소득과 전국 평균 비교 (2023)
        </h2>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
          <div className="h-[450px]">
            <JejuNationalComparisonChart />
          </div>
        </div>
        <p className="mt-3 text-center text-sm font-medium text-gray-500">그림 5: 제주 농가소득과 전국 평균 비교 (2023년, 천원)</p>
      </div>
    </div>
  );
};

export default FarmIncomeStructure;
