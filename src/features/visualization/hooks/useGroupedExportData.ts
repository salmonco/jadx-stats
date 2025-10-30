import { useMemo } from "react";
import { countryCoordinates } from "~/utils/countryCoordinates";
import { generateColorFromString } from "~/utils/colorGenerator";
import { ScrollSelectorOption } from "../components/common/OneDepthScrollSelector";

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import { fromLonLat } from "ol/proj";
import { MultiPolygon } from "ol/geom";
import Overlay from "ol/Overlay";
import MandarinExportLayer, { RANK_COLORS } from "../layers/MandarinExportLayer";

export interface ExportData {
  ntn_nm: string;
  amt: number;
  wght: number;
  year: number;
}

export type GroupedCountryTotalData = Record<
  string,
  {
    totalAmount: number;
    totalWeight: number;
    coordinates: [number, number];
  }
>;

export type GroupedCountryYearData = Record<
  string,
  Record<
    number,
    {
      totalAmount: number;
      totalWeight: number;
    }
  >
>;

export type GroupedCountryData = Record<string, ExportData[]>;

export interface CountryOption {
  value: string;
  color: string;
}
export const showCountries = [
  "러시아",
  "미국",
  "홍콩",
  "캐나다",
  "싱가포르",
  "말레이시아",
  "몽골",
  "괌",
  "중화민국",
  "아랍에미리트",
  "북마리아나 제도",
  "뉴질랜드",
  "필리핀",
  "인도네시아",
  "캄보디아",
];

export const useGroupedExportData = (data: ExportData[], selectedCountries: string[] = []) => {
  const groupedCountryTotals = useMemo(() => {
    if (selectedCountries.length === 0) return {};

    return data.reduce((acc, curr) => {
      if (!selectedCountries.includes(curr.ntn_nm)) return acc;

      if (!acc[curr.ntn_nm]) {
        acc[curr.ntn_nm] = {
          totalAmount: 0,
          totalWeight: 0,
          coordinates: countryCoordinates[curr.ntn_nm],
        };
      }
      acc[curr.ntn_nm].totalAmount += curr.amt;
      acc[curr.ntn_nm].totalWeight += curr.wght / 1000;
      return acc;
    }, {} as GroupedCountryTotalData);
  }, [data, selectedCountries]);

  const groupedCountryYears = useMemo(() => {
    if (selectedCountries.length === 0) return {};

    return data.reduce((acc, curr) => {
      if (!selectedCountries.includes(curr.ntn_nm)) return acc;

      if (!acc[curr.ntn_nm]) {
        acc[curr.ntn_nm] = {};
      }
      if (!acc[curr.ntn_nm][curr.year]) {
        acc[curr.ntn_nm][curr.year] = {
          totalAmount: 0,
          totalWeight: 0,
        };
      }
      acc[curr.ntn_nm][curr.year].totalAmount += curr.amt;
      acc[curr.ntn_nm][curr.year].totalWeight += curr.wght / 1000;
      return acc;
    }, {} as GroupedCountryYearData);
  }, [data, selectedCountries]);

  const countryOptions: ScrollSelectorOption[] = useMemo(() => {
    if (!data.length) return [];

    const uniqueCountries = [...new Set(data.map((item) => item.ntn_nm))].filter((country) => showCountries.includes(country));
    return uniqueCountries.map((country) => ({
      value: country,
      color: generateColorFromString(country),
    }));
  }, [data]);

  const drawPolygonsForSelectedCountries = (map, selectedCountries, features) => {
    map.getLayers().forEach((layer) => {
      if (layer?.get("name") === "country-polygons") {
        map.removeLayer(layer);
      }
    });

    if (!map || !features || features.length === 0) return;
    const { colorMap } = MandarinExportLayer.calculateRanks(groupedCountryTotals);
    const source = new VectorSource();
    features.forEach((featureData) => {
      const { geometry, properties } = featureData;
      const name = properties.name;

      if (!selectedCountries.includes(name)) return;
      if (!groupedCountryTotals[name]) return;

      let geometryObject;

      if (geometry.type === "Polygon") {
        geometryObject = new Polygon(geometry.coordinates.map((coord) => coord.map((point) => fromLonLat(point))));
      } else if (geometry.type === "MultiPolygon") {
        geometryObject = new MultiPolygon(geometry.coordinates.map((polygon) => polygon.map((coord) => coord.map((point) => fromLonLat(point)))));
      }

      const color = colorMap.get(name) || "rgba(0,0,0,0.3)";

      const feature = new Feature({ geometry: geometryObject });
      feature.set("name", name);

      feature.setStyle(
        new Style({
          fill: new Fill({ color }),
        })
      );

      source.addFeature(feature);

      // 툴팁 엘리먼트 생성
      const tooltipElement = document.createElement("div");
      tooltipElement.className = "tooltip";
      tooltipElement.style.cssText = `
        display: grid; 
        grid-template-columns: auto 1fr; 
        column-gap: 6px; 
        padding: 14px 20px 14px 14px; 
        border-radius: 12px; 
        background-color: #37445E; 
        color: white; 
        pointer-events: none;
      `;

      const tooltipOverlay = new Overlay({
        element: tooltipElement,
        offset: [10, 0],
        positioning: "bottom-left",
      });
      map.addOverlay(tooltipOverlay);

      // 툴팁 이벤트
      map.on("pointermove", function (evt) {
        const pixel = map.getEventPixel(evt.originalEvent);
        const feature = map.forEachFeatureAtPixel(pixel, (f) => f);

        if (feature) {
          const name = feature.get("name");
          const countryData = groupedCountryTotals[name];
          const totalAmount = countryData?.totalAmount != null ? Math.round(countryData.totalAmount).toLocaleString() : "-";

          const totalWeight = countryData?.totalWeight != null ? Math.round(countryData.totalWeight).toLocaleString() : "-";
          if (countryData) {
            tooltipElement.innerHTML = `
              <div style="display: flex; align-items: center; gap: 6px;">
                <div style="color: #FFC132; font-size: 16px;">▶</div>
                <div style="color: #FFC132; font-weight: 700;">${name}</div>
              </div>
              <div>총 금액: $${totalAmount}</div>
              <div>총 중량: ${totalWeight}톤</div>            
          `;
            tooltipOverlay.setPosition(evt.coordinate);
            tooltipElement.style.display = "block";
          } else {
            tooltipElement.style.display = "none";
          }
        } else {
          tooltipElement.style.display = "none";
        }
      });
    });

    const vectorLayer = new VectorLayer({ source });
    vectorLayer.set("name", "country-polygons");
    map.addLayer(vectorLayer);
  };

  return {
    groupedCountryTotals,
    groupedCountryYears,
    countryOptions,
    drawPolygonsForSelectedCountries,
  };
};
