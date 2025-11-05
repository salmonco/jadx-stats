import { Maximize } from "lucide-react";
import { useMapList } from "~/maps/hooks/useMapList";

interface LayerHeaderProps {
  mapId: string;
  onClickFullScreen?: () => void;
}

const LayerHeader = ({ mapId, onClickFullScreen }: LayerHeaderProps) => {
  const mapList = useMapList();
  const map = mapList.getMapById(mapId);

  if (!map) {
    return null;
  }

  return (
    <div className="absolute left-0 top-0 flex w-full justify-between bg-[#37445E] p-3">
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
        {/* TODO: 공유 구현 */}
        <div>공유</div>
        <button onClick={() => mapList.addMap()} className="text-white" aria-label="지도 추가" title="지도 추가">
          +
        </button>
      </div>
    </div>
  );
};

export default LayerHeader;
