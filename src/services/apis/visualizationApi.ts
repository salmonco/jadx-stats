import { MarketStatsData } from "~/pages/visualization/retail/WholesaleMarketShare";
import apiClient, { nextezApiClient, removeEmptyParams } from "~/services/_base/apiClient";
import domains from "~/services/_base/domains";
import {
  HibernationVegetableCultivationData,
  GroundwaterData,
  MarketTradeRatioTableData,
  PricePredictionRequest,
  PricePredictionResponse,
  PriceDashboardMonthlyRequest,
  PriceDashboardMonthlyResponse,
  DefaultMarket,
  PriceDashboardRegionRequest,
  PriceDashboardRegionResponse,
  GarakMarketPriceRequest,
  GarakMarketPriceDailyResponse,
  GarakMarketPriceMonthlyResponse,
  GarakMarketPriceMethodResponse,
} from "~/services/types/visualizationTypes";
import { RegionLevels } from "~/services/types/visualizationTypes";
import { MonthlyComparisonData, TradeStats } from "~/pages/visualization/retail/CropTradeInfo";

const getVisualizationData = async (qualifiedName: string, params?: { [key: string]: any }): Promise<any> => {
  const response = await apiClient.get(`${domains.visualize}/${qualifiedName}`, {
    params: {
      ...params,
    },
  });
  return response?.data;
};

const getGroundwaterByWell = async (targetYear: number, standardYear: number): Promise<GroundwaterData> => {
  const response = await apiClient.get(`${domains.visualize}/well/by-year`, {
    params: {
      target_year: targetYear,
      standard_year: standardYear,
    },
  });
  return response?.data;
};

const getObservationResultByYear = async (targetYear: number, standardYear: number): Promise<any> => {
  const response = await apiClient.get(`${domains.visualize}/observation-result/by-year`, {
    params: {
      target_year: targetYear,
      standard_year: standardYear,
    },
  });
  return response?.data;
};

const getObservationResultByMonth = async (selectedLevel: RegionLevels, targetYear: number): Promise<any> => {
  const response = await apiClient.get(`${domains.visualize}/observation-result/by-month`, {
    params: {
      level: selectedLevel,
      target_year: targetYear,
    },
  });
  return response?.data;
};

const getMandarinExportByYear = async (targetYear: number, standardYear: number): Promise<any> => {
  const response = await apiClient.get(`${domains.visualize}/export/by-year`, {
    params: {
      target_year: targetYear,
      standard_year: standardYear,
    },
  });
  return response?.data;
};

const getYearlyDisasterInfoByYear = async (targetYear: number, standardYear: number): Promise<any> => {
  const response = await apiClient.get(`${domains.visualize}/disaster/by-year`, {
    params: {
      target_year: targetYear,
      standard_year: standardYear,
    },
  });
  return response?.data?.data;
};

const getDisasterByItemByYear = async (targetYear: number): Promise<any> => {
  const response = await apiClient.get(`${domains.visualize}/dmg-amt/by-year`, {
    params: {
      target_year: targetYear,
    },
  });
  return response?.data;
};

const getMarketStatsByYear = async (targetYear: number): Promise<MarketStatsData> => {
  const response = await apiClient.get(`${domains.visualize}/market/by-year`, {
    params: {
      target_year: targetYear,
    },
  });
  return response?.data;
};

const getMandarinFloweringByYear = async (targetYear: number, standardYear: number[]): Promise<any> => {
  const years = [targetYear, ...standardYear].join(",");
  const response = await apiClient.get(`${domains.visualize}/flowering/by-year`, {
    params: {
      target_year: years,
    },
  });
  return response?.data;
};

// 월동채소 재배면적 변화
const getHinatVgtblCltvarDclrFile = async (target_year: number, standard_year: number, level: RegionLevels): Promise<any> => {
  const response = await apiClient.get(`${domains.visualize}/hinat_vgtbl_cltvar_dclr/file`, {
    params: {
      target_year,
      standard_year,
      level,
    },
  });
  return response?.data;
};

const getHinatVgtblCltvarDclrByYear = async (target_year: number, standard_year: number): Promise<HibernationVegetableCultivationData> => {
  const response = await apiClient.get(`${domains.visualize}/hinat/by-year`, {
    params: {
      target_year,
      standard_year,
    },
  });
  return response?.data;
};

