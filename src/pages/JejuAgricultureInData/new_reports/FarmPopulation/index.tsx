import FarmPopulationHouseholdChart from "./FarmPopulationHouseholdChart";

const FarmPopulation = () => {
  return (
    <div className="relative mb-8 min-h-screen rounded-lg bg-white p-8 pb-4 text-lg shadow-sm">
      <div className="mb-10">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
          <div className="h-[500px]">
            <FarmPopulationHouseholdChart />
          </div>
        </div>
        <p className="mt-2 text-center text-sm text-gray-500">그림 1: 제주 농가인구 및 농가 수 변화 추이 (1993-2023)</p>
      </div>

      <p className="leading-8">
        지난 30년간 제주 지역의 농가 인구와 농가 수는 지속적인 감소 추세를 보여 왔다. 통계에 따르면 1993년에는 151,350명이던 농가 인구가 2023년에는 72,985명으로 줄어들며
        약 71%라는 급격한 감소율을 기록하였다. 반면, 같은 기간 농가 수는 40,192호에서 30,357호로 약 24% 감소하는 데 그쳤다. 이러한 수치는 단순히 농촌 인구가 줄어들고
        있다는 사실을 넘어서, 농가당 평균 구성원 수가 점차 감소하고 있다는 구조적 변화를 보인다. 예전에는 여러 세대가 함께 거주하던 대가족 중심의 농가가 주를 이루었으나,
        점차 1~2인 가구 또는 고령 단독 농가의 비중이 증가하면서 가족 구성원의 규모가 축소되고 있는 것으로 보여진다. 이와같은 변화는 가족 중심 농업에서 보다 전문화된
        농업체계로 전환하는 긍정적인 의미도 있지만, 한편으로는 고령화 심화와 청년층의 농촌 이탈 등의 문제도 내포하고 있다.
      </p>
    </div>
  );
};

export default FarmPopulation;
