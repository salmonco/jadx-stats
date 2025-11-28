import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { FileText, Printer, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import { ExtendedOLMap } from "../hooks/useOLMap";

interface Props<M> {
  map: M;
  olMap: ExtendedOLMap;
  onClose: () => void;
}

const MAP_CAPTURE_DELAY = 200;
const REPORT_SOURCE = "제주농업통계시스템";

/** A4 width in mm */
const PAGE_WIDTH = 210;
/** A4 height in mm */
const PAGE_HEIGHT = 297;

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

    // Capture map
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

    // Capture legend
    const parentElement = olMap.getTargetElement().parentElement;
    const legendElement = parentElement ? parentElement.querySelector(".legend-container") : null;

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

  const filterText = useMemo(() => {
    const parts = map.getFilterText();
    if (parts.length > 0) {
      return parts.join(" + ");
    }
    return "적용된 필터가 없습니다.";
  }, [map]);

  const handlePrint = async () => {
    if (!reportContentRef.current) {
      alert("보고서 내용을 찾을 수 없습니다.");
      return;
    }

    const element = reportContentRef.current;
    const originalOverflow = element.style.overflow;
    const originalHeight = element.style.height;

    try {
      element.style.overflow = "visible";
      element.style.height = "auto";

      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 2,
      });

      element.style.overflow = originalOverflow;
      element.style.height = originalHeight;

      const imgData = canvas.toDataURL("image/png");
      const printWindow = window.open("", "", `width=${window.innerWidth},height=${window.innerHeight}`);

      if (!printWindow) {
        alert("팝업이 차단되었습니다.");
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>보고서</title>
            <style>
              @page { size: A4; margin: 0; }
              body { margin: 0; padding: 0; }
              img { width: 100%; height: auto; display: block; }
            </style>
          </head>
          <body>
            <img src="${imgData}" />
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } catch (error) {
      element.style.overflow = originalOverflow;
      element.style.height = originalHeight;
      console.error("Error printing:", error);
      alert("인쇄 중 오류가 발생했습니다.");
    }
  };

  const handleSavePdf = async () => {
    if (!reportContentRef.current) {
      alert("보고서 내용을 찾을 수 없습니다.");
      return;
    }

    const element = reportContentRef.current;
    const originalOverflow = element.style.overflow;
    const originalHeight = element.style.height;

    try {
      element.style.overflow = "visible";
      element.style.height = "auto";

      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 2,
      });

      element.style.overflow = originalOverflow;
      element.style.height = originalHeight;

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgHeight = (canvas.height * PAGE_WIDTH) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, PAGE_WIDTH, imgHeight);
      heightLeft -= PAGE_HEIGHT;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, PAGE_WIDTH, imgHeight);
        heightLeft -= PAGE_HEIGHT;
      }

      pdf.save("보고서.pdf");
      alert("PDF가 성공적으로 저장되었습니다.");
    } catch (error) {
      element.style.overflow = originalOverflow;
      element.style.height = originalHeight;
      console.error("Error saving PDF:", error);
      alert("PDF 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="h-5/6 w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl">
        <div className="no-print flex items-center justify-between">
          <h2 className="text-2xl font-bold">보고서</h2>
          <div className="flex items-center gap-2">
            <button onClick={handleSavePdf} className="flex items-center gap-1 text-gray-500 hover:text-gray-800" aria-label="PDF 저장" title="PDF 저장">
              <FileText size={20} />
              <span>PDF</span>
            </button>
            <button onClick={handlePrint} className="flex items-center gap-1 text-gray-500 hover:text-gray-800" aria-label="인쇄" title="인쇄">
              <Printer size={20} />
              <span>인쇄</span>
            </button>
            <button onClick={onClose} className="flex items-center gap-1 text-gray-500 hover:text-gray-800" aria-label="닫기" title="닫기">
              <X size={20} />
              <span>닫기</span>
            </button>
          </div>
        </div>
        <div className="printable mt-4 h-[calc(100%-80px)] overflow-y-auto" ref={reportContentRef}>
          <div className="mb-4 rounded-md border p-4">
            <h3 className="mb-2 text-lg font-bold">검색조건</h3>
            <p>{filterText}</p>
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
                  <p>지도를 불러오는 중...</p>
                </div>
              )}
              {legendImage && <img className="absolute bottom-0 left-2 max-h-[200px] max-w-[200px]" src={legendImage} alt="Legend Capture" />}
            </div>
          </div>
          {map.renderChart(true)}
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
