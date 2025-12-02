import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import InfoTooltip from "~/components/InfoTooltip";
import BaseLegend from "~/features/visualization/components/common/BaseLegend";
import ChartContainer from "~/features/visualization/components/common/ChartContainer";
import FilterContainer from "~/features/visualization/components/common/FilterContainer";
import OneDepthScrollSelector from "~/features/visualization/components/common/OneDepthScrollSelector";
import VisualizationContainer from "~/features/visualization/components/common/VisualizationContainer";
import YearSelector from "~/features/visualization/components/common/YearSelector";
import YearlyExportLineChart from "~/features/visualization/components/retail/YearlyExportLineChart";
import YearlyExportTable from "~/features/visualization/components/retail/YearlyExportTable";
import { useGroupedExportData } from "~/features/visualization/hooks/useGroupedExportData";
import MandarinExportLayer, { RANK_COLORS } from "~/features/visualization/layers/MandarinExportLayer";
import BackgroundMap from "~/maps/components/BackgroundMap";
import { MapOptions } from "~/maps/constants/mapOptions";
import useSetupOL from "~/maps/hooks/useSetupOL";
import visualizationApi from "~/services/apis/visualizationApi";
import { infoTooltipContents } from "~/utils/InfoTooltipContents";

interface MandarinExportData {
  agcode: string; // 농산물 코드
  amt: number; // 금액
  hscode: string; // HS 코드
  ntn_nm: string; // 국가명
  se: "수입" | "수출"; // 수출입 구분
  vrty_clsf_nm: string; // 품종 분류명
  wght: number; // 중량
  year: number; // 연도
}

const MAP_ID = uuidv4();
const mapOptions: MapOptions = {
  type: "world",
  layerSwitcher: false,
  mapTypeSwitcher: false,
  roundCorners: true,
};

const TARGET_YEAR = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002];
const STANDARD_YEAR = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

const YearlyCountryExportInfo = () => {
  const { layerManager, map, ready } = useSetupOL(MAP_ID, 2, "world", true, false);
  const layerRef = useRef<MandarinExportLayer | null>(null);

  const [selectedTargetYear, setSelectedTargetYear] = useState<number>(2023);
  const [selectedStandardYear, setSelectedStandardYear] = useState<number>(10);
  const [mandarinExportData, setMandarinExportData] = useState<MandarinExportData[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["러시아", "캐나다", "미국", "말레이시아"]);
  const [features, setGeoJsonData] = useState(null);
  const [polygonReady, setPolygonReady] = useState(false);

  useEffect(() => {
    if (!features) {
      const geoJsonData = async () => {
        const response = await visualizationApi.getWorldGeoJson();
        setGeoJsonData(response);
      };

      geoJsonData();
    }
  }, [features]);

  useEffect(() => {
    const fetchMandarinExportData = async () => {
      const response = await visualizationApi.getMandarinExportByYear(selectedTargetYear, selectedStandardYear);
      setMandarinExportData(response?.data?.cifru_exp_incm);
    };

    fetchMandarinExportData();
  }, [selectedTargetYear, selectedStandardYear]);

  const { groupedCountryTotals, groupedCountryYears, countryOptions, drawPolygonsForSelectedCountries } = useGroupedExportData(mandarinExportData, selectedCountries);

  // 폴리곤 그리기
  useEffect(() => {
    if (features && mandarinExportData && countryOptions) {
      drawPolygonsForSelectedCountries(map, selectedCountries, features);
      setPolygonReady(true);
    }
  }, [mandarinExportData, features, map, countryOptions, selectedCountries, ready]);

  useEffect(() => {
    if (!ready || !layerManager || !polygonReady || !Object.keys(groupedCountryTotals).length) return;

    const createMandarinLayer = async () => {
      if (!layerRef.current) {
        const mandarinLayer = await MandarinExportLayer.asyncFactory(groupedCountryTotals, map);
        layerManager.addLayer(mandarinLayer, "감귤 수출 정보");
        layerRef.current = mandarinLayer;
      } else {
        layerManager.removeLayer("감귤 수출 정보");
        const mandarinLayer = await MandarinExportLayer.asyncFactory(groupedCountryTotals, map);
        layerManager.addLayer(mandarinLayer, "감귤 수출 정보");
        layerRef.current = mandarinLayer;
      }
    };

    createMandarinLayer();

    return () => {
      if (layerRef.current) {
        layerManager.removeLayer("감귤 수출 정보");
        layerRef.current = null;
      }
    };
  }, [layerManager, groupedCountryTotals, polygonReady, ready]);

  return (
    <VisualizationContainer
      title="제주 감귤 연도별, 국가별 수출 정보"
      tooltip={<InfoTooltip content={infoTooltipContents["제주 감귤 연도별, 국가별 수출정보"]} />}
      mapContent={<BackgroundMap layerManager={layerManager} ready={ready} mapId={MAP_ID} mapOptions={mapOptions} />}
      filterContent={
        <FilterContainer>
          <YearSelector
            targetYear={TARGET_YEAR}
            standardYear={STANDARD_YEAR}
            selectedTargetYear={selectedTargetYear}
            setSelectedTargetYear={setSelectedTargetYear}
            selectedStandardYear={selectedStandardYear}
            setSelectedStandardYear={setSelectedStandardYear}
          />
          <OneDepthScrollSelector
            options={countryOptions}
            title="수출 국가 선택"
            selectedValues={selectedCountries}
            setSelectedValues={setSelectedCountries}
            multiSelect={true}
          />
          <BaseLegend
            title="수출 규모 범례"
            direction="horizontal"
            items={[
              { label: "최상위", color: RANK_COLORS[1] },
              { label: "상위", color: RANK_COLORS[2] },
              { label: "중위", color: RANK_COLORS[3] },
              { label: "하위", color: RANK_COLORS[4] },
            ]}
          />
        </FilterContainer>
      }
      chartContent={
        <div className="flex flex-col gap-4">
          <ChartContainer minHeight={400} cols={2}>
            <YearlyExportLineChart yearlyData={groupedCountryYears} type={"totalAmount"} countryOptions={countryOptions} />
            <YearlyExportLineChart yearlyData={groupedCountryYears} type={"totalWeight"} countryOptions={countryOptions} />
          </ChartContainer>
          <YearlyExportTable yearlyData={groupedCountryYears} type={"totalAmount"} countryOptions={countryOptions} />
          <YearlyExportTable yearlyData={groupedCountryYears} type={"totalWeight"} countryOptions={countryOptions} />
        </div>
      }
    />
  );
};

export default YearlyCountryExportInfo;
