import { useEffect } from "react";
import { Info, TrendingUp, Users, Calendar } from "lucide-react";
import { Card } from "antd";
import FarmPopulationChart from "./FarmPopulationChart";
import FarmIncomeChart from "./FarmIncomeChart";
import AgeDistributionChart from "./AgeDistributionChart";
import FarmSizeChart from "./FarmSizeChart";

export default function FarmPopulation() {
  useEffect(() => {
    import("antd/dist/reset.css");
  }, []);

  return (
    <div className="relative min-h-screen text-lg">
      <section className="mb-8 rounded-lg bg-white p-8 pb-4 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">제주 농업 현황 개요</h2>

        <div className="prose prose-lg max-w-none">
          <p className="mb-2 text-gray-600">
            1993년부터 2023년까지 제주특별자치도의 농업 구조는 <strong className="text-[#1e3a8a]">인구 감소와 소득 증가</strong>의 역설적 추세를 보였다.
          </p>

          <p>
            <strong className="text-red-600">농가인구</strong>는 약 150,000명(1993년)에서 60,000명 미만(2023년)으로 약 60% 감소하였으며,
            <strong className="text-red-600">농가 수</strong>는 같은 기간 약 45,000호에서 30,000호 수준으로 약 33% 감소하였다.
          </p>

          <p>
            반면, <strong className="text-red-600">농가소득</strong>은 1993년 약 4천만 원에서 2023년 약 1억 3천만 원으로 3.25배 증가(약 225% 상승)하였다.
          </p>

          <div className="my-8">
            <div className="h-[400px]">
              <FarmPopulationChart />
            </div>
            <p className="mt-2 text-center text-sm text-gray-500">그림 1: 제주 농가인구 및 농가 수 변화 추이 (1993-2023)</p>
          </div>

          <div className="my-10">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <Users className="h-5 w-5 text-blue-600" />
              농가 인구 연령 구조 변화
            </h3>
            <p className="mb-6 text-gray-600">
              제주 농업 인구의 연령 구조는 지속적으로 고령화되고 있다. 1970년 0-14세 인구 비율이 43.3%였으나 2023년에는 5.1%로 급감했으며, 65세 이상 인구는 13.2%에서
              49.0%로 크게 증가했다.
            </p>

            <div className="h-[350px]">
              <AgeDistributionChart />
            </div>
            <p className="mt-2 text-center text-sm text-gray-500">그림 2: 제주 농업 인구의 연령별 분포 변화 (1970-2023)</p>
          </div>

          <div className="my-10 rounded-lg bg-gray-50 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <TrendingUp className="h-5 w-5 text-green-600" />
              주요 변화 지표
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card className="shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">농가인구 감소율 (1993-2023)</p>
                    <p className="text-2xl font-bold text-red-600">-51.8%</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                    <Users className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </Card>

              <Card className="shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">65세 이상 인구 비율 변화</p>
                    <p className="text-2xl font-bold text-orange-600">+35.7%p</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </Card>

              <Card className="shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">농가 소득 증가율 (1993-2023)</p>
                    <p className="text-2xl font-bold text-green-600">+225%</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <p>
            특히, 2008-2010년에는 농가인구가 일시적으로 35% 내외 소폭 증가하였는데, 이는 귀농·귀촌 인구 유입 증가와 제주 이주 열풍, 행정적 유입 지원정책 등에 기인한다.
          </p>

          <p>
            이러한 변화는 제주의 농업 구조가 <strong className="text-red-600">영세 고령농 중심에서 고수익 전문농 중심(부가가치가 큰 사업)</strong>
            으로 전환되고 있음을 시사하며, <strong className="text-red-600">생산 농가 중심의 소득 집중 현상</strong>
            으로 해석할 수 있다.
          </p>

          <p>
            그러나 <strong className="text-red-600">인구 대비 농가 수 감소폭이 작아</strong>, 고령, 단독 농업노동력 부족 문제는 여전히 심각한 과제로 남아 있다.
          </p>

          <p>
            앞으로는 <strong className="text-red-600">청년농 유입 확대, 스마트농업 기반 확대, 귀농·귀촌의 정책 안정성 제고</strong>가 병행되어야 지속 가능한 제주 농업의
            미래를 확보할 수 있다.(
            <strong className="text-red-600">정책적 제언, 제언가능</strong>)
          </p>
        </div>
      </section>

      <section id="population" className="mb-8 rounded-lg bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">제주 농업 인구 변화</h2>

        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-xl font-semibold">농가인구 감소 추세</h3>
            <p className="mb-4 text-gray-600">
              제주 농가인구는 1993년 약 150,000명에서 2023년 60,000명 미만으로 약 60% 감소하였다. 이는 전국 평균 농가인구 감소율보다 높은 수치로, 제주 농업의 구조적
              변화를 보여준다.
            </p>

            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
              <h4 className="mb-2 flex items-center gap-2 font-medium text-blue-800">
                <Info className="h-4 w-4" />
                주요 감소 원인
              </h4>
              <ul className="list-disc space-y-1 pl-5 text-gray-600">
                <li>농업 종사자의 고령화</li>
                <li>젊은 세대의 농업 기피 현상</li>
                <li>농업의 기계화 및 자동화로 인한 노동력 수요 감소</li>
                <li>도시 지역으로의 인구 이동</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">연령별 인구 구조 변화</h3>
            <p className="mb-4 text-gray-600">
              제주 농업 인구의 연령 구조는 지속적으로 고령화되고 있다. 65세 이상 인구 비율이 증가하는 반면, 15세 미만 인구 비율은 지속적으로 감소하고 있다.
            </p>

            <div className="h-[300px]">
              <AgeDistributionChart />
            </div>
            <p className="mt-2 text-center text-sm text-gray-500">그림 2: 제주 농업 인구의 연령별 분포 변화 (1970-2023)</p>
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-6">
          <h3 className="mb-4 text-xl font-semibold">농가 수 변화</h3>
          <p className="mb-4 text-gray-600">
            농가인구가 60% 감소한 것에 비해 농가 수는 33% 감소에 그쳤다. 이는 가구당 농업 종사자 수가 감소했음을 의미하며, 소규모 가족농 중심에서 전문화된 농업 경영체로의
            전환을 보여준다.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="shadow-sm">
              <p className="text-sm text-gray-500">1993년 농가 수</p>
              <p className="text-2xl font-bold text-gray-900">약 45,000호</p>
            </Card>
            <Card className="shadow-sm">
              <p className="text-sm text-gray-500">2023년 농가 수</p>
              <p className="text-2xl font-bold text-gray-900">약 30,000호</p>
            </Card>
            <Card className="shadow-sm">
              <p className="text-sm text-gray-500">감소율</p>
              <p className="text-2xl font-bold text-red-600">약 33%</p>
            </Card>
          </div>
        </div>
      </section>

      <section id="income" className="mb-8 rounded-lg bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">제주 농가 소득 분석</h2>

        <div className="mb-8">
          <div className="h-[400px]">
            <FarmIncomeChart />
          </div>
          <p className="mt-2 text-center text-sm text-gray-500">그림 3: 제주 농가 소득 변화 추이 (1993-2023)</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-xl font-semibold">소득 증가 추세</h3>
            <p className="mb-4 text-gray-600">
              제주 농가소득은 1993년 약 4천만 원에서 2023년 약 1억 3천만 원으로 3.25배 증가(약 225% 상승)하였다. 이는 전국 평균 농가소득 증가율보다 높은 수치이다.
            </p>

            <div className="rounded-lg border border-green-100 bg-green-50 p-4">
              <h4 className="mb-2 flex items-center gap-2 font-medium text-green-800">
                <Info className="h-4 w-4" />
                소득 증가 요인
              </h4>
              <ul className="list-disc space-y-1 pl-5 text-gray-600">
                <li>고부가가치 작물 재배 확대</li>
                <li>농업 기술 발전 및 생산성 향상</li>
                <li>농산물 브랜드화 및 마케팅 강화</li>
                <li>관광업과 연계한 6차 산업화</li>
                <li>직거래 및 온라인 판매 확대</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">소득 구조 변화</h3>
            <p className="mb-4 text-gray-600">
              제주 농가의 소득 구조는 농업소득 중심에서 농외소득 및 이전소득 비중이 증가하는 방향으로 변화하고 있다. 특히 관광업과 연계한 농외소득 증가가 두드러진다.
            </p>

            <Card className="p-2 shadow-sm">
              <h4 className="mb-4 font-medium">2023년 제주 농가 소득 구성</h4>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex justify-between">
                    <span className="text-sm font-medium">농업소득</span>
                    <span className="text-sm font-medium">55%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: "55%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between">
                    <span className="text-sm font-medium">농외소득</span>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-green-600" style={{ width: "30%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between">
                    <span className="text-sm font-medium">이전소득</span>
                    <span className="text-sm font-medium">12%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-yellow-500" style={{ width: "12%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between">
                    <span className="text-sm font-medium">비경상소득</span>
                    <span className="text-sm font-medium">3%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-red-500" style={{ width: "3%" }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="structure" className="mb-8 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">제주 농업 구조 변화</h2>

        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-xl font-semibold">농업 경영 구조 변화</h3>
            <p className="mb-4 text-gray-600">
              제주 농업은 영세 고령농 중심에서 고수익 전문농 중심으로 전환되고 있다. 이는 농가 수 감소에 비해 농가소득이 크게 증가한 현상으로 확인할 수 있다.
            </p>

            <div className="rounded-lg border border-orange-100 bg-orange-50 p-4">
              <h4 className="mb-2 flex items-center gap-2 font-medium text-orange-800">
                <Info className="h-4 w-4" />
                주요 변화 특징
              </h4>
              <ul className="list-disc space-y-1 pl-5 text-gray-600">
                <li>농가당 경지면적 증가</li>
                <li>시설농업 및 기계화 확대</li>
                <li>전업농 비율 증가</li>
                <li>농업법인 및 협업경영체 증가</li>
                <li>스마트팜 도입 확대</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">농가 규모별 분포 변화</h3>
            <p className="mb-4 text-gray-600">
              소규모 농가는 감소하고 중대규모 농가는 증가하는 추세를 보이고 있다. 이는 농업의 규모화 및 전문화가 진행되고 있음을 의미한다.
            </p>

            <div className="h-[250px]">
              <FarmSizeChart />
            </div>
            <p className="mt-2 text-center text-sm text-gray-500">그림 4: 제주 농가 규모별 분포 변화 (2000-2023)</p>
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-6">
          <h3 className="mb-4 text-xl font-semibold">미래 전망 및 정책 제언</h3>
          <p className="mb-4 text-gray-600">제주 농업이 지속가능한 발전을 이루기 위해서는 다음과 같은 정책적 접근이 필요하다.</p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border-l-4 border-blue-500 bg-white p-4 shadow-sm">
              <h4 className="mb-2 font-medium text-gray-900">청년농 유입 확대</h4>
              <p className="text-sm text-gray-600">청년 창업농 지원 강화, 농업교육 확대, 정착 지원금 확대 등을 통해 젊은 농업인구 유입을 촉진해야 한다.</p>
            </div>
            <div className="rounded-lg border-l-4 border-green-500 bg-white p-4 shadow-sm">
              <h4 className="mb-2 font-medium text-gray-900">스마트농업 기반 확대</h4>
              <p className="text-sm text-gray-600">ICT 기술을 활용한 스마트팜 보급, 농업 자동화 시스템 구축, 데이터 기반 농업 의사결정 지원 등이 필요하다.</p>
            </div>
            <div className="rounded-lg border-l-4 border-yellow-500 bg-white p-4 shadow-sm">
              <h4 className="mb-2 font-medium text-gray-900">농업 부가가치 증대</h4>
              <p className="text-sm text-gray-600">농산물 가공, 체험관광, 직거래 등 6차 산업화를 통해 농업의 부가가치를 높이는 전략이 중요하다.</p>
            </div>
            <div className="rounded-lg border-l-4 border-purple-500 bg-white p-4 shadow-sm">
              <h4 className="mb-2 font-medium text-gray-900">농업 정책 안정성 제고</h4>
              <p className="text-sm text-gray-600">장기적 관점의 농업 정책 수립, 농가 소득 안정망 구축, 농업 인프라 지속적 개선이 필요하다.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
