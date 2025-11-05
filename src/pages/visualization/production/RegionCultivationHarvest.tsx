import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import visualizationApi from "~/services/apis/visualizationApi";
import RegionCumulativeStatus from "~/features/visualization/components/production/RegionCumulativeStatus";
import RegionDailyStatus from "~/features/visualization/components/production/RegionDailyStatus";
import BackgroundMap, { MapOptions } from "~/maps/components/ListManagedBackgroundMap";
import useContourLayer from "~/features/visualization/hooks/useContourLayer";
import InfoTooltip from "~/components/InfoTooltip";
import { Fill, Stroke, Style } from "ol/style";
import { transform } from "ol/proj";
import useSetupOL from "~/maps/hooks/useSetupOL";
import { useHighlightLayer } from "~/maps/hooks/useHighlightLayer";
import { useEventHandlers } from "~/maps/hooks/useEventHandlers";
import FarmhouseDataService from "~/maps/services/FarmhouseDataService";
import { baseUrl } from "~/maps/services/LayerDataService";
import MapboxVectorTileLayer from "~/maps/layers/MapboxVectorTileLayer";
import { infoTooltipContents } from "~/utils/InfoTooltipContents";
import { LoadingOutlined } from "@ant-design/icons";
import { DatePicker, Select, Spin } from "antd";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const MAP_ID = uuidv4();
const mapOptions: MapOptions = {
  type: "Satellite",
  layerSwitcher: true,
  mapTypeSwitcher: true,
  roundCorners: true,
};

const polygonStyle = new Style({
  fill: new Fill({ color: "rgba(0, 76, 255, 0.4)" }),
  stroke: new Stroke({
    color: "#003EFF",
    width: 2,
  }),
});

const region = [
  {
    name: "구좌읍",
    lat: 33.499455,
    lng: 126.795723,
  },
  {
    name: "성산읍",
    lat: 33.423085,
    lng: 126.864113,
  },
];

