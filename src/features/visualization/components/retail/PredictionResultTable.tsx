import { Table, TableColumnsType, Tag, Tooltip } from "antd";
import { LabeledPrediction, ModelType } from "~/pages/visualization/retail/PricePrediction";
import { QuestionCircleOutlined } from "@ant-design/icons";

interface Props {
  model: ModelType;
  result: LabeledPrediction[] | null;
}

const getDayLabels = (model: ModelType) => {
  if (model === "3일 예상 가격") return ["1일 후", "2일 후", "3일 후"];
  if (model === "7일 예상 가격") return ["1일 후", "2일 후", "3일 후", "4일 후", "5일 후", "6일 후", "7일 후"];
  if (model === "1개월 예상 가격") return ["1주 후", "2주 후", "3주 후", "4주 후"];
  return [];
};

const getPriceKeys = (model: ModelType) => {
  if (model === "3일 예상 가격" || model === "7일 예상 가격") {
    // 3일/7일 모두 day_1 ~ day_7까지 있으나, 3일은 3개만 사용
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

const PredictionResultTable = ({ model, result }: Props) => {
  if (!result || result.length === 0) return null;

  const labels = getDayLabels(model);
  const keys = getPriceKeys(model);

  const getValues = (type: "예측 가격" | "반입량 적용", market: string) => {
    const found = result.find((r) => r.type === type);
    const row = found?.data?.[market];
    return keys.map((k) => {
      const v = row?.[k as keyof typeof row];
      return typeof v === "number" ? v.toFixed(1).toLocaleString() : "-";
    });
  };

  const allMarkets = Object.keys(result[0]?.data || {});
  const hasAdjust = result.some((r) => r.type === "반입량 적용");

  const dataSource = allMarkets
    .map((market, i) => {
      const base = result[0].data[market];
      const priceValues = getValues("예측 가격", market);
      const adjustedValues = hasAdjust ? getValues("반입량 적용", market) : priceValues;

      // 하나라도 "-"인 값이 있으면 제외
      const hasMissing = [...priceValues, ...adjustedValues].some((v) => v === "-");

      if (hasMissing) return null;

      return {
        key: String(i),
        market,
        model: model.replace(" 예상 가격", ""),
        errorRate: base.predc_err_rt,
        priceChange: base.prc_chnge_rt,
        "예측 가격": priceValues?.map((v) => Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })),
        "반입량 적용": adjustedValues?.map((v) => Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })),
      };
    })
    .filter(Boolean);

  const columns: TableColumnsType<any> = [
    {
      title: "시장",
      dataIndex: "market",
      key: "market",
      align: "center",
      fixed: "left",
    },
    {
      title: "모델",
      dataIndex: "model",
      key: "model",
      align: "center",
      render: (text) => {
        const color = text === "3일" ? "blue" : text === "7일" ? "green" : "red";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: () => (
        <div>
          1% 당<br />
          가격 변화율(%)
        </div>
      ),
      dataIndex: "priceChange",
      key: "priceChange",
      align: "center",
      render: (v) => (v != null ? v.toFixed(2) : "-"),
    },
    {
      title: () => (
        <div className="flex items-center justify-center gap-1">
          오차율(%)
          <Tooltip title="일별 실제값과 예측값 간의 평균 오차율(%)">
            <QuestionCircleOutlined className="text-gray-500" />
          </Tooltip>
        </div>
      ),
      dataIndex: "errorRate",
      key: "errorRate",
      align: "center",
      render: (v) => (v != null ? v.toFixed(2) : "-"),
    },
    {
      title: "예측 가격",
      children: labels.map((label, i) => ({
        title: label,
        key: `pred_${i}`,
        align: "center",
        render: (_: any, row: any) => <div className="flex justify-end">{row["예측 가격"][i]}원</div>,
      })),
    },
    {
      title: "반입량 적용 예측 가격",
      children: labels.map((label, i) => ({
        title: label,
        key: `adj_${i}`,
        align: "center",
        render: (_: any, row: any) => <div className="flex justify-end">{row["반입량 적용"][i]}원</div>,
      })),
    },
  ];

  return <Table columns={columns} dataSource={dataSource} bordered pagination={false} scroll={{ x: "max-content" }} />;
};

export default PredictionResultTable;
