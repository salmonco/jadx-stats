import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { FileText, Printer, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import logo from "~/assets/logo.png";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import { formatDateTime } from "~/utils/formatDateTime";
import { ExtendedOLMap } from "../hooks/useOLMap";

interface Props<M> {
  map: M;
  olMap: ExtendedOLMap;
  onClose: () => void;
}

const MAP_CAPTURE_DELAY = 200;
const REPORT_SOURCE = "제주농업통계시스템";
const REPORT_SOURCE_URL = "https://agri.jeju.go.kr/stats/";

/** A4 width in mm */
const PAGE_WIDTH = 210;
/** A4 height in mm */
const PAGE_HEIGHT = 297;

const ReportModal = <M extends CommonBackgroundMap>({ map, olMap, onClose }: Props<M>) => {
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

  const captureAsImage = async (element: HTMLElement) => {
    const canvas = await html2canvas(element, { useCORS: true, scale: 2 });
    return canvas.toDataURL("image/png");
  };

  const createTableHtml = () => {
    const cellStyle = "border: 1px solid #d1d5db; padding: 12px; vertical-align: middle; height: 50px;";
    const headerCellStyle = `${cellStyle} background-color: #e5e7eb; text-align: center; font-weight: bold; -webkit-print-color-adjust: exact; print-color-adjust: exact;`;

    return `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; table-layout: fixed;">
        <tbody>
          <tr style="height: 50px;">
            <td style="width: 16.666667%; ${headerCellStyle}">검색조건</td>
            <td style="width: 33.333333%; ${cellStyle}">${filterText}</td>
            <td style="width: 16.666667%; ${headerCellStyle}">출처</td>
            <td style="width: 33.333333%; ${cellStyle}">${REPORT_SOURCE}</td>
          </tr>
        </tbody>
      </table>
    `;
  };

  const createPrintDocument = (headerImage: string, tableHtml: string, imagesHtml: string) => `
    <html>
      <head>
        <title>보고서</title>
        <style>
          @page { size: A4; margin: 10mm; }
          body { margin: 0; padding: 0; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        </style>
      </head>
      <body>
        <img src="${headerImage}" style="width: 100%; height: auto; display: block; margin-bottom: 16px;" />
        ${tableHtml}
        ${imagesHtml}
      </body>
    </html>
  `;

  const handlePrint = async () => {
    if (!reportContentRef.current || !reportHeaderRef.current) {
      alert("보고서 내용을 찾을 수 없습니다.");
      return;
    }

    try {
      const reportSections = Array.from(reportContentRef.current.querySelectorAll(".report-section"));
      const chartContainer = reportContentRef.current.querySelector(".chart-container");
      const chartSections = chartContainer ? Array.from(chartContainer.children) : [];
      const sectionsToCapture = [...reportSections.slice(1), ...chartSections];

      const headerImage = await captureAsImage(reportHeaderRef.current);
      const tableHtml = createTableHtml();

      const sectionImages = await Promise.all(sectionsToCapture.map((section) => captureAsImage(section as HTMLElement)));
      const imagesHtml = sectionImages.map((img) => `<img src="${img}" style="width: 100%; height: auto; display: block; margin-bottom: 16px;" />`).join("");

      const printWindow = window.open("", "", `width=${window.innerWidth},height=${window.innerHeight}`);
      if (!printWindow) {
        alert("팝업이 차단되었습니다.");
        return;
      }

      printWindow.document.write(createPrintDocument(headerImage, tableHtml, imagesHtml));
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
      const pdf = new jsPDF("p", "mm", "a4");
      const reportSections = Array.from(reportContentRef.current.querySelectorAll(".report-section"));
      const chartContainer = reportContentRef.current.querySelector(".chart-container");
      const chartSections = chartContainer ? Array.from(chartContainer.children) : [];
      const allSections = [reportHeaderRef.current, ...reportSections, ...chartSections];

      const maxY = PAGE_HEIGHT;
      let currentY = 10;

      for (const section of allSections) {
        const canvas = await html2canvas(section as HTMLElement, {
          useCORS: true,
          scale: 2,
        });

        const imgWidth = PAGE_WIDTH - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const imgData = canvas.toDataURL("image/png");

        // 섹션이 현재 페이지에 들어가지 않으면 새 페이지
        if (currentY + imgHeight > maxY) {
          pdf.addPage();
          currentY = 10;
        }

        pdf.addImage(imgData, "PNG", 10, currentY, imgWidth, imgHeight);
        currentY += imgHeight + 5;
      }

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
          <div className="report-section mb-4 rounded-md border p-4">
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
          <div className="chart-container">{map.renderChart(true)}</div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
