import { Maximize } from "lucide-react";

interface LayerHeaderProps {
  title: string;
  tooltip?: React.ReactNode;
  onClickFullScreen?: () => void;
  onAddMap: () => void;
}

const LayerHeader = ({ title, tooltip, onClickFullScreen, onAddMap }: LayerHeaderProps) => {
  return (
    <div className="absolute left-0 top-0 flex w-full justify-between bg-[#37445E] p-3">
      <div className="flex items-center gap-2.5">
        <div className="text-2xl font-semibold text-white">{title}</div>
        {tooltip}
      </div>
      <div className="flex items-center gap-4">
        {/* TODO: 보고서 구현 */}
        <div>보고서</div>
        <button onClick={onClickFullScreen} className="text-white" aria-label="전체화면 토글" title="전체화면 토글">
          <Maximize />
        </button>
        {/* TODO: 공유 구현 */}
        <div>공유</div>
        <button onClick={onAddMap} className="text-white" aria-label="지도 추가" title="지도 추가">
          +
        </button>
      </div>
    </div>
  );
};

export default LayerHeader;
