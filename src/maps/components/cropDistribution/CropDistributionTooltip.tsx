import InfoTooltip from "~/components/InfoTooltip";

const CropDistributionTooltip = () => {
  return (
    <InfoTooltip
      title="작물 재배지도"
      content={`- 제주 지역별 주 생산 품목을 지도에 색상별로 표기하여 직관적으로 확인\n- ‘상위 2품목’선택시 해당 구역을 클릭하여 전체 순위별로 작물별 재배 면적을 확인 가능\n- ※ 데이터: 드론재배면적조사(’21~’23)`}
    />
  );
};

export default CropDistributionTooltip;