/* 2024 이전으로는 입력된 데이터가 없으므로 당근 월동채소 재배면적의 데이터 표출 */
const RegionCultivationHarvest = () => {
  const farmhouseDataService = new FarmhouseDataService();

  const { layerManager, eventManager, ready, map } = useSetupOL(MAP_ID, 10.7, "jeju", true, false);
  const { selectedFeature, setSelectedFeature, onFeatureClick } = useHighlightLayer(layerManager, ready);
  useEventHandlers(eventManager, ready, onFeatureClick);

  const [selectedDateRange, setSelectedDateRange] = useState<string[]>(["20250101", "20251231"]);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedCrop, setSelectedCrop] = useState<string>("당근");
  const [selectedViewType, setSelectedViewType] = useState<"SDNG" | "HRVST">("SDNG"); // SDNG: 파종, HRVST: 수확
  const [selectedAltitude, setSelectedAltitude] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string[]>([]); // [0]: 읍, [1]: 리
  const [requestBody, setRequestBody] = useState<{ ltlnd_mst_uid_list: string[]; altd_range: string } | null>(null);

  useEffect(() => {
    setSelectedYear(Number(selectedDateRange[0].substring(0, 4)));
  }, [selectedDateRange]);

  const { data: totalData } = useQuery({
    queryKey: ["regionCultivationHarvest", selectedViewType, selectedDateRange, selectedCrop, selectedAltitude],
    queryFn: () =>
      visualizationApi.getRegionCultivationHarvest(
        selectedViewType,
        selectedDateRange[0],
        selectedDateRange[1],
        selectedCrop,
        selectedAltitude?.[0],
        selectedAltitude?.[1]
      ),
    retry: false,
  });

  const { data: dailyData } = useQuery({
    queryKey: ["regionCultivationHarvestDaily", selectedViewType, selectedDateRange, selectedCrop, selectedRegion, selectedAltitude],
    queryFn: () =>
      visualizationApi.getRegionCultivationHarvestDaily(
        selectedViewType,
        selectedDateRange[0],
        selectedDateRange[1],
        selectedCrop,
        selectedRegion[0],
        selectedRegion[1] === "기타" ? "" : selectedRegion[1]
      ),
    enabled: selectedRegion.length > 0,
    retry: false,
  });

  const { data: landList } = useQuery({
    queryKey: ["regionCultivationHarvestLandList", selectedViewType, selectedDateRange, selectedCrop, selectedAltitude],
    queryFn: () =>
      visualizationApi.getRegionCultivationHarvestDetail(
        selectedViewType,
        selectedDateRange[0],
        selectedDateRange[1],
        selectedCrop,
        undefined,
        selectedAltitude?.[0],
        selectedAltitude?.[1]
      ),
    retry: false,
  });

  const { data: detailData, isLoading: isDetailDataLoading } = useQuery({
    queryKey: ["regionCultivationHarvestDetail", selectedViewType, selectedDateRange, selectedFeature],
    queryFn: () =>
      visualizationApi.getRegionCultivationHarvestDetail(
        selectedViewType,
        selectedDateRange[0],
        selectedDateRange[1],
        selectedCrop,
        selectedFeature?.getProperties()?.ltlnd_mst_uid
      ),
    enabled: !!selectedFeature?.getProperties()?.ltlnd_mst_uid,
    retry: false,
  });

  const { data: baseInfo, isLoading: isBaseInfoLoading } = useQuery({
    queryKey: ["regionCultivationHarvestBaseInfo", selectedFeature],
    queryFn: () => farmhouseDataService.fetchFarmfieldBaseInfo(selectedFeature?.getProperties()?.ltlnd_mst_uid, true),
    enabled: !!selectedFeature?.getProperties()?.ltlnd_mst_uid,
    retry: false,
  });

  // 2024년 이전 월동채소 재배면적 데이터
  const { data: cropCultivationArea } = useQuery({
    queryKey: ["cropCultivationArea", selectedYear, selectedAltitude, selectedCrop, requestBody],
    queryFn: () => visualizationApi.getCropCultivationArea(selectedYear, requestBody?.altd_range, selectedCrop),
    enabled: selectedYear <= 2024,
    retry: false,
  });

  const { data: cropLilndMstUidList } = useQuery({
    queryKey: ["cropLilndMstUidList", selectedYear, selectedAltitude, selectedCrop, requestBody],
    queryFn: () => visualizationApi.getCropLilndMstUidList(selectedYear, requestBody?.altd_range, selectedCrop),
    enabled: selectedYear <= 2024,
    retry: false,
  });

  useEffect(() => {
    if (!totalData || !selectedRegion.length) return;

    // selectedRegion[0] (emdNm)과 selectedRegion[1] (stliNm)이 둘 다 일치하는 항목이 있는지 확인
    const hasMatchingRegion = totalData.some((item) => item.emdNm === selectedRegion[0] && item.stliNm === selectedRegion[1]);

    if (!hasMatchingRegion) {
      setSelectedRegion([]);
    }
  }, [totalData]);

  useEffect(() => {
    let altd_range = null;

    if (selectedAltitude[0] === "0") {
      altd_range = "low";
    } else if (selectedAltitude[0] === "100") {
      altd_range = "middle";
    } else if (selectedAltitude[0] === "200") {
      altd_range = "high";
    }
    setRequestBody((prev) => ({
      ...prev,
      altd_range,
    }));
  }, [selectedAltitude]);

  useEffect(() => {
    if (selectedYear <= 2024 && cropLilndMstUidList) {
      setRequestBody((prev) => ({
        ...prev,
        ltlnd_mst_uid_list: cropLilndMstUidList,
      }));
    } else {
      setRequestBody((prev) => ({
        ...prev,
        ltlnd_mst_uid_list: landList?.map((land) => land.ltlndMstUid).filter((uid) => typeof uid === "string") || [],
      }));
    }
  }, [landList, selectedYear, cropLilndMstUidList]);

  const vectorTileLayerRef = useRef<MapboxVectorTileLayer | null>(null);

  const ensureVectorTileLayer = useCallback(() => {
    const url = `${baseUrl}/common/v0/gis/crop/mvt/{z}/{x}/{y}`;

    // 기존 레이어가 있으면 제거
    if (vectorTileLayerRef.current) {
      layerManager.removeLayer("cultivationHarvest");
      vectorTileLayerRef.current = null;
    }

    // 새로운 레이어 생성
    if (requestBody?.ltlnd_mst_uid_list?.length > 0) {
      vectorTileLayerRef.current = new MapboxVectorTileLayer("cultivationHarvest", "지역별 재배면적 및 수확현황", polygonStyle, url, requestBody);
      layerManager.addLayer(vectorTileLayerRef.current, "cultivationHarvest");
    }
  }, [layerManager, requestBody]);

  useEffect(() => {
    if (!ready) return;
    ensureVectorTileLayer();

    return () => {
      if (vectorTileLayerRef.current) {
        layerManager.removeLayer("cultivationHarvest");
        vectorTileLayerRef.current = null;
      }
    };
  }, [ready, ensureVectorTileLayer]);

  useEffect(() => {
    setSelectedFeature(null);
  }, [selectedViewType]);

  useEffect(() => {
    if (!ready || !map || !selectedRegion[0]) return;

    const selectedRegionData = region.find((r) => r.name === selectedRegion[0]);
    if (!selectedRegionData) return;

    const [x, y] = transform([selectedRegionData.lng, selectedRegionData.lat], "EPSG:4326", "EPSG:3857");
    map.getView().animate({
      center: [x, y],
      zoom: 12.5,
      duration: 400,
    });
  }, [ready, map, selectedRegion]);

  useContourLayer({ layerManager, ready, map });

  return (
    <div className="flex min-h-[calc(100vh-70px)] flex-col gap-4 p-5 3xl:min-h-[calc(100vh-70px)]">
      <div className="flex flex-col gap-5 rounded-lg bg-[#37445E] p-5 text-white">
        <div className="flex items-center gap-5 rounded-lg bg-[#43516D] px-5 py-3">
          <div className="flex items-center gap-2.5">
            <p className="flex-shrink-0 text-2xl font-semibold">지역별 재배면적 및 수확현황</p>
            <InfoTooltip content={infoTooltipContents["지역별 재배면적 및 수확현황"]} />
          </div>
          <div className="flex items-center gap-2">
            <p className="flex-shrink-0 text-[18px] font-semibold text-white">날짜</p>
            <RangePicker
              className="w-[260px]"
              value={[dayjs(selectedDateRange[0]), dayjs(selectedDateRange[1])]}
              onChange={(dates) => {
                if (dates) {
                  setSelectedDateRange([dates[0].format("YYYYMMDD"), dates[1].format("YYYYMMDD")]);
                }
              }}
              size="large"
            />
          </div>
          {/* 현재는 당근 밖에 없음 추후 추가 예정 */}
          <div className="flex items-center gap-2.5">
            <p className="flex-shrink-0 text-[18px] font-semibold text-white">작물</p>
            <Select
              className="w-[100px]"
              options={[
                { label: "당근", value: "당근" },
                { label: "무", value: "무" },
              ]}
              value={selectedCrop}
              onChange={(value: string) => setSelectedCrop(value)}
              size="large"
            />
          </div>
          <div className="flex items-center gap-2.5">
            <p className="flex-shrink-0 text-[18px] font-semibold text-white">작기</p>
            <Select
              className="w-[85px]"
              options={[
                { label: "파종", value: "SDNG" },
                { label: "수확", value: "HRVST" },
              ]}
              value={selectedViewType}
              onChange={(value: "SDNG" | "HRVST") => setSelectedViewType(value)}
              size="large"
            />
          </div>
          <div className="flex items-center gap-2.5">
            <p className="flex-shrink-0 text-[18px] font-semibold text-white">고도</p>
            <Select
              className="w-[150px]"
              options={[
                { label: "전체", value: JSON.stringify([]) },
                { label: "100m 이하", value: JSON.stringify(["0", "99"]) },
                { label: "100m ~ 199m", value: JSON.stringify(["100", "199"]) },
                { label: "200m 이상", value: JSON.stringify(["200", "1950"]) },
              ]}
              value={JSON.stringify(selectedAltitude)}
              onChange={(value) => setSelectedAltitude(JSON.parse(value))}
              size="large"
            />
          </div>
        </div>
        <div className="flex h-full flex-1 gap-5 rounded-lg bg-[#37445E] 3xl:max-h-[1000px] 4xl:max-h-[1200px]">
          <div className="relative flex-1">
            <BackgroundMap layerManager={layerManager} ready={ready} mapId={MAP_ID} mapOptions={mapOptions}>
              {selectedFeature?.getProperties()?.ltlnd_mst_uid && (
                <>
                  {isBaseInfoLoading || isDetailDataLoading ? (
                    <div className="absolute left-[10px] top-[12px] z-10 flex h-[150px] w-[250px] items-center justify-center rounded-lg bg-white p-3 text-black">
                      <Spin indicator={<LoadingOutlined spin style={{ fontSize: 60 }} />} />
                    </div>
                  ) : (
                    <div className="absolute left-[10px] top-[12px] z-10 h-fit w-fit rounded-lg bg-white p-3 text-black">
                      <p className="text-[16px]">주소 : {baseInfo?.rprs_lotno_addr?.replace("제주특별자치도", "")}</p>
                      {selectedViewType === "SDNG" && (
                        <>
                          <p className="text-[16px]">
                            재배면적 :{" "}
                            {selectedYear <= 2024
                              ? Number(selectedFeature?.getProperties()?.ltlnd_area).toLocaleString(undefined, { maximumFractionDigits: 1 })
                              : detailData[0]?.totlCltvar?.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                            m<sup>2</sup>
                          </p>
                          {selectedYear > 2024 && <p className="text-[16px]">파종량 : {detailData[0]?.totlVol?.toFixed(1)}kg</p>}
                        </>
                      )}
                      {selectedViewType === "HRVST" && (
                        <>
                          <p className="text-[16px]">수확량 : {detailData[0]?.totlHrvstVol?.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg</p>
                          <p className="text-[16px]">저장량 : {detailData[0]?.totlStrgVol?.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg</p>
                          <p className="text-[16px]">출하량 : {detailData[0]?.totlDptVol?.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg</p>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </BackgroundMap>
          </div>
          <div className="flex w-[35%] flex-col gap-5 3xl:w-[30%] 4xl:w-[27%]">
            <div className="custom-dark-scroll overflow-y-auto rounded-lg bg-[#43516D] p-4 text-white">
              <RegionCumulativeStatus
                selectedDateRange={selectedDateRange}
                viewType={selectedViewType}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                totalData={selectedYear <= 2024 ? cropCultivationArea : totalData}
              />
            </div>
            <div className="custom-dark-scroll overflow-y-auto rounded-lg bg-[#43516D] p-4 text-white">
              <RegionDailyStatus viewType={selectedViewType} region={selectedRegion} dailyData={dailyData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionCultivationHarvest;
