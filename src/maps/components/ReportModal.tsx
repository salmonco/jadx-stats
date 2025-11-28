import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { FileText, Map, Printer, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import logo from "~/assets/logo.png";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import { createReportHtml } from "~/maps/utils/createReportHtml";
import { formatDateTime } from "~/utils/formatDateTime";
import { ExtendedOLMap } from "../hooks/useOLMap";

interface Props<M> {
  map: M;
  olMap: ExtendedOLMap;
  onClose: () => void;
  pageTitle: string;
}

const MAP_CAPTURE_DELAY = 200;
const REPORT_SOURCE = "제주농업통계시스템";
const REPORT_SOURCE_URL = "https://agri.jeju.go.kr/stats/";

/** A4 width in mm */
const PAGE_WIDTH = 210;
/** A4 height in mm */
const PAGE_HEIGHT = 297;

const ReportModal = <M extends CommonBackgroundMap>({ map, olMap, onClose, pageTitle }: Props<M>) => {
  const [mapImage, setMapImage] = useState<string | null>(null);
  const [legendImage, setLegendImage] = useState<string | null>(null);
  const reportContentRef = useRef<HTMLDivElement>(null);
  const reportHeaderRef = useRef<HTMLDivElement>(null);
  const currentDateTime = useMemo(() => formatDateTime(), []);

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
    if (!reportContentRef.current || !reportHeaderRef.current) {
      alert("보고서 내용을 찾을 수 없습니다.");
      return;
    }

    try {
      const reportHtml = await createReportHtml({
        reportContentRef: reportContentRef.current,
        reportHeaderRef: reportHeaderRef.current,
        filterText,
        reportSource: REPORT_SOURCE,
        pageTitle,
      });

      const printWindow = window.open("", "", `width=${window.innerWidth},height=${window.innerHeight}`);
      if (!printWindow) {
        alert("팝업이 차단되었습니다.");
        return;
      }

      printWindow.document.write(reportHtml);
      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } catch (error) {
      console.error("Error printing:", error);
      alert("인쇄 중 오류가 발생했습니다.");
    }
  };

  const handleSavePdf = async () => {
    if (!reportContentRef.current || !reportHeaderRef.current) {
      alert("보고서 내용을 찾을 수 없습니다.");
      return;
    }

    try {
      const reportHtml = await createReportHtml({
        reportContentRef: reportContentRef.current,
        reportHeaderRef: reportHeaderRef.current,
        filterText,
        reportSource: REPORT_SOURCE,
        pageTitle,
        forPdf: true,
      });

      // 임시 iframe에 HTML 렌더링
      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.left = "-9999px";
      iframe.style.width = "210mm";
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error("iframe document not available");
      }

      iframeDoc.open();
      iframeDoc.write(reportHtml);
      iframeDoc.close();

      // iframe 로드 대기
      await new Promise((resolve) => setTimeout(resolve, 500));

      // iframe 내용을 PDF로 변환
      const pdf = new jsPDF("p", "mm", "a4");
      const body = iframeDoc.body;
      const sections = Array.from(body.children);

      const maxY = PAGE_HEIGHT - 20;
      let currentY = 10;

      for (const section of sections) {
        const canvas = await html2canvas(section as HTMLElement, { useCORS: true, scale: 2 });
        const imgHeight = (canvas.height * (PAGE_WIDTH - 20)) / canvas.width;

        if (currentY + imgHeight > maxY) {
          pdf.addPage();
          currentY = 10;
        }

        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 10, currentY, PAGE_WIDTH - 20, imgHeight);
        currentY += imgHeight + 8;
      }

      document.body.removeChild(iframe);

      pdf.save("보고서.pdf");
      alert("PDF가 성공적으로 저장되었습니다.");
    } catch (error) {
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
          <div className="report-header-hidden mb-4 flex items-start justify-between border-b pb-4" ref={reportHeaderRef}>
            <img src={logo} alt="제주농업통계시스템" className="h-10" />
            <div className="text-right text-sm">
              <div className="font-bold">
                {REPORT_SOURCE} ({REPORT_SOURCE_URL})
              </div>
              <div className="mt-1 text-gray-600">작성일자 : {currentDateTime}</div>
            </div>
          </div>
          <div className="report-section mb-4">
            <div className="mb-4 flex items-center justify-center">
              <h2 className="text-xl font-bold">{pageTitle}</h2>
            </div>
          </div>
          <div className="report-section mb-4">
            <table className="w-full border-collapse border" style={{ tableLayout: "fixed" }}>
              <tbody>
                <tr style={{ height: "50px" }}>
                  <td className="w-1/6 border bg-gray-200 px-3 text-center font-bold" style={{ verticalAlign: "middle", height: "50px", backgroundColor: "#e5e7eb" }}>
                    검색조건
                  </td>
                  <td className="w-1/3 border px-3" style={{ verticalAlign: "middle", height: "50px" }}>
                    {filterText}
                  </td>
                  <td className="w-1/6 border bg-gray-200 px-3 text-center font-bold" style={{ verticalAlign: "middle", height: "50px", backgroundColor: "#e5e7eb" }}>
                    출처
                  </td>
                  <td className="w-1/3 border px-3" style={{ verticalAlign: "middle", height: "50px" }}>
                    {REPORT_SOURCE}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="report-section mb-4 rounded-md p-4">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
              <Map size={24} />
              <span>지도 시각화 화면</span>
            </h3>
            <div style={{ position: "relative" }}>
              {mapImage ? (
                <img src={mapImage} alt="Map Capture" className="w-full rounded-lg" />
              ) : (
                <div className="no-print flex h-96 w-full items-center justify-center bg-gray-200">
                  <p>지도를 불러오는 중...</p>
                </div>
              )}
              {legendImage && <img className="absolute bottom-0 left-2 max-h-[200px] max-w-[200px]" src={legendImage} alt="Legend Capture" />}
            </div>
          </div>
          <div className="chart-container">{map.renderChart(true)}</div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