// 감귤 품종 리스트 (재배면적 내림차순 정렬)
const getMandarinVarietyList = async (): Promise<any> => {
  const response = await apiClient.get(`${domains.visualize}/cifru_cltvtn_mng_sys/filter`);
  return response?.data;
};

// 감귤 수령분포
const getMandarinTreeAgeDistribution = async (target_year: number, level: RegionLevels, pummok: string, variety: string): Promise<any> => {
  const response = await apiClient.get(`${domains.visualize}/cifru_cltvtn_mng_sys/simulation`, {
    params: {
      target_year,
      level,
      pummok,
      variety,
    },
  });
  return response?.data;
};

// 지역별 감귤 재배정보
const getMandarinCultivationInfo = async (level: RegionLevels, pummok: string, variety: string): Promise<any> => {
  const response = await apiClient.get(`${domains.visualize}/cifru_cltvtn_mng_sys/zone`, {
    params: {
      level,
      pummok,
      variety,
    },
  });
  return response?.data;
};

// 지역별 감귤 재배정보 (차트)
const getMandarinCultivationInfoChart = async (level: string, pummok: string, variety: string): Promise<any> => {
  const response = await apiClient.get(`${domains.visualize}/cifru_cltvtn_mng_sys/chart`, {
    params: {
      level,
      pummok,
      variety,
    },
  });
  return response?.data;
};

// 감귤 수령분포, 지역별 감귤 재배정보 에서 사용할 품목, 품종 리스트
const getMandarinPummokVariety = async (): Promise<any> => {
  const response = await apiClient.get(`${domains.visualize}/cifru_cltvtn_mng_sys/default`);
  return response?.data;
};

// 세계 지도 geoJson
const getWorldGeoJson = async (): Promise<any> => {
  const response = await apiClient.get(`${domains.visualize}/worldmap/select_geojson`);
  return response?.data.features;
};

// 내륙 지도 geoJson
const getAreaGeojson = async (level: string): Promise<any> => {
  const response = await apiClient.get(`${domains.visualize}/gisMap/getAreaGeojson`, {
    params: {
      level,
    },
  });
  return response?.data;
};

// 지하수 데이터 및 영역
const getField = async (level: string, targetYear: number): Promise<any> => {
  const response = await apiClient.get(`${domains.visualize}/agrclt_gwt_wtrqlty/ground_water`, {
    params: {
      level,
      targetYear,
    },
  });
  return response?.data;
};

// 감귤 관측조사 결과 비교
const getMandarinGrowthSurveyCompare = async (level: string, target_year: number, standard_year: number, category: string, altitude: string): Promise<any> => {
  const response = await apiClient.get(`${domains.visualize}/obsrvn_exmn`, {
    params: {
      level,
      target_year,
      standard_year,
      category,
      altitude,
    },
  });
  return response?.data;
};

// 농업재해 연도별 현황
const getDisasterName = async (target_year: number): Promise<any> => {
  const response = await apiClient.get(`${domains.visualize}/disaster/name`, {
    params: {
      target_year,
    },
  });
  return response?.data;
};

const getDisasterFeatures = async (target_year: number, level: RegionLevels, disaster_name: string, item_name?: string): Promise<any> => {
  const params: Record<string, any> = {
    target_year,
    level,
    disaster_name,
  };

  if (item_name) {
    params.item_name = item_name;
  }

  const response = await apiClient.get(`${domains.visualize}/disaster/gis`, {
    params,
  });

  return response?.data;
};

// 월동채소 도매시장 거래정보
const getHibernationVegetableMarketTrade = async (target_date: string, pummok: string): Promise<TradeStats> => {
  const response = await apiClient.get(`${domains.visualize}/whlsl_mrkt_dlng_info`, {
    params: {
      target_date,
      pummok,
    },
  });
  return response?.data;
};

const getHibernationVegetableMarketTradeChart = async (target_date: string, pummok: string): Promise<MonthlyComparisonData[]> => {
  const response = await apiClient.get(`${domains.visualize}/whlsl_mrkt_dlng_info/chart`, {
    params: {
      target_date,
      pummok,
    },
  });
  return response?.data;
};

