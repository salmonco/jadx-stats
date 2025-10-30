import { SetStateAction, useState } from "react";
import { useAuth } from "~/contexts/AuthContext";
import LayerDataService from "~/maps/services/LayerDataService";
import { Modal, Steps, Form, Input, Button, ColorPicker, Slider, Descriptions, Card, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const { Step } = Steps;

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
  params: any;
  filterInfo: any;
}

interface FilterFormData {
  filter_name: string;
  strokeColor: string;
  strokeWidth: number;
  fillColor: string;
  fillOpacity: number;
}

const filterLabels: Record<string, string> = {
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
};

const SaveFilterModal = ({ isModalOpen, setIsModalOpen, params, filterInfo }: Props) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const layerDataService = new LayerDataService();
  const [messageApi, contextHolder] = message.useMessage();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FilterFormData>();
  // const [layerNameError, setLayerNameError] = useState<string | null>(null);

  const formattedFilters = Object.entries(params).map(([key, value]) => ({
    label: filterLabels[key] || key, // 키가 없으면 원래 키값을 사용
    value: Array.isArray(value) ? value.join(", ") : value, // 배열이면 ", "로 join
  }));

  const saveFilterMutation = useMutation({
    mutationFn: ({ params, body }: { params: any; body: any }) => layerDataService.saveFarmfieldFilter(params, body, token),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["farmfieldFilters"], exact: true });
      messageApi.success("필터가 저장되었습니다.");
      setIsModalOpen(false);
    },
    onError: () => {
      messageApi.error("필터 저장에 실패했습니다.");
    },
  });

  // const checkNameDuplicate = async (layerName: string): Promise<boolean> => {
  //   try {
  //     const response = await layerDataService.checkLayerNameDuplicate(layerName);
  //     return response?.detail;
  //   } catch (error) {
  //     return false;
  //   }
  // };

  const steps = [
    {
      title: "필터명 설정",
      content: (
        <Form
          layout="vertical"
          onFinish={async (values) => {
            // if (!/^[a-zA-Z0-9-_]+$/.test(values?.filter_name)) return setLayerNameError("필터명은 영문, 숫자, '-', '_'만 입력 가능합니다!");

            // const isDuplicate = await checkNameDuplicate(values?.filter_name);
            // console.log(isDuplicate);
            // if (isDuplicate) return setLayerNameError("필터명이 이미 존재합니다. 다른 이름을 입력하세요!");

            // setLayerNameError(null);
            setFormData({ ...formData, ...values });
            setCurrentStep(currentStep + 1);
          }}
        >
          <Form.Item
            name="filter_name"
            label="필터명"
            // validateStatus={layerNameError ? "error" : undefined}
            // help={layerNameError}
            rules={[{ required: true, message: "필터명을 입력하세요!" }]}
          >
            <Input type="text" />
          </Form.Item>

          <Form.Item className="mb-0 mt-[24px] flex justify-end">
            <Button type="primary" htmlType="submit">
              다음
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "스타일 설정",
      content: (
        <Form
          layout="vertical"
          onFinish={(values) => {
            const processedData = {
              ...values,
              strokeColor: typeof values.strokeColor === "string" ? values.strokeColor : values.strokeColor?.toHexString(),
              fillColor: typeof values.fillColor === "string" ? values.fillColor : values.fillColor?.toHexString(),
            };
            setFormData({ ...formData, ...processedData });
            setCurrentStep(currentStep + 1);
          }}
        >
          <Form.Item name="strokeWidth" label="선 두께" rules={[{ required: true, message: "선 두께를 입력하세요!" }]}>
            <Input type="number" addonAfter="px" min={1} />
          </Form.Item>
          <Form.Item name="strokeColor" label="선 색상" initialValue="#ffffff" rules={[{ required: true, message: "선 색상을 선택하세요!" }]}>
            <ColorPicker format="hex" disabledAlpha showText />
          </Form.Item>
          <Form.Item name="fillColor" label="채우기 색상" initialValue="#000000" rules={[{ required: true, message: "채우기 색상을 선택하세요!" }]}>
            <ColorPicker format="hex" disabledAlpha showText />
          </Form.Item>
          <Form.Item name="fillOpacity" label="투명도" initialValue={0.5} rules={[{ required: true, message: "투명도를 입력하세요!" }]}>
            <Slider min={0} max={1} step={0.1} className="mx-3" />
          </Form.Item>
          <Form.Item className="mb-0 mt-[24px] flex justify-end">
            <Button className="mr-[8px]" onClick={() => setCurrentStep(currentStep - 1)}>
              이전
            </Button>
            <Button type="primary" htmlType="submit">
              다음
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "확인 및 저장",
      content: (
        <div className="pt-3">
          <div className="mb-[24px] flex flex-col gap-[8px]">
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
          <Descriptions bordered column={1}>
            <Descriptions.Item label="필터명">{formData?.filter_name}</Descriptions.Item>
            <Descriptions.Item label="선 색상">
              <ColorPicker defaultValue={formData?.strokeColor} showText disabled size="small" className="cursor-default bg-[#fff]" />
            </Descriptions.Item>
            <Descriptions.Item label="선 두께">{formData?.strokeWidth}px</Descriptions.Item>
            <Descriptions.Item label="채우기 색상">
              <ColorPicker defaultValue={formData?.fillColor} showText disabled size="small" className="cursor-default bg-[#fff]" />
            </Descriptions.Item>
            <Descriptions.Item label="채우기 투명도">{formData?.fillOpacity}</Descriptions.Item>
          </Descriptions>
          <div className="mt-[24px] flex justify-end">
            <Button
              type="primary"
              className="mr-[8px]"
              onClick={() => {
                const body = {
                  filter_name: formData?.filter_name,
                  style: {
                    strokeColor: formData?.strokeColor,
                    strokeWidth: formData?.strokeWidth,
                    fillColor: formData?.fillColor,
                    fillOpacity: formData?.fillOpacity.toString(),
                  },
                };

                saveFilterMutation.mutate({ params, body });
              }}
            >
              저장
            </Button>
            <Button className="mr-[8px]" onClick={() => setCurrentStep(currentStep - 1)}>
              이전
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>취소</Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Modal open={isModalOpen} title={<div className="mb-[20px] text-[20px] font-bold">필터 저장</div>} footer={null} onCancel={() => setIsModalOpen(false)} centered>
      <Steps current={currentStep} size="small" className="mb-[16px]">
        {steps.map((step, index) => (
          <Step key={index} title={step.title} />
        ))}
      </Steps>
      <div>{steps[currentStep].content}</div>
      {contextHolder}
    </Modal>
  );
};

export default SaveFilterModal;
