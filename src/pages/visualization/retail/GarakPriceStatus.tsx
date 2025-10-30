import { useState } from "react";
import DailyPrice from "~/features/visualization/components/retail/DailyPrice";
import MonthlyPrice from "~/features/visualization/components/retail/MonthlyPrice";
import MethodPrice from "~/features/visualization/components/retail/MethodPrice";
import { Card, Form, Select, DatePicker, Button, Segmented } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

type Tabs = "daily" | "monthly" | "method";

const GarakMarketPrice = () => {
  const [form] = Form.useForm();

  const [tab, setTab] = useState<Tabs>("daily");
  const [pummok, setPummok] = useState("감귤 온주 5kg");
  const [startDate, setStartDate] = useState<string>("2025-01-01");
  const [endDate, setEndDate] = useState<string>("2025-02-28");

  const handleQuickRange = (rangeType: "7d" | "1m" | "3m" | "1y") => {
    const end = dayjs();
    let start: dayjs.Dayjs;

    switch (rangeType) {
      case "7d":
        start = end.subtract(6, "day");
        break;
      case "1m":
        start = end.subtract(1, "month");
        break;
      case "3m":
        start = end.subtract(3, "month");
        break;
      case "1y":
        start = end.subtract(1, "year");
        break;
    }

    setStartDate(start.format("YYYY-MM-DD"));
    setEndDate(end.format("YYYY-MM-DD"));
    form.setFieldsValue({ date: [start, end] });
  };

  const handleRangeChange = (val: [dayjs.Dayjs, dayjs.Dayjs]) => {
    if (val && val[0] && val[1]) {
      setStartDate(val[0].format("YYYY-MM-DD"));
      setEndDate(val[1].format("YYYY-MM-DD"));
      form.setFieldsValue({ date: val });
    }
  };

  return (
    <div className="space-y-[24px] p-5">
      <Card>
        <Form form={form} layout="vertical" initialValues={{ pummok: "감귤 온주 5kg", date: [dayjs(startDate), dayjs(endDate)] }}>
          <div className="flex gap-[16px]">
            <Form.Item label="품종" name="pummok" className="mb-0 flex-1">
              <Select value={pummok} onChange={(value) => setPummok(value)}>
                <Select.Option value="감귤 온주 5kg">감귤 온주 5kg</Select.Option>
                <Select.Option value="당근 20kg">당근 20kg</Select.Option>
                <Select.Option value="양배추 8kg">양배추 8kg</Select.Option>
                <Select.Option value="브로콜리 8kg">브로콜리 8kg</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="기간" name="date" className="mb-0 flex-1">
              <RangePicker className="w-full" value={[dayjs(startDate), dayjs(endDate)]} onChange={handleRangeChange as any} />
              <div className="mt-[12px] flex gap-[12px]">
                <Button className="flex-1" onClick={() => handleQuickRange("7d")}>
                  최근 1주일
                </Button>
                <Button className="flex-1" onClick={() => handleQuickRange("1m")}>
                  최근 1개월
                </Button>
                <Button className="flex-1" onClick={() => handleQuickRange("3m")}>
                  최근 3개월
                </Button>
                <Button className="flex-1" onClick={() => handleQuickRange("1y")}>
                  최근 1년
                </Button>
              </div>
            </Form.Item>
          </div>
        </Form>
      </Card>
      <Card>
        <div className="space-y-[24px]">
          <Segmented
            options={[
              { label: "일별/등급별 가격", value: "daily" },
              { label: "월별/등급별 가격", value: "monthly" },
              { label: "거래방법별 가격 및 물량", value: "method" },
            ]}
            value={tab}
            onChange={(value) => setTab(value as Tabs)}
            className="text-[16px]"
            block
          />
          {tab === "daily" && <DailyPrice pummok={pummok} startDate={startDate} endDate={endDate} />}
          {tab === "monthly" && <MonthlyPrice pummok={pummok} startDate={startDate} endDate={endDate} />}
          {tab === "method" && <MethodPrice pummok={pummok} startDate={startDate} endDate={endDate} />}
        </div>
      </Card>
    </div>
  );
};

export default GarakMarketPrice;
