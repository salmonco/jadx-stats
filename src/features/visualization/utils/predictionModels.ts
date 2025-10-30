export const predictionModels = {
  "감귤 모델1": {
    description:
      "가격 데이터는 시간의 흐름에 따라 변하는 패턴을 가지고 있고, 과거의 가격이 미래의 가격에 영향을 주기도 하기 때문에 이러한 가격의 특성을 고려하여 시계열 모형을 활용하여 가격을 예측합니다.",
    formula: {
      description: `\\Delta P_t = \\alpha + \\sum_{j=1}^{P} \\beta_j \\Delta P_{t-j} + \\sum_{j=0}^{P} \\gamma_j \\Delta Q_{t-j} + \\delta (P_{t-1} - \\theta Q_{t-1}) + \\varepsilon_t`,
      variables: [
        { symbol: "P_t_", description: "t 시점의 제주산 감귤 가격" },
        { symbol: "Q_t_", description: "t 시점의 제주산 반입량" },
        { symbol: "ΔP_t_", description: "t-1 시점 대비 t 시점의 감귤 가격 증감분" },
        { symbol: "ΔQ_t_", description: "t-1 시점 대비 t 시점의 감귤 반입량 증감분" },
        { symbol: "P_t-1_ - θQ_t-1_", description: "오차수정항" },
        { symbol: "ε_t_", description: "알 수 없는 에러" },
      ],
      target: "가격 변동률",
      result: "전일 가격 + 가격 변동률 예측값",
    },
    variables: {
      description: "일별/시장별/작물별 반입량 및 평균가를 이용하여 전일 대비 가격 변동량을 예측하고, 이를 전일 가격과 합산하여 가격을 예측합니다.",
      data: [
        // { key: "P", name: "가격", unit: "원", dataLocation: "DataHub", remark: "" },
        // { key: "Q", name: "반입량", unit: "kg", dataLocation: "DataHub", remark: "" },
        { key: "∆P", name: "전일 대비 가격 변동량", unit: "원", dataLocation: "DB서버 (JADXMT)", remark: "별도 계산값" },
        { key: "∆Q", name: "전일 대비 반입량 변동량", unit: "kg", dataLocation: "DB서버 (JADXMT)", remark: "별도 계산값" },
      ],
    },
    source:
      "가격 예측을 위해 공공데이터포털에서 서비스하고 있는 한국농수산식품유통공사_전국 공영도매시장 경매원천정보(https://www.data.go.kr/data/15141810/openapi.do)데이터를 수집하여 예측 모델 개발을 위한 학습 데이터를 생성합니다.",
    process: {
      "3일 예상 가격":
        "예상 가격 예측 모델은 입력 변수를 기반으로 가격을 3일 후 예측 가격을 산출합니다. 산출된 예측 결과는 기준일을 기점으로 작물별, 시장별로 집계되어 대시보드에 표시되며, 반입량 증감에 따른 가격 변동 시뮬레이션을 할 수 있습니다.",
      "7일 예상 가격":
        "예상 가격 예측 모델은 입력 변수를 기반으로 가격을 7일 후 예측 가격을 산출합니다. 산출된 예측 결과는 기준일을 기점으로 작물별, 시장별로 집계되어 대시보드에 표시되며, 반입량 증감에 따른 가격 변동 시뮬레이션을 할 수 있습니다.",
    },
  },
  "감귤 모델2": {
    description:
      "가격 데이터는 시간의 흐름에 따라 변하는 패턴을 가지고 있고, 과거의 가격이 미래의 가격에 영향을 주기도 하기 때문에 이러한 가격의 특성을 고려하여 시계열 모형을 활용하여 가격을 예측합니다.",
    formula: {
      description: `\\Delta P_t = \\alpha + \\sum_{j=1}^{P} \\beta_j \\Delta P_{t-j} + \\sum_{j=0}^{P} \\gamma_j Q_{t-j} + \\varepsilon_t`,
      variables: [
        { symbol: "P_t_", description: "t 시점의 제주산 감귤 가격" },
        { symbol: "ΔP_t_", description: "t-1 시점 대비 t 시점의 감귤 가격 증감분" },
        { symbol: "Q_t_", description: "t 시점의 제주산 반입량" },
        { symbol: "ε_t_", description: "알 수 없는 에러" },
      ],
      target: "가격 변동률",
      result: "전일 가격 + 가격 변동률 예측값",
    },
    variables: {
      description: "일별/시장별/작물별 반입량 및 평균가를 이용하여 전일 대비 가격 변동량을 예측하고, 이를 전일 가격과 합산하여 가격을 예측합니다.",
      data: [
        // { key: "P", name: "가격", unit: "원", dataLocation: "DataHub", remark: "" },
        { key: "∆P", name: "전일 대비 가격 변동량", unit: "원", dataLocation: "DB서버 (JADXMT)", remark: "별도 계산값" },
        { key: "Q", name: "반입량", unit: "kg", dataLocation: "DataHub", remark: "" },
      ],
    },
    source:
      "가격 예측을 위해 공공데이터포털에서 서비스하고 있는 한국농수산식품유통공사_전국 공영도매시장 경매원천정보(https://www.data.go.kr/data/15141810/openapi.do)데이터를 수집하여 예측 모델 개발을 위한 학습 데이터를 생성합니다.",
    process:
      "예상 가격 예측 모델은 입력 변수를 기반으로 가격을 30일 후 예측 가격을 산출합니다. 산출된 예측 결과는 기준일을 기점으로 작물별, 시장별로 집계되어 대시보드에 표시되며, 반입량 증감에 따른 가격 변동 시뮬레이션을 할 수 있습니다.",
  },
  "감귤 모델3": {
    description:
      "가격 데이터는 시간의 흐름에 따라 변하는 패턴을 가지고 있고, 과거의 가격이 미래의 가격에 영향을 주기도 하기 때문에 이러한 가격의 특성을 고려하여 시계열 모형을 활용하여 가격을 예측합니다.",
    formula: {
      description: `P_t = \\alpha + \\sum_{j=1}^{P} \\beta_j P_{t-j} + \\sum_{j=0}^{P} \\gamma_j Q_{t-j} + \\varepsilon_t`,
      variables: [
        { symbol: "P_t_", description: "t 시점의 제주산 감귤 가격" },
        { symbol: "Q_t_", description: "t 시점의 제주산 반입량" },
        { symbol: "ε_t_", description: "알 수 없는 에러" },
      ],
      target: "가격",
      result: "",
    },
    variables: {
      description: "일별/시장별/작물별 반입량 및 평균가를 이용하여 전일 대비 가격 변동량을 예측하고, 이를 전일 가격과 합산하여 가격을 예측합니다.",
      data: [
        { key: "P", name: "가격", unit: "원", dataLocation: "DataHub", remark: "" },
        { key: "Q", name: "반입량", unit: "kg", dataLocation: "DataHub", remark: "" },
      ],
    },
    source:
      "가격 예측을 위해 공공데이터포털에서 서비스하고 있는 한국농수산식품유통공사_전국 공영도매시장 경매원천정보(https://www.data.go.kr/data/15141810/openapi.do)데이터를 수집하여 예측 모델 개발을 위한 학습 데이터를 생성합니다.",
    process:
      "예상 가격 예측 모델은 입력 변수를 기반으로 가격을 30일 후 예측 가격을 산출합니다. 산출된 예측 결과는 기준일을 기점으로 작물별, 시장별로 집계되어 대시보드에 표시되며, 반입량 증감에 따른 가격 변동 시뮬레이션을 할 수 있습니다.",
  },
  "당근 모델1": {
    description:
      "가격 데이터는 시간의 흐름에 따라 변하는 패턴을 가지고 있고, 과거의 가격이 미래의 가격에 영향을 주기도 하기 때문에 이러한 가격의 특성을 고려하여 시계열 모형을 활용하여 가격을 예측합니다.",
    formula: {
      description: `\\Delta P_{J_t} = \\alpha + \\sum_{j=1}^{P} \\beta_j \\Delta P_{J_{t-j}} + \\sum_{j=0}^{P} \\gamma_j Q_{t-j} + \\sum_{j=1}^{P} \\delta_j \\Delta P_{I_{t-j}} + \\varepsilon_t`,
      variables: [
        { symbol: "PJ_t_", description: "t 시점의 제주산 당근 가격" },
        { symbol: "PI_t_", description: "t 시점의 수입산 당근 가격" },
        { symbol: "ΔPJ_t_", description: "t-1 시점 대비 t 시점의 제주산 당근 가격 증감분" },
        { symbol: "ΔPI_t_", description: "t-1 시점 대비 t 시점의 수입산 당근 가격 증감분" },
        { symbol: "Q_t_", description: "t 시점의 제주산 반입량" },
        { symbol: "ε_t_", description: "알 수 없는 에러" },
      ],
      target: "가격 변동률",
      result: "전일 가격 + 가격 변동률 예측값",
    },
    variables: {
      description: "일별/시장별/작물별 반입량 및 평균가를 이용하여 전일 대비 가격 변동량을 예측하고, 이를 전일 가격과 합산하여 가격을 예측합니다.",
      data: [
        { key: "∆PJ", name: "전일 대비 제주산 당근 가격 변동량", unit: "원", dataLocation: "DB서버 (JADXMT)", remark: "별도 계산값" },
        { key: "∆PI", name: "전일 대비 수입산 당근 가격 변동량", unit: "원", dataLocation: "DB서버 (JADXMT)", remark: "별도 계산값" },
        { key: "Q", name: "반입량", unit: "kg", dataLocation: "DataHub", remark: "" },
        // { key: "P_J_", name: "제주산 당근 가격", unit: "원", dataLocation: "DataHub", remark: "" },
        // { key: "P_I_", name: "수입산 당근 가격", unit: "원", dataLocation: "DataHub", remark: "" },
      ],
    },
    source:
      "가격 예측을 위해 공공데이터포털에서 서비스하고 있는 한국농수산식품유통공사_전국 공영도매시장 경매원천정보(https://www.data.go.kr/data/15141810/openapi.do)데이터를 수집하여 예측 모델 개발을 위한 학습 데이터를 생성합니다.",
    process: {
      "3일 예상 가격":
        "예상 가격 예측 모델은 입력 변수를 기반으로 가격을 3일 후 예측 가격을 산출합니다. 산출된 예측 결과는 기준일을 기점으로 작물별, 시장별로 집계되어 대시보드에 표시되며, 반입량 증감에 따른 가격 변동 시뮬레이션을 할 수 있습니다.",
      "7일 예상 가격":
        "예상 가격 예측 모델은 입력 변수를 기반으로 가격을 7일 후 예측 가격을 산출합니다. 산출된 예측 결과는 기준일을 기점으로 작물별, 시장별로 집계되어 대시보드에 표시되며, 반입량 증감에 따른 가격 변동 시뮬레이션을 할 수 있습니다.",
    },
  },
  "당근 모델2": {
    description:
      "가격 데이터는 시간의 흐름에 따라 변하는 패턴을 가지고 있고, 과거의 가격이 미래의 가격에 영향을 주기도 하기 때문에 이러한 가격의 특성을 고려하여 시계열 모형을 활용하여 가격을 예측합니다.",
    formula: {
      description: `\\Delta P_{J_t} = \\alpha + \\sum_{j=1}^{P} \\beta_j \\Delta P_{J_{t-j}} + \\sum_{j=0}^{P} \\gamma_j Q_{t-j} + \\sum_{j=1}^{P} \\delta_j P_{I_{t-j}} + \\varepsilon_t`,
      variables: [
        { symbol: "PJ_t_", description: "t 시점의 제주산 당근 가격" },
        { symbol: "ΔPJ_t_", description: "t-1 시점 대비 t 시점의 제주산 당근 가격 증감분" },
        { symbol: "Q_t_", description: "t 시점의 제주산 반입량" },
        { symbol: "PI_t_", description: "t 시점의 수입산 당근 가격" },
        { symbol: "ε_t_", description: "알 수 없는 에러" },
      ],
      target: "가격 변동률",
      result: "전일 가격 + 가격 변동률 예측값",
    },
    variables: {
      description: "일별/시장별/작물별 반입량 및 평균가를 이용하여 전일 대비 가격 변동량을 예측하고, 이를 전일 가격과 합산하여 가격을 예측합니다.",
      data: [
        { key: "∆PJ", name: "전일 대비 제주산 당근 가격 변동량", unit: "원", dataLocation: "DB서버 (JADXMT)", remark: "별도 계산값" },
        { key: "PI", name: "수입산 당근 가격", unit: "원", dataLocation: "DataHub", remark: "" },
        { key: "Q", name: "반입량", unit: "kg", dataLocation: "DataHub", remark: "" },
        // { key: "PJ", name: "제주산 당근 가격", unit: "원", dataLocation: "DataHub", remark: "" },
      ],
    },
    source:
      "가격 예측을 위해 공공데이터포털에서 서비스하고 있는 한국농수산식품유통공사_전국 공영도매시장 경매원천정보(https://www.data.go.kr/data/15141810/openapi.do)데이터를 수집하여 예측 모델 개발을 위한 학습 데이터를 생성합니다.",
    process:
      "예상 가격 예측 모델은 입력 변수를 기반으로 가격을 30일 후 예측 가격을 산출합니다. 산출된 예측 결과는 기준일을 기점으로 작물별, 시장별로 집계되어 대시보드에 표시되며, 반입량 증감에 따른 가격 변동 시뮬레이션을 할 수 있습니다.",
  },
};