const getRegionCultivationHarvest = async (seCd: string, sStartYmd: string, sEndYmd: string, clsfNm: string, sStartAltd?: string, sEndAltd?: string): Promise<any> => {
  const params = removeEmptyParams({
    apiKey: "2a0c3f1e-4b8d-4f5b-9a6c-7d0e1f2a3b8f",
    seCd,
    sStartYmd,
    sEndYmd,
    clsfNm,
    sStartAltd,
    sEndAltd,
  });

  const response = await nextezApiClient.get(`/jadx/app/api/getApiTotalByStli`, { params });
  return response?.data?.response?.body?.emdMap?.items?.item;
};

const getRegionCultivationHarvestDaily = async (
  seCd: string,
  sStartYmd: string,
  sEndYmd: string,
  clsfNm: string,
  emdNm?: string,
  stliNm?: string,
  sStartAltd?: string,
  sEndAltd?: string
): Promise<any> => {
  const params = removeEmptyParams({
    apiKey: "2a0c3f1e-4b8d-4f5b-9a6c-7d0e1f2a3b8f",
    seCd,
    sStartYmd,
    sEndYmd,
    clsfNm,
    emdNm,
    stliNm,
    sStartAltd,
    sEndAltd,
  });

  const response = await nextezApiClient.get(`/jadx/app/api/getApiTotalByStliYmd`, { params });
  return response?.data?.response?.body?.emdMap?.items?.item;
};

const getRegionCultivationHarvestDetail = async (
  seCd: string,
  sStartYmd: string,
  sEndYmd: string,
  clsfNm: string,
  ltlndMstUid?: string,
  sStartAltd?: string,
  sEndAltd?: string
): Promise<any> => {
  const params = removeEmptyParams({
    apiKey: "2a0c3f1e-4b8d-4f5b-9a6c-7d0e1f2a3b8f",
    seCd,
    sStartYmd,
    sEndYmd,
    clsfNm,
    ltlndMstUid,
    sStartAltd,
    sEndAltd,
  });

  const response = await nextezApiClient.get(`/jadx/app/api/getApiTotalByLtlnd`, { params });
  return response?.data?.response?.body?.emdMap?.items?.item ?? [];
};

const getAgingStatus = async (level: RegionLevels, exclude_dong: boolean): Promise<any> => {
  const response = await apiClient.get(`${domains.visualize}/farming-entity/by-year`, {
    params: {
      level,
      exclude_dong,
    },
  });
  return response?.data;
};

const getMarketTradeRatioTable = async (target_date: string, pummok: string): Promise<MarketTradeRatioTableData[]> => {
  const response = await apiClient.get(`${domains.visualize}/whlsl_mrkt_dlng_info/ratio`, {
    params: {
      target_date,
      pummok,
    },
  });
  return response?.data;
};

const getCropCultivationArea = async (target_year: number, altd_range: string | null, crop_name: string): Promise<any> => {
  const response = await apiClient.get(`${domains.visualize}/crop/cultivation-area`, {
    params: {
      target_year,
      altd_range,
      crop_name,
    },
  });
  return response?.data;
};

const getCropLilndMstUidList = async (target_year: number, altd_range: string | null, crop_name: string): Promise<any> => {
  const response = await apiClient.get(`${domains.visualize}/crop/ltlnd-mst-uid`, {
    params: {
      target_year,
      altd_range,
      crop_name,
    },
  });
  return response?.data;
};

// 가격 예측
const getPricePrediction = async (request: PricePredictionRequest): Promise<PricePredictionResponse> => {
  const response = await apiClient.get(`${domains.survey}/prediction/price-prediction`, { params: request });
  return response?.data;
};

const getPricePredictionWeight = async (request: any): Promise<any> => {
  const response = await apiClient.get(`${domains.survey}/prediction/price-prediction/weight`, { params: request });
  return response?.data;
};

// 가격 대시보드
const getDefaultMarketList = async (date: string): Promise<DefaultMarket[]> => {
  const response = await apiClient.get(`${domains.survey}/default`, { params: { date } });
  return response?.data;
};

const getPriceDashboardMonthly = async (request: PriceDashboardMonthlyRequest): Promise<PriceDashboardMonthlyResponse> => {
  const response = await apiClient.get(`${domains.survey}/prediction/price-dashboard`, { params: request });
  return response?.data;
};

