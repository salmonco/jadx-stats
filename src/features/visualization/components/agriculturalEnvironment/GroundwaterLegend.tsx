import { interpolateTurbo, interpolateYlOrBr, interpolateYlGn } from "d3";

interface GroundwaterLegendProps {
  visType: string;
  metric: "ph" | "ntrgn" | "chlrn";
}

const GroundwaterLegend = ({ visType, metric }: GroundwaterLegendProps) => {
  let colorScale: any;
  let minValue: number;
  let maxValue: number;

  // 각 성분별 색상 스케일 및 값 범위 설정
  if (metric === "ph") {
    colorScale = interpolateTurbo;
    minValue = 4;
    maxValue = 10;
  } else if (metric === "ntrgn") {
    colorScale = interpolateYlOrBr;
    minValue = 0.08;
    maxValue = 95;
  } else if (metric === "chlrn") {
    colorScale = interpolateYlGn;
    minValue = 1;
    maxValue = 900;
  }

  // 100개의 색상 조각을 만들어 그라데이션으로 보여줌
  const gradientSteps = Array.from({ length: 100 }, (_, i) => (
    <div
      key={i}
      style={{
        width: "1%",
        height: "20px",
        backgroundColor: colorScale(i / 100),
        display: "inline-block",
      }}
    />
  ));

  const legendItems = [
    { label: "부적합 (1개 이상)", color: "#D11B1B" },
    { label: "모두 적합", color: "rgba(245, 245, 245, 0.5)" },
  ];

  return (
    <div className="flex w-full flex-col gap-2 rounded-lg bg-[#43516D] p-5">
      <p className="text-[18px] font-semibold text-white">범례</p>
      <div className="rounded-lg border border-[#d9d9d9] bg-[#fff] px-[12px] py-[14px]">
        {visType === "metrics" ? (
          <>
            <div className="flex justify-between px-[2px] text-[#222]">
              <span>{minValue}</span>
              <span>{maxValue}</span>
            </div>
            <div className="flex justify-center">{gradientSteps}</div>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            {legendItems.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="mr-[10px] h-[20px] w-[20px] rounded-sm" style={{ backgroundColor: item.color, border: "1px solid #000" }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroundwaterLegend;
