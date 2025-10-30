import ExpenditureComparisonChart from "./ExpenditureComparisonChart";
import ExpenditureCompositionChart from "./ExpenditureCompositionChart";
import ExpenditureCompositionPieChart from "./ExpenditureCompositionPieChart";
import FarmExpenditureTrendChart from "./FarmExpenditureTrendChart";

const FarmExpenditureTrend = () => {
  return (
    <div className="relative mb-8 min-h-screen rounded-lg bg-white p-8 pb-4 text-lg shadow-sm">
      <p className="leading-8">
        2023년 기준 제주 농가의 연간 가계지출은 <strong className="text-[#ef4444]">47백만원</strong>으로 나타났으며, 이는 2003년 대비 약 47% 증가한 수치이다. 전반적으로
        제주 농가의 가계지출은 꾸준히 상승세를 보이고 있으며, 특히 2013년 이후부터는 증가 폭이 더욱 뚜렷하게 나타나고 있다. 이러한 지출 수준은 전국 평균과 비교해도 차이가
        크다. 2023년 전국 농가의 평균 가계지출은 <strong className="text-[#1e40af]">37백만원</strong>으로, 제주 농가는 이보다{" "}
        <strong className="text-[#4f46e5]">10백만원 더 높은</strong> 지출을 기록하였다. 최근으로 올수록 이 격차는 더욱 확대되는 추세이다.
      </p>

      <div className="my-10">
        <h2 className="mb-3 flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-[#2563eb]"></span>
          농가 가계지출 추이 (2003-2023)
        </h2>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
          <div className="h-[400px]">
            <FarmExpenditureTrendChart />
          </div>
        </div>
        <p className="mt-3 text-center text-sm font-medium text-gray-500">그림 1: 농가 가계지출 변화 (2003-2023, 백만원)</p>
      </div>

      {/* 가계지출 구성 변화 차트 */}
      <div className="mb-10">
        <h2 className="mb-3 flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-[#2563eb]"></span>
          제주농가 가계지출 구성 변화 (2003-2023)
        </h2>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
          <div className="h-[500px]">
            <ExpenditureCompositionChart />
          </div>
        </div>
        <p className="mt-3 text-center text-sm font-medium text-gray-500">그림 2: 제주농가 가계지출 구성 변화 (2003-2023, %)</p>
      </div>

      {/* 2023년 지출 구성비와 제주-전국 비교 */}
      <div className="mb-10 grid grid-cols-2 gap-8">
        <div>
          <h2 className="mb-3 flex items-center gap-3">
            <span className="h-8 w-1 rounded-full bg-[#2563eb]"></span>
            2023년 가계지출 구성비
          </h2>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
            <div className="h-[400px]">
              <ExpenditureCompositionPieChart />
            </div>
          </div>
          <p className="mt-3 text-center text-sm font-medium text-gray-500">그림 3: 2023년 가계지출 구성비</p>
        </div>

        <div>
          <h2 className="mb-3 flex items-center gap-3">
            <span className="h-8 w-1 rounded-full bg-[#2563eb]"></span>
            제주 농가 가계지출과 전국 평균 비교 (2023)
          </h2>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
            <div className="h-[400px]">
              <ExpenditureComparisonChart />
            </div>
          </div>
          <p className="mt-3 text-center text-sm font-medium text-gray-500">그림 4: 제주 농가 가계지출과 전국 평균 비교 (2023년)</p>
        </div>
      </div>
    </div>
  );
};

export default FarmExpenditureTrend;
