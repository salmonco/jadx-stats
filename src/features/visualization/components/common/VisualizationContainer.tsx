import React from "react";

interface Props {
  // TODO: title 삭제
  title?: string | React.ReactNode;
  tooltip?: React.ReactNode;
  mapContent: React.ReactNode;
  filterContent?: React.ReactNode;
  chartContent?: React.ReactNode;
}

const VisualizationContainer = ({ title, tooltip, mapContent, filterContent, chartContent }: Props) => {
  return (
    <div className="flex min-h-screen w-full flex-col gap-5 p-5">
      <div className="flex flex-col gap-5 rounded-lg bg-[#37445E] p-5">
        {/* 타이틀 */}
        <div className={`flex items-center gap-2.5 rounded-lg bg-[#43516D] px-5 text-white`}>
          {typeof title === "string" ? (
            <div className="flex items-center gap-2 py-4">
              <p className="text-2xl font-semibold">{title}</p>
              {tooltip}
            </div>
          ) : (
            <div className="w-full py-3">{title}</div>
          )}
          {/* 툴팁 */}
        </div>
        <div className="flex h-[65%] min-h-[570px] gap-5 3xl:min-h-[800px] 4xl:min-h-[950px]">
          {/* 지도 */}
          <div style={{ flex: 7 }} className="rounded-lg">
            {mapContent}
          </div>
          {/* 필터 */}
          {filterContent && (
            <div style={{ flex: 3 }} className="max-w-[360px] 3xl:max-w-[440px] 4xl:max-w-[550px]">
              {filterContent}
            </div>
          )}
        </div>
        {/* 차트 */}
        {chartContent && <div className="w-full">{chartContent}</div>}
      </div>
    </div>
  );
};

export default VisualizationContainer;
