import { useEffect, useReducer, useRef, useState } from "react";
import { LayerManager } from "~/maps/hooks/useLayerManager";
import FilterMVTLayer from "~/maps/layers/FilterMVTLayer";
import LayerDataService from "~/maps/services/LayerDataService";
import ExportFilterModal from "~/maps/components/ExportFilterModal";
import SaveFilterModal from "~/maps/components/SaveFilterModal";
import LoadFilterModal from "~/maps/components/LoadFilterModal";
import { Collapse, Checkbox, Select, Slider, Radio, Card, Input, Button, InputNumber, Tooltip } from "antd";
import { FileExcelOutlined, SaveOutlined, FolderOpenOutlined } from "@ant-design/icons";
import { createMVTStyle } from "../utils/createMVTStyle";
import { jejuTownList, seogwipoTownList } from "~/utils/townList";

const { Panel } = Collapse;
const { Option } = Select;

interface PummokDict {
  [group: string]: {
    [subGroup: string]: string[];
  };
}

export interface FilterDefault {
  min_area: number;
  max_area: number;
  pummok_dict: PummokDict;
  soil_test_years: string[];
  growth_years: string[];
  quality_years: string[];
  panel_years: string[];
  panel_pummok: string[];
  observation_years: string[];
  disaster_years: string[];
  min_organic_matter_pct: number;
  max_organic_matter_pct: number;
  winter_vegetable_uav_pummok: string[];
  soil_series: string[];
  citrus_system_pummok: string[];
}

export interface FilterInfo {
  total_count: number;
  total_area: number;
}

interface Props {
  layerManager: LayerManager;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const initialState = {
  // 필지 정보
  farmerName: "",
  address: [] as string[],
  areaRange: [500, 2000] as [number, number],
  altitude: "",
  crops: [] as string[],
  // 감귤 관측
  citrusSystemPummok: [] as string[],
  observationYears: [] as string[],
  qualityYears: [] as string[],
  growthYears: [] as string[],
  // 월동채소 관측
  winterVegetableUavPummok: [] as string[],
  // 토양 정보
  soilTestYears: [] as string[],
  soilType: "",
  organicMatterRange: [300, 1100] as [number, number],
  soilSeries: [] as string[],
  // 경영정보 조사
  panelYears: [] as string[],
  panelPummok: [] as string[],
  // 농업재해
  disasterYears: [] as string[],
  // 장비 설치 여부
  equipments: [] as string[],
  activeFilters: {
    farmerName: false,
    address: false,
    area: false,
    altitude: false,
    crop: false,
    citrusSystemPummok: false,
    observationYears: false,
    qualityYears: false,
    growthYears: false,
    winterVegetableUavPummok: false,
    soilTest: false,
    soilType: false,
    organicMatter: false,
    soilSeries: false,
    panelYears: false,
    panelPummok: false,
    disasterYears: false,
    equipment: false,
  },
};

export type Action =
  | { type: "SET_FILTER"; key: keyof typeof initialState; value: any }
  | { type: "TOGGLE_FILTER"; key: keyof typeof initialState.activeFilters }
  | { type: "RESET_FILTERS" };

const filterReducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, [action.key]: action.value };
    case "TOGGLE_FILTER":
      return {
        ...state,
        activeFilters: {
          ...state.activeFilters,
          [action.key]: !state.activeFilters[action.key],
        },
      };
    case "RESET_FILTERS":
      return { ...initialState };
    default:
      return state;
  }
};

interface FilterItemProps {
  label: string;
  filterKey: keyof typeof initialState.activeFilters;
  state: typeof initialState;
  dispatch: React.Dispatch<Action>;
  children?: React.ReactNode;
}

const FilterItem = ({ label, filterKey, state, dispatch, children }: FilterItemProps) => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Checkbox
          className="text-[15px]"
          checked={state.activeFilters[filterKey]}
          onChange={() => {
            dispatch({ type: "TOGGLE_FILTER", key: filterKey });
          }}
        />
        <p className="text-[15px] font-semibold">{label}</p>
      </div>
      {children && <div className={`pl-6 ${!state.activeFilters[filterKey] ? "opacity-50" : ""}`}>{children}</div>}
    </div>
  );
};

