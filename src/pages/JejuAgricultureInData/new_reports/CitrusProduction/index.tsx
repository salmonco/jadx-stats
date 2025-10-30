import CitrusAreaTrendChart from "./CitrusAreaTrendChart";
import CitrusProductionTrendChart from "./CitrusProductionTrendChart";

const CitrusProduction = () => {
  return (
    <div className="relative mb-8 min-h-screen rounded-lg bg-white p-8 pb-4 text-lg shadow-sm">
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">재배면적 변화</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">41.3% 감소</div>
          <div className="text-sm text-gray-600">24,261ha → 14,242ha</div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">생산량 변화</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">21.8% 감소</div>
          <div className="text-sm text-gray-600">518,731톤 → 405,885톤</div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <div className="mb-3 text-sm font-semibold text-gray-700">단수 개선</div>
          <div className="mb-1 text-3xl font-bold text-gray-900">상대적 향상</div>
          <div className="text-sm text-gray-600">생산량 감소폭이 면적보다 작음</div>
        </div>
      </div>

      <p className="leading-8">
        2000년 기준 노지감귤 재배면적은 <strong className="text-[#2563eb]">24,261ha</strong>였으며, 이후 꾸준한 감소세를 보여 2023년경에는 14,242ha 수준으로 감소하였다.
        이는 2000년 대비 약 41.3% 감소한 수치이다. 생산량의 경우, 2000년에는 518,731톤이었으며, 이후에는 연도에 따라 등락을 반복하며 600,000톤 내외의 수준에서 등락을
        거듭하였고, 2012년 이후부터는 점진적인 감소 추세로 전환되었다. 2023년에는 생산량이 405,885톤을 기록하며, 2000년과 비교해 약 21.8% 감소하였다. 이와 같이,
        재배면적은 장기적으로 뚜렷한 감소세를 보인 반면, 생산량은 일정기간 등락을 반복하다가 감소하는 추세를 보인다. 생산량의 감소폭이 재배면적보다 상대적으로 작았다는
        점에서, 단위면적당 수확량(단수)이 일정 수준 개선되었다고 볼 수 있다.
      </p>

      <div className="my-10">
        <h2 className="mb-3 flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-[#2563eb]"></span>
          노지감귤 재배면적 변화 (2000-2023)
        </h2>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
          <div className="h-[400px]">
            <CitrusAreaTrendChart />
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-gray-500">그림 1: 노지감귤 재배면적 변화 (2000-2023, ha)</p>
      </div>

      {/* 노지감귤 생산량 변화 차트 */}
      <div className="mb-10">
        <h2 className="mb-3 flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-[#2563eb]"></span>
          노지감귤 생산량 변화 (2000-2023)
        </h2>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
          <div className="h-[400px]">
            <CitrusProductionTrendChart />
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-gray-500">그림 2: 노지감귤 생산량 변화 (2000-2023, 톤)</p>
      </div>
    </div>
  );
};

export default CitrusProduction;
