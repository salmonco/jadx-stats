import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import commonApi from "~/services/apis/commonApi";
import visualizationApi from "~/services/apis/visualizationApi";
import { PricePredictionMarketData } from "~/services/types/visualizationTypes";
import PredictionResultTable from "~/features/visualization/components/retail/PredictionResultTable";
import PricePredictionChart from "~/features/visualization/components/retail/PricePredictionChart";
import ModelInfo from "~/features/visualization/components/retail/ModelInfo";
import { Button, Card, DatePicker, Empty, Form, Segmented, Select, Tag, Slider, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "katex/dist/katex.min.css";

type ResultType = "detail" | "model";

export type ModelType = "3일 예상 가격" | "7일 예상 가격" | "1개월 예상 가격";

export type LabeledPrediction = {
  type: "예측 가격" | "반입량 적용";
  data: Record<string, PricePredictionMarketData>;
};

const modelKeyMap: Record<string, Record<string, string>> = {
  "노지감귤 5kg": {
    "3일 예상 가격": "감귤 모델1",
    "7일 예상 가격": "감귤 모델1",
    "1개월 예상 가격": "감귤 모델2",
  },
  "노지감귤 10kg": {
    "3일 예상 가격": "감귤 모델1",
    "7일 예상 가격": "감귤 모델1",
    "1개월 예상 가격": "감귤 모델3",
  },
  "제주산 당근 20kg": {
    "3일 예상 가격": "당근 모델1",
    "7일 예상 가격": "당근 모델1",
    "1개월 예상 가격": "당근 모델2",
  },
};

const pummokKeyMap: Record<string, string> = {
  "노지감귤 5kg": "cifru",
  "노지감귤 10kg": "cifru",
  "제주산 당근 20kg": "carrot",
};

const unitWeightMap: Record<string, string> = {
  "노지감귤 5kg": "5",
  "노지감귤 10kg": "10",
  "제주산 당근 20kg": "20",
};

const modelMap: Record<string, string> = {
  "3일 예상 가격": "3days",
  "7일 예상 가격": "7days",
  "1개월 예상 가격": "month",
};

interface PricePredictionForm {
  date: dayjs.Dayjs;
  pummok: string;
  market: string;
  model: ModelType;
  increaseRate: number;
}

const getPriceKeys = (model: ModelType) => {
  if (model === "3일 예상 가격" || model === "7일 예상 가격") {
    return [
      "predc_prc_day_1",
      "predc_prc_day_2",
      "predc_prc_day_3",
      ...(model === "7일 예상 가격" ? ["predc_prc_day_4", "predc_prc_day_5", "predc_prc_day_6", "predc_prc_day_7"] : []),
    ];
  }
  if (model === "1개월 예상 가격") {
    return ["predc_prc_wkly_1", "predc_prc_wkly_2", "predc_prc_wkly_3", "predc_prc_wkly_4"];
  }
  return [];
};

const PricePrediction = () => {
  const [form] = Form.useForm<PricePredictionForm>();

  const [model, setModel] = useState<ModelType>("3일 예상 가격");
  const [pummok, setPummok] = useState<string>("노지감귤 5kg");
  const [market, setMarket] = useState<string>("서울가락");
  const [results, setResults] = useState<any[]>([]);
  const [resultType, setResultType] = useState<ResultType>("detail");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [date, setDate] = useState<any>(dayjs().subtract(1, "day").format("YYYYMMDD"));
  const [baseDate, setBaseDate] = useState<any>(null);
  const [datePickerYear, setDatePickerYear] = useState<string>(dayjs().format("YYYY"));

  const { data: holidays } = useQuery({
    queryKey: ["holidays", datePickerYear],
    queryFn: () => commonApi.getHolidays(datePickerYear),
    enabled: !!datePickerYear,
  });

  const { data: weight } = useQuery({
    queryKey: ["price-prediction-weight", date, pummok, market, model],
    queryFn: () =>
      visualizationApi.getPricePredictionWeight({
        yyyymmdd: date,
        pummok: pummokKeyMap[pummok],
        unit_wght: unitWeightMap[pummok],
        predict_period: modelMap[model],
        market_name: market,
      }),
  });

  useEffect(() => {
    const yesterday = dayjs().subtract(1, "day");

    form.setFieldsValue({
      date: yesterday,
      pummok: "노지감귤 5kg",
      market: "서울가락",
      model: "3일 예상 가격",
      increaseRate: 0,
    });

    form.submit();
  }, []);

  const handleExecute = async (values: any) => {
    try {
      setModel(values.model);
      setPummok(values.pummok);
      setMarket(values.market);
      setBaseDate(values.date.format("YYYYMMDD"));
      setIsLoading(true);

      const yyyymmdd = values.date.format("YYYYMMDD");
      const unit_wght = Number(values.pummok.replace(/[^0-9]/g, ""));
      const item_nm = values.pummok.includes("감귤") ? "cifru" : "carrot";
      const predict_period = values.model === "1개월 예상 가격" ? "month" : values.model === "7일 예상 가격" ? "7days" : "3days";
      const adjust_ratio = values.increaseRate / 100;

      const baseFormData = { yyyymmdd, pummok: item_nm, unit_wght, predict_period };

      const fetchPrediction = async (ratio: number) => {
        const response = await visualizationApi.getPricePrediction({ ...baseFormData, adjust_ratio: ratio });
        const mapped: Record<string, PricePredictionMarketData> = {};
        const flatResponse = response.flat();
        for (const entry of flatResponse) {
          if (entry.whlsl_mrkt_cd) {
            mapped[entry.whlsl_mrkt_cd] = entry;
          } else {
            console.warn("whlsl_mrkt_cd가 없습니다:", entry);
          }
        }
        return mapped;
      };

      if (adjust_ratio !== 0) {
        const [resAdjust, resBase] = await Promise.all([fetchPrediction(adjust_ratio), fetchPrediction(0)]);
        setResults([
          { type: "반입량 적용", data: resAdjust },
          { type: "예측 가격", data: resBase },
        ]);
      } else {
        const res = await fetchPrediction(0);
        setResults([
          { type: "반입량 적용", data: res },
          { type: "예측 가격", data: res },
        ]);
      }
    } catch (error) {
      console.error(error);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getDateLabels = (model: ModelType) => {
    switch (model) {
      case "3일 예상 가격":
        return ["1일 후", "2일 후", "3일 후"];
      case "7일 예상 가격":
        return ["1일 후", "2일 후", "3일 후", "4일 후", "5일 후", "6일 후", "7일 후"];
      case "1개월 예상 가격":
        return ["1주 후", "2주 후", "3주 후", "4주 후"];
      default:
        return [];
    }
  };

  const labels = getDateLabels(model);
  const priceKeys = getPriceKeys(model);

  const getDataByType = (type: "예측 가격" | "반입량 적용") => {
    const found = results?.find((r) => r.type === type);
    if (!found) return [];
    const dataObj = found.data[market];
    if (!dataObj) return [];
    return priceKeys.map((key) => {
      const value = dataObj[key as keyof typeof dataObj];
      return typeof value === "number" ? value : null;
    });
  };

  const predictPrices = getDataByType("예측 가격");
  const adjustPrices = results?.some((r) => r.type === "반입량 적용") ? getDataByType("반입량 적용") : predictPrices;

  function isResultDataEmpty(resultData: any) {
    if (!resultData) return true;
    // 모든 마켓의 예측 가격 값이 null인지 확인
    return Object.values(resultData).every((marketData: any) => {
      if (!marketData) return true;
      const keys = [
        "predc_prc_day_1",
        "predc_prc_day_2",
        "predc_prc_day_3",
        "predc_prc_day_4",
        "predc_prc_day_5",
        "predc_prc_day_6",
        "predc_prc_day_7",
        "predc_prc_wkly_1",
        "predc_prc_wkly_2",
        "predc_prc_wkly_3",
        "predc_prc_wkly_4",
      ];
      return keys.every((key) => marketData[key] == null);
    });
  }

  const isEmpty = !results?.[0] || !results[0].data || Object.keys(results[0].data || {}).length === 0 || isResultDataEmpty(results[0].data) || !model;

  return (
    <div className="space-y-[24px] p-5">
      <div className="flex gap-[24px]">
        <Card className="w-[30%]">
          <div className="space-y-[12px]">
            <span className="text-[22px] font-semibold">예측 매개변수</span>
            <Form form={form} layout="vertical" onFinish={handleExecute} className="flex h-full flex-col">
              <Form.Item label="기준일" name="date" required>
                <DatePicker
                  className="w-full"
                  placeholder="기준일을 선택해주세요."
                  disabledDate={(current) => {
                    const day = current?.day();
                    const formatted = current?.format("YYYY-MM-DD");
                    return day === 0 || holidays?.includes(formatted);
                  }}
                  onChange={(date) => {
                    setDate(date?.format("YYYYMMDD"));
                  }}
                  onPanelChange={(date) => {
                    if (!date) return;
                    const year = date.format("YYYY");
                    setDatePickerYear(year);
                  }}
                />
              </Form.Item>
              <Form.Item label="품종" name="pummok" required>
                <Select placeholder="품종을 선택해주세요.">
                  <Select.Option value="노지감귤 5kg">노지감귤 5kg</Select.Option>
                  <Select.Option value="노지감귤 10kg">노지감귤 10kg</Select.Option>
                  <Select.Option value="제주산 당근 20kg">제주산 당근 20kg</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="시장" name="market" required>
                <Select placeholder="시장을 선택해주세요.">
                  <Select.Option value="서울가락">서울가락</Select.Option>
                  <Select.Option value="서울강서">서울강서</Select.Option>
                  <Select.Option value="부산엄궁">부산엄궁</Select.Option>
                  <Select.Option value="광주각화">광주각화</Select.Option>
                  <Select.Option value="구리">구리</Select.Option>
                  <Select.Option value="대구북부">대구북부</Select.Option>
                  <Select.Option value="대전오정">대전오정</Select.Option>
                  <Select.Option value="수원">수원</Select.Option>
                  <Select.Option value="인천남촌">인천남촌</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="예측 모델" name="model" required>
                <Select placeholder="예측 모델을 선택해주세요.">
                  <Select.Option value="3일 예상 가격" style={{ backgroundColor: "#d3f0d9" }}>
                    3일 예상 가격
                  </Select.Option>
                  <Select.Option value="7일 예상 가격" style={{ backgroundColor: "#f1f2c9" }}>
                    7일 예상 가격
                  </Select.Option>
                  <Select.Option value="1개월 예상 가격" style={{ backgroundColor: "#f7cbcf" }}>
                    1개월 예상 가격
                  </Select.Option>
                </Select>
              </Form.Item>
              <div>
                <Form.Item label="반입량 증가율(%)" name="increaseRate" required className="mb-2">
                  <Slider min={-10} max={10} marks={{ "-10": "-10", "0": "0", "10": "10" }} className="mt-[4px]" />
                </Form.Item>
                <div className="mb-4 mt-[-8px] flex items-center justify-end gap-[4px] text-[14px]">
                  <span>
                    {dayjs(date).format("YYYY-MM-DD")} 반입량 : {weight?.tot_vol ? weight.tot_vol.toLocaleString() + "kg" : "-"}
                  </span>
                  <span>(전일 대비 {weight?.vol_chnge_rt ? weight.vol_chnge_rt.toLocaleString(undefined, { maximumFractionDigits: 1 }) + "%" : "-"})</span>
                </div>
              </div>
              <Form.Item className="mt-auto">
                <Button htmlType="submit" className="w-full" type="primary" loading={isLoading}>
                  예측 실행
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Card>

        <Card className="flex w-[70%] flex-col" styles={{ body: { height: "100%" } }}>
          {isEmpty || isLoading ? (
            <div className="flex h-full items-center justify-center">
              {isLoading ? (
                <Spin indicator={<LoadingOutlined style={{ fontSize: 72 }} spin />} />
              ) : (
                <Empty
                  description={
                    <div className="flex flex-col gap-[4px]">
                      <span className="text-[17px] text-[#666666]">데이터가 존재하지 않습니다.</span>
                      <span className="text-[16px]">왼쪽의 예측 매개변수를 설정하고 '예측 실행' 버튼을 클릭하여 농산물 가격 예측 결과를 확인하세요.</span>
                    </div>
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </div>
          ) : (
            <>
              <div className="mb-[16px] flex items-center justify-between">
                <span className="text-[22px] font-semibold">가격 예측 결과</span>
                <Tag className="rounded-full px-[12px] py-[6px] text-[15px]">
                  서울가락 / {pummok} / {model}
                </Tag>
              </div>

              <Card className="flex-1">
                <PricePredictionChart model={model} market={market} results={results} baseDate={baseDate} holidays={holidays} />
              </Card>

              <div className={`mt-[16px] ${labels.length >= 4 ? "flex snap-x snap-mandatory gap-4 overflow-x-auto" : `grid grid-cols-${labels.length} gap-4`}`}>
                <div className={labels.length > 4 ? "flex w-max gap-4" : "contents"}>
                  {labels.map((label, idx) => (
                    <div
                      key={idx}
                      className={`${labels.length > 4 ? "mb-[12px] w-[280px] shrink-0 snap-start" : "w-full"} rounded-lg border border-gray-300 bg-white p-[16px]`}
                    >
                      <span className="text-[16px]">{label}</span>
                      <div className="flex w-full items-center gap-[4px]">
                        <div className="flex flex-1 flex-col">
                          <span className="text-[14px] text-[#666666]">예측 가격</span>
                          <span className="text-[17px] font-semibold">
                            {predictPrices[idx] != null ? Number(predictPrices[idx]).toLocaleString(undefined, { maximumFractionDigits: 0 }) + "원" : "-"}
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col">
                          <span className="text-[14px] text-[#666666]">반입량 적용</span>
                          <span className="text-[17px] font-semibold">
                            {adjustPrices[idx] != null ? Number(adjustPrices[idx]).toLocaleString(undefined, { maximumFractionDigits: 0 }) + "원" : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </Card>
      </div>

      <Card>
        {isEmpty || isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            {isLoading ? (
              <Spin indicator={<LoadingOutlined style={{ fontSize: 72 }} spin />} />
            ) : (
              <Empty
                description={
                  <div className="flex flex-col gap-[4px]">
                    <span className="text-[17px] text-[#666666]">데이터가 존재하지 않습니다.</span>
                    <span className="text-[16px]">왼쪽의 예측 매개변수를 설정하고 '예측 실행' 버튼을 클릭하여 농산물 가격 예측 결과를 확인하세요.</span>
                  </div>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </div>
        ) : (
          <>
            <Segmented
              options={[
                { label: "상세 결과", value: "detail" },
                { label: "모델 설명", value: "model" },
              ]}
              block
              value={resultType}
              onChange={(value) => {
                setResultType(value as ResultType);
              }}
            />
            {resultType === "detail" ? (
              <div className="mt-[20px] space-y-[20px]">
                <div className="flex flex-col">
                  <span className="text-[20px] font-semibold">예측 결과 상세 정보</span>
                  <span className="text-[16px] text-[#666666]">
                    {model === "1개월 예상 가격"
                      ? "1개월 예측 모델 기반 상세 결과입니다."
                      : model === "7일 예상 가격"
                        ? "7일 예측 모델 기반 상세 결과입니다."
                        : "3일 예측 모델 기반 상세 결과입니다."}
                  </span>
                </div>

                <PredictionResultTable model={model} result={results} />
              </div>
            ) : (
              <ModelInfo pummok={pummok} model={modelKeyMap[pummok]?.[model] || ""} period={model} />
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default PricePrediction;