const getPriceDashboardMonthlyExcel = async (request: PriceDashboardMonthlyRequest): Promise<Blob> => {
  const response = await apiClient.get(`${domains.survey}/prediction/price-dashboard/excel`, { params: request, responseType: "blob" });
  return response?.data;
};

const getPriceDashboardRegion = async (request: PriceDashboardRegionRequest): Promise<PriceDashboardRegionResponse> => {
  const response = await apiClient.get(`${domains.survey}/prediction/price-dashboard/region`, { params: request });
  return response?.data;
};

const getPriceDashboardRegionExcel = async (request: PriceDashboardRegionRequest): Promise<Blob> => {
  const response = await apiClient.get(`${domains.survey}/prediction/price-dashboard/region/excel`, { params: request, responseType: "blob" });
  return response?.data;
};

// 가락시장 농산물 가격 현황
const getGarakMarketPriceDaily = async (request: GarakMarketPriceRequest): Promise<GarakMarketPriceDailyResponse> => {
  const response = await apiClient.get(`${domains.survey}/prediction/garak-market/daily`, { params: request });
  return response?.data;
};

const getGarakMarketPriceDailyExcel = async (request: GarakMarketPriceRequest): Promise<Blob> => {
  const response = await apiClient.get(`${domains.survey}/prediction/garak-market/daily/excel`, { params: request, responseType: "blob" });
  return response?.data;
};

const getGarakMarketPriceMonthly = async (request: GarakMarketPriceRequest): Promise<GarakMarketPriceMonthlyResponse> => {
  const response = await apiClient.get(`${domains.survey}/prediction/garak-market/monthly`, { params: request });
  return response?.data;
};

const getGarakMarketPriceMonthlyExcel = async (request: GarakMarketPriceRequest): Promise<Blob> => {
  const response = await apiClient.get(`${domains.survey}/prediction/garak-market/monthly/excel`, { params: request, responseType: "blob" });
  return response?.data;
};

const getGarakMarketPriceMethod = async (request: GarakMarketPriceRequest): Promise<GarakMarketPriceMethodResponse> => {
  const response = await apiClient.get(`${domains.survey}/prediction/garak-market/method`, { params: request });
  return response?.data;
};

const getGarakMarketPriceMethodExcel = async (request: GarakMarketPriceRequest): Promise<Blob> => {
  const response = await apiClient.get(`${domains.survey}/prediction/garak-market/method/excel`, { params: request, responseType: "blob" });
  return response?.data;
};

export default {
  getVisualizationData,
  getGroundwaterByWell,
  getObservationResultByYear,
  getObservationResultByMonth,
  getMandarinExportByYear,
  getYearlyDisasterInfoByYear,
  getDisasterByItemByYear,
  getMarketStatsByYear,
  getMandarinFloweringByYear,
  getHinatVgtblCltvarDclrFile,
  getHinatVgtblCltvarDclrByYear,
  getMandarinVarietyList,
  getMandarinTreeAgeDistribution,
  getMandarinCultivationInfo,
  getMandarinCultivationInfoChart,
  getMandarinPummokVariety,
  getWorldGeoJson,
  getAreaGeojson,
  getField,
  getMandarinGrowthSurveyCompare,
  getDisasterName,
  getDisasterFeatures,
  getHibernationVegetableMarketTrade,
  getHibernationVegetableMarketTradeChart,
  getRegionCultivationHarvest,
  getRegionCultivationHarvestDaily,
  getRegionCultivationHarvestDetail,
  getAgingStatus,
  getMarketTradeRatioTable,
  getCropCultivationArea,
  getCropLilndMstUidList,
  getPricePrediction,
  getPricePredictionWeight,
  getDefaultMarketList,
  getPriceDashboardMonthly,
  getPriceDashboardMonthlyExcel,
  getPriceDashboardRegion,
  getPriceDashboardRegionExcel,
  getGarakMarketPriceDaily,
  getGarakMarketPriceDailyExcel,
  getGarakMarketPriceMonthly,
  getGarakMarketPriceMonthlyExcel,
  getGarakMarketPriceMethod,
  getGarakMarketPriceMethodExcel,
};
