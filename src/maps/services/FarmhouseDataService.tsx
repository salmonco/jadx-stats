import { QueryClient } from "@tanstack/react-query";
import { request as __request } from "~/maps/services/core/request";
import { OpenAPI } from "~/maps/services/core/OpenAPI";
import QueryClientSingleton from "~/maps/classes/QueryClientSingleton";
import { Farmhouse, FarmhouseSearhResult } from "~/maps/classes/interfaces";

const apiBase = import.meta.env.VITE_API_URL || "http://43.202.8.244:8001";
export const baseUrl = `${apiBase}/api/guidance/v0/farmhouse`;

export const getRequest = async (url: string, options?: { params?: Record<string, string | number> }) => {
  const queryString = options?.params ? "?" + new URLSearchParams(options.params as Record<string, string>).toString() : "";

  return __request(OpenAPI, {
    method: "GET",
    url: `${url}${queryString}`,
  });
};

export const postRequest = async (
  url: string,
  options?: {
    params?: Record<string, string | number>;
    body?: Record<string, any>;
  }
) => {
  const queryString = options?.params ? "?" + new URLSearchParams(options.params as Record<string, string>).toString() : "";

  return __request(OpenAPI, {
    method: "POST",
    url: `${url}${queryString}`,
    body: options?.body,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

class FarmhouseDataService {
  private queryClient: QueryClient;

  constructor() {
    this.queryClient = QueryClientSingleton.getInstance();
  }

  async getFarmhousesFarmFields(searchValue: string, offset: number, limit: number): Promise<FarmhouseSearhResult[]> {
    return this.queryClient.fetchQuery({
      queryKey: ["farmfields", searchValue, offset, limit],
      queryFn: () => getRequest(`${apiBase}/api/common/v0/gis/addr-search/farmfields`, { params: { addr: searchValue, offset, limit } }),
    });
  }

  async getFarmhousesFarmmap(searchValue: string): Promise<FarmhouseSearhResult[]> {
    return this.queryClient.fetchQuery({
      queryKey: ["farmmap", searchValue],
      queryFn: () => getRequest(`${apiBase}/api/common/v0/gis/addr-search/farmmap`, { params: { addr: searchValue } }),
    });
  }

  async getFarmhousesCadastral(searchValue: string): Promise<FarmhouseSearhResult[]> {
    return this.queryClient.fetchQuery({
      queryKey: ["cadastral", searchValue],
      queryFn: () => getRequest(`${apiBase}/api/common/v0/gis/addr-search/cadastral`, { params: { addr: searchValue } }),
    });
  }

  async getFarmhousesFarmentity(searchValue: string): Promise<FarmhouseSearhResult[]> {
    return this.queryClient.fetchQuery({
      queryKey: ["farmentity", searchValue],
      queryFn: () => getRequest(`${apiBase}/api/common/v0/gis/addr-search/farmentity`, { params: { addr: searchValue } }),
    });
  }

  async getFarmhouse(searchType: string, searchValue: string): Promise<Farmhouse> {
    return this.queryClient.fetchQuery({
      queryKey: ["farmhouse", searchType, searchValue],
      queryFn: () => getRequest(`${apiBase}/api/guidance/v0/farmhouse/search/${searchType}`, { params: { search_value: searchValue } }),
    });
  }

  async fetchFarmfieldBaseInfo(fid: string, geometry: boolean): Promise<any> {
    return this.queryClient.fetchQuery({
      queryKey: ["farmfieldBaseInfo", fid, geometry],
      queryFn: () => getRequest(`${apiBase}/api/common/v0/gis/farmfield/base-info/${fid}`, { params: { geometry: geometry ? "true" : "false" } }),
    });
  }
}

export default FarmhouseDataService;
