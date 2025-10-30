import AgeStructureLineChart from "./AgeStructureLineChart";
import AgeStructureStackedChart from "./AgeStructureStackedChart";

const AgriculturalPopulation = () => {
  return (
    <div className="relative mb-8 min-h-screen rounded-lg bg-white p-8 pb-4 text-lg shadow-sm">
      <p className="leading-8">
        생산가능 인구 구성 측면에서 세대별 비중 변화가 뚜렷하게 나타난다. 0세부터 14세까지의 유소년 인구는 1970년 전체 인구의 43%를 차지했으나, 이후 지속적으로 감소하여
        2023년에는 6%로 급감하였다. 반면, 15세부터 64세까지의 생산가능인구는 1970년 50%에서 증가하여 1995년에는 73%로 정점을 찍었으나, 이후 감소세로 전환되며 2023년에는
        56%로 나타났다. 고령인구인 65세 이상 인구는 1970년에는 전체 인구의 6%에 불과했으나, 이후 꾸준한 증가세를 보이며 2023년에는 37%까지 상승하였다. 이처럼 고령 인구의
        비중이 급격히 늘어난 반면, 유소년 인구는 급감하고 있어 인구 구조의 고령화가 심화되고 있는 상황이다.
      </p>

      <div className="my-10">
        <h2 className="flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-[#2563eb]"></span>
          연령별 인구 비율 변화
        </h2>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
          <div className="h-[500px]">
            <AgeStructureLineChart />
          </div>
        </div>
        <p className="mt-2 text-center text-sm text-gray-500">그림 1: 제주 농업 생산가능 인구의 연령별 비율 변화 (1990-2023)</p>
      </div>

      {/* 인구 구성 변화 스택 차트 */}
      <div className="mb-10">
        <h2 className="flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-[#2563eb]"></span>
          인구 구성 변화
        </h2>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
          <div className="h-[500px]">
            <AgeStructureStackedChart />
          </div>
        </div>
        <p className="mt-2 text-center text-sm text-gray-500">그림 2: 제주 농업 생산가능 인구 구성 변화 (1970-2023)</p>
      </div>
    </div>
  );
};

export default AgriculturalPopulation;
