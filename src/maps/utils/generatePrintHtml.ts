interface GeneratePrintHtmlParams {
  reportHeaderRef: HTMLElement;
  reportContentRef: HTMLElement;
  pageTitle: string;
}

export const generatePrintHtml = ({ reportHeaderRef, reportContentRef, pageTitle }: GeneratePrintHtmlParams): string => {
  // 현재 페이지의 스타일 복사
  const styles = Array.from(document.styleSheets)
    .map((styleSheet) => {
      try {
        return Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join("\n");
      } catch (e) {
        return "";
      }
    })
    .join("\n");

  // 헤더 HTML에서 report-header-hidden 클래스 제거
  const headerDiv = reportHeaderRef.cloneNode(true) as HTMLElement;
  headerDiv.classList.remove("report-header-hidden");
  const headerHtml = headerDiv.outerHTML;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>보고서 - ${pageTitle}</title>
        <style>
          ${styles}
          @media print {
            body { margin: 0; padding: 20px; }
            .no-print { display: none !important; }
            .report-section { 
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .mb-4 { 
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .h-full { 
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .w-full { 
              page-break-inside: avoid;
              break-inside: avoid;
            }
            table {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        ${headerHtml}
        ${reportContentRef.innerHTML}
      </body>
    </html>
  `;
};
