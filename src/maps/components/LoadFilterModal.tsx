import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "~/contexts/AuthContext";
import { Action } from "~/maps/components/FilterLayerTab";
import LayerDataService from "~/maps/services/LayerDataService";
import { List, message, Modal, Radio, RadioChangeEvent, Tag } from "antd";
import { ClockCircleOutlined, DeleteTwoTone } from "@ant-design/icons";

interface Props {
  isModalOpen: boolean;
  closeModal: () => void;
  dispatch: React.Dispatch<Action>;
  applyFilters: (customKey: string, params?: any, style?: any) => void;
}

export interface Filter {
  fltr_nm: string;
  sld_unq_nm: string;
  fltr_param: Record<string, any>;
  fill: string;
  fill_opacity: number;
  stroke: string;
  stroke_width: number;
}

const filterLabels: Record<string, string> = {
  address: "지역 필터",
  min_area: "최소 면적",
  max_area: "최대 면적",
  altd_range: "고도 필터",
  pummok: "품목 필터",
  citrus_system_pummok: "감귤 품목/품종 조회",
  observation_years: "관측조사 필지 여부",
  quality_years: "품질검사 결과 여부",
  growth_years: "생육조사 결과 여부",
  winter_vegetable_uav_pummok: "월동채소 필터",
  soil_test_years: "검정연도 필터",
  soil_type: "토양 유형",
  min_organic_matter_pct: "유기물 함량 (최소)",
  max_organic_matter_pct: "유기물 함량 (최대)",
  soil_series: "토양도 필터",
  panel_years: "패널조사 필지 여부",
  panel_pummok: "경영정보 조사 품목 조회",
  sensor_types: "장비 설치 여부",
};

interface MiniStylePreviewProps {
  fill: string;
  fillOpacity: number;
  stroke: string;
  strokeWidth: number;
  size?: number;
}

const MiniStylePreview = ({ fill, fillOpacity, stroke, strokeWidth, size = 22 }: MiniStylePreviewProps) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 4,
        backgroundColor: fill,
        opacity: fillOpacity,
        border: `${strokeWidth}px solid ${stroke}`,
        boxSizing: "border-box",
      }}
      title={`fill: ${fill}, stroke: ${stroke}, opacity: ${fillOpacity}, width: ${strokeWidth}`}
    />
  );
};

