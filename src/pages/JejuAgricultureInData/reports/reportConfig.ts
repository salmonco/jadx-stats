// import FarmPopulationChart from "~/pages/JejuAgricultureInData/reports/FarmPopulation";
// import FarmIncomeChart from "~/pages/JejuAgricultureInData/reports/FarmIncome";
// import FarmExpenditure from "~/pages/JejuAgricultureInData/reports/FarmExpenditure";
// import FarmAssetsLiabilities from "~/pages/JejuAgricultureInData/reports/FarmAssetsLiabilities";
// import LandUse from "~/pages/JejuAgricultureInData/reports/LandUse";
// import MandarinFlowering from "~/pages/JejuAgricultureInData/reports/MandarinFlowering";
// import IndustrialStructure from "~/pages/JejuAgricultureInData/reports/IndustrialStructure";
// import FarmSize from "~/pages/JejuAgricultureInData/reports/FarmSize";
// import Employment from "~/pages/JejuAgricultureInData/reports/Employment";
// import Fertilizer from "~/pages/JejuAgricultureInData/reports/Fertilizer";

import FarmPopulation from "../new_reports/FarmPopulation";
import AgriculturalPopulation from "../new_reports/AgriculturalPopulation";
import FarmIncomeStructure from "../new_reports/FarmIncomeStructure";
import FarmExpenditureTrend from "../new_reports/FarmExpenditureTrend";
import FarmAssets from "../new_reports/FarmAssets";
import FarmDebt from "../new_reports/FarmDebt";
import LandStructure from "../new_reports/LandStructure";
import CitrusFlowering from "../new_reports/CitrusFlowering";
import FarmScaleChange from "../new_reports/FarmScaleChange";
import FertilizerConsumption from "../new_reports/FertilizerConsumption";
import PopulationPyramid from "../new_reports/PopulationPyramid";
import AgriculturalPerformance from "../new_reports/AgriculturalPerformance";
import CitrusProduction from "../new_reports/CitrusProduction";
import MandarinProduction from "../new_reports/MandarinProduction";
import IndustrialStructure from "../new_reports/IndustrialStructure";
import Employment from "../new_reports/Employment";

const reportConfig = [
  {
    id: "1",
    title: "제주 농가인구 및 구조 변화",
    description: "제주 농가인구 및 농가 수 변화 추이 분석",
    category: "농가인구",
    date: "2023년 12월 20일",
    component: FarmPopulation,
  },
  {
    id: "2",
    title: "제주농업 생산가능 인구의 변화",
    description: "1970년부터 2023년까지 제주 농업 생산가능 인구의 연령대별 구성 변화 분석",
    category: "농가인구",
    date: "2023년 12월 22일",
    component: AgriculturalPopulation,
  },
  {
    id: "3",
    title: "농가소득의 증가와 소득구조 변화",
    description: "2023년 기준 제주 지역 농가소득 분석 및 전국 평균과의 비교",
    category: "농가경제",
    date: "2023년 12월 28일",
    component: FarmIncomeStructure,
  },
  {
    id: "4",
    title: "제주농가 가계지출의 변화 흐름",
    description: "2003년부터 2023년까지 제주 농가 가계지출의 변화 추이와 전국 평균과의 비교 분석",
    category: "농가경제",
    date: "2023년 12월 30일",
    component: FarmExpenditureTrend,
  },
  {
    id: "5",
    title: "제주 농가경제지표 중 자산 변화",
    description: "2003년부터 2023년까지 제주 농가 자산의 변화 추이와 구성 분석",
    category: "농가경제",
    date: "2024년 6월 2일",
    component: FarmAssets,
  },
  {
    id: "6",
    title: "제주 농가경제지표 중 부채 변화",
    description: "2003년부터 2023년까지 제주 농가 부채의 변화 추이와 구성 분석을 통한 농가 경제 현황 파악",
    category: "농가경제",
    date: "2024년 6월 2일",
    component: FarmDebt,
  },
  {
    id: "7",
    title: "제주 농지의 구조변화: 지형과 기후가 이끈 50년 변화상",
    description: "1975년부터 2023년까지 제주 농지 구조의 변화와 작물별 재배면적 구성 분석",
    category: "경지이용",
    date: "2024년 5월 15일",
    component: LandStructure,
  },
  {
    id: "8",
    title: "제주지역 노지감귤 개화시기 변화",
    description: "2016년부터 2024년까지 제주시와 서귀포시의 노지감귤 개화시기 변화 추이 분석",
    category: "감귤",
    date: "2024년 5월 20일",
    component: CitrusFlowering,
  },
  {
    id: "9",
    title: "제주 농가수와 경지규모의 변화 흐름",
    description: "1980년부터 2024년까지 제주 농업의 경지규모별 농가수 변화 추이 분석",
    category: "경지이용",
    date: "2024년 5월 25일",
    component: FarmScaleChange,
  },
  {
    id: "10",
    title: "경지면적당 비료소비량 변화",
    description: "1975년부터 2023년까지 제주도와 전국의 단위면적당 비료 사용량 변화 추이 분석",
    category: "생산요소",
    date: "2024년 6월 2일",
    component: FertilizerConsumption,
  },
  {
    id: "11",
    title: "제주 연령별 농가인구 피라미드 변화 분석",
    description: "1990년부터 2024년까지 제주 농가인구의 연령별 구성 변화와 고령화 추세 분석",
    category: "농가인구",
    date: "2024년 6월 2일",
    component: PopulationPyramid,
  },
  {
    id: "12",
    title: "농업경영성과지표",
    description: "2003년부터 2023년까지 제주도 농업의 노동, 토지, 자본 생산성 변화 추이 분석",
    category: "농가경영",
    date: "2024년 6월 2일",
    component: AgriculturalPerformance,
  },
  {
    id: "13",
    title: "노지감귤 생산량 및 재배면적 변화",
    description: "2000년부터 2023년까지 제주 노지감귤의 재배면적과 생산량 변화 추이 분석",
    category: "감귤",
    date: "2024년 6월 2일",
    component: CitrusProduction,
  },
  {
    id: "14",
    title: "만감류 생산량 및 재배면적 변화",
    description: "1997년부터 2023년까지 제주 만감류의 재배면적과 생산량 변화 추이 분석",
    category: "감귤",
    date: "2024년 6월 2일",
    component: MandarinProduction,
  },
  {
    id: "15",
    title: "제주지역 산업별 생산구조 변화",
    description: "제주 농림어업의 구조변화, 비중은 줄었지만 여전히 중요한 산업 분석",
    category: "농업생산",
    date: "2024년 6월 2일",
    component: IndustrialStructure,
  },
  {
    id: "16",
    title: "제주도의 산업별 취업자 추이",
    description: "산업별 취업자수로 본 제주농업의 현재와 위치 분석.",
    category: "농업생산",
    date: "2024년 6월 2일",
    component: Employment,
  },
];

export default reportConfig;
