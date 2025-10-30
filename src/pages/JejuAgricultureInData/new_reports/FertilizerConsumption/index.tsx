import FertilizerComparisonTable from "./FertilizerComparisonTable";
import FertilizerConsumptionTrendChart from "./FertilizerConsumptionTrendChart";

const FertilizerConsumption = () => {
  return (
    <div className="relative mb-8 min-h-screen rounded-lg bg-white p-8 pb-4 text-lg shadow-sm">
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">1975년 제주/전국 비율</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">1.2배</div>
          <div className="text-sm text-gray-600">제주 468kg/ha vs 전국 396kg/ha</div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">1994년 최대 격차</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">2.7배</div>
          <div className="text-sm text-gray-600">제주 1,076kg/ha vs 전국 399kg/ha</div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">2023년 현재 비율</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">1.7배</div>
          <div className="text-sm text-gray-600">제주 414kg/ha vs 전국 247kg/ha</div>
        </div>
      </div>

      <p className="leading-8">
        1975년 제주도의 단위면적당 비료 사용량은 468kg/ha로, 같은 해 전국 평균(396kg/ha)보다 약 1.2배 높은 수준이었다. 이후 1994년에는 제주도의 비료 사용량이 1,076kg/ha로
        급증하며 전국 평균(399kg/ha)의 2.7배에 달하는 최대 격차를 기록하였다. 이러한 현상은 밭작물 중심의 집약적 농업구조의 영향으로 보인다. 그러나 1990년대 중반
        이후부터는 환경 문제와 친환경 농업, 지속가능한 농업 등에 대한 사회적 관심이 증가하면서, 제주도에서도 비료 사용량이 빠르게 감소하였다. 2005년에는 599kg/ha,
        2010년에는 320kg/ha까지 줄어들었으며, 같은 기간 전국 평균 역시 354kg/ha에서 219kg/ha로 감소하였다. 2023년 현재 제주도의 비료 사용량은 414kg/ha로 다소
        반등하였지만, 전국 평균(247kg/ha)과 비교할 때 여전히 약 1.7배 높은 수준을 유지하고 있다. 이에 따라 작물별 정밀 시비 지도, 정확한 토양진단 기반 시비 처방 시스템
        등이 고려되어야 할 것으로 보인다.
      </p>

      <div className="my-10">
        <h2 className="mb-3 flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-[#2563eb]"></span>
          경지면적당 비료소비량 변화 추이 (1975-2023)
        </h2>
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
          <FertilizerConsumptionTrendChart />
        </div>
        <p className="mt-3 text-center text-sm text-gray-500">그림 1: 경지면적당 비료소비량 변화 추이 (1975-2023)</p>
      </div>

      {/* 주요 연도별 제주와 전국 비료소비량 비교 */}
      <div className="mb-10">
        <h2 className="mb-3 flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-[#2563eb]"></span>
          주요 연도별 제주와 전국 비료소비량 비교
        </h2>
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
          <FertilizerComparisonTable />
        </div>
        <p className="mt-3 text-center text-sm text-gray-500">표 1: 주요 연도별 제주와 전국 비료소비량 비교</p>
      </div>
    </div>
  );
};

export default FertilizerConsumption;
