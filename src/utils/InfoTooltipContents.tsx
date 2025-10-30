export const infoTooltipContents = {
  "감귤 재배정보": (
    <div className="space-y-[8px]">
      <div>
        <p className="text-[15px] font-semibold">감귤 재배정보</p>
        <ul className="list-disc pl-4">
          <li>
            제주 지역의 감귤 재배 현황을 한눈에 살펴볼 수 있는 제주 특화 통계 서비스입니다.
            <br />본 페이지에서는 품종별, 지역별로 감귤이 어떻게 재배되고 있는지 GIS지도를 통해 직관적으로 시각화하였습니다.
          </li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">주요 내용</p>
        <ul className="list-disc pl-4">
          <li>감귤 품종별, 지역별 재배면적 현황 제공</li>
          <li>법정리, 행정동 등 다양한 공간 단위별 감귤 재배 현황 제공</li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">사용된 데이터</p>
        <ul className="list-disc pl-4">
          <li>감귤재배실태관리시스템 (제주도청)</li>
          <li>공간정보시스템 (제주도청)</li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">이용 방법</p>
        <ul className="list-disc pl-4">
          <li>필터에서 원하는 지역 또는 품목을 선택하여 상세한 재배 정보를 확인할 수 있습니다.</li>
          <li>지도 색상 및 그래프를 통해 각 지역의 감귤 재배 현황을 쉽게 비교할 수 있습니다.</li>
        </ul>
      </div>
      <div className="pt-[12px]">
        이 통계는 제주 감귤산업의 현황을 파악하고, 지역별 품종 특성을 이해하는 데 도움을 주기 위해 제작되었습니다.
        <br />
        감귤 재배와 관련된 최신 공간 정보를 쉽고 빠르게 확인해보세요.
      </div>
    </div>
  ),
  "월동채소 재배면적 변화": (
    <div className="space-y-[8px]">
      <div>
        <p className="text-[15px] font-semibold">월동채소 재배면적 변화</p>
        <ul className="list-disc pl-4">
          <li>
            제주 지역의 월동채소(예: 배추, 무 등) 재배면적이 어떻게 변화하고 있는지 한눈에 볼 수 있는 제주 특화 통계 서비스입니다.
            <br />본 페이지에서는 드론 등 첨단 기술로 수집된 데이터를 바탕으로, 지역별 월동채소 재배 현황과 변화 추이를 GIS지도를 통해 직관적으로 제공합니다.
          </li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">주요 내용</p>
        <ul className="list-disc pl-4">
          <li>제주도 내 월동채소(배추, 무 등) 재배면적의 시기별·지역별 변화 현황 제공</li>
          <li>권역별, 행정구역별 등 다양한 공간 단위로 재배면적 변화 정보 제공</li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">사용된 데이터</p>
        <ul className="list-disc pl-4">
          <li>드론 작물지도 (제주도청)</li>
          <li>월동채소 재배면적 현황 (제주도청)</li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">이용 방법</p>
        <ul className="list-disc pl-4">
          <li>필터에서 원하는 지역 및 품목을 선택하면 월동채소 재배면적의 변화 양상을 상세히 확인할 수 있습니다.</li>
          <li>변화 추이는 지도 색상과 그래프 등을 통해 쉽게 비교할 수 있습니다.</li>
        </ul>
      </div>
      <div className="pt-[12px]">
        이 통계는 월동채소의 재배현황 변화를 시각적으로 확인하고, 지역별 농업 트렌드 파악과 정책 수립 등에 활용할 수 있도록 제작되었습니다.
        <br />
        제주 월동채소의 최신 재배 정보를 쉽고 빠르게 확인해보세요.
      </div>
    </div>
  ),
  "지역별 재배면적 및 수확현황": (
    <div className="space-y-[8px]">
      <div>
        <p className="text-[15px] font-semibold">지역별 재배면적 및 수확현황</p>
        <ul className="list-disc pl-4">
          <li>
            제주 각 지역의 작물 재배면적과 수확 현황을 한눈에 볼 수 있는 공간 통계 서비스입니다.
            <br />본 페이지에서는 농가별로 입력된 파종 및 수확 데이터를 바탕으로, 필지별 재배면적과 수확량 현황을 GIS 지도에서 시각적으로 확인할 수 있습니다.
          </li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">주요 내용</p>
        <ul className="list-disc pl-4">
          <li>농가별 파종 및 수확 현황 제공</li>
          <li>지도상 포인트 레이어 단위로 파종·수확 현황 제공</li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">사용된 데이터</p>
        <ul className="list-disc pl-4">
          <li>농가별 파종 입력 데이터(농가 입력)</li>
          <li>농가별 수확 입력 데이터(농가 입력)</li>
          <li>재배면적 데이터(팜맵)</li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">이용 방법</p>
        <ul className="list-disc pl-4">
          <li>필터에서 원하는 지역을 선택하면 각 지역의 파종 및 수확 현황을 상세히 확인할 수 있습니다.</li>
          <li>파종·수확 현황은 지도 포인트, 지역/일자별 집계를 통해 쉽게 비교할 수 있습니다.</li>
        </ul>
      </div>
      <div className="pt-[12px]">
        이 통계는 제주 지역의 재배 수확 및 파종 현황을 시각적으로 제공하여,
        <br />
        향후 지역별 작물 생산 동향 파악과 농업 정책 수립 등에 활용할 수 있도록 제작되었습니다.
        <br />
        지역별 재배 및 수확 현황 정보를 쉽고 빠르게 확인해보세요.
      </div>
    </div>
  ),
  "감귤 수령분포": (
    <div className="space-y-[8px]">
      <div>
        <p className="text-[15px] font-semibold">감귤 수령분포</p>
        <ul className="list-disc pl-4">
          <li>
            제주 지역의 감귤 수령(나무 나이) 현황을 공간적으로 한눈에 살펴볼 수 있는 시각화 통계 서비스입니다.
            <br />본 페이지에서는 감귤 품종별 재배면적 및 수령 현황 데이터를 바탕으로, 지역별 감귤 수령의 공간적 분포와 시뮬레이션 결과를 GIS 지도 위에 직관적으로
            제공합니다.
          </li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">주요 내용</p>
        <ul className="list-disc pl-4">
          <li>농가별, 구역별 감귤 수령(나무 나이) 현황 제공</li>
          <li>감귤 품종별, 행정구역별, 격자단위별 등 다양한 공간 단위로 수령 분포 제공</li>
          <li>감귤 수령의 공간적 분포 및 시뮬레이션 결과 시각화 제공</li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">사용된 데이터</p>
        <ul className="list-disc pl-4">
          <li>감귤재배실태관리시스템(제주도청)</li>
          <li>공간정보시스템(제주도청)</li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">이용 방법</p>
        <ul className="list-disc pl-4">
          <li>필터에서 원하는 지역 및 품목을 선택하면 감귤 수령의 공간적 분포와 변화 양상을 상세히 확인할 수 있습니다.</li>
          <li>수령 분포 및 시뮬레이션 결과는 지도와 다양한 시각화 도구를 통해 쉽게 비교할 수 있습니다.</li>
        </ul>
      </div>
      <div className="pt-[12px]">
        이 통계는 제주 감귤산업의 구조적 특징과 지역별 품종·나이 분포를 시각적으로 제공하여, 감귤나무 수령 현황 파악과 맞춤형 정책 수립 등에 활용할 수 있도록
        제작되었습니다.
        <br />
        제주 감귤나무의 수령 분포 정보를 쉽고 빠르게 확인해보세요.
      </div>
    </div>
  ),
  "감귤 개화기": (
    <div className="space-y-[8px]">
      <div>
        <p className="text-[15px] font-semibold">감귤 개화기</p>
        <ul className="list-disc pl-4">
          <li>
            제주 지역 감귤의 개화(꽃이 피는 시기) 특성을 한눈에 살펴볼 수 있는 시각화 통계 서비스입니다.
            <br />본 페이지에서는 감귤 포장(밭)별 위치 정보와 개화일자, 고도정보(DEM) 등 다양한 데이터를 바탕으로, 연도별 감귤 개화시기를 히트맵 및 그래프 형태로
            제공합니다.
          </li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">주요 내용</p>
        <ul className="list-disc pl-4">
          <li>감귤 개화일자 현황 및 지역별 개화율 시각화 제공</li>
          <li>포장 위치 및 고도 등 다양한 공간정보를 연계한 개화기 분석 결과 제공</li>
          <li>히트맵, 그래프 등 시각적 도구를 통해 개화시기 변화 결과 제공</li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">사용된 데이터</p>
        <ul className="list-disc pl-4">
          <li>개화기 관측정보(농업기술원)</li>
          <li>고도정보(국토정보지리원)</li>
          <li>감귤재배실태관리시스템 (제주도청)</li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">이용 방법</p>
        <ul className="list-disc pl-4">
          <li>필터에서 원하는 기준날짜 또는 비교날짜 선택하면 개화시기 정보를 상세히 확인할 수 있습니다.</li>
          <li>히트맵과 그래프를 통해 지역별 감귤 개화일자 분포를 쉽고 빠르게 비교할 수 있습니다.</li>
        </ul>
      </div>
      <div className="pt-[12px]">
        이 통계는 제주 감귤의 개화 현황과 지역별 특성을 공간적으로 제공하여, 생산 시기 예측, 농업 경영계획, 품종·재배지 선택 등에 활용할 수 있도록 제작되었습니다.
        <br />
        제주 감귤 개화 정보를 쉽고 직관적으로 확인해보세요.
      </div>
    </div>
  ),
  "감귤 관측조사": (
    <div className="space-y-[8px]">
      <div>
        <p className="text-[15px] font-semibold">감귤 관측조사</p>
        <ul className="list-disc pl-4">
          <li>
            제주 감귤 관측조사 결과를 기반으로 생육 특성과 환경 조건을 한눈에 볼 수 있는 시각화 통계 서비스입니다.
            <br />본 페이지에서는 감귤 관측조사 단계별(1차~3차)로 수집된 감귤 생육 및 품질 데이터를 감귤 포장(밭) 위치, 고도정보와 결합하여, 지역별 감귤 생육 특성의
            공간적 차이를 GIS 지도 위에 제공합니다.
          </li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">주요 내용</p>
        <ul className="list-disc pl-4">
          <li>1차(화엽비), 2차(열매수·황경), 3차(당도·산도·당산비) 등 단계별 생육 및 품질 데이터 시각화</li>
          <li>포장별 위치 정보와 고도(지형) 정보를 결합한 공간 분석</li>
          <li>생육 지표별 색상 범례 적용, 지역별 특성 비교</li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">사용된 데이터</p>
        <ul className="list-disc pl-4">
          <li>1차~3차 노지감귤 관측조사 데이터(농업기술원)</li>
          <li>고도정보(제주도 고도모형, 국토정보지리원)</li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">이용 방법</p>
        <ul className="list-disc pl-4">
          <li>
            필터에서 원하는 지역과 조사 항목을 선택하면 관측조사 결과 기반 각종 생육·품질 지표(화엽비, 열매수, 당도 등)를 색상 범례를 통해 시각적으로 확인할 수 있습니다.
          </li>
          <li>또한 지역별 생육·품질 특성과 고도(지형) 구간에 따른 차이를 한눈에 비교할 수 있습니다.</li>
        </ul>
      </div>
      <div className="pt-[12px]">
        이 통계는 제주 감귤의 생육 상태와 품질 정보를 공간적으로 제공하여 생산 관리, 농업 경영 계획, 지역 맞춤형 관리방안 수립 등에 활용할 수 있도록 제작되었습니다.
        <br />
        최신 감귤 생육·환경 데이터를 쉽고 빠르게 확인해보세요.
      </div>
    </div>
  ),
  "도매시장 출하 점유율": (
    <div className="space-y-[8px]">
      <div>
        <p className="text-[15px] font-semibold">도매시장 출하 점유율</p>
        <ul className="list-disc pl-4">
          <li>
            본 페이지에서는 전국 9개 권역 도매시장의 품목별 주간(1주 단위) 경매가격 및 반입량 데이터를 활용하여
            <br />각 권역의 출하 집중도, 시장 점유율, 주산지 현황 등을 한눈에 파악할 수 있도록 시각화한 통계 서비스입니다.
          </li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">주요 내용</p>
        <ul className="list-disc pl-4">
          <li>품목별, 권역별, 주간(1주 단위) 출하물량 비교 제공</li>
          <li>반입량 기준 시장 점유율 및 전국 주산지 분석</li>
          <li>품목별 주간 평균 가격 추이 제공</li>
          <li>그래프, 지도, 파이차트 등 다양한 시각적 도구를 통한 데이터 비교</li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">사용된 데이터</p>
        <ul className="list-disc pl-4">
          <li>전국 공영도매시장 경매원천정보 (한국농수산식품유통공사)</li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">이용 방법</p>
        <ul className="list-disc pl-4">
          <li>상단 필터에서 연도, 주(week), 품목 등을 선택하면 해당 조건에 맞는 권역별 출하량, 경매가격, 점유율 분석 결과가 표시됩니다.</li>
          <li>지도에서는 지역별 출하 점유율을 색상으로 확인할 수 있으며, 그래프와 파이차트를 통해 주요 주산지의 출하 동향과 시장 점유율을 손쉽게 비교할 수 있습니다.</li>
        </ul>
      </div>
      <div className="pt-[12px]">
        이 통계는 주요 품목의 전국 도매시장 출하 동향과 시장 집중도를 시각적으로 제공하여,
        <br />
        출하 전략 수립, 주산지 동향 분석, 가격 변동 예측 등 다양한 농산물 유통·관리 업무에 활용할 수 있도록 제작되었습니다.
        <br />
        전국 도매시장의 품목별 주간 출하 및 시장 점유율 정보를 쉽고 빠르게 확인해보세요.
      </div>
    </div>
  ),
  "주요품목 도매시장 거래정보": (
    <div className="space-y-[8px]">
      <div>
        <p className="text-[15px] font-semibold">주요품목 도매시장 거래정보</p>
        <ul className="list-disc pl-4">
          <li>
            본 서비스는 전국 9개 권역 도매시장의 품목별 경매가격 및 반입량 데이터를 기반으로 실시간으로
            <br />
            주요 농산물의 도매시장 거래현황을 모니터링할 수 있도록 구성된 통계 페이지입니다.
          </li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">주요 내용</p>
        <ul className="list-disc pl-4">
          <li>전국 도매시장의 품목별 평균가격, 대표 등급 가격, 반입량 등 실시간 거래현황 제공</li>
          <li>권역별·시장별 가격 및 반입 비율 비교, 최고/최저 가격 지역 표시</li>
          <li>월별, 지역별 가격 추이 및 반입 동향 시각화</li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">사용된 데이터</p>
        <ul className="list-disc pl-4">
          <li>전국 공영도매시장 경매원천정보 (한국농수산식품유통공사)</li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">이용 방법</p>
        <ul className="list-disc pl-4">
          <li>상단 필터에서 날짜와 품목을 선택하면 해당 조건에 맞는 전국 도매시장별 가격, 반입량 등 주요 거래 지표가 실시간으로 표시됩니다.</li>
          <li>
            대시보드 형태의 화면을 통해 전국 평균가격, 대표 등급 가격, 제주산 반입량, 지역별/권역별 가격·반입량, 월별 가격 추이 등<br />
            다양한 정보를 한눈에 비교·분석할 수 있습니다.
          </li>
        </ul>
      </div>
      <div className="pt-[12px]">
        이 통계는 전국 도매시장의 주요 농산물 거래동향을 실시간으로 제공하여 시장 모니터링, 가격 동향 분석, 유통 관리 등<br />
        다양한 농산물 유통·관리 업무에 활용할 수 있도록 제작되었습니다.
        <br />
        주요품목 도매시장 거래정보를 쉽고 빠르게 확인해보세요.
      </div>
    </div>
  ),
  "제주 감귤 연도별, 국가별 수출정보": (
    <div className="space-y-[8px]">
      <div>
        <p className="text-[15px] font-semibold">제주 감귤 연도별, 국가별 수출정보</p>
        <ul className="list-disc pl-4">
          <li>
            본 서비스는 제주 감귤의 연도별, 국가별 수출 현황을 한눈에 파악할 수 있도록 실제 수출 금액 및 중량 데이터를
            <br />
            세계지도 기반으로 시각화한 통계 페이지입니다.
          </li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">주요 내용</p>
        <ul className="list-disc pl-4">
          <li>연도별, 국가별 제주 감귤 수출 금액 및 수출 물량 정보 제공</li>
          <li>국가별 수출 규모에 따라 색상 및 그래프로 구분, 비교 제공</li>
          <li>세계지도에서 주요 수출국과 규모를 제공</li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">사용된 데이터</p>
        <ul className="list-disc pl-4">
          <li>국가별 감귤 수출금액, 수출물량 (관세청)</li>
        </ul>
      </div>
      <div>
        <p className="text-[15px] font-semibold">이용 방법</p>
        <ul className="list-disc pl-4">
          <li>우측 필터에서 연도와 수출 국가를 선택하면 선택한 조건에 맞는 국가별 감귤 수출 현황이 세계지도에 시각화되어 표시됩니다.</li>
          <li>마우스를 지도상의 국가에 올리면 해당 국가의 연도별 수출 금액, 중량 등의 세부 정보를 확인할 수 있습니다.</li>
          <li>수출 규모 범례를 활용하여 최상위~하위 국가별 수출 분포를 비교할 수 있습니다.</li>
        </ul>
      </div>
      <div className="pt-[12px]">
        이 통계는 제주 감귤의 수출 동향을 연도별, 국가별로 시각화하여
        <br />
        주요 시장 현황 및 수출 전략 수립, 해외 진출 확대 등에 활용할 수 있도록 제작되었습니다.
        <br />
        세계 각국으로 수출되는 제주 감귤의 최신 정보를 쉽고 빠르게 확인해보세요.
      </div>
    </div>
  ),
};
