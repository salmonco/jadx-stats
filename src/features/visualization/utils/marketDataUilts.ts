import { QuantityValue } from "~/features/visualization/components/retail/MarketQuantityBarLineChart";
import { useEffect, useState } from "react";
import { marketRegionMapping } from "./marketRegionMapping";
import { MarketQuantityData } from "~/pages/visualization/retail/WholesaleMarketShare";

const colorMap = {
  무: "#E0DEB3",
  감귤: "#FFA500",
  양배추: "#7CFC00",
  당근: "#FF4500",
  양파: "#FFD700",
  만감: "#FF8C00",
  브로콜리: "#228B22",
  콜라비: "#9370DB",
  비트: "#8B0000",
  감자: "#D2B48C",
  쪽파: "#32CD32",
  적채: "#BB00D1",
  마늘: "#F5DEB3",
  키위: "#6B8E23",
  칼리플라워: "#F0E68C",
  옥수수: "#FFD700",
};

export const jejuCodes = {
  "제주도 제주시": ["50110"],
  "제주도 서귀포시": ["50130"],
};

export const options = Object.keys(colorMap).map((key) => {
  return { label: key, value: key };
});

export const getJejuData = (data: MarketQuantityData[], selectedPummok: string) => {
  return data
    .filter((item) => item.jeju_yn && item.vrty_clsf_nm === selectedPummok)
    .map((item) => ({
      group: item.wk_id,
      holiday: item.lhldy_yn,
      quantity: item.wght,
      pummok: item.vrty_clsf_nm,
      range: item.intrvl,
      region: item.rgn_nm,
      x_key: item.wk_se,
      som: item.mm_strt,
      soy: item.yr_strt,
      year: item.yr,
    }));
};

export const getRestData = (data: MarketQuantityData[], selectedPummok: string) => {
  return data
    .filter((item) => !item.jeju_yn && item.vrty_clsf_nm === selectedPummok)
    .map((item) => ({
      group: item.wk_id,
      holiday: item.lhldy_yn,
      quantity: item.wght,
      pummok: item.vrty_clsf_nm,
      range: item.intrvl,
      region: item.rgn_nm,
      x_key: item.wk_se,
      som: item.mm_strt,
      soy: item.yr_strt,
      year: item.yr,
    }));
};

export const sumQuantitiesByRegion = (data: QuantityValue[]) => {
  const result = data.reduce((acc, item) => {
    let regionObj = acc.find((obj) => obj.region === item.region);
    if (regionObj) {
      regionObj.quantitySum += item.quantity;
    } else {
      acc.push({ region: item.region, quantitySum: item.quantity, codes: [] });
    }
    return acc;
  }, []);
  return result;
};

export const filterByYearMonth = (data: QuantityValue[], year: number, month: number) => {
  return data.filter((item) => {
    const range = item.range.split("~");
    let start = new Date(+item.year, parseInt(range[0].split("/")[0]) - 1, parseInt(range[0].split("/")[1]));
    const end = new Date(+item.year, parseInt(range[1].split("/")[0]) - 1, parseInt(range[1].split("/")[1]));
    let ranges = [];
    while (start <= end) {
      ranges.push(start);
      start = new Date(start.setDate(start.getDate() + 1));
    }
    return ranges.some((date) => date.getFullYear() === year && date.getMonth() + 1 === month);
  });
};

export const getMarketRegionData = (quantityData: MarketQuantityData[], selectedPummok: string, selectedTargetYear: number, selectedTargetMonth: number) => {
  const [quantityJeju, setQuantityJeju] = useState<any[]>([]);
  const [quantityRest, setQuantityRest] = useState<any[]>([]);

  useEffect(() => {
    if (quantityData && marketRegionMapping) {
      const jejuData = getJejuData(quantityData, selectedPummok);
      const restData = getRestData(quantityData, selectedPummok);

      const filteredJeju = filterByYearMonth(jejuData, selectedTargetYear, selectedTargetMonth);
      const filteredRest = filterByYearMonth(restData, selectedTargetYear, selectedTargetMonth);

      const restSummed = sumQuantitiesByRegion(filteredRest);
      const restMapped = restSummed
        .map((region) => {
          const mappedRegion = marketRegionMapping[region.region];
          if (mappedRegion) {
            region.codes = mappedRegion;
          }
          return region;
        })
        .filter((region) => !["수입산", "원양산", "-"].includes(region.region));

      const jejuSummed = sumQuantitiesByRegion(filteredJeju);
      const jejuMapped = jejuSummed.map((region) => {
        const codes = jejuCodes[region.region];
        if (codes) {
          region.codes = codes;
        }
        return region;
      });
      setQuantityRest(restMapped);
      setQuantityJeju(jejuMapped);
    }
  }, [quantityData, selectedPummok, selectedTargetYear, selectedTargetMonth]);

  return { quantityJeju, quantityRest };
};
