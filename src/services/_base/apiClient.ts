import axios, { AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const nextezApiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_NEXTEZ_API_URL,
});

export const s3BaseUrl = "https://jadx-temp-1.s3.ap-northeast-2.amazonaws.com";

export default apiClient;

export const removeEmptyParams = <T extends object>(params: T): Partial<T> => {
  return Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)) as Partial<T>;
};
