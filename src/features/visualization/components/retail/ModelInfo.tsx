import { Button, Card, Table, TableColumnsType, Tag } from "antd";
import { MoveRight } from "lucide-react";
import { predictionModels } from "~/features/visualization/utils/predictionModels";
import { BlockMath } from "react-katex";
import { DownloadOutlined } from "@ant-design/icons";
import { renderSymbol } from "~/features/visualization/utils/renderSymbol";

interface Props {
  pummok: string;
  model: string;
  period: string; // "3일 예상 가격" | "7일 예상 가격" | "1개월 예상 가격"
}

const ModelInfo = ({ pummok, model, period }: Props) => {
  const columns: TableColumnsType<any> = [
    { title: "변수", dataIndex: "key", key: "key", align: "center", render: (text) => renderSymbol(text) },
    { title: "설명", dataIndex: "name", key: "name", align: "center" },
    { title: "단위", dataIndex: "unit", key: "unit", align: "center" },
    { title: "데이터 위치", dataIndex: "dataLocation", key: "dataLocation", align: "center" },
    { title: "비고", dataIndex: "remark", key: "remark", align: "center" },
  ];

  const currentModel = predictionModels[model];

  const fileName = "[감귤,당근] 가격 예측 모델 결과 보고서.pdf";
  const fileUrl = `https://kr.object.gov-ncloudstorage.com/jadx-lake-1/origin/static/name%3Dpredc/%20%5B%EA%B0%90%EA%B7%A4%2C%EB%8B%B9%EA%B7%BC%5D%20%EA%B0%80%EA%B2%A9%20%EC%98%88%EC%B8%A1%20%EB%AA%A8%EB%8D%B8%20%EA%B2%B0%EA%B3%BC%20%EB%B3%B4%EA%B3%A0%EC%84%9C.pdf`;

  return (
    <div className="mt-[20px] flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <span className="text-[20px] font-semibold">예측 모델 설명</span>
            <Tag className="rounded-full px-[12px] py-[6px] text-[15px]">
              {pummok} {period}
            </Tag>
          </div>
          <span className="text-[16px] text-[#666666]">이 모델은 시계열 분석과 시장 데이터를 기반으로 농산물 가격을 예측합니다.</span>
        </div>
        <Button type="primary" icon={<DownloadOutlined />} onClick={() => window.open(fileUrl, "_blank")}>
          보고서 다운로드
        </Button>
      </div>
      <div className="flex flex-col gap-6 2xl:flex-row">
        <Card className="w-full 2xl:w-[30%]">
          <div className="flex flex-col">
            <div className="mb-4 flex justify-center rounded-lg bg-[#f5f5f5] p-[12px]">
              <BlockMath math={currentModel?.formula?.description} />
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-[15px] text-[#0f172a] 2xl:mx-0 2xl:grid-cols-1">
              {currentModel?.formula?.variables?.map((variable, index) => (
                <div key={index}>
                  <strong>{renderSymbol(variable.symbol)}</strong>: {variable.description}
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card className="w-[full]">
          <div className="flex flex-col space-y-[24px]">
            <div className="flex w-full">
              {[...Array(4)].map((_, index) => (
                <>
                  <div key={`box-${index}`} className="flex flex-[2] flex-col items-center gap-[6px]">
                    <span className="text-[14px] text-[#333]">{index < 2 ? "Datahub" : "DB서버 (JADXMT)"}</span>
                    <div
                      className={`flex min-h-[100px] w-full items-center justify-center rounded-lg border px-[12px] text-center shadow-sm ${
                        index === 3 ? "border-[#002766] bg-[#002766]" : "border-[#e3f0ff] bg-[#e3f0ff]"
                      }`}
                    >
                      {
                        [
                          <div className="text-[17px] font-semibold">
                            도매시장 정산가격
                            <br />
                            업데이트
                          </div>,
                          <div className="flex flex-col items-center gap-[4px]">
                            <span className="text-[17px] font-semibold">반입량 및 평균가</span>
                            <span className="text-[15px] text-[#767676]">(일별/시장별/작물별)</span>
                          </div>,
                          <div className="flex flex-col items-center gap-[4px]">
                            <span className="text-[17px] font-semibold">{currentModel.formula.target} 예측</span>
                            <span className="text-[15px] text-[#767676]">({period.split(" ")[0]})</span>
                          </div>,
                          <div className="text-[17px] font-semibold text-white">예측 결과</div>,
                        ][index]
                      }
                    </div>
                    <span className="text-[13px] text-[#444]">{index === 0 ? "매일 경락 완료 후 업로드" : index === 3 ? currentModel.formula.result : "\u00A0"}</span>
                  </div>
                  {index < 3 && (
                    <div key={`arrow-${index}`} className="flex min-w-[72px] flex-1 flex-col items-center justify-center">
                      {index < 2 ? (
                        <>
                          <span className="whitespace-nowrap text-[13px] text-[#767676]">당일 데이터</span>
                          <MoveRight className="text-[#767676]" />
                          <span className="whitespace-nowrap text-[13px] text-[#767676]">업로드 완료</span>
                        </>
                      ) : (
                        <MoveRight className="text-[#767676]" />
                      )}
                    </div>
                  )}
                </>
              ))}
            </div>

            <div className="space-y-[4px]">
              <div className="text-[18px] font-medium">■ 모델 설명</div>
              <p className="text-[18px] text-[#767676]">{currentModel.description}</p>
            </div>

            <div className="space-y-[4px]">
              <span className="text-[18px] font-medium">■ 데이터 출처</span>
              <div className="text-[18px] text-[#767676]">{currentModel.source}</div>
            </div>

            <div className="space-y-[4px]">
              <span className="text-[18px] font-medium">■ 입력 변수</span>
              <div className="text-[18px] text-[#767676]">{currentModel.variables?.description}</div>
              <Table columns={columns} dataSource={currentModel.variables?.data} pagination={false} bordered />
            </div>

            <div>
              <span className="text-[18px] font-medium">■ 예측 결과 산출 방법</span>
              <p className="text-[18px] text-[#767676]">{typeof currentModel.process === "object" ? currentModel.process?.[period] : currentModel.process}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ModelInfo;