const LoadFilterModal = ({ isModalOpen, closeModal, dispatch, applyFilters }: Props) => {
  const { token } = useAuth();
  const layerDataService = new LayerDataService();
  const [messageApi, contextHolder] = message.useMessage();

  const [selectedFilter, setSelectedFilter] = useState<Filter | null>(null);

  const { data: filters = [], refetch } = useQuery<Filter[]>({
    queryKey: ["farmfieldFilters"],
    queryFn: () => layerDataService.getFarmfieldFilters(token),
    enabled: isModalOpen,
    staleTime: 0,
  });

  const handleRadioChange = (e: RadioChangeEvent) => {
    const selected = filters?.find((filter) => filter.fltr_nm === e.target.value) || null;
    setSelectedFilter(selected);
  };

  const deleteMutation = useMutation({
    mutationFn: (fltr_nm: string) => layerDataService.deleteFarmfieldFilter(fltr_nm, token),
    onSuccess: async () => {
      await refetch();
      setSelectedFilter(null);
      messageApi.success("필터가 삭제되었습니다.");
    },
  });

  const handleDelete = (fltr_nm: string) => {
    deleteMutation.mutate(fltr_nm);
  };

  const handleLoadFilter = async () => {
    if (!selectedFilter) return;

    // dispatch({ type: "RESET_FILTERS" });

    const param = selectedFilter.fltr_param;

    // if (param.address) {
    //   dispatch({ type: "TOGGLE_FILTER", key: "address" });
    //   dispatch({ type: "SET_FILTER", key: "address", value: param.address });
    // }

    // if (param.min_area !== undefined && param.max_area !== undefined) {
    //   dispatch({ type: "TOGGLE_FILTER", key: "area" });
    //   dispatch({ type: "SET_FILTER", key: "areaRange", value: [param.min_area, param.max_area] });
    // }

    // if (param.altd_range) {
    //   dispatch({ type: "TOGGLE_FILTER", key: "altitude" });
    //   dispatch({ type: "SET_FILTER", key: "altitude", value: param.altd_range });
    // }

    // if (param.pummok) {
    //   dispatch({ type: "TOGGLE_FILTER", key: "crop" });
    //   dispatch({ type: "SET_FILTER", key: "crops", value: param.pummok });
    // }

    // if (param.citrus_system_pummok) {
    //   dispatch({ type: "TOGGLE_FILTER", key: "citrusSystemPummok" });
    //   dispatch({ type: "SET_FILTER", key: "citrusSystemPummok", value: param.citrus_system_pummok });
    // }

    // if (param.observation_years) {
    //   dispatch({ type: "TOGGLE_FILTER", key: "observationYears" });
    //   dispatch({ type: "SET_FILTER", key: "observationYears", value: param.observation_years });
    // }

    // if (param.quality_years) {
    //   dispatch({ type: "TOGGLE_FILTER", key: "qualityYears" });
    //   dispatch({ type: "SET_FILTER", key: "qualityYears", value: param.quality_years });
    // }

    // if (param.growth_years) {
    //   dispatch({ type: "TOGGLE_FILTER", key: "growthYears" });
    //   dispatch({ type: "SET_FILTER", key: "growthYears", value: param.growth_years });
    // }

    // if (param.winter_vegetable_uav_pummok) {
    //   dispatch({ type: "TOGGLE_FILTER", key: "winterVegetableUavPummok" });
    //   dispatch({ type: "SET_FILTER", key: "winterVegetableUavPummok", value: param.winter_vegetable_uav_pummok });
    // }

    // if (param.soil_test_years) {
    //   dispatch({ type: "TOGGLE_FILTER", key: "soilTest" });
    //   dispatch({ type: "SET_FILTER", key: "soilTestYears", value: param.soil_test_years });
    // }

    // if (param.soil_type) {
    //   dispatch({ type: "TOGGLE_FILTER", key: "soilType" });
    //   dispatch({ type: "SET_FILTER", key: "soilType", value: param.soil_type });
    // }

    // if (param.min_organic_matter_pct !== undefined && param.max_organic_matter_pct !== undefined) {
    //   dispatch({ type: "TOGGLE_FILTER", key: "organicMatter" });
    //   dispatch({
    //     type: "SET_FILTER",
    //     key: "organicMatterRange",
    //     value: [param.min_organic_matter_pct, param.max_organic_matter_pct],
    //   });
    // }

    // if (param.soil_series) {
    //   dispatch({ type: "TOGGLE_FILTER", key: "soilSeries" });
    //   dispatch({ type: "SET_FILTER", key: "soilSeries", value: param.soil_series });
    // }

    // if (param.panel_years) {
    //   dispatch({ type: "TOGGLE_FILTER", key: "panelYears" });
    //   dispatch({ type: "SET_FILTER", key: "panelYears", value: param.panel_years });
    // }

    // if (param.sensor_types) {
    //   dispatch({ type: "TOGGLE_FILTER", key: "equipment" });
    //   dispatch({ type: "SET_FILTER", key: "equipments", value: param.sensor_types });
    // }

    // setFilterStyle({
    //   fill: selectedFilter?.fill,
    //   fill_opacity: selectedFilter?.fill_opacity,
    //   stroke: selectedFilter?.stroke,
    //   stroke_width: selectedFilter?.stroke_width,
    // });

    const style = {
      fill: selectedFilter?.fill,
      fill_opacity: selectedFilter?.fill_opacity,
      stroke: selectedFilter?.stroke,
      stroke_width: selectedFilter?.stroke_width,
    };

    closeModal();

    await applyFilters(selectedFilter.fltr_nm, param, style);
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={closeModal}
      title={<div className="mb-[12px] text-[20px] font-bold">필터 불러오기</div>}
      width={650}
      centered
      okText="불러오기"
      onOk={handleLoadFilter}
      styles={{ body: { marginRight: "4px" } }}
    >
      <Radio.Group onChange={handleRadioChange} value={selectedFilter?.fltr_nm} className="mx-[6px] mb-[12px] max-h-[calc(100vh-320px)] w-full overflow-y-auto">
        <List
          dataSource={filters}
          renderItem={(item) => (
            <List.Item>
              <div className="mr-[16px] flex w-full justify-between">
                <Radio value={item.fltr_nm} className="flex-1">
                  <div className="ml-[16px] flex flex-col gap-[4px]">
                    <div className="flex items-center gap-[8px]">
                      <div className="text-[16px] font-semibold">{item.fltr_nm}</div>
                      <div className="flex items-center gap-[4px] text-[14px] text-[#666]">
                        <ClockCircleOutlined />
                        2023-10-21
                      </div>
                    </div>

                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.fltr_param ? (
                        Object.keys(item.fltr_param).map((filter) => <Tag key={filter}>{filterLabels[filter]}</Tag>)
                      ) : (
                        <Tag color="gray">No Filters</Tag>
                      )}

                      <MiniStylePreview fill={item.fill} fillOpacity={item.fill_opacity} stroke={item.stroke} strokeWidth={item.stroke_width} />
                    </div>
                  </div>
                </Radio>

                <DeleteTwoTone className="cursor-pointer text-[16px]" twoToneColor="#ff0000" onClick={() => handleDelete(item.fltr_nm)} />
              </div>
            </List.Item>
          )}
        />
      </Radio.Group>
      {contextHolder}
    </Modal>
  );
};

export default LoadFilterModal;
