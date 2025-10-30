import { Button } from "antd";
import { ExternalLink } from "lucide-react";
import { statisticsSourceMap } from "~/features/statistics/utils/statisticsSourceMap";

interface Props {
  title: string;
  children: React.ReactNode;
  subject?: string;
}

const StatisticsContainer = ({ title, children, subject }: Props) => {
  const source = statisticsSourceMap.find((item) => item.category === (subject ?? title));

  const handleOpenNewWindow = () => {
    if (!source?.sourceUrl) return;

    const newWindow = window.open(source.sourceUrl, "newWindow", "width=1200,height=800,top=100,left=100,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes");

    if (newWindow) {
      newWindow.opener = null;
    }
  };

  const isValidUrl = (url?: string) => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl p-5">
      <div className="flex items-center justify-between rounded-lg bg-[#37445E] px-5 py-4 text-white">
        <div className="flex items-center gap-[16px]">
          <span className="text-[24px] font-semibold">{title}</span>
          {/* YearRangeSelector -> 차트 상단으로 이동 (기획 변경...) */}
          {/* <YearRangeSelector range={yearRange} selectedYearRange={selectedYearRange} onChange={handleRangeChange} /> */}
        </div>
        {source?.sourceUrl && isValidUrl(source.sourceUrl) ? (
          <Button
            type="primary"
            icon={<ExternalLink width={16} height={16} strokeWidth={1.75} />}
            onClick={handleOpenNewWindow}
            className="bg-[#FFC132] text-[#454545] hover:!bg-[#ffd332] hover:!text-[#454545]"
          >
            통계출처 : KOSIS {source.sourceTitle}
          </Button>
        ) : source?.sourceUrl ? (
          <Button type="primary" className="pointer-events-none bg-[#FFC132] text-[#454545] hover:!bg-[#ffd332] hover:!text-[#454545]">
            통계출처 : {source.sourceUrl}
          </Button>
        ) : null}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
};

export default StatisticsContainer;
