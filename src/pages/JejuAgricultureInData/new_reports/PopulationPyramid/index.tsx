import PopulationPyramidChart from "./PopulationPyramidChart";

const PopulationPyramid = () => {
  return (
    <div className="relative mb-8 min-h-screen rounded-lg bg-white p-8 pb-4 text-lg shadow-sm">
      <p className="leading-8">
        지난 34년간 제주 지역의 농가인구 구조는 급격한 변화를 겪어왔다. 1990년대 초반만 해도 상대적으로 균형잡힌 연령 분포를 보였던 제주 농가인구는 2024년 현재 전형적인
        역피라미드 구조로 변화하였다.
      </p>

      <div className="my-10">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
          <div className="h-[1170px]">
            <PopulationPyramidChart />
          </div>
        </div>
        <p className="mb-8 mt-3 text-center text-sm text-gray-500">그림 1: 제주 농가인구 연령별 피라미드 변화 (1990-2024년)</p>
      </div>

      {/* 주요 분석 결과 */}
      <div className="mb-10 grid gap-8 md:grid-cols-2">
        <div className="rounded-lg bg-blue-50 p-6">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-blue-800">
            <span className="h-2 w-2 rounded-full bg-blue-600"></span>
            청년층 인구 감소
          </h3>
          <p className="text-sm leading-relaxed text-blue-700">
            1990년대에는 청년층(0-29세)이 전체 농가인구의 상당 부분을 차지했으나, 현재는 10% 미만으로 급격히 감소하였다. 이는 농업 후계자 부족과 직결되는 심각한 문제이다.
          </p>
        </div>

        <div className="rounded-lg bg-orange-50 p-6">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-orange-800">
            <span className="h-2 w-2 rounded-full bg-orange-600"></span>
            고령화 심화
          </h3>
          <p className="text-sm leading-relaxed text-orange-700">
            60세 이상 고령층이 전체 농가인구의 절반 이상을 차지하게 되어 농업 인력의 고령화가 심각한 수준에 이르렀다. 이는 농업 생산성과 지속가능성에 중대한 영향을 미치고
            있다.
          </p>
        </div>
      </div>

      {/* 상세 분석 */}
      <div className="space-y-6">
        <p>
          특히 주목할 점은 성별에 따른 인구 분포의 차이이다. 고령층에서는 여성 인구가 남성 인구보다 많은 현상이 지속되고 있으며, 이는 평균 수명의 차이와 농업 종사 패턴의
          변화를 반영한다.
        </p>

        <p>
          이러한 인구 구조의 변화는 제주 농업의 미래에 대한 근본적인 질문을 제기한다. 청년 농업인의 부족은 농업 기술의 혁신과 전수를 어렵게 만들고 있으며, 고령 농업인의
          증가는 노동 집약적 농업 방식의 지속가능성에 의문을 제기하고 있다.
        </p>
      </div>
    </div>
  );
};

export default PopulationPyramid;
