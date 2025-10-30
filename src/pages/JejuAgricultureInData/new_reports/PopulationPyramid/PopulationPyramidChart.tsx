import { useState, useEffect, useMemo } from "react";
import { Button, Slider, Radio, Space, Card, Statistic, Row, Col } from "antd";
import { PlayCircle, PauseCircle, SkipBack, SkipForward, ChevronLeft, ChevronRight } from "lucide-react";
import { populationData, allYears } from "./populationData";
import PopulationPyramidChartCore from "./PopulationPyramidChartCore";

// 기존의 getGlobalMaxValue 함수와 GLOBAL_MAX_VALUE 상수를 제거하고 다음으로 교체:
const FIXED_MAX_VALUE = 13500;

export default function PopulationPyramidChart() {
  // 시작 연도를 1990년으로 변경:
  const [currentYear, setCurrentYear] = useState(1990);
  const [prevYear, setPrevYear] = useState(1980);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [showLabels, setShowLabels] = useState(true);

  // 현재 연도 데이터 처리 - 피라미드 형태로 변환
  const processedData = useMemo(() => {
    if (!populationData[currentYear]) return [];

    const yearData = populationData[currentYear];
    return yearData.map((item) => ({
      age: item.age,
      male: item.male, // 이미 음수로 되어 있음
      female: item.female,
      maleAbs: Math.abs(item.male),
      femaleAbs: item.female,
    }));
  }, [currentYear]);

  // 현재 연도 통계 계산
  const currentYearStats = useMemo(() => {
    if (!processedData.length) return { totalMale: 0, totalFemale: 0, total: 0, youngPct: 0, middlePct: 0, oldPct: 0, genderRatio: 0 };

    const totalMale = processedData.reduce((sum, item) => sum + item.maleAbs, 0);
    const totalFemale = processedData.reduce((sum, item) => sum + item.femaleAbs, 0);
    const total = totalMale + totalFemale;

    // 연령대별 비율 계산
    const youngGroup = processedData
      .filter((item) => {
        const age = Number.parseInt(item.age.split(" ")[0]);
        return age < 30;
      })
      .reduce((sum, item) => sum + item.maleAbs + item.femaleAbs, 0);

    const middleGroup = processedData
      .filter((item) => {
        const age = Number.parseInt(item.age.split(" ")[0]);
        return age >= 30 && age < 60;
      })
      .reduce((sum, item) => sum + item.maleAbs + item.femaleAbs, 0);

    const oldGroup = processedData
      .filter((item) => {
        const age = Number.parseInt(item.age.split(" ")[0]);
        return age >= 60;
      })
      .reduce((sum, item) => sum + item.maleAbs + item.femaleAbs, 0);

    return {
      totalMale,
      totalFemale,
      total,
      youngPct: Math.round((youngGroup / total) * 100),
      middlePct: Math.round((middleGroup / total) * 100),
      oldPct: Math.round((oldGroup / total) * 100),
      genderRatio: Math.round((totalMale / totalFemale) * 100),
    };
  }, [processedData]);

  // 이전 연도와 비교한 변화율
  const populationChange = useMemo(() => {
    if (!populationData[currentYear] || !populationData[prevYear]) return { totalChange: 0, totalChangePercent: 0, changeDirection: "유지" };

    const currentTotal = currentYearStats.total;
    const prevData = populationData[prevYear];
    const prevTotal = prevData.reduce((sum, item) => sum + Math.abs(item.male) + item.female, 0);

    const change = currentTotal - prevTotal;
    const changePercent = prevTotal ? Math.round((change / prevTotal) * 100 * 10) / 10 : 0;

    return {
      totalChange: change,
      totalChangePercent: changePercent,
      changeDirection: change > 0 ? "증가" : change < 0 ? "감소" : "유지",
    };
  }, [currentYear, prevYear, currentYearStats.total]);

  // 이전 연도 설정
  useEffect(() => {
    const yearIndex = allYears.indexOf(currentYear);
    if (yearIndex > 0) {
      setPrevYear(allYears[yearIndex - 1]);
    }
  }, [currentYear]);

  // 자동 재생 기능
  useEffect(() => {
    let interval;

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentYear((prev) => {
          const yearIndex = allYears.indexOf(prev);
          if (yearIndex === allYears.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return allYears[yearIndex + 1];
        });
      }, animationSpeed);
    }

    return () => clearInterval(interval);
  }, [isPlaying, animationSpeed]);

  // 컨트롤 함수들
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentYear === 2024) {
        setCurrentYear(1990);
      }
      setIsPlaying(true);
    }
  };

  const handleYearChange = (value) => {
    setIsPlaying(false);
    setCurrentYear(value);
  };

  const goToPrevYear = () => {
    const yearIndex = allYears.indexOf(currentYear);
    if (yearIndex > 0) {
      setCurrentYear(allYears[yearIndex - 1]);
      setIsPlaying(false);
    }
  };

  const goToNextYear = () => {
    const yearIndex = allYears.indexOf(currentYear);
    if (yearIndex < allYears.length - 1) {
      setCurrentYear(allYears[yearIndex + 1]);
      setIsPlaying(false);
    }
  };

  const goToFirstYear = () => {
    setCurrentYear(1990);
    setIsPlaying(false);
  };

  const goToLastYear = () => {
    setCurrentYear(allYears[allYears.length - 1]);
    setIsPlaying(false);
  };

  return (
    <div className="w-full">
      {/* 현재 연도 표시 */}
      <div className="mb-8 text-center">
        <div
          className={`inline-block rounded-xl px-8 py-4 transition-all duration-500 ${
            isPlaying ? "scale-105 transform bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" : "bg-gray-100 text-gray-800"
          }`}
        >
          <div className="text-[32px] font-bold">{currentYear}년</div>
          {isPlaying && <div className="mt-1 text-sm opacity-90">재생 중...</div>}
        </div>
      </div>

      {/* 통계 카드 */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} md={8}>
          <Card className="h-full border-0 bg-gradient-to-br from-orange-50 to-white shadow-sm">
            <Statistic
              title={<span className="font-medium text-orange-600">총 농가인구</span>}
              value={currentYearStats.total}
              formatter={(value) => (
                <div className="text-2xl font-bold text-orange-700">
                  {value?.toLocaleString()}명
                  {populationChange.totalChange !== 0 && (
                    <span className={`ml-2 text-sm ${populationChange.totalChange > 0 ? "text-red-500" : "text-blue-500"}`}>
                      ({populationChange.totalChange > 0 ? "+" : ""}
                      {populationChange.totalChangePercent}%)
                    </span>
                  )}
                </div>
              )}
            />
            <div className="mt-2 text-sm text-gray-500">
              {prevYear}년 대비 {Math.abs(populationChange.totalChange).toLocaleString()}명 {populationChange.changeDirection}
            </div>
          </Card>
        </Col>
        <Col xs={12} md={8}>
          <Card className="h-full border-0 bg-gradient-to-br from-blue-50 to-white shadow-sm">
            <Statistic
              title={<span className="font-medium text-blue-600">성별 구성</span>}
              value={currentYearStats.genderRatio}
              formatter={() => (
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#ff7300]">
                    👨 {currentYearStats.totalMale.toLocaleString()}
                    <span className="ml-1 text-xs">({Math.round((currentYearStats.totalMale / currentYearStats.total) * 100)}%)</span>
                  </div>
                  <div className="font-bold text-[#0088fe]">
                    👩 {currentYearStats.totalFemale.toLocaleString()}
                    <span className="ml-1 text-xs">({Math.round((currentYearStats.totalFemale / currentYearStats.total) * 100)}%)</span>
                  </div>
                </div>
              )}
            />
            <div className="mt-2 text-sm text-gray-500">성비(남/여): {currentYearStats.genderRatio}%</div>
          </Card>
        </Col>
        <Col xs={12} md={8}>
          <Card className="h-full border-0 bg-gradient-to-br from-green-50 to-white shadow-sm">
            <Statistic
              title={<span className="w-full font-medium text-green-600">연령대별 구성</span>}
              value={100}
              formatter={() => (
                <div className="flex items-center justify-between text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-500">{currentYearStats.youngPct}%</div>
                    <div className="text-gray-500">
                      청년층
                      <br />
                      (0-29세)
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-500">{currentYearStats.middlePct}%</div>
                    <div className="text-gray-500">
                      중년층
                      <br />
                      (30-59세)
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-500">{currentYearStats.oldPct}%</div>
                    <div className="text-gray-500">
                      노년층
                      <br />
                      (60세 이상)
                    </div>
                  </div>
                </div>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 차트 영역 */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
        <PopulationPyramidChartCore data={processedData} showLabels={showLabels} height={600} maxValue={FIXED_MAX_VALUE} />
      </div>

      {/* 컨트롤 영역 */}
      <div className="flex flex-col items-center space-y-6">
        <div className="flex items-center justify-center gap-2">
          {/* 컨트롤 버튼의 disabled 조건을 1990년으로 변경: */}
          <Button onClick={goToFirstYear} icon={<SkipBack size={16} />} disabled={currentYear === 1990} />
          <Button onClick={goToPrevYear} icon={<ChevronLeft size={16} />} disabled={currentYear === 1990} />
          <Button
            type="primary"
            shape="circle"
            size="large"
            onClick={togglePlay}
            icon={isPlaying ? <PauseCircle size={20} /> : <PlayCircle size={20} />}
            className="mx-2 flex items-center justify-center"
          />
          <Button onClick={goToNextYear} icon={<ChevronRight size={16} />} disabled={currentYear === 2024} />
          <Button onClick={goToLastYear} icon={<SkipForward size={16} />} disabled={currentYear === 2024} />
        </div>

        <div className="w-full max-w-4xl">
          <Slider
            min={1970}
            max={2024}
            step={1}
            value={currentYear}
            onChange={handleYearChange}
            marks={{
              1970: "1970",
              1980: "1980",
              1990: "1990",
              2000: "2000",
              2010: "2010",
              2020: "2020",
              2024: "2024",
            }}
            tooltip={{
              formatter: (value) => `${value}년`,
            }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Radio.Group value={animationSpeed} onChange={(e) => setAnimationSpeed(e.target.value)} buttonStyle="solid">
            <Radio.Button value={1500}>느리게</Radio.Button>
            <Radio.Button value={1000}>보통</Radio.Button>
            <Radio.Button value={600}>빠르게</Radio.Button>
          </Radio.Group>

          <Space>
            <Button type={showLabels ? "primary" : "default"} onClick={() => setShowLabels(!showLabels)}>
              {showLabels ? "라벨 숨기기" : "라벨 표시"}
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
}
