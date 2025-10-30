import { useState, useEffect } from "react";
import { populationData, allYears } from "../JejuAgricultureInData/new_reports/PopulationPyramid/populationData";
import PopulationPyramidChartCore from "../JejuAgricultureInData/new_reports/PopulationPyramid/PopulationPyramidChartCore";

export default function AnimatedPopulationPyramid() {
  const [currentYear, setCurrentYear] = useState(1990);

  // 자동 연도 증가 로직
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentYear((prev) => {
        const yearIndex = allYears.indexOf(prev);
        if (yearIndex === allYears.length - 1) {
          return allYears[0];
        }
        return allYears[yearIndex + 1];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const currentData = populationData[currentYear] || [];

  return (
    <div className="relative h-full w-full">
      {/* 연도 표시 */}
      <div className="absolute left-2 top-0 z-10">
        <div className="rounded-lg bg-black/40 px-3 py-1 text-sm font-bold text-white shadow-lg">{currentYear}년</div>
      </div>

      {/* 차트 */}
      <div className="h-full w-full">
        {currentData.length > 0 ? (
          <PopulationPyramidChartCore data={currentData} showLabels={false} height={265} maxValue={13500} tickFontSize={12} />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">데이터 로딩 중... ({currentYear}년)</div>
        )}
      </div>
    </div>
  );
}
