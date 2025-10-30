import { useState } from "react";
import LayerDataService from "~/maps/services/LayerDataService";
import { Card, message, Modal, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { saveAs } from "file-saver";

interface Props {
  isModalOpen: boolean;
  closeModal: () => void;
  params: any;
  filterInfo: any;
}

const filterLabels: Record<string, string> = {
  farmer_name: "농가명 필터",
  address: "지역 필터",
  min_area: "최소 면적",
  max_area: "최대 면적",
  altd_range: "고도 필터",
  pummok: "품목 필터",
  soil_test_years: "검정연도 필터",
  soil_type: "토양 유형",
  min_organic_matter_pct: "유기물 함량 (최소)",
  max_organic_matter_pct: "유기물 함량 (최대)",
  has_observation_exam: "관측조사 필지 여부",
  has_quality_exam: "품질검사 결과 여부",
  has_growth_exam: "생육조사 결과 여부",
  has_panel_exam: "패널조사 필지 여부",
  sensor_types: "장비 설치 여부",
  history: "농지 이력",
  winter_vegetable_uav_pummok: "월동 채소 품목 필터",
  citrus_system_pummok: "감귤/관측 품종 필터",
  disaster_years: "재해 연도 필터",
  observation_years: "관측조사 연도 필터",
  quality_years: "품질검사 연도 필터",
  growth_years: "생육조사 연도 필터",
  panel_years: "패널조사 연도 필터",
  soil_series: "토양도 필터",
};

const ExportFilterModal = ({ isModalOpen, closeModal, params, filterInfo }: Props) => {
  const layerDataService = new LayerDataService();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      const blob = await layerDataService.exportFarmfieldFilter(params);
      saveAs(blob, "farmfield_data.xlsx");
      closeModal();
      messageApi.success("필터 엑셀 다운로드가 완료되었습니다.");
    } catch (e) {
      messageApi.error("필터 엑셀 다운로드에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const formattedFilters = Object.entries(params).map(([key, value]) => {
    let displayValue = value;

    if (key === "pummok" && Array.isArray(value)) {
      displayValue = value.map((v: string) => v.split(",").filter(Boolean).join(" > ")).join(", ");
    } else if (Array.isArray(value)) {
      displayValue = value.join(", ");
    }

    return {
      label: filterLabels[key] || key,
      value: displayValue,
    };
  });

  return (
    <Modal
      open={isModalOpen}
      onCancel={closeModal}
      title={<div className="mb-[12px] text-[20px] font-bold">필터 엑셀 다운로드</div>}
      width={500}
      centered
      onOk={handleDownload}
      okButtonProps={{ loading: isLoading }}
      cancelButtonProps={{ disabled: isLoading }}
    >
      <div className="relative mb-[24px] flex flex-col gap-[8px]">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 92 }} spin />} />
          </div>
        )}
        <span className="text-[16px] font-semibold">필터 적용 농가</span>
        <Card bodyStyle={{ padding: "14px 18px" }} className="mb-[16px]">
          <div className="flex items-center gap-2 text-[14px]">
            <p className="w-[27.5%] text-[#666]">현재 필지 수</p>
            <p className="font-semibold">{filterInfo?.total_count.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2 text-[14px]">
            <p className="w-[27.5%] text-[#666]">현재 필지 면적</p>
            <p className="font-semibold">
              {filterInfo?.total_area.toLocaleString()} m<sup>2</sup>
            </p>
          </div>
        </Card>

        <span className="text-[16px] font-semibold">적용된 필터</span>
        <Card bodyStyle={{ padding: "12px 14px" }} className="max-h-[400px] overflow-auto">
          {formattedFilters.length > 0 ? (
            formattedFilters.map((filter, index) => (
              <div key={index} className="flex items-center gap-2 text-[14px]">
                <p className="w-[27.5%] text-[#666]">{filter.label}</p>
                <p className="font-semibold">{filter.value as string}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">적용된 필터가 없습니다.</p>
          )}
        </Card>
      </div>
      {contextHolder}
    </Modal>
  );
};

export default ExportFilterModal;
