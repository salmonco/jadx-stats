import React from "react";

interface ExplainContainerProps {
  selectedCategory: string;
}

const ExplainContainer: React.FC<ExplainContainerProps> = ({ selectedCategory }) => {
  if (selectedCategory === "flower_leaf") {
    return (
      <div className="custom-dark-scroll flex flex-col gap-2 rounded-lg bg-[#43516D] p-4 text-white" style={{ maxHeight: "250px", overflowY: "auto" }}>
        <p className="text-[16px] font-bold">* 화엽비란?</p>
        <p className="text-[15px] font-bold">* 정의</p>
        <p className="text-[15px] leading-snug">
          화엽비는 <strong>감귤나무에 피어난 꽃의 수와 잎의 수를 비교한 비율</strong>로, 나무의 생식생장(열매 생산)과 영양생장(잎 성장)사이의 균형을 보여주는 중요한
          지표입니다.
        </p>
        <p className="text-[15px] font-bold">* 왜 중요한가요?</p>
        <p className="text-[15px] leading-snug">
          적정한 화엽비는 <strong>적정 착과량</strong>과 <strong>양호한 과실 품질</strong>을 결정짓는 핵심 요소입니다. 꽃이 지나치게 많거나 적으면 열매 수량과 품질 모두
          저하될 수 있습니다.
        </p>
        <p className="text-[15px] font-bold">* 계산식 </p>
        <p className="text-[15px] leading-snug">화엽비 = 꽃 수/잎 수</p>
        <p className="text-[15px] font-bold">* 해석 기준 예시 </p>
        <div className="text-[15px] leading-snug">
          <p>
            <strong>0.2~0.3:</strong> 적정수준(바람직한 착과 가능)
          </p>
          <p>
            <strong>0.4 이상:</strong> 꽃 과다 → 낙과 위험 증가
          </p>
          <p>
            <strong>0.1 이하:</strong> 꽃 부족 → 수량 감소 우려
          </p>
        </div>
      </div>
    );
  }

  if (selectedCategory === "brix_ratio") {
    return (
      <div className="flex flex-col gap-2 rounded-lg bg-[#43516D] p-5 text-white" style={{ maxHeight: "300px", overflowY: "auto" }}>
        <p className="text-[16px] font-bold">* 당산비란?</p>
        <p className="text-[15px] font-bold">*정의</p>
        <p className="text-[15px] leading-snug">
          당산비는 감귤의 당도와 산도의 비율을 나태는 수치로, 감귤의 맛(새콤달콤함)을 종합적으로 판단할 수 있는 대표적인 지표입니다.
        </p>
        <p className="text-[15px] font-bold">*왜 중요한가요?</p>
        <p className="text-[15px] leading-snug">
          당산비는 소비자가 느끼는 감귤의 <strong>맛 균형</strong>을 나타냅니다. 단맛(당도)과 신맛(산도)의 조화가 잘 맞을수록 맛있는 감귤로 평가됩니다.
        </p>
        <p className="text-[15px] font-bold">*계산식 </p>
        <p className="text-[15px] leading-snug">당산비 = 당도(°Brix)/산도(%)</p>
        <p className="text-[15px] font-bold">*해석 기준 예시 </p>
        <div className="text-[15px] leading-snug">
          <p>10 이상: 맛이 뛰어남</p>
          <p>8 ~ 10: 보통 수준</p>
          <p>8 이하: 신맛 강하고 덜 달게 느껴질 수 있음</p>
          <br />
        </div>
      </div>
    );
  }

  return null;
};

export default ExplainContainer;
