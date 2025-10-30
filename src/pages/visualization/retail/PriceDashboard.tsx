import { useState } from "react";
import MonthlyAnalysis from "~/features/visualization/components/retail/MonthlyAnalysis";
import RegionalAnalysis from "~/features/visualization/components/retail/RegionalAnalysis";
import { Button, Card, Form, Segmented, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

type AnalysisType = "monthly" | "region";

const PriceDashboard = () => {
  const [form] = Form.useForm();

  const [analysisType, setAnalysisType] = useState<AnalysisType>("monthly");
  const [pummok, setPummok] = useState<string>("노지감귤 5kg");

  return (
    <div className="space-y-[24px] p-5">
      <Card>
        <Form form={form} layout="vertical" initialValues={{ pummok: "노지감귤 5kg" }}>
          <div className="flex items-end space-x-[16px]">
            <Form.Item name="pummok" label="품종" className="mb-0 flex-1">
              <Select value={pummok}>
                <Select.Option value="노지감귤 5kg">노지감귤 5kg</Select.Option>
                <Select.Option value="당근 20kg">당근 20kg</Select.Option>
                <Select.Option value="월동무 20kg">월동무 20kg</Select.Option>
                <Select.Option value="양배추 8kg">양배추 8kg</Select.Option>
                <Select.Option value="브로콜리 8kg">브로콜리 8kg</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item className="mb-0">
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />} onClick={() => setPummok(form.getFieldValue("pummok"))}>
                조회
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Card>
      <Card>
        <div className="space-y-[24px]">
          <Segmented
            options={[
              { label: "월별 시계열 분석", value: "monthly" },
              { label: "권역별 분석", value: "region" },
            ]}
            value={analysisType}
            onChange={(value) => setAnalysisType(value as AnalysisType)}
            className="text-[16px]"
            block
          />
          {analysisType === "monthly" ? <MonthlyAnalysis pummok={pummok} /> : <RegionalAnalysis pummok={pummok} />}
        </div>
      </Card>
    </div>
  );
};

export default PriceDashboard;
