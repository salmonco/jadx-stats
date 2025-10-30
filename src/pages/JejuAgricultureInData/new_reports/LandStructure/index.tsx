import CropCompositionPieChart from "./CropCompositionPieChart";
import CropCompositionStackedChart from "./CropCompositionStackedChart";
import LandAreaChangeChart from "./LandAreaChangeChart";

const LandStructure = () => {
  return (
    <div className="relative mb-8 min-h-screen rounded-lg bg-white p-8 pb-4 text-lg shadow-sm">
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">논 면적 변화</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">99% 감소</div>
          <div className="text-sm text-gray-600">1975년 1,062ha → 2023년 12ha</div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">밭 면적 변화</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">15% 증가</div>
          <div className="text-sm text-gray-600">1975년 48,436ha → 2023년 55,593ha</div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">채소+과수 비중</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">64%</div>
          <div className="text-sm text-gray-600">2023년 전체 재배면적 기준</div>
        </div>
      </div>

      <p className="leading-8">
        제주는 용암지형에 기반한 화산섬으로, 토양의 투수성이 매우 높아 물을 오래 가두기 어려운 특성이 있다. 이러한 물리적 제약으로 인해 논 농업에 필수적인 담수 유지가
        곤란하며, 상대적으로 온화한 겨울 기후 또한 논에서 재배되는 벼보다는 밭작물의 생육에 더욱 적합한 환경을 제공하고 있다. 이러한 자연환경의 영향은 장기적인 농지 구조
        변화로 이어졌다. 채소와 과수는 2009년 전체 재배면적의 66%를 차지하였으며, 2023년에도 여전히 64%를 차지하면서 타 작물 대비 지속적인 우위를 점하고 있다. 이는
        밭농업의 중심이 단지 면적 확대에 그치지 않고, 주요 소득 작물로서의 비중과 중요성에서도 확고히 자리매김하고 있음을 보여준다.
      </p>

      <div className="my-10">
        <h2 className="mb-3 flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-[#2563eb]"></span>
          제주 경지면적 변화 추이 (1975-2023)
        </h2>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
          <div className="h-[450px]">
            <LandAreaChangeChart />
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-gray-500">그림 1: 제주 경지면적 변화 추이 (1975-2023)</p>
      </div>

      {/* 작물별 재배면적 구성 변화 차트 */}
      <div className="mb-10">
        <h2 className="mb-3 flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-[#2563eb]"></span>
          작물별 재배면적 구성 변화 (2008-2023)
        </h2>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
          <div className="h-[450px]">
            <CropCompositionStackedChart />
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-gray-500">그림 2: 작물별 재배면적 구성 변화 (2008-2023)</p>
      </div>

      {/* 2023년 작물별 재배면적 구성비 */}
      <div className="mb-10">
        <h2 className="mb-3 flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-[#2563eb]"></span>
          2023년 작물별 재배면적 구성비
        </h2>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
          <div className="h-[400px]">
            <CropCompositionPieChart />
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-gray-500">그림 3: 2023년 작물별 재배면적 구성비</p>
      </div>
    </div>
  );
};

export default LandStructure;
