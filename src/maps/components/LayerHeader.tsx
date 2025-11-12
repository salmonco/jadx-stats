import { FileText, Maximize, Share2 } from "lucide-react";
import { useState } from "react";
import CommonBackgroundMap from "~/maps/classes/CommonBackgroundMap";
import { useMapList } from "~/maps/hooks/useMapList";
import useMapShare from "~/maps/hooks/useMapShare";
import { ExtendedOLMap } from "../hooks/useOLMap";
import ReportModal from "./ReportModal";
import ShareModal from "./ShareModal";

interface Props<M> {
  map: M;
  olMap: ExtendedOLMap;
  onClickFullScreen?: () => void;
}

const LayerHeader = <M extends CommonBackgroundMap>({ map, olMap, onClickFullScreen }: Props<M>) => {
  const mapList = useMapList<M>();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const { isShareModalOpen, shareUrl, onClickShare, onCloseShareModal } = useMapShare({ map });

  if (!map) {
    return null;
  }

  const onClickReport = () => {
    setIsReportModalOpen(true);
  };

  const onCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  return (
    <>
      <div className="absolute left-0 top-0 z-10 flex w-full justify-between bg-[#37445E] p-3">
        <div className="flex items-center gap-2.5">
          <div className="text-2xl font-semibold text-white">{map.title}</div>
          {map.tooltip}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onClickReport} className="text-white" aria-label="보고서" title="보고서">
            <FileText />
          </button>
          <button onClick={onClickFullScreen} className="text-white" aria-label="전체화면 토글" title="전체화면 토글">
            <Maximize />
          </button>
          <button onClick={onClickShare} className="text-white" aria-label="공유" title="공유">
            <Share2 />
          </button>
          <button onClick={() => mapList.addMap()} className="text-white" aria-label="지도 추가" title="지도 추가">
            +
          </button>
        </div>
      </div>
      {isShareModalOpen && <ShareModal url={shareUrl} onClose={onCloseShareModal} />}
      {isReportModalOpen && <ReportModal map={map} olMap={olMap} onClose={onCloseReportModal} />}
    </>
  );
};

export default LayerHeader;
