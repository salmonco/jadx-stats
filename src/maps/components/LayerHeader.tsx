import { Maximize, Share2 } from "lucide-react";
import { useMapList } from "~/maps/hooks/useMapList";
import useMapShare from "~/maps/hooks/useMapShare";
import ShareModal from "./ShareModal";

interface LayerHeaderProps {
  mapId: string;
  onClickFullScreen?: () => void;
}

const LayerHeader = ({ mapId, onClickFullScreen }: LayerHeaderProps) => {
  const mapList = useMapList();
  const map = mapList.getMapById(mapId);

  const { isShareModalOpen, shareUrl, onClickShare, onCloseShareModal } = useMapShare({ map });

  if (!map) {
    return null;
  }

  return (
    <>
      <div className="absolute left-0 top-0 z-10 flex w-full justify-between bg-[#37445E] p-3">
        <div className="flex items-center gap-2.5">
          <div className="text-2xl font-semibold text-white">{map.title}</div>
          {map.tooltip}
        </div>
        <div className="flex items-center gap-4">
          {/* TODO: 보고서 구현 */}
          <div>보고서</div>
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
    </>
  );
};

export default LayerHeader;
