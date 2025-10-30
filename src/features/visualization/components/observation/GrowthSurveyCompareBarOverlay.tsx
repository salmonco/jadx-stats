import { useEffect } from "react";
import Overlay from "ol/Overlay";
import type { Feature } from "ol";

interface Props {
  layerManager: any;
  selectedObservationType: string[];
  brixData: Feature[];
  countData: Feature[];
  sizeData: Feature[];
  prevYearBrixData: Feature[];
  prevYearCountData: Feature[];
  prevYearSizeData: Feature[];
  elevationNum: number;
  elevation: number[];
  year: number;
}

export default function GrowthSurveyCompareBarOverlay({
  layerManager,
  selectedObservationType,
  brixData,
  countData,
  sizeData,
  prevYearBrixData,
  prevYearCountData,
  prevYearSizeData,
  elevationNum,
  elevation,
  year,
}: Props) {
  useEffect(() => {
    if (!layerManager) return;
    const map = layerManager.map;
    if (!map) return;

    if (!elevation.includes(elevationNum)) {
      return;
    }

    // elevationNum에 따라 brixData 필터링
    const brixDataAltd = brixData.filter((feature) => {
      const altd = feature.get("altd") ?? 0;
      if (elevationNum === 100) {
        return altd < 100;
      } else if (elevationNum === 200) {
        return altd >= 100 && altd < 200;
      } else if (elevationNum === 201) {
        return altd >= 200;
      }
      return false;
    });

    const countDataAltd = countData.filter((feature) => {
      const altd = feature.get("altd") ?? 0;
      if (elevationNum === 100) {
        return altd < 100;
      } else if (elevationNum === 200) {
        return altd >= 100 && altd < 200;
      } else if (elevationNum === 201) {
        return altd >= 200;
      }
      return false;
    });

    const sizeDataAltd = sizeData.filter((feature) => {
      const altd = feature.get("altd") ?? 0;
      if (elevationNum === 100) {
        return altd < 100;
      } else if (elevationNum === 200) {
        return altd >= 100 && altd < 200;
      } else if (elevationNum === 201) {
        return altd >= 200;
      }
      return false;
    });

    const prevYearBrixDataAltd = prevYearBrixData.filter((feature) => {
      const altd = feature.get("altd") ?? 0;
      if (elevationNum === 100) {
        return altd < 100;
      } else if (elevationNum === 200) {
        return altd >= 100 && altd < 200;
      } else if (elevationNum === 201) {
        return altd >= 200;
      }
      return false;
    });

    const prevYearCountDataAltd = prevYearCountData.filter((feature) => {
      const altd = feature.get("altd") ?? 0;
      if (elevationNum === 100) {
        return altd < 100;
      } else if (elevationNum === 200) {
        return altd >= 100 && altd < 200;
      } else if (elevationNum === 201) {
        return altd >= 200;
      }
      return false;
    });

    const prevYearSizeDataAltd = prevYearSizeData.filter((feature) => {
      const altd = feature.get("altd") ?? 0;
      if (elevationNum === 100) {
        return altd < 100;
      } else if (elevationNum === 200) {
        return altd >= 100 && altd < 200;
      } else if (elevationNum === 201) {
        return altd >= 200;
      }
      return false;
    });

    // 평균 계산 함수
    const calculateAverages = (features: Feature[]) => {
      let brixSum = 0;
      let cdtySum = 0;
      let countSum = 0;
      let sizeSum = 0;

      features.forEach((feature) => {
        brixSum += feature.get("brix") ?? 0;
        cdtySum += feature.get("cdty") ?? 0;
        countSum += feature.get("aug_frc") ?? 0;
        sizeSum += feature.get("aug_frt_sz") ?? 0;
      });

      return {
        brixAvg: cdtySum === 0 ? 0 : brixSum / cdtySum, // 당산도 평균
        countAvg: features.length === 0 ? 0 : countSum / features.length, // 열매수 평균
        sizeAvg: features.length === 0 ? 0 : sizeSum / features.length, // 횡경 평균
      };
    };

    // 증감률 계산 함수
    const calculatePercentageChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : -100;
      return ((current - previous) / previous) * 100;
    };

    // 현재 및 전년도 데이터 평균 계산
    const filteredBrixData = brixDataAltd.filter((feature) => feature.get("yr") === year);
    const filteredCountData = countDataAltd.filter((feature) => feature.get("yr") === year);
    const filteredSizeData = sizeDataAltd.filter((feature) => feature.get("yr") === year);

    const currentAverages = calculateAverages([...filteredBrixData, ...filteredCountData, ...filteredSizeData]);
    const prevAverages = calculateAverages([...prevYearBrixDataAltd, ...prevYearCountDataAltd, ...prevYearSizeDataAltd]);

    const brixChange = calculatePercentageChange(currentAverages.brixAvg, prevAverages.brixAvg);
    const countChange = calculatePercentageChange(currentAverages.countAvg, prevAverages.countAvg);
    const sizeChange = calculatePercentageChange(currentAverages.sizeAvg, prevAverages.sizeAvg);

    const normalizeValue = (value: number, max: number, minHeight: number = 5) => {
      const maxHeight = 50; // 차트 바의 최대 높이
      return Math.max((value / max) * maxHeight, minHeight);
    };

    const maxBrix = Math.max(currentAverages.brixAvg, prevAverages.brixAvg, 1);
    const maxCount = Math.max(currentAverages.countAvg, prevAverages.countAvg, 1);
    const maxSize = Math.max(currentAverages.sizeAvg, prevAverages.sizeAvg, 1);

    // Overlay DOM 생성
    const container = document.createElement("div");
    container.className = "chart-overlay";
    container.style.position = "absolute";
    container.style.height = "140px";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    container.style.width = `${selectedObservationType.length > 1 ? `${selectedObservationType.length * 68}px` : "80px"}`;
    container.style.backgroundColor = "white";
    container.style.opacity = `${selectedObservationType.length > 0 ? 0.7 : 0}`;
    container.style.borderRadius = "4px";

    // 화살표 SVG 생성 함수
    const createArrowSvg = (isUp: boolean, color: string) => `
      <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}">
        ${
          isUp
            ? '<path d="M12 2l-8 8h6v12h4V10h6z"/>' // 위쪽 화살표
            : '<path d="M12 22l8-8h-6V2h-4v12H4z"/>' // 아래쪽 화살표
        }
      </svg>
    `;

    const tooltip = document.createElement("div");
    tooltip.id = "tooltip"; // 추가
    tooltip.style.position = "absolute";
    tooltip.style.background = "white";
    tooltip.style.border = "1px solid #ccc";
    tooltip.style.padding = "6px 8px";
    tooltip.style.borderRadius = "4px";
    tooltip.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
    tooltip.style.fontSize = "12px";
    tooltip.style.whiteSpace = "nowrap";
    tooltip.style.display = "none"; // 기본적으로 숨김
    tooltip.style.pointerEvents = "none"; // 툴팁이 클릭 이벤트를 방해하지 않음
    tooltip.style.transition = "opacity 0.2s ease-in-out";
    tooltip.style.opacity = "0"; // 기본적으로 투명하게 설정
    document.body.appendChild(tooltip);

    // 툴팁 업데이트 함수
    const showTooltip = (event: MouseEvent, text: string) => {
      tooltip.textContent = text;
      tooltip.style.left = `${event.clientX + 10}px`; // 마우스 오른쪽
      tooltip.style.top = `${event.clientY + 10}px`; // 마우스 아래쪽
      tooltip.style.display = "block";
      tooltip.style.opacity = "1"; // 투명도 조절
    };

    const hideTooltip = () => {
      tooltip.style.opacity = "0";
      setTimeout(() => {
        tooltip.style.display = "none";
      }, 200);
    };

    const createBarWithTooltip = (value: number, max: number, color: string, label: string, change: number) => {
      const barContainer = document.createElement("div");
      barContainer.style.display = "flex";
      barContainer.style.flexDirection = "column";
      barContainer.style.alignItems = "center";
      barContainer.style.position = "relative";

      // Create Label (바 위에 위치)
      const labelContainer = document.createElement("div");
      labelContainer.style.fontSize = "12px";
      labelContainer.style.fontWeight = "bold";
      labelContainer.style.marginBottom = "4px"; // 바와 간격 유지
      labelContainer.style.color = "#333";
      labelContainer.textContent = `${label}`;

      // Create Bar
      const barHeight = normalizeValue(value, max); // 바의 높이 계산
      const bar = document.createElement("div");
      bar.style.width = "50px";
      bar.style.height = `${barHeight}px`;
      bar.style.background = color;
      bar.style.position = "relative";
      bar.style.cursor = "pointer";
      bar.style.display = "flex";
      bar.style.alignItems = "center";
      bar.style.justifyContent = "center";

      // Create Value Text (바 중앙에 표시)
      const valueText = document.createElement("span");
      valueText.style.position = "absolute";
      valueText.style.color = "white";
      valueText.style.fontSize = "12px";
      valueText.style.fontWeight = "bold";
      valueText.style.pointerEvents = "none"; // 마우스 이벤트 방해하지 않도록 설정
      valueText.textContent = value.toFixed(2); // 소수점 2자리로 표시

      // Create Arrow (바 아래 화살표)
      const arrowContainer = document.createElement("div");
      arrowContainer.style.marginTop = "4px";
      if (change > 0) {
        arrowContainer.innerHTML = createArrowSvg(true, color);
      } else if (change < 0) {
        arrowContainer.innerHTML = createArrowSvg(false, color);
      } else {
        arrowContainer.textContent = "="; // No change
      }

      // Attach Tooltip Events
      bar.addEventListener("mouseover", (event) => {
        showTooltip(event, `${year - 1}년도 대비 ${year}년도 ${label} 증감률: ${change.toFixed(2)}%`);
      });

      bar.addEventListener("mouseout", hideTooltip);

      // Append elements
      bar.appendChild(valueText); // 바 중앙에 값 추가
      barContainer.appendChild(labelContainer); // 바 위에 텍스트 추가
      barContainer.appendChild(bar);
      barContainer.appendChild(arrowContainer);

      return barContainer;
    };

    const barsContainer = document.createElement("div");
    barsContainer.style.display = "flex";
    barsContainer.style.alignItems = "flex-end";
    barsContainer.style.justifyContent = "center";
    barsContainer.style.gap = "16px";

    const titleContainer = document.createElement("div");
    titleContainer.style.textAlign = "center";
    titleContainer.style.fontSize = "14px";
    titleContainer.style.fontWeight = "bold";
    titleContainer.style.marginBottom = "8px";
    titleContainer.style.color = "#333"; // 글자 색상
    titleContainer.style.opacity = `${selectedObservationType.length > 0 ? 1 : 0}`;

    // 고도별 제목 설정
    if (elevationNum === 100) {
      titleContainer.textContent = `100m 미만 (${year}년도)`;
    } else if (elevationNum === 200) {
      titleContainer.textContent = `200m 미만 (${year}년도)`;
    } else if (elevationNum === 201) {
      titleContainer.textContent = `200m 이상 (${year}년도)`;
    }

    const colorSpectrum = {
      100: ["#00695C", "#00796B", "#00897B"], // 짙은 청록 → 기본 → 밝은 청록
      200: ["#E65100", "#EF6C00", "#F57C00"], // 짙은 주황 → 기본 → 밝은 주황
      201: ["#B71C1C", "#C62828", "#D32F2F"], // 짙은 레드 → 기본 → 밝은 레드
    };

    if (selectedObservationType.includes("brix")) {
      barsContainer.appendChild(createBarWithTooltip(currentAverages.brixAvg, maxBrix, colorSpectrum[elevationNum][0], "당산도", brixChange));
    }
    if (selectedObservationType.includes("count")) {
      barsContainer.appendChild(createBarWithTooltip(currentAverages.countAvg, maxCount, colorSpectrum[elevationNum][1], "열매수", countChange));
    }
    if (selectedObservationType.includes("size")) {
      barsContainer.appendChild(createBarWithTooltip(currentAverages.sizeAvg, maxSize, colorSpectrum[elevationNum][2], "횡경", sizeChange));
    }

    container.appendChild(titleContainer);
    container.appendChild(barsContainer);

    const position_100 = [14093000, 3935000];
    const position_200 = [14093000, 3967000];
    const position_201 = [14065000, 3959000];
    const position = [14072000, 3955000];

    // Overlay 위치를 중앙으로 조정
    const overlay = new Overlay({
      element: container,
      positioning: "center-center",
      position: elevationNum === 100 ? position_100 : elevationNum === 200 ? position_200 : elevationNum === 201 ? position_201 : position,
    });

    map.addOverlay(overlay);

    // 언마운트 시 레이어와 Overlay 정리
    return () => {
      map.removeOverlay(overlay);
      tooltip.remove();
    };
  }, [layerManager, brixData, countData, sizeData, prevYearBrixData, prevYearCountData, prevYearSizeData, selectedObservationType, elevationNum, elevation]);

  return null;
}
