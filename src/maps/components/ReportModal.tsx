import html2canvas from "html2canvas";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getKeyByValue } from "~/features/visualization/utils/getKeyByValue";
import { DEFAULT_ALL_OPTION } from "~/features/visualization/utils/regionFilterOptions";
import { REGION_LEVEL_OPTIONS } from "~/features/visualization/utils/regionLevelOptions";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import { ExtendedOLMap } from "../hooks/useOLMap";

interface Props<M> {
  map: M;
  olMap: ExtendedOLMap;
  onClose: () => void;
}

const MAP_CAPTURE_DELAY = 200;
const REPORT_SOURCE = "제주농업통계시스템";

const ReportModal = <M extends CommonBackgroundMap>({ map, olMap, onClose }: Props<M>) => {
  const [mapImage, setMapImage] = useState<string | null>(null);
  const [legendImage, setLegendImage] = useState<string | null>(null);
  const reportContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleCapture();
    }, MAP_CAPTURE_DELAY);

    return () => clearTimeout(timer);
  }, []);

  const handleCapture = async () => {
    if (!olMap) {
      return;
    }

    const mapViewport = olMap.getViewport();

    if (mapViewport) {
      try {
        const canvas = await html2canvas(mapViewport as HTMLElement, {
          useCORS: true,
        });
        setMapImage(canvas.toDataURL());
      } catch (error) {
        console.error("Error capturing map viewport with html2canvas:", error);
      }
    } else {
      console.error("Map viewport element not found.");
    }

    const legendElement = document.querySelector(".legend-container");

    if (legendElement) {
      try {
        const canvas = await html2canvas(legendElement as HTMLElement, {
          useCORS: true,
          backgroundColor: null,
        });
        setLegendImage(canvas.toDataURL());
      } catch (error) {
        console.error("Error capturing legend:", error);
      }
    } else {
      console.error("Legend element not found.");
    }
  };

  const getFilterText = () => {
    const filterParts: string[] = [];
    const regionSetting = map.regionFilterSetting;

    filterParts.push(getKeyByValue(REGION_LEVEL_OPTIONS, regionSetting.구분));

    if (regionSetting.구분 === REGION_LEVEL_OPTIONS.제주도) {
      filterParts.push(DEFAULT_ALL_OPTION);
    }
    if (regionSetting.구분 === REGION_LEVEL_OPTIONS.행정시) {
      filterParts.push(regionSetting.행정시 === null ? DEFAULT_ALL_OPTION : regionSetting.행정시);
    }
    if (regionSetting.구분 === REGION_LEVEL_OPTIONS.권역) {
      filterParts.push(regionSetting.권역.length === 0 ? DEFAULT_ALL_OPTION : regionSetting.권역.join(", "));
    }
    if (regionSetting.구분 === REGION_LEVEL_OPTIONS.읍면) {
      filterParts.push(regionSetting.읍면.length === 0 ? DEFAULT_ALL_OPTION : regionSetting.읍면.join(", "));
    }
    if (regionSetting.구분 === REGION_LEVEL_OPTIONS.리동) {
      filterParts.push(regionSetting.리동.length === 0 ? DEFAULT_ALL_OPTION : regionSetting.리동.join(", "));
    }

    if (filterParts.length > 0) {
      return filterParts.join(" + ");
    }

    return "적용된 필터가 없습니다.";
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="h-5/6 w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl">
        <div className="no-print flex items-center justify-between">
          <h2 className="text-2xl font-bold">보고서</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <div className="printable mt-4 h-[calc(100%-80px)] overflow-y-auto" ref={reportContentRef}>
          <div className="mb-4 rounded-md border p-4">
            <h3 className="mb-2 text-lg font-bold">검색조건</h3>
            <p>{getFilterText()}</p>
          </div>
          <div className="mb-4 rounded-md border p-4">
            <h3 className="mb-2 text-lg font-bold">출처</h3>
            <p>{REPORT_SOURCE}</p>
          </div>
          <div className="mb-4 rounded-md border p-4">
            <h3 className="mb-2 text-lg font-bold">지도 시각화 화면</h3>
            <div style={{ position: "relative" }}>
              {mapImage ? (
                <img src={mapImage} alt="Map Capture" className="w-full" />
              ) : (
                <div className="no-print flex h-96 w-full items-center justify-center bg-gray-200">
                  <p>지도를 캡처해주세요.</p>
                </div>
              )}
              {legendImage && <img className="absolute bottom-0 left-2 max-h-[200px] max-w-[200px]" src={legendImage} alt="Legend Capture" />}
            </div>
          </div>
        </div>
        <div className="no-print mt-4 flex justify-end gap-2">
          <button onClick={handlePrint} className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700">
            인쇄
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
