import apiClient from "~/services/_base/apiClient";
import dayjs from "dayjs";
import domains from "~/services/_base/domains";

const mockLogin = async (username: string, password: string): Promise<any> => {
  const response = await apiClient.post(`${domains.common}/users/mock-login`, {
    username,
    password,
  });
  return response.data;
};

const getHolidays = async (year: string): Promise<any> => {
  const response = await apiClient.get(`https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo`, {
    params: {
      ServiceKey: "praVFihnPzdeFExkbPCCm4AJCcWtbtjd1HdCF1gJhh6dtmRCXksYF+Isff59Mea3sdDFYFuqkind5lk3Rgu02g==",
      solYear: year,
      pageNo: 1,
      numOfRows: 100,
    },
  });

  const realHolidays = response?.data?.response?.body?.items?.item?.filter((i: any) => !i.dateName.includes("임시공휴일") && !i.dateName.includes("대체공휴일"));
  return realHolidays.map((i: any) => dayjs(i.locdate.toString(), "YYYYMMDD").format("YYYY-MM-DD"));
};

export default {
  mockLogin,
  getHolidays,
};
