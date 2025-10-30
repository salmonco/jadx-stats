import DebtComparisonChart from "./DebtComparisonChart";
import DebtCompositionChart from "./DebtCompositionChart";
import DebtCompositionPieChart from "./DebtCompositionPieChart";
import DebtManagementCostChart from "./DebtManagementCostChart";
import FarmDebtTrendChart from "./FarmDebtTrendChart";

const FarmDebt = () => {
  return (
    <div className="relative mb-8 min-h-screen rounded-lg bg-white p-8 pb-4 text-lg shadow-sm">
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">2023년 부채 현황</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">94백만원</div>
          <div className="text-sm text-gray-600">전국 평균 대비 2.6배</div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">농업용 부채 비중</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">69%</div>
          <div className="text-sm text-gray-600">전년 대비 비중 확대</div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">20년간 증가율</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">115%</div>
          <div className="text-sm text-gray-600">2003년 대비 상승</div>
        </div>
      </div>

      <p className="leading-8">
        부채 측면에서는 2023년 기준 제주 농가의 평균 부채가 <strong className="text-[#2563eb]">94백만원</strong>
        으로 나타났으며, 이는 전국 평균(35백만원)보다 59백만원 많은 수준이다. 이는 전년 대비 3%, 2003년 대비 약 115% 증가한 수치로, 장기적으로 부채 부담이 확대되고 있는
        흐름을 보인다. 부채의 성격을 보면, 농업용 부채가 전체의 69%를 차지하며 전년 대비 비중이 확대되었고, 비농업용 부채는 감소세를 보이고 있다. 그 외 가계용 부채는 19%,
        기타 및 겸업용 부채는 12%를 차지하고 있다. 전국 평균 대비 약 2.6배에 달하는 높은 부채 수준은 제주 농업이 시설 투자와 운영 자본에 많은 비용을 지출하는 고정비
        중심의 구조에 놓여 있음을 보여준다.
      </p>

      <div className="my-10">
        <h2 className="mb-3 flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-[#2563eb]"></span>
          농가부채 변화 (2003-2023)
        </h2>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
          <div className="h-[400px]">
            <FarmDebtTrendChart />
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-gray-500">그림 1: 농가부채 변화 (2003-2023, 백만원)</p>
      </div>

      {/* 제주 농가부채 구성 변화 차트 */}
      <div className="mb-10">
        <h2 className="mb-3 flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-[#2563eb]"></span>
          제주 농가부채 구성 변화 (2003-2023)
        </h2>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
          <div className="h-[500px]">
            <DebtCompositionChart />
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-gray-500">그림 2: 제주 농가부채 구성 변화 (2003-2023, %)</p>
      </div>

      {/* 2023년 부채 구성비와 제주-전국 비교 */}
      <div className="mb-10 grid grid-cols-2 gap-8">
        <div>
          <h2 className="mb-3 flex items-center gap-3">
            <span className="h-6 w-1 rounded-full bg-[#2563eb]"></span>
            2023년 제주 농가부채 구성비
          </h2>
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
            <div className="h-[400px]">
              <DebtCompositionPieChart />
            </div>
          </div>
          <p className="mt-3 text-center text-sm text-gray-500">그림 3: 2023년 부채 구성비</p>
        </div>

        <div>
          <h2 className="mb-3 flex items-center gap-3">
            <span className="h-6 w-1 rounded-full bg-[#2563eb]"></span>
            제주 농가부채와 전국 평균 비교 (2023)
          </h2>
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
            <div className="h-[400px]">
              <DebtComparisonChart />
            </div>
          </div>
          <p className="mt-3 text-center text-sm text-gray-500">그림 4: 제주 농가부채와 전국 평균 비교 (2023년)</p>
        </div>
      </div>

      {/* 농가부채와 농업경영비 관계 */}
      <div className="mb-10">
        <h2 className="mb-3 flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-[#2563eb]"></span>
          농가부채와 농업경영비 변화 (2003-2023)
        </h2>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
          <div className="h-[450px]">
            <DebtManagementCostChart />
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-gray-500">그림 5: 농가부채와 농업경영비 변화 (2003-2023, 백만원)</p>
      </div>
    </div>
  );
};

export default FarmDebt;
