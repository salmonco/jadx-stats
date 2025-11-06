import { QueryClient } from "@tanstack/react-query";
import { request as __request } from "~/maps/services/core/request";
import { OpenAPI } from "~/maps/services/core/OpenAPI";
import QueryClientSingleton from "~/maps/classes/QueryClientSingleton";
import { Layer, Layers, Sld } from "~/maps/classes/interfaces";
import { LayerStyle } from "~/maps/hooks/useLayerExportTools";
import { FilterDefault, FilterInfo } from "~/maps/components/FilterLayerTab";
import { Filter } from "~/maps/components/LoadFilterModal";

const apiBase = import.meta.env.VITE_API_URL || "https://agri.jeju.go.kr";
export const baseUrl = `${apiBase}/api`;

export const getRequest = async <T>(url: string, options?: { params?: Record<string, string | number>; token?: string }): Promise<T> => {
  const queryString = options?.params ? "?" + new URLSearchParams(options.params as Record<string, string>).toString() : "";
  const token = options?.token || localStorage.getItem("jadx_token");

  return __request(OpenAPI, {
    method: "GET",
    url: `${url}${queryString}`,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export const getRequestKeyValue = async (url: string, options?: { params?: Record<string, string | number | string[]>; token?: string }) => {
  let queryString = "";
  if (options?.params) {
    const params = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.append(key, String(value));
      }
    });
    queryString = `?${params.toString()}`;
  }

  const token = options?.token || localStorage.getItem("jadx_token");

  return __request(OpenAPI, {
    method: "GET",
    url: `${url}${queryString}`,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export const postRequest = async (
  url: string,
  options?: {
    params?: Record<string, string | number>;
    body?: Record<string, any>;
    token?: string;
  }
) => {
  const queryString = options?.params ? "?" + new URLSearchParams(options.params as Record<string, string>).toString() : "";
  const token = options?.token || localStorage.getItem("jadx_token");

  return __request(OpenAPI, {
    method: "POST",
    url: `${url}${queryString}`,
    body: options?.body,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export const patchRequest = async (
  url: string,
  options?: {
    params?: Record<string, string | number>;
    body?: Record<string, any>;
  }
) => {
  const queryString = options?.params ? "?" + new URLSearchParams(options.params as Record<string, string>).toString() : "";

  return __request(OpenAPI, {
    method: "PATCH",
    url: `${url}${queryString}`,
    body: options?.body,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteRequest = async (url: string, options?: { params?: Record<string, string | number>; token?: string }) => {
  const queryString = options?.params ? "?" + new URLSearchParams(options.params as Record<string, string>).toString() : "";
  const token = options?.token || localStorage.getItem("jadx_token");

  await __request(OpenAPI, {
    method: "DELETE",
    url: `${url}${queryString}`,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return;
};

export async function getBlob(url: string, options?: { params?: Record<string, string | number>; token?: string }) {
  const queryString = options?.params ? "?" + new URLSearchParams(options.params as Record<string, string>).toString() : "";
  const token = options?.token || localStorage.getItem("jadx_token");

  const res = await fetch(`${url}${queryString}`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) throw new Error("엑셀 다운로드 실패");
  return res.blob();
}

class LayerDataService {
  private queryClient: QueryClient;

  constructor() {
    this.queryClient = QueryClientSingleton.getInstance();
  }

  async getLayers(): Promise<Layers> {
    return this.queryClient.fetchQuery({
      queryKey: ["layers", new Date().getTime()],
      queryFn: () => getRequest(`${baseUrl}/gis/v0/layers/list`),
    });
  }

  async getLayer(layerName: string, params?: Record<string, string | number>): Promise<Layer> {
    return this.queryClient.fetchQuery({
      queryKey: ["layer", new Date().getTime()],
      queryFn: () =>
        getRequest(`${baseUrl}/gis/v0/layers/geometry`, {
          params: {
            layer_name: layerName,
            ...params,
          },
        }),
    });
  }

  async checkLayerNameDuplicate(layerName: string): Promise<any> {
    return this.queryClient.fetchQuery({
      queryKey: ["layer", layerName],
      queryFn: () => getRequest(`${baseUrl}/gis/v0/layers/exists/${layerName}`),
    });
  }

  async createLayer(layerName: string, layerTitle: string, geoJSON: object, style: LayerStyle): Promise<any> {
    return this.queryClient.fetchQuery({
      queryKey: ["layer", layerName],
      queryFn: () =>
        postRequest(`${baseUrl}/gis/v0/layers/${layerName}`, {
          body: {
            geo_json: geoJSON,
            layer_title: layerTitle,
            style: style,
          },
        }),
    });
  }

  async getSld(styleName: string): Promise<string> {
    return this.queryClient.fetchQuery({
      queryKey: ["sld", styleName],
      queryFn: () => getRequest(`${baseUrl}/gis/v0/styles/${styleName}`),
    });
  }

  async getFarmfieldFilterDefault(): Promise<FilterDefault> {
    return this.queryClient.fetchQuery({
      queryKey: ["farmfieldFilterDefault"],
      queryFn: () => getRequest(`${baseUrl}/common/v0/gis/farmfield/default`),
    });
  }

  async getFarmfieldMVTInfo(params: Record<string, any>): Promise<FilterInfo> {
    return this.queryClient.fetchQuery({
      queryKey: ["farmfielInfo", params],
      queryFn: () =>
        getRequestKeyValue(`${baseUrl}/common/v0/gis/farmfield/mvt/info`, {
          params: {
            ...params,
          },
        }),
    });
  }

  async getFarmfieldFilters(token: string): Promise<Filter[]> {
    return getRequest(`${baseUrl}/common/v0/gis/farmfield/filter`, { token });
  }

  async saveFarmfieldFilter(params: Record<string, any>, body: Record<string, any>, token: string): Promise<any> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else {
        searchParams.append(key, String(value));
      }
    });

    return postRequest(`${baseUrl}/common/v0/gis/farmfield/filter?${searchParams.toString()}`, { body, token });
  }

  async deleteFarmfieldFilter(fltr_nm: string, token: string): Promise<string> {
    await deleteRequest(`${baseUrl}/common/v0/gis/farmfield/filter/${fltr_nm}`, { token });
    return fltr_nm;
  }

  async exportFarmfieldFilter(params: Record<string, any>): Promise<Blob> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else {
        searchParams.append(key, String(value));
      }
    });
    return getBlob(`${baseUrl}/common/v0/gis/farmfield/excel?${searchParams.toString()}`);
  }
}

export default LayerDataService;
