import MandarinAreaTrendChart from "./MandarinAreaTrendChart";
import MandarinProductionTrendChart from "./MandarinProductionTrendChart";

const MandarinProduction = () => {
  return (
    <div className="relative mb-8 min-h-screen rounded-lg bg-white p-8 pb-4 text-lg shadow-sm">
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">재배면적 변화</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">672.6% 증가</div>
          <div className="text-sm text-gray-600">540ha → 4,172ha</div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">생산량 변화</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">17배 증가</div>
          <div className="text-sm text-gray-600">6,618톤 → 116,559톤</div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">2017년 급증</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">50% 증가</div>
          <div className="text-sm text-gray-600">2,261ha → 3,392ha</div>
        </div>
      </div>

      <p className="leading-8">
        1997년 기준 만감류 재배면적은 <strong className="text-[#2563eb]">540ha</strong>였으며, 이후 꾸준한 증가세를 보여 2016년에는 2,261ha로 확대되었다. 특히 2016년
        이후에는 재배면적이 급격히 증가하여, 2017년에는 전년 대비 약 50% 증가한 3,392ha를 기록하였다. 이후 재배면적 증가세는 다소 완화되어, 점차 완만한 상승 추세로
        전환되었다. 한편, 생산량은 1997년 6,618톤에서 2023년에는 116,559톤으로 약 17배 증가하였으며, 이 역시 장기적인 증가 추세를 나타내고 있다.
      </p>

      <div className="my-10">
        <h2 className="mb-3 flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-[#2563eb]"></span>
          만감류 재배면적 변화 (1997-2023)
        </h2>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
          <div className="h-[400px]">
            <MandarinAreaTrendChart />
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-gray-500">그림 1: 만감류 재배면적 변화 (1997-2023, ha)</p>
      </div>

      {/* 만감류 생산량 변화 차트 */}
      <div className="my-10">
        <h2 className="mb-3 flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-[#2563eb]"></span>
          만감류 생산량 변화 (1997-2023)
        </h2>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
          <div className="h-[400px]">
            <MandarinProductionTrendChart />
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-gray-500">그림 2: 만감류 생산량 변화 (1997-2023, 톤)</p>
      </div>
    </div>
  );
};

export default MandarinProduction;