const FilterLayerTab = ({ layerManager, setLoading }: Props) => {
  const layerDataService = new LayerDataService();
  const filterLayerRef = useRef<FilterMVTLayer | null>(null);

  const [state, dispatch] = useReducer(filterReducer, initialState);

  const [filterDefault, setFilterDefault] = useState<FilterDefault | null>(null);
  const [filterInfoMap, setFilterInfoMap] = useState<Record<string, FilterInfo>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<string>("");

  const [selectedSi, setSelectedSi] = useState<string | undefined>(undefined);
  const [selectedEmd, setSelectedEmd] = useState<string | undefined>(undefined);
  const [selectedRi, setSelectedRi] = useState<string | undefined>(undefined);
  const [addedAddresses, setAddedAddresses] = useState<string[]>([]);

  const [selectedGroup, setSelectedGroup] = useState<string | undefined>();
  const [selectedSubGroup, setSelectedSubGroup] = useState<string | undefined>();
  const [selectedVariety, setSelectedVariety] = useState<string | undefined>();
  const [addedPummoks, setAddedPummoks] = useState<string[]>([]);

  const closeModal = () => {
    setIsModalOpen(false);
    setModalStatus("");
  };

  useEffect(() => {
    const fetchFilterDefault = async () => {
      const data = await layerDataService.getFarmfieldFilterDefault();
      setFilterDefault(data);
    };

    fetchFilterDefault();
  }, []);

  // 내부에서 선언:
  const applyFilters = async (customKey: string, params?: Record<string, any>, filterStyle?: any) => {
    const queryParams = params ?? generateQueryParams();
    if (Object.keys(queryParams).length === 0) {
      removeFilterLayer();
      return;
    }

    const layerKey = customKey ?? "필터 레이어";

    const existingLayer = layerManager.getLayer(layerKey);
    const style = filterStyle ? createMVTStyle(filterStyle) : undefined;

    if (!existingLayer) {
      const filterLayer = new FilterMVTLayer(layerKey, queryParams, style);
      layerManager.addLayer(filterLayer, layerKey);
      filterLayerRef.current = filterLayer;
    } else if (existingLayer instanceof FilterMVTLayer) {
      filterLayerRef.current = existingLayer;
      filterLayerRef.current.updateQueryParams(queryParams);
      filterLayerRef.current.getSource().refresh();
      if (style) {
        filterLayerRef.current.setStyle(style as any);
      }
    }

    try {
      setLoading(true);
      const info = await layerDataService.getFarmfieldMVTInfo(queryParams);
      setFilterInfoMap((prev) => ({
        ...prev,
        [layerKey]: info,
      }));
    } finally {
      setLoading(false);
    }
  };

  const removeFilterLayer = (key: string = "필터 레이어") => {
    layerManager.removeLayer(key);
    filterLayerRef.current = null;
    setFilterInfoMap((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const generateQueryParams = () => {
    const params: Record<string, any> = {};

    if (state.activeFilters.farmerName && state.farmerName) {
      params.farmer_name = state.farmerName;
    }
    if (state.activeFilters.address && state.address.length > 0) {
      params.address = state.address;
    }
    if (state.activeFilters.area) {
      params.min_area = state.areaRange[0];
      params.max_area = state.areaRange[1];
    }
    if (state.activeFilters.altitude && state.altitude) {
      params.altd_range = state.altitude;
    }
    if (state.activeFilters.crop && state.crops.length > 0) {
      params.pummok = state.crops;
    }
    if (state.activeFilters.citrusSystemPummok && state.citrusSystemPummok.length > 0) {
      params.citrus_system_pummok = state.citrusSystemPummok;
    }
    if (state.activeFilters.observationYears && state.observationYears.length > 0) {
      params.observation_years = state.observationYears;
    }
    if (state.activeFilters.qualityYears && state.qualityYears.length > 0) {
      params.quality_years = state.qualityYears;
    }
    if (state.activeFilters.growthYears && state.growthYears.length > 0) {
      params.growth_years = state.growthYears;
    }
    if (state.activeFilters.winterVegetableUavPummok && state.winterVegetableUavPummok.length > 0) {
      params.winter_vegetable_uav_pummok = state.winterVegetableUavPummok;
    }
    if (state.activeFilters.soilTest && state.soilTestYears.length > 0) {
      params.soil_test_years = state.soilTestYears;
    }
    if (state.activeFilters.soilType && state.soilType) {
      params.soil_type = state.soilType;
    }
    if (state.activeFilters.organicMatter) {
      params.min_organic_matter_pct = state.organicMatterRange[0];
      params.max_organic_matter_pct = state.organicMatterRange[1];
    }
    if (state.activeFilters.soilSeries && state.soilSeries.length > 0) {
      params.soil_series = state.soilSeries;
    }
    if (state.activeFilters.panelYears && state.panelYears.length > 0) {
      params.panel_years = state.panelYears;
    }
    if (state.activeFilters.panelPummok && state.panelPummok.length > 0) {
      params.panel_pummok = state.panelPummok;
    }
    if (state.activeFilters.disasterYears && state.disasterYears.length > 0) {
      params.disaster_years = state.disasterYears;
    }
    if (state.activeFilters.equipment && state.equipments.length > 0) {
      params.sensor_types = state.equipments;
    }

    return params;
  };

  const getEmdOptions = () => {
    if (selectedSi === "제주시") {
      return Object.keys(jejuTownList.제주시);
    } else if (selectedSi === "서귀포시") {
      return Object.keys(seogwipoTownList.서귀포시);
    }
    return [];
  };

  const getRiOptions = () => {
    if (selectedSi === "제주시" && selectedEmd) {
      return jejuTownList.제주시[selectedEmd] || [];
    } else if (selectedSi === "서귀포시" && selectedEmd) {
      return seogwipoTownList.서귀포시[selectedEmd] || [];
    }
    return [];
  };

  const handleAddAddress = () => {
    if (!selectedSi || !selectedEmd) return;

    const fullAddress = selectedRi ? `${selectedSi} ${selectedEmd} ${selectedRi}` : `${selectedSi} ${selectedEmd}`;

    if (addedAddresses.includes(fullAddress)) return;

    const updated = [...addedAddresses, fullAddress];

    setAddedAddresses(updated);
    dispatch({ type: "SET_FILTER", key: "address", value: updated });

    // 초기화
    setSelectedSi(undefined);
    setSelectedEmd(undefined);
    setSelectedRi(undefined);
  };

  const handleAddPummok = () => {
    if (!selectedGroup) return;

    const raw = [selectedGroup, selectedSubGroup ?? "", selectedVariety ?? ""].join(",");

    if (addedPummoks.includes(raw)) return;

    const updated = [...addedPummoks, raw];
    setAddedPummoks(updated);
    dispatch({ type: "SET_FILTER", key: "crops", value: updated });

    setSelectedGroup(undefined);
    setSelectedSubGroup(undefined);
    setSelectedVariety(undefined);
  };

  return (
    <div className="flex h-full flex-col gap-[12px] overflow-hidden" onWheel={(e) => e.preventDefault()}>
      <div className="flex items-center justify-between">
        <p className="text-[20px] font-semibold">필터 설정</p>
        <div className="flex items-center gap-2">
          <Tooltip title="엑셀 다운로드">
            <Button
              icon={<FileExcelOutlined />}
              size="middle"
              type="default"
              disabled={Object.keys(generateQueryParams()).length === 0 || !filterInfoMap["필터 레이어"]}
              onClick={() => {
                setIsModalOpen(true);
                setModalStatus("export");
              }}
            />
          </Tooltip>
          <Tooltip title="필터 저장">
            <Button
              icon={<SaveOutlined />}
              size="middle"
              type="default"
              disabled={Object.keys(generateQueryParams()).length === 0 || !filterInfoMap["필터 레이어"]}
              onClick={() => {
                setIsModalOpen(true);
                setModalStatus("save");
              }}
            />
          </Tooltip>
          <Tooltip title="필터 불러오기">
            <Button
              icon={<FolderOpenOutlined />}
              size="middle"
              type="default"
              onClick={() => {
                setIsModalOpen(true);
                setModalStatus("load");
              }}
            />
          </Tooltip>
        </div>
      </div>
      {Object.keys(filterInfoMap).length > 0 && (
        <Card styles={{ body: { padding: "12px 14px" } }}>
          <div className="flex items-center gap-2 text-[14px]">
            <p className="w-[30%] text-[#666]">현재 필지 수</p>
            <p className="font-semibold">
              {Object.values(filterInfoMap)
                .reduce((acc, cur) => acc + cur.total_count, 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2 text-[14px]">
            <p className="w-[30%] text-[#666]">현재 필지 면적</p>
            <p className="font-semibold">
              {Object.values(filterInfoMap)
                .reduce((acc, cur) => acc + cur.total_area, 0)
                .toLocaleString()}
              m<sup>2</sup>
            </p>
          </div>
        </Card>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Collapse defaultActiveKey={["1"]} expandIconPosition="end" className="mr-[8px] text-[16px]">
          {/* 필지 정보 */}
          <Panel header="필지 정보" key="1">
            <div className="space-y-[16px] p-[8px]">
              {/* 농가명 필터 -> 8/19 숨김처리 요청 */}
              {/* <FilterItem label="농가명 필터" filterKey="farmerName" state={state} dispatch={dispatch}>
                <div className="mt-[8px] flex items-center gap-[8px]">
                  <Input
                    placeholder="농가명을 입력하세요"
                    value={state.farmerName}
                    onChange={(e) => dispatch({ type: "SET_FILTER", key: "farmerName", value: e.target.value })}
                    disabled={!state.activeFilters.farmerName}
                  />
                </div>
              </FilterItem> */}

              {/* 지역 필터 */}
              <FilterItem label="지역 필터" filterKey="address" state={state} dispatch={dispatch}>
                <div className="mt-[8px] flex flex-col items-center gap-[6px]">
                  {/* 추가된 지역 리스트 표시 */}

                  <Select
                    mode="multiple"
                    className="w-full"
                    value={addedAddresses}
                    onChange={(value) => {
                      setAddedAddresses(value);
                      dispatch({ type: "SET_FILTER", key: "address", value });
                    }}
                    maxTagCount="responsive"
                    options={addedAddresses.map((addr) => ({
                      label: addr,
                      value: addr,
                    }))}
                    disabled={!state.activeFilters.address}
                    placeholder="지역을 선택하세요."
                    showSearch={false}
                  />

                  {state.activeFilters.address && (
                    <>
                      <Select
                        allowClear
                        showSearch
                        className="w-full"
                        onChange={(value) => setSelectedSi(value)}
                        value={selectedSi}
                        disabled={!state.activeFilters.address}
                        placeholder={selectedSi === undefined ? "시를 선택하세요." : selectedSi}
                      >
                        <Select.Option value="제주시">제주시</Select.Option>
                        <Select.Option value="서귀포시">서귀포시</Select.Option>
                      </Select>
                      <Select
                        disabled={!selectedSi || getEmdOptions().length === 0}
                        allowClear
                        showSearch
                        className="w-full"
                        onChange={(value) => {
                          setSelectedEmd(value);
                          const nextRiOptions = selectedSi === "제주시" ? jejuTownList.제주시[value] : seogwipoTownList.서귀포시[value];
                          if (!nextRiOptions || nextRiOptions.length === 0) {
                            setSelectedRi(undefined);
                          }
                        }}
                        value={selectedEmd}
                        placeholder={selectedEmd === undefined ? "읍면동을 선택하세요." : selectedEmd}
                      >
                        {getEmdOptions().map((emd) => (
                          <Select.Option key={emd} value={emd}>
                            {emd}
                          </Select.Option>
                        ))}
                      </Select>
                      <div className="flex w-full gap-[6px]">
                        <Select
                          disabled={!selectedEmd || getRiOptions().length === 0}
                          allowClear
                          showSearch
                          className="w-full"
                          onChange={(value) => setSelectedRi(value)}
                          value={selectedRi}
                          placeholder={selectedRi === undefined ? "리를 선택하세요." : selectedRi}
                        >
                          {getRiOptions().map((li) => (
                            <Select.Option key={li} value={li}>
                              {li}
                            </Select.Option>
                          ))}
                        </Select>
                        <Button type="primary" onClick={handleAddAddress}>
                          추가
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </FilterItem>

              {/* 면적 필터 */}
              <FilterItem label="면적 필터" filterKey="area" state={state} dispatch={dispatch}>
                <div className="mt-[8px] flex w-full items-center gap-2">
                  <InputNumber
                    min={filterDefault?.min_area}
                    max={filterDefault?.max_area}
                    value={state.areaRange[0]}
                    onChange={(value) => {
                      if (value === null || value === undefined) return;
                      dispatch({ type: "SET_FILTER", key: "areaRange", value: [value, state.areaRange[1]] });
                    }}
                    onBlur={() => {
                      if (state.areaRange[0] > state.areaRange[1]) dispatch({ type: "SET_FILTER", key: "areaRange", value: [state.areaRange[1], state.areaRange[1]] });
                    }}
                    disabled={!state.activeFilters.area}
                    className="flex-1"
                    placeholder="최소"
                    suffix="㎡"
                    controls={false}
                  />
                  <span>~</span>
                  <InputNumber
                    min={filterDefault?.min_area}
                    max={filterDefault?.max_area}
                    value={state.areaRange[1]}
                    onChange={(value) => {
                      if (value === null || value === undefined) return;
                      dispatch({ type: "SET_FILTER", key: "areaRange", value: [state.areaRange[0], value] });
                    }}
                    onBlur={() => {
                      if (state.areaRange[1] <= state.areaRange[0]) dispatch({ type: "SET_FILTER", key: "areaRange", value: [state.areaRange[0], state.areaRange[0]] });
                    }}
                    disabled={!state.activeFilters.area}
                    className="flex-1"
                    placeholder="최대"
                    suffix="㎡"
                    controls={false}
                  />
                </div>
              </FilterItem>

              {/* 고도 필터 */}
              <FilterItem label="고도 필터" filterKey="altitude" state={state} dispatch={dispatch}>
                <Radio.Group
                  className="flex flex-col gap-[12px] pt-[8px]"
                  value={state.altitude}
                  onChange={(e) => dispatch({ type: "SET_FILTER", key: "altitude", value: e.target.value })}
                  disabled={!state.activeFilters.altitude}
                >
                  <Radio value="low">100m 이하</Radio>
                  <Radio value="middle">100~200m</Radio>
                  <Radio value="high">200m 이상</Radio>
                </Radio.Group>
              </FilterItem>

              {/* 품목 필터 */}
              <FilterItem label="품목 필터" filterKey="crop" state={state} dispatch={dispatch}>
                <div className="mt-[8px] flex flex-col gap-2">
                  {/* 현재 선택된 품목 목록 */}
                  <Select
                    mode="multiple"
                    className="w-full"
                    value={addedPummoks}
                    onChange={(value) => {
                      setAddedPummoks(value);
                      dispatch({ type: "SET_FILTER", key: "crops", value });
                    }}
                    maxTagCount="responsive"
                    disabled={!state.activeFilters.crop}
                    options={addedPummoks.map((pummok) => {
                      const [group, subGroup, variety] = pummok.split(",");
                      return {
                        label: [group, subGroup, variety].filter(Boolean).join(" > "),
                        value: pummok,
                      };
                    })}
                    placeholder="품목을 선택하세요."
                    showSearch={false}
                  />

                  {state.activeFilters.crop && (
                    <>
                      {/* 대분류 선택 */}
                      <Select
                        allowClear
                        value={selectedGroup}
                        onChange={(val) => {
                          setSelectedGroup(val);
                          setSelectedSubGroup(undefined);
                          setSelectedVariety(undefined);
                        }}
                        placeholder="대분류 선택"
                        disabled={!state.activeFilters.crop}
                        options={Object.keys(filterDefault?.pummok_dict ?? {}).map((group) => ({
                          label: group,
                          value: group,
                        }))}
                        showSearch
                      />

                      {/* 중분류 선택 */}
                      <Select
                        allowClear
                        value={selectedSubGroup}
                        onChange={(val) => {
                          setSelectedSubGroup(val);
                          setSelectedVariety(undefined);
                        }}
                        placeholder="중분류 선택"
                        disabled={!state.activeFilters.crop || !selectedGroup}
                        options={
                          selectedGroup
                            ? Object.keys(filterDefault?.pummok_dict[selectedGroup] ?? {}).map((sub) => ({
                                label: sub,
                                value: sub,
                              }))
                            : []
                        }
                        showSearch
                      />

                      {/* 소분류 선택 */}
                      <div className="flex gap-2">
                        <Select
                          allowClear
                          value={selectedVariety}
                          onChange={(val) => setSelectedVariety(val)}
                          placeholder="소분류 선택"
                          className="flex-1"
                          disabled={!state.activeFilters.crop || !selectedSubGroup}
                          options={
                            selectedGroup && selectedSubGroup
                              ? (filterDefault?.pummok_dict[selectedGroup]?.[selectedSubGroup] ?? []).map((v) => ({
                                  label: v,
                                  value: v,
                                }))
                              : []
                          }
                          showSearch
                          optionFilterProp="children"
                        />

                        <Button
                          type="primary"
                          onClick={handleAddPummok}
                          disabled={!selectedGroup} // 대분류만 있으면 허용
                        >
                          추가
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </FilterItem>
            </div>
          </Panel>

          {/* 감귤 관측 */}
          <Panel header="감귤 관측" key="3">
            <div className="space-y-[16px] p-[8px]" onClick={(e) => e.stopPropagation()}>
              <FilterItem label="감귤 품목/품종 조회" filterKey="citrusSystemPummok" state={state} dispatch={dispatch}>
                <Select
                  mode="multiple"
                  className="mt-[8px] w-full"
                  placeholder="작물을 선택하세요"
                  value={state.citrusSystemPummok}
                  onChange={(value) => dispatch({ type: "SET_FILTER", key: "citrusSystemPummok", value })}
                  disabled={!state.activeFilters.citrusSystemPummok}
                  showSearch
                  optionFilterProp="children"
                >
                  {filterDefault?.citrus_system_pummok.map((pummok) => (
                    <Option key={pummok} value={pummok}>
                      {pummok}
                    </Option>
                  ))}
                </Select>
              </FilterItem>

              <FilterItem label="연도별 관측조사 필지 여부" filterKey="observationYears" state={state} dispatch={dispatch}>
                <Select
                  mode="multiple"
                  className="mt-[8px] w-full"
                  placeholder="연도를 선택하세요"
                  value={state.observationYears}
                  onChange={(value) => dispatch({ type: "SET_FILTER", key: "observationYears", value })}
                  disabled={!state.activeFilters.observationYears}
                >
                  {filterDefault?.observation_years
                    ?.slice()
                    .reverse()
                    .map((year) => (
                      <Option key={year} value={year}>
                        {year}
                      </Option>
                    ))}
                </Select>
              </FilterItem>

              <FilterItem label="연도별 품질 검사 여부" filterKey="qualityYears" state={state} dispatch={dispatch}>
                <Select
                  mode="multiple"
                  className="mt-[8px] w-full"
                  placeholder="연도를 선택하세요"
                  value={state.qualityYears}
                  onChange={(value) => dispatch({ type: "SET_FILTER", key: "qualityYears", value })}
                  disabled={!state.activeFilters.qualityYears}
                >
                  {filterDefault?.quality_years
                    ?.slice()
                    .reverse()
                    .map((year) => (
                      <Option key={year} value={year}>
                        {year}
                      </Option>
                    ))}
                </Select>
              </FilterItem>

              <FilterItem label="연도별 감귤 생육조사 필지 여부" filterKey="growthYears" state={state} dispatch={dispatch}>
                <Select
                  mode="multiple"
                  className="mt-[8px] w-full"
                  placeholder="연도를 선택하세요"
                  value={state.growthYears}
                  onChange={(value) => dispatch({ type: "SET_FILTER", key: "growthYears", value })}
                  disabled={!state.activeFilters.growthYears}
                >
                  {filterDefault?.growth_years
                    ?.slice()
                    .reverse()
                    .map((year) => (
                      <Option key={year} value={year}>
                        {year}
                      </Option>
                    ))}
                </Select>
              </FilterItem>
            </div>
          </Panel>

          {/* 월동채소 관측 */}
          <Panel header="월동채소 관측" key="4">
            <div className="space-y-[16px] p-[8px]">
              <FilterItem label="월동채소 드론조사 품목" filterKey="winterVegetableUavPummok" state={state} dispatch={dispatch}>
                <Select
                  mode="multiple"
                  className="mt-[8px] w-full"
                  placeholder="품목을 선택하세요"
                  value={state.winterVegetableUavPummok}
                  onChange={(value) => dispatch({ type: "SET_FILTER", key: "winterVegetableUavPummok", value })}
                  disabled={!state.activeFilters.winterVegetableUavPummok}
                >
                  {filterDefault?.winter_vegetable_uav_pummok.map((pummok) => (
                    <Option key={pummok} value={pummok}>
                      {pummok}
                    </Option>
                  ))}
                </Select>
              </FilterItem>
            </div>
          </Panel>

          {/* 토양 정보 */}
          <Panel header="토양 정보" key="5">
            <div className="space-y-[16px] p-[8px]">
              {/* 검정결과 보유 여부 */}
              <FilterItem label="검정결과 보유 여부" filterKey="soilTest" state={state} dispatch={dispatch}>
                <Select
                  mode="multiple"
                  className="mt-[8px] w-full"
                  placeholder="연도를 선택하세요"
                  value={state.soilTestYears}
                  onChange={(value) => dispatch({ type: "SET_FILTER", key: "soilTestYears", value })}
                  disabled={!state.activeFilters.soilTest}
                >
                  {filterDefault?.soil_test_years
                    ?.slice()
                    .reverse()
                    .map((year) => (
                      <Option key={year} value={year}>
                        {year}
                      </Option>
                    ))}
                </Select>
              </FilterItem>

              {/* 토양 유형 */}
              <FilterItem label="토양 유형" filterKey="soilType" state={state} dispatch={dispatch}>
                <Radio.Group
                  className="flex flex-col gap-[12px] pt-[8px]"
                  value={state.soilType}
                  onChange={(e) => dispatch({ type: "SET_FILTER", key: "soilType", value: e.target.value })}
                  disabled={!state.activeFilters.soilType}
                >
                  <Radio value="화산회토" className="text-[15px]">
                    화산회토
                  </Radio>
                  <Radio value="비화산회토" className="text-[15px]">
                    비화산회토
                  </Radio>
                </Radio.Group>
              </FilterItem>

              {/* 유기물 함량 */}
              <FilterItem label="유기물 함량" filterKey="organicMatter" state={state} dispatch={dispatch}>
                <Slider
                  range
                  value={state.organicMatterRange}
                  min={filterDefault?.min_organic_matter_pct}
                  max={filterDefault?.max_organic_matter_pct}
                  disabled={!state.activeFilters.organicMatter}
                  onChange={(value) => dispatch({ type: "SET_FILTER", key: "organicMatterRange", value })}
                />
              </FilterItem>

              <FilterItem label="토양도" filterKey="soilSeries" state={state} dispatch={dispatch}>
                <Select
                  mode="multiple"
                  className="mt-[8px] w-full"
                  placeholder="토양도를 선택하세요"
                  value={state.soilSeries}
                  onChange={(value) => dispatch({ type: "SET_FILTER", key: "soilSeries", value })}
                  disabled={!state.activeFilters.soilSeries}
                >
                  {filterDefault?.soil_series.map((series) => (
                    <Option key={series} value={series}>
                      {series}
                    </Option>
                  ))}
                </Select>
              </FilterItem>
            </div>
          </Panel>

          {/* 경영정보 조사 */}
          <Panel header="경영정보 조사" key="6">
            <div className="space-y-[16px] p-[8px]" onClick={(e) => e.stopPropagation()}>
              <FilterItem label="패널조사 필지 여부" filterKey="panelYears" state={state} dispatch={dispatch}>
                <Select
                  mode="multiple"
                  className="mt-[8px] w-full"
                  placeholder="연도를 선택하세요"
                  value={state.panelYears}
                  onChange={(value) => dispatch({ type: "SET_FILTER", key: "panelYears", value })}
                  disabled={!state.activeFilters.panelYears}
                >
                  {filterDefault?.panel_years
                    ?.slice()
                    .reverse()
                    .map((year) => (
                      <Option key={year} value={year}>
                        {year}
                      </Option>
                    ))}
                </Select>
              </FilterItem>

              <FilterItem label="경영정보 조사 품목 조회" filterKey="panelPummok" state={state} dispatch={dispatch}>
                <Select
                  mode="multiple"
                  className="mt-[8px] w-full"
                  placeholder="작물을 선택하세요"
                  value={state.panelPummok}
                  onChange={(value) => dispatch({ type: "SET_FILTER", key: "panelPummok", value })}
                  disabled={!state.activeFilters.panelPummok}
                  showSearch
                  optionFilterProp="children"
                >
                  {filterDefault?.panel_pummok.map((pummok) => (
                    <Option key={pummok} value={pummok}>
                      {pummok}
                    </Option>
                  ))}
                </Select>
              </FilterItem>
            </div>
          </Panel>

          {/* 병해충 예찰 */}
          {/* <Panel header="병해충 예찰" key="7">
            <div className="space-y-[16px] p-[8px]"></div>
          </Panel> */}

          {/* 농업재해 */}
          <Panel header="농업재해" key="8">
            <div className="space-y-[16px] p-[8px]" onClick={(e) => e.stopPropagation()}>
              <FilterItem label="연도별 피해 필지 여부" filterKey="disasterYears" state={state} dispatch={dispatch}>
                <Select
                  mode="multiple"
                  className="mt-[8px] w-full"
                  placeholder="연도를 선택하세요"
                  value={state.disasterYears}
                  onChange={(value) => dispatch({ type: "SET_FILTER", key: "disasterYears", value })}
                  disabled={!state.activeFilters.disasterYears}
                >
                  {filterDefault?.disaster_years
                    ?.slice()
                    .reverse()
                    .map((year) => (
                      <Option key={year} value={year}>
                        {year}
                      </Option>
                    ))}
                </Select>
              </FilterItem>
            </div>
          </Panel>

          {/* 장비 설치 여부 */}
          <Panel header="IoT장비 위치" key="9">
            <div className="space-y-[16px] p-[8px]" onClick={(e) => e.stopPropagation()}>
              <FilterItem label="장비 설치" filterKey="equipment" state={state} dispatch={dispatch}>
                <Checkbox.Group
                  className="flex flex-col gap-[12px] pt-[8px]"
                  disabled={!state.activeFilters.equipment}
                  value={state.equipments}
                  onChange={(value) => dispatch({ type: "SET_FILTER", key: "equipments", value })}
                >
                  <Checkbox value="RTU" className="text-[15px]">
                    토양센서
                  </Checkbox>
                  <Checkbox value="AWS" className="text-[15px]">
                    AWS
                  </Checkbox>
                  <Checkbox value="DT" className="text-[15px]">
                    디지털트랩
                  </Checkbox>
                </Checkbox.Group>
              </FilterItem>
            </div>
          </Panel>
        </Collapse>
      </div>
      <div>
        <Button type="primary" className="h-[36px] w-full" onClick={() => applyFilters("필터 레이어")}>
          필터 적용
        </Button>
      </div>
      {isModalOpen && modalStatus === "export" && (
        <ExportFilterModal isModalOpen={isModalOpen} closeModal={closeModal} params={generateQueryParams()} filterInfo={filterInfoMap["필터 레이어"]} />
      )}
      {isModalOpen && modalStatus === "save" && (
        <SaveFilterModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} params={generateQueryParams()} filterInfo={filterInfoMap["필터 레이어"]} />
      )}
      {isModalOpen && modalStatus === "load" && <LoadFilterModal isModalOpen={isModalOpen} closeModal={closeModal} dispatch={dispatch} applyFilters={applyFilters} />}
    </div>
  );
};

export default FilterLayerTab;
