import FloweringDateTrendChart from "./FloweringDateTrendChart";
import { TrendingUp, ChartGantt, AlertTriangle, Bug } from "lucide-react";
import { Image } from "antd";

export default function MandarinFlowering() {
  return (
    <div className="relative min-h-screen text-lg">
      <section className="mb-8 rounded-lg border border-[#c2dfff] bg-[#e5f1ff] p-8 pb-4 shadow-sm">
        <h3 className="mb-4 text-xl font-bold text-gray-900">주요 요약</h3>
        <ul className="list-disc space-y-1 pl-5 text-gray-700">
          <li>최근 제주시와 서귀포시를 포함한 제주지역에서 개화시기가 점점 앞당겨지고 있는 경향임</li>
          <li>제주시의 경우 2016년 5월 4일이던 개화일이 2024년에는 4월 30일로, 서귀포시는 같은 기간 5월 3일에서 4월 28일로 각각 4일 및 5일이 빨라졌음</li>
          <li>이러한 변화는 단기적인 현상이 아닌, 기후변화에 따른 장기적인 추세로 나타남</li>
          <li>특히 2021년 이후에는 대부분 4월 말에 개화가 이루어지고 있으며, 개화시기가 점진적으로 앞당겨지는 추세임</li>
          <li>이로 인해 병해충 발생시기도 앞당겨질 가능성이 높아지고, 노지감귤 생육 단계별 관리에 차질이 생길 우려가 있음</li>
        </ul>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 pb-4 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <TrendingUp className="h-5 w-5 text-[#1e3a8a]" />
          제주지역 노지감귤 개화시기 변화
        </h3>

        <p>
          최근 제주시와 서귀포시를 포함한 제주 전역에서 개화 시기가 점차 앞당겨지는 경향이 관찰되고 있다. 제주시의 경우, 2016년 개화일은 5월 4일이었으나 2024년에는 4월
          30일로, 서귀포시는 같은 기간 동안 5월 3일에서 4월 28일로 앞당겨져 각각 4일, 5일 정도 빠르게 꽃이 피기 시작한 것으로 나타났다.
        </p>

        <div className="my-10">
          <figure className="relative">
            <div className="h-[550px] w-full">
              <FloweringDateTrendChart />
            </div>
            <figcaption className="mt-3 text-center text-sm text-gray-500">그림 1: 연도별 노지감귤 개화일자 추이(해안) (2016-2023)</figcaption>
          </figure>
        </div>

        <p>
          이러한 변화는 일시적인 변동이 아닌 기후변화에 따른 장기적인 추세로 분석되고 있다. 특히 2021년 이후로는 대부분의 개화가 4월 말에 이뤄지고 있어, 개화 시기의
          점진적인 조기화가 뚜렷하게 나타나는 양상이다.
        </p>

        <p>
          위 그래프에서 볼 수 있듯이, 제주시(파란색 선)와 서귀포시(주황색 선) 모두 개화일이 점차 앞당겨지는 추세를 보이고 있으며, 점선으로 표시된 추세선은 이러한 경향이
          일시적인 현상이 아닌 장기적인 변화임을 보여준다. 특히 서귀포시의 경우 2021년에는 4월 23일로 급격히 앞당겨졌다가 다시 조정되는 모습을 보였으나, 전반적으로는
          개화시기가 빨라지는 추세가 지속되고 있다.
        </p>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 pb-4 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <ChartGantt className="h-5 w-5 text-[#1e3a8a]" />
          지역별 개화율 비교 (2016년 vs 2023년)
        </h3>

        <p>
          지역별 개화율을 비교해보면, 2016년과 2023년 사이에 개화 패턴의 변화가 더욱 명확하게 드러난다. 아래 열지도는 각 지역별 개화율을 시간에 따라 보여주는데, 색상이
          짙어질수록 개화율이 높음을 의미한다.
        </p>

        <div className="my-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-0">
          <div className="flex justify-center">
            <figure className="relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RUeXCjySynZ6msnhgZfsbgB3VzhR1i.png"
                alt="2016년 지역별 개화율"
                width={500}
                height={400}
                className="w-full rounded-lg"
              />
              <figcaption className="mt-3 text-center text-sm text-gray-500">그림 2: 2016년 지역별 개화율</figcaption>
            </figure>
          </div>

          <div className="flex justify-center">
            <figure className="relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WHylB8a2Sg7NleKoDnLFIHIng4hGj0.png"
                alt="2023년 지역별 개화율"
                width={500}
                height={400}
                className="w-full rounded-lg"
              />
              <figcaption className="mt-3 text-center text-sm text-gray-500">그림 3: 2023년 지역별 개화율</figcaption>
            </figure>
          </div>
        </div>

        <p>
          2016년과 2023년의 지역별 개화율 열지도를 비교해보면, 전반적으로 개화 시기가 앞당겨진 것을 확인할 수 있다. 2016년에는 대부분의 지역에서 5월 초에 개화가
          본격화되었으나, 2023년에는 4월 말부터 개화가 시작되어 더 이른 시기에 높은 개화율을 보이고 있다. 이는 기후변화로 인한 온도 상승이 감귤의 생육 주기에 직접적인
          영향을 미치고 있음을 시사한다.
        </p>
      </section>

      <section className="mb-8 rounded-lg bg-white p-8 pb-4 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <Bug className="h-5 w-5 text-[#1e3a8a]" />
          개화시기 변화의 영향 및 우려사항
        </h3>

        <p>개화 시기의 변화는 단순히 달력상의 날짜 변동을 넘어, 농업 생태계 전반에 다양한 영향을 미칠 수 있다. 특히 다음과 같은 우려사항이 제기되고 있다.</p>

        <div className="my-8 rounded-lg border-l-4 border-[#f59e0b] bg-[#fff8e6] p-6">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-[#b45309]">
            <AlertTriangle className="h-5 w-5" />
            주요 우려사항
          </h3>
          <ul className="list-disc space-y-3 pl-5 text-gray-700">
            <li>
              <strong>병해충 발생시기 변화:</strong> 개화시기가 앞당겨짐에 따라 병해충의 활동 시기도 함께 앞당겨질 가능성이 높아지고 있다. 이는 기존의 방제 일정과 차이가
              생겨 적기 방제에 어려움을 초래할 수 있다.
            </li>
            <li>
              <strong>생육 단계별 관리 차질:</strong> 노지감귤의 생육 단계가 변화함에 따라 기존에 수립된 생육 단계별 관리 계획에 차질이 생길 우려가 있다. 특히 비료 살포,
              적과, 수확 등의 작업 시기 조정이 필요할 수 있다.
            </li>
          </ul>
        </div>
      </section>

      <section className="rounded-lg border border-[#c2dfff] bg-[#e5f1ff] p-8 pb-4 shadow-sm">
        <h3 className="mb-2 flex items-center gap-2 text-xl font-semibold">시사점 및 전망</h3>

        <p>개화시기 변화에 효과적으로 대응하기 위해서는 다음과 같은 종합적인 접근이 필요하다.</p>

        <div className="my-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-[#1e3a8a]">병해충 예찰시스템 조기 가동</h3>
            <p className="text-[16px] text-gray-600">
              개화시기가 앞당겨짐에 따라 병해충 발생 시기도 함께 변화할 가능성이 높다. 이에 병해충 예찰시스템을 조기에 가동하여 초기 이상 징후를 조기에 포착하고 대응할 수
              있는 체계를 마련해야 한다.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-[#1e3a8a]">적기방제 및 맞춤형 농약·비료 살포</h3>
            <p className="text-[16px] text-gray-600">
              생육 단계에 맞춘 맞춤형 농약 및 비료 살포 체계를 재정립해야 한다. 특히 개화시기 변화에 따른 생육 단계별 적정 방제 시기를 재설정하고, 이에 맞춰 농약 및 비료
              살포 일정을 조정할 필요가 있다.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-[#1e3a8a]">품종별 개화시기 모니터링 강화</h3>
            <p className="text-[16px] text-gray-600">
              품종별 개화 시기 모니터링을 강화하고, 데이터 기반 대응체계를 구축함으로써 유연하고 과학적인 농작업 계획이 가능하도록 해야 한다. 특히 지역별, 품종별 차이를
              고려한 맞춤형 관리 방안이 필요하다.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-[#1e3a8a]">농업인 대상 교육 및 정보제공 강화</h3>
            <p className="text-[16px] text-gray-600">
              변화하는 기후 환경에 농업인들이 효과적으로 대응할 수 있도록 교육 및 정보 제공을 강화해야 한다. 특히 개화시기 변화에 따른 영농 관리 방법, 병해충 방제 요령,
              기상 변동성 대응 방안 등에 대한 실질적인 정보가 제공되어야 한다.
            </p>
          </div>
        </div>

        <h3 className="mb-2 items-center text-xl font-semibold">결론</h3>
        <p>
          제주 노지감귤의 개화시기는 지난 수년간 뚜렷하게 앞당겨지는 추세를 보이고 있으며, 이는 기후변화에 따른 장기적인 현상으로 분석된다. 이러한 변화는 병해충 발생 시기
          변화, 생육 단계별 관리 차질 등 다양한 농업적 영향을 초래할 수 있어 체계적인 대응이 필요하다.
        </p>
        <p className="mt-4">
          특히 병해충 예찰시스템 조기 가동, 적기 방제 및 맞춤형 농약·비료 살포, 품종별 개화시기 모니터링 강화, 농업인 대상 교육 및 정보 제공 강화 등 종합적인 접근을 통해
          개화시기 변화에 효과적으로 대응해 나가야 할 것이다.
        </p>
        <p className="mt-4">
          기후 변화는 이미 농업의 일상 속에 깊숙이 영향을 미치고 있으며, 단기적 대응을 넘어 장기적 관점의 적응력 강화가 더욱 중요해지고 있다. 제주 노지감귤 농업의
          지속가능성을 확보하기 위해서는 변화하는 환경에 맞춘 과학적이고 체계적인 대응 전략이 필요하다.
        </p>
      </section>
    </div>
  );
}
