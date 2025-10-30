import apiClient from "~/services/_base/apiClient";
import domains from "~/services/_base/domains";
import { StatsRange, StatsSummaryGeneral, StatsSummaryMarket, StatsSummaryMarketTable, YearlyStats } from "~/services/types/statsTypes";

const getStatsList = async (): Promise<any> => {
  const response = await apiClient.get(`${domains.stats}`);
  return response?.data;
};

const getStatsRange = async (qualifiedName: string): Promise<StatsRange> => {
  const response = await apiClient.get(`${domains.stats}/kosis/${qualifiedName}/range`);
  return response?.data;
};

const getStatsData = async (qualifiedName: string, startYear: number, endYear: number): Promise<YearlyStats> => {
  const response = await apiClient.get(`${domains.stats}/kosis/${qualifiedName}`, {
    params: {
      start_year: startYear,
      end_year: endYear,
    },
  });
  return response?.data;
};

const getStatsSummaryGeneral = async (targetYear: number): Promise<StatsSummaryGeneral> => {
  const response = await apiClient.get(`${domains.stats}/summary/general`, {
    params: {
      target_year: targetYear,
    },
  });
  return response?.data;
};

const getStatsSummaryMarket = async (targetDate: string, pummok: string): Promise<StatsSummaryMarket> => {
  const response = await apiClient.get(`${domains.stats}/summary/market`, {
    params: {
      target_date: targetDate,
      pummok: pummok,
    },
  });
  return response?.data;
};

const getStatsSummaryMarketTable = async (targetDate: string, pummok: string): Promise<StatsSummaryMarketTable> => {
  const response = await apiClient.get(`${domains.stats}/summary/market/table`, {
    params: {
      target_date: targetDate,
      pummok: pummok,
    },
  });
  return response?.data;
};

export default {
  getStatsList,
  getStatsRange,
  getStatsData,
  getStatsSummaryGeneral,
  getStatsSummaryMarket,
  getStatsSummaryMarketTable,
};
