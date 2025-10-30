export interface StatsRange {
  start_year: number;
  end_year: number;
}

export interface Stats {
  C1_OBJ_NM: string;
  DT: string;
  ITM_NM: string;
  PRD_DE: string;
  C1_NM: string;
  C2_NM?: string;
  UNIT_NM: string;
}

export interface YearlyStats {
  [year: string]: Stats[];
}

export interface YearlyFarmingStats {
  year: number;
  farmer_count: number;
  farmhouse_count: number;
  cultivation_area: number;
  farming_income: number | null;
  farming_purchase_index: number;
  farming_sales_index: number;
  total_farming_income: number | null;
}

export interface StatsSummaryGeneral {
  data: YearlyFarmingStats[];
  previous_cultivation_area_rate: number;
  previous_farmer_count_rate: number;
  previous_farmhouse_count_rate: number;
  previous_farming_income_rate: number | null;
  previous_farming_purchase_index_rate: number;
  previous_farming_sales_index_rate: number;
  previous_total_farming_income_rate: number | null;
}

export interface StatsSummaryMarket {
  garak_average_price: number | null;
  garak_average_price_change_rate: number | null;
  garak_grade_price: number | null;
  garak_grade_price_change_rate: number | null;
  total_average_price: number | null;
  total_average_price_change_rate: number | null;
  jeju_weight: number | null;
  jeju_weight_change_rate: number | null;
  total_weight: number | null;
  total_weight_change_rate: number | null;
}

export interface MarketPriceData {
  whlsl_mrkt_nm: string;
  target_average_price: number | null;
  target_grade_price: number | null;
  week_average_price: number | null;
  year_average_price: number | null;
  jeju_total_weight: number | null;
}

export interface StatsSummaryMarketTable {
  [region: string]: MarketPriceData[];
}

export interface MarketPriceData {
  whlsl_mrkt_nm: string;
  target_average_price: number | null;
  grade_average_price: number | null;
  week_average_price: number | null;
  year_average_price: number | null;
  target_total_weight: number | null;
  today_all_weight: number | null;
}
