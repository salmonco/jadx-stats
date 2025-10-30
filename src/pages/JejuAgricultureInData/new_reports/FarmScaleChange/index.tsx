import FarmScalePieChart from "./FarmScalePieChart";
import FarmScaleTrendChart from "./FarmScaleTrendChart";

const FarmScaleChange = () => {
  return (
    <div className="relative mb-8 min-h-screen rounded-lg bg-white p-8 pb-4 text-lg shadow-sm">
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">소규모 농가 변화</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">17.6%p 감소</div>
          <div className="text-sm text-gray-600">1980년 50.6% → 2024년 33.0%</div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">중규모 농가 변화</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">11.0%p 증가</div>
          <div className="text-sm text-gray-600">1980년 42.4% → 2024년 53.4%</div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">대규모 농가 변화</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">6.5%p 증가</div>
          <div className="text-sm text-gray-600">1980년 7.0% → 2024년 13.5%</div>
        </div>
      </div>

      <p className="leading-8">
        제주 농업은 지난 수십년간 뚜렷한 변화를 이어온 모습을 보인다. 1980년대까지만 해도 50%이상의 농가가 0.5ha 미만의 소규모 경지를 경작했지만, 이제는 0.5ha~2ha 사이의
        중규모 농가가 제주 농업의 중심축이 되었다. 특히 2010년 이후 중규모 농가 비중이 꾸준히 50%를 상회하며, 제주의 농업 기반이 보다 안정적인 경영 구조로 이동 중임을
        보여준다. 반면 2ha 이상의 대규모 농가는 일정 수준까지 확대되었다가 다시 정체된 모습을 보인다. 이러한 변화는 제주 농업이 급격한 대규모화보다는 중규모 농가를
        중심으로 점차적으로 규모화되는 방향으로 구조 전환이 이루어지고 있음을 보여준다.
      </p>

      <div className="my-10">
        <h2 className="mb-6 flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-[#2563eb]"></span>
          제주 경지규모별 농가수 변화 추이 (1980-2024)
        </h2>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
          <div className="h-[500px]">
            <FarmScaleTrendChart />
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-gray-500">그림 1: 제주 경지규모별 농가수 변화 추이 (1980-2024)</p>
      </div>

      {/* 2024년 현재 비중 */}
      <div className="mb-10">
        <h2 className="mb-6 flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-[#2563eb]"></span>
          2024년 제주 경지규모별 농가수 비중
        </h2>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
          <div className="h-[400px]">
            <FarmScalePieChart />
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-gray-500">그림 2: 2024년 제주 경지규모별 농가수 비중</p>
      </div>
    </div>
  );
};

export default FarmScaleChange;
