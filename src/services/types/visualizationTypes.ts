export type RegionLevels = "do" | "city" | "region" | "emd" | "ri";

// 월동채소 재배면적 변화
type YearKey = `${number}`;
type RateKey = "rate";

export type YearlyCultivationData = {
  [key in YearKey]?: {
    pummok: string;
    cult_area: number;
  }[];
} & {
  [key in RateKey]?: {
    pummok: string;
    rate: number;
  }[];
};

export interface HibernationVegetableCultivationData {
  [region: string]: YearlyCultivationData;
}

// 지하수 관정별 수질변화
export interface YearlyGroundwaterData {
  [year: string]: {
    [region: string]: number;
  };
}

export interface GroundwaterData {
  [element: string]: YearlyGroundwaterData;
}

export interface MarketTradeRatioTableData {
  region: string;
  target_average_price: number;
  grade_average_price: number;
  target_jeju_weight: number;
  weight_ratio: number;
}

// 가격 예측
export interface PricePredictionRequest {
  yyyymmdd: string;
  pummok: string;
  unit_wght: number;
  predict_period: string;
  adjust_ratio: number;
}

export interface PricePredictionMarketData {
  whlsl_mrkt_cd: string;
  dlng_clcln_ymd: string;
  item_nm: string;
  unit_wght: number;
  // 일별 예측 (7일)
  predc_prc_thdy?: number;
  predc_prc_day_1?: number;
  predc_prc_day_2?: number;
  predc_prc_day_3?: number;
  predc_prc_day_4?: number;
  predc_prc_day_5?: number;
  predc_prc_day_6?: number;
  predc_prc_day_7?: number;
  predc_err_rt?: number | null;
  prc_chnge_rt?: number | null;
  // 주별 예측 (4주)
  predc_prc_wkly?: number;
  predc_prc_wkly_1?: number;
  predc_prc_wkly_2?: number;
  predc_prc_wkly_3?: number;
  predc_prc_wkly_4?: number | null;
  tot_vol: number | null;
  actl_prc: number | null;
}

export type PricePredictionResponse = PricePredictionMarketData[];

// 가격 대시보드
export interface DefaultMarket {
  code: number;
  name: string;
}

export interface PriceDashboardMonthlyRequest {
  pummok: string;
  target_year: number;
  target_month: string;
  market_name: string;
}

export interface PriceDashboardRegionRequest {
  pummok: string;
  start_date: string;
  end_date: string;
}

export interface PriceDashboardMonthlyItem {
  market_name: string;
  market_region_name: string;
  nine_wholesale_market_yn: "Y" | "N";
  total_weight: number | null;
  average_price: number | null;
  previous_day_price: number | null;
  previous_week_price: number | null;
  previous_month_price: number | null;
  previous_year_price: number | null;
  average_year_price: number | null;
  market_total_weight: number | null;
  is_real_weight: boolean;
  is_real_price: boolean;
}

export interface PriceDashboardEntry {
  crtr_ymd: string;
  data: PriceDashboardMonthlyItem[];
}

export type PriceDashboardMonthlyResponse = PriceDashboardEntry[];

export interface PriceDashboardRegionItem {
  market_region_name: string;
  market_count: number;
  average_price: number;
  average_weight: number;
}

export interface PriceDashboardRegionEntry {
  crtr_ymd: string;
  data: PriceDashboardRegionItem[];
}

export type PriceDashboardRegionResponse = PriceDashboardRegionEntry[];

export interface GarakMarketPriceRequest {
  pummok: string;
  start_date: string;
  end_date: string;
}

export interface GarakMarketPriceDailyItem {
  crtr_ymd: string;
  pummok: string;
  grade: string;
  daily_price: number;
  average_monthly_price: number;
}

export interface GarakMarketPriceDailyEntry {
  crtr_ymd: string;
  data: GarakMarketPriceDailyItem[];
}

export type GarakMarketPriceDailyResponse = GarakMarketPriceDailyEntry[];

export interface GarakMarketPriceMonthlyItem {
  pummok: string;
  grade: string;
  monthly_price: number;
  previous_year_price: number;
  previous_year_diff_pct: number;
  average_year_price: number;
}

export interface GarakMarketPriceMonthlyEntry {
  crtr_ymd: string;
  data: GarakMarketPriceMonthlyItem[];
}

export type GarakMarketPriceMonthlyResponse = GarakMarketPriceMonthlyEntry[];

export interface GarakMarketPriceMethodItem {
  dealing_method: string;
  high_price: number;
  low_price: number;
  middle_price: number;
  price_range: number | null;
  pummok: string;
  weight: number;
}

export interface GarakMarketPriceMethodEntry {
  crtr_ymd: string;
  data: GarakMarketPriceMethodItem[];
}

export type GarakMarketPriceMethodResponse = GarakMarketPriceMethodEntry[];
