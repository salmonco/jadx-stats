import html2canvas from "html2canvas";

interface CreateReportHtmlParams {
  reportContentRef: HTMLDivElement;
  reportHeaderRef: HTMLDivElement;
  filterText: string;
  reportSource: string;
}

const captureAsImage = async (element: HTMLElement) => {
  const canvas = await html2canvas(element, { useCORS: true, scale: 2 });
  return canvas.toDataURL("image/png");
};

const createTableHtml = (filterText: string, reportSource: string) => {
  const cellStyle = "border: 1px solid #d1d5db; padding: 12px; vertical-align: middle; height: 50px;";
  const headerCellStyle = `${cellStyle} background-color: #e5e7eb; text-align: center; font-weight: bold; -webkit-print-color-adjust: exact; print-color-adjust: exact;`;

  return `
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; table-layout: fixed;">
      <tbody>
        <tr style="height: 50px;">
          <td style="width: 16.666667%; ${headerCellStyle}">검색조건</td>
          <td style="width: 33.333333%; ${cellStyle}">${filterText}</td>
          <td style="width: 16.666667%; ${headerCellStyle}">출처</td>
          <td style="width: 33.333333%; ${cellStyle}">${reportSource}</td>
        </tr>
      </tbody>
    </table>
  `;
};

const createTitleHtml = (iconSvg: string, title: string) => {
  return `
    <table style="width: 100%; margin-bottom: 12px; border-collapse: collapse; table-layout: fixed;">
      <tbody>
        <tr style="height: 30px;">
          <td style="width: 24px; vertical-align: middle; padding: 0; height: 30px;">
            ${iconSvg}
          </td>
          <td style="vertical-align: middle; padding-left: 8px; font-size: 18px; font-weight: bold; height: 30px;">
            ${title}
          </td>
        </tr>
      </tbody>
    </table>
  `;
};

export const createReportHtml = async ({ reportContentRef, reportHeaderRef, filterText, reportSource }: CreateReportHtmlParams) => {
  const reportSections = Array.from(reportContentRef.querySelectorAll(".report-section"));
  const chartContainer = reportContentRef.querySelector(".chart-container");
  const chartSections = chartContainer ? Array.from(chartContainer.children) : [];

  const headerImage = await captureAsImage(reportHeaderRef);
  const tableHtml = createTableHtml(filterText, reportSource);

  // 아이콘 SVG
  const mapIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>`;
  const tableIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>`;
  const chartIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>`;

  // 지도 섹션
  const mapSection = reportSections[1];
  const mapContent = mapSection?.querySelector('div[style*="position: relative"]');
  const mapContentImage = mapContent ? await captureAsImage(mapContent as HTMLElement) : "";
  const mapSectionHtml = mapContentImage
    ? `
      <div style="margin-bottom: 16px; padding: 16px; page-break-inside: avoid;">
        ${createTitleHtml(mapIconSvg, "지도 시각화 화면")}
        <img src="${mapContentImage}" style="width: 100%; height: auto; display: block; border-radius: 8px;" />
      </div>
    `
    : "";

  // 차트 섹션들
  let chartSectionsHtml = "";
  for (let i = 0; i < chartSections.length; i++) {
    const section = chartSections[i] as HTMLElement;
    const icon = i === 0 ? tableIconSvg : chartIconSvg;
    const title = i === 0 ? "데이터 표" : "데이터 그래프";

    if (i === 1) {
      const chartWrapper = section.querySelector("div.flex.flex-col.gap-4");

      if (chartWrapper) {
        const individualCharts = Array.from(chartWrapper.children);

        for (let j = 0; j < individualCharts.length; j++) {
          const chart = individualCharts[j];
          const chartImage = await captureAsImage(chart as HTMLElement);

          if (j === 0) {
            chartSectionsHtml += `
              <div style="margin-bottom: 16px; padding: 16px; page-break-inside: avoid;">
                ${createTitleHtml(icon, title)}
                <img src="${chartImage}" style="width: 100%; height: auto; display: block;" />
              </div>
            `;
          } else {
            chartSectionsHtml += `
              <div style="padding: 0 16px 16px 16px; page-break-inside: avoid;">
                <img src="${chartImage}" style="width: 100%; height: auto; display: block;" />
              </div>
            `;
          }
        }
      }
    } else {
      const content = Array.from(section.children).filter((child) => child.tagName !== "H3");
      const tempDiv = document.createElement("div");
      content.forEach((child) => tempDiv.appendChild(child.cloneNode(true)));
      document.body.appendChild(tempDiv);
      const contentImage = await captureAsImage(tempDiv);
      document.body.removeChild(tempDiv);

      chartSectionsHtml += `
        <div style="margin-bottom: 16px; padding: 16px; page-break-inside: avoid;">
          ${createTitleHtml(icon, title)}
          <img src="${contentImage}" style="width: 100%; height: auto; display: block;" />
        </div>
      `;
    }
  }

  return `
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
        ${mapSectionHtml}
        ${chartSectionsHtml}
      </body>
    </html>
  `;
};
