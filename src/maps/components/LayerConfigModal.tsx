import { SetStateAction, useState } from "react";
import { LayerConfig } from "~/maps/hooks/useLayerExportTools";
import LayerDataService from "~/maps/services/LayerDataService";
import { Modal, Steps, Form, Select, Input, Button, ColorPicker, Slider, Descriptions } from "antd";

const { Step } = Steps;

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
  title?: string;
  toggleExport: (layerConfig: LayerConfig) => void;
}

const LayerConfigModal = ({ isModalOpen, setIsModalOpen, toggleExport, title = "레이어 설정" }: Props) => {
  const layerDataService = new LayerDataService();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<LayerConfig>();
  const [layerNameError, setLayerNameError] = useState<string | null>(null);

  const checkLayerNameDuplicate = async (layerName: string): Promise<boolean> => {
    try {
      const response = await layerDataService.checkLayerNameDuplicate(layerName);
      return response?.detail;
    } catch (error) {
      return false;
    }
  };

  const steps = [
    {
      title: "레이어 타입",
      content: (
        <Form
          layout="vertical"
          onFinish={async (values) => {
            if (!/^[a-zA-Z0-9-_]+$/.test(values.layerName)) return setLayerNameError("레이어 명은 영문, 숫자, '-', '_'만 입력 가능합니다!");

            const isDuplicate = await checkLayerNameDuplicate(values?.layerName);
            if (isDuplicate) return setLayerNameError("레이어 명이 이미 존재합니다. 다른 이름을 입력하세요!");

            setLayerNameError(null);
            setFormData({ ...formData, ...values });
            setCurrentStep(currentStep + 1);
          }}
        >
          <Form.Item name="type" label="레이어 타입" rules={[{ required: true, message: "레이어 타입을 선택하세요!" }]}>
            <Select>
              <Select.Option value="point">Point</Select.Option>
              <Select.Option value="polygon">Polygon</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="layerName"
            label="레이어 명"
            validateStatus={layerNameError ? "error" : undefined}
            help={layerNameError}
            rules={[{ required: true, message: "레이어 명을 입력하세요!" }]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item name="layerTitle" label="레이어 제목" rules={[{ required: true, message: "레이어 제목 입력하세요!" }]}>
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
          {formData?.type === "point" && (
            <Form.Item name="pointRadius" label="원 크기" rules={[{ required: true, message: "원 크기를 입력하세요!" }]}>
              <Input type="number" addonAfter="px" min={1} />
            </Form.Item>
          )}
          <Form.Item name="strokeWidth" label="선 두께" rules={[{ required: true, message: "선 두께를 입력하세요!" }]}>
            <Input type="number" addonAfter="px" min={1} />
          </Form.Item>
          <Form.Item name="strokeColor" label="선 색상" initialValue="#ffffff" rules={[{ required: true, message: "선 색상을 선택하세요!" }]}>
            <ColorPicker format="hex" disabledAlpha showText />
          </Form.Item>
          <Form.Item name="fillColor" label="채우기 색상" initialValue="#000000" rules={[{ required: true, message: "채우기 색상을 선택하세요!" }]}>
            <ColorPicker format="hex" disabledAlpha showText />
          </Form.Item>
          {formData?.type === "polygon" && (
            <Form.Item name="fillOpacity" label="투명도" initialValue={0.5} rules={[{ required: true, message: "투명도를 입력하세요!" }]}>
              <Slider min={0} max={1} step={0.1} className="mx-3" />
            </Form.Item>
          )}
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
          <Descriptions bordered column={1}>
            <Descriptions.Item label="레이어 타입">{formData?.type}</Descriptions.Item>
            <Descriptions.Item label="레이어 명">{formData?.layerName}</Descriptions.Item>
            <Descriptions.Item label="레이어 제목">{formData?.layerTitle}</Descriptions.Item>
            {formData?.type === "point" && <Descriptions.Item label="원 크기">{formData.pointRadius}px</Descriptions.Item>}
            <Descriptions.Item label="선 색상">
              <ColorPicker defaultValue={formData?.strokeColor} showText disabled size="small" className="cursor-default bg-[#fff]" />
            </Descriptions.Item>
            <Descriptions.Item label="선 두께">{formData?.strokeWidth}px</Descriptions.Item>
            <Descriptions.Item label="채우기 색상">
              <ColorPicker defaultValue={formData?.fillColor} showText disabled size="small" className="cursor-default bg-[#fff]" />
            </Descriptions.Item>
            {formData?.type === "polygon" && <Descriptions.Item label="채우기 투명도">{formData?.fillOpacity}</Descriptions.Item>}
          </Descriptions>
          <div className="mt-[24px] flex justify-end">
            <Button
              type="primary"
              onClick={() => {
                toggleExport(formData);
                setIsModalOpen(false);
              }}
            >
              저장
            </Button>
            <Button className="ml-[8px]" onClick={() => setIsModalOpen(false)}>
              취소
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Modal open={isModalOpen} title={<div className="mb-[20px] text-[20px] font-bold">{title}</div>} footer={null} onCancel={() => setIsModalOpen(false)} centered>
      <Steps current={currentStep} size="small" className="mb-[16px]">
        {steps.map((step, index) => (
          <Step key={index} title={step.title} />
        ))}
      </Steps>
      <div>{steps[currentStep].content}</div>
    </Modal>
  );
};

export default LayerConfigModal;
