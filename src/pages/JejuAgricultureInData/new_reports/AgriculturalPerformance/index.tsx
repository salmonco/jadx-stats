import CapitalProductivityChart from "./CapitalProductivityChart";
import LaborProductivityChart from "./LaborProductivityChart";
import LandProductivityChart from "./LandProductivityChart";

const AgriculturalPerformance = () => {
  return (
    <div className="relative mb-8 min-h-screen rounded-lg bg-white p-8 pb-4 text-lg shadow-sm">
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">2023년 노동생산성</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">22천원</div>
          <div className="text-sm text-gray-600">전국 평균 대비 +22%</div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">2023년 토지생산성</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">1,769천원</div>
          <div className="text-sm text-gray-600">전국 평균 대비 -24%</div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">2023년 자본생산성</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">270천원</div>
          <div className="text-sm text-gray-600">전국 평균 대비 +12%</div>
        </div>
      </div>

      <p className="leading-8">
        2003년부터 2023년까지 제주도의 노동, 토지, 자본 생산성은 대체로 상승세를 보였으며, 대부분의 기간 동안 전국 평균을 상회하였다. 최근 5년간(2019~2023년) 제주도의{" "}
        <strong className="text-[#2563eb]">노동생산성은 매년 증가하여 2023년에는 22천원</strong>으로 전국 평균인 18천원을 상회하였다. 토지생산성 역시 상승세를 유지하며
        2023년에는 2,343천원으로 전년 대비 증가하였고, 전국 평균(1,867천원)보다 높은 수준을 기록하였다. 자본생산성은 최근 변동이 있었지만 2023년 기준 270천원으로 전년
        대비 소폭 감소했음에도 전국 평균(246천원)을 상회하였다. 전반적으로 제주도는 노동, 토지, 자본 생산성 모두에서 전국 평균보다 높은 수준을 유지하고 있으며, 특히
        노동과 토지 부문에서의 생산성 향상이 두드러진다.
      </p>

      <div className="my-10">
        <h2 className="mb-3 flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-[#2563eb]"></span>
          노동생산성 변화 (2003-2023)
        </h2>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
          <div className="h-[400px]">
            <LaborProductivityChart />
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-gray-500">그림 1: 노동생산성 변화 (2003-2023, 천원)</p>
      </div>

      {/* 토지생산성 변화 추이 차트 */}
      <div className="my-10">
        <h2 className="mb-3 flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-[#2563eb]"></span>
          토지생산성 변화 (2003-2023)
        </h2>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
          <div className="h-[400px]">
            <LandProductivityChart />
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-gray-500">그림 2: 토지생산성 변화 (2003-2023, 천원)</p>
      </div>

      {/* 자본생산성 변화 추이 차트 */}
      <div className="my-10">
        <h2 className="mb-3 flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-[#2563eb]"></span>
          자본생산성 변화 (2003-2023)
        </h2>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
          <div className="h-[400px]">
            <CapitalProductivityChart />
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-gray-500">그림 3: 자본생산성 변화 (2003-2023, 천원)</p>
      </div>

      {/* 용어 설명 섹션 */}
      <div className="mt-10 border-t border-gray-100 pb-4 pt-8">
        <h3 className="mb-3 text-[16px] font-medium text-gray-700">용어 설명</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-1 text-[14px] text-gray-600">
            <h4 className="font-medium text-gray-800">노동생산성</h4>
            <p className="leading-relaxed">
              <span className="text-gray-500">정의:</span> 농업부가가치/자영농업노동시간
            </p>
            <p className="leading-relaxed">노동생산성은 자본생산성 지표와 함께 농업과 타산업 또는 농가 상호간의 경제적 능력을 나타냄</p>
          </div>
          <div className="space-y-1 text-[14px] text-gray-600">
            <h4 className="font-medium text-gray-800">토지생산성</h4>
            <p className="leading-relaxed">
              <span className="text-gray-500">정의:</span> 농업부가가치/경지면적(10a)
            </p>
            <p className="leading-relaxed">토지면적 단위당의 생산량을 말하며, 그 토지의 경제성을 타 토지와 비교하는데 사용</p>
          </div>
          <div className="space-y-1 text-[14px] text-gray-600">
            <h4 className="font-medium text-gray-800">자본생산성</h4>
            <p className="leading-relaxed">
              <span className="text-gray-500">정의:</span> 농업부가가치/농업자본
            </p>
            <p className="leading-relaxed">투입된 자본에 대한 생산량</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriculturalPerformance;
