// third-party imports
import { QueryClient } from "@tanstack/react-query";
import GeoJSON from "ol/format/GeoJSON";
import Feature from "ol/Feature";
// local imports
import { request as __request } from "~/maps/services/core/request";
import { OpenAPI } from "~/maps/services/core/OpenAPI";
import QueryClientSingleton from "~/maps/classes/QueryClientSingleton";
import { MapType } from "~/maps/constants/gisConstants";

export const baseUrl = "https://jadx-temp-1.s3.ap-northeast-2.amazonaws.com";

export const getRequest = async (url: string) =>
  __request(OpenAPI, {
    method: "GET",
    url: url,
  });

export const parseFeature = (data): Feature[] => new GeoJSON().readFeatures(data);

export type RegionLevels = "do" | "city" | "region" | "emd" | "ri";
export type OffsetRange = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";

class MapDataService {
  private queryClient: QueryClient;

  constructor() {
    this.queryClient = QueryClientSingleton.getInstance();
  }

  async getRegionData(lvl: RegionLevels) {
    return this.queryClient.fetchQuery({
      queryKey: ["regionData", lvl],
      queryFn: () => getRequest(`${baseUrl}/gis/${lvl}/jeju_merged_3857.geojson`).then(parseFeature),
    });
  }

  async getCropChangeData(year = 2023) {
    const prevYear = year - 1;
    return this.queryClient.fetchQuery({
      queryKey: ["cropChangeData", year],
      queryFn: () => getRequest(`${baseUrl}/gis/hexagons_area_changes__${prevYear}-${year}.geojson`) as Promise<any>,
    });
  }

  async getCropChangeDataForLvl(lvl: RegionLevels, year = 2023) {
    const prevYear = year - 1;
    return this.queryClient.fetchQuery({
      queryKey: ["cropChangeDataForLvl", year, lvl],
      queryFn: () => getRequest(`${baseUrl}/gis/${lvl}_area_changes__${prevYear}-${year}.geojson`) as Promise<any>,
    });
  }

  async getCadastralData(pnu: string = "5013032021120450001") {
    return this.queryClient.fetchQuery({
      queryKey: ["cadastralData", pnu],
      queryFn: () => getRequest(`${baseUrl}/gis/cadastral/${pnu}.geojson`).then(parseFeature),
    });
  }

  async getFarmmapData(pnu: string = "5013032021120450001") {
    return this.queryClient.fetchQuery({
      queryKey: ["farmmapData", pnu],
      queryFn: () => getRequest(`${baseUrl}/gis/farmmap/${pnu}.geojson`).then(parseFeature),
    });
  }

  async getFarmmapXsectData(pnu: string = "5013032021120450001") {
    return this.queryClient.fetchQuery({
      queryKey: ["farmmapXsectData", pnu],
      queryFn: () => getRequest(`${baseUrl}/gis/farmmap_xsect/${pnu}.geojson`).then(parseFeature),
    });
  }

  async getMandarinFieldAreaData() {
    return this.queryClient.fetchQuery({
      queryKey: ["mandarinFieldAreaData"],
      queryFn: () => getRequest(`${baseUrl}/mandarin-data/field_cult_area.json`),
    });
  }

  async getMandarinAgeGroupOffsetData(level: RegionLevels, offset: OffsetRange) {
    const response = await fetch(`${baseUrl}/mandarin-data/${level}/mandarin_age_group_offset_${offset}.json`);
    if (!response.ok) throw new Error("네트워크 오류");
    return response.json();
  }

  async getMarketRegionData(region: MapType) {
    return this.queryClient.fetchQuery({
      queryKey: ["marketRegionData", region],
      queryFn: () => getRequest(`${baseUrl}/market-data/market_regions_${region}.geojson`).then(parseFeature),
    });
  }

  async getMarketRegionMapping() {
    return this.queryClient.fetchQuery({
      queryKey: ["marketRegionMapping"],
      queryFn: () => getRequest(`${baseUrl}/market-data/market_region_to_gis_region.json`),
    });
  }

  async getMarketStatsData(region: MapType, year: number, pummok: string) {
    return this.queryClient.fetchQuery({
      queryKey: ["marketStatsData", region, year, pummok],
      queryFn: () => getRequest(`${baseUrl}/market-data/weekly_market_data__${region}__${year}__${pummok}.json`),
    });
  }
}

export default MapDataService;
