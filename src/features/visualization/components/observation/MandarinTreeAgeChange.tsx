import { OffsetRange } from "~/maps/services/MapDataService";
import { Slider, Switch } from "antd";

interface MandarinTreeAgeChangeProps {
  autoplay: boolean;
  setAutoplay: (value: boolean) => void;
  offset: OffsetRange;
  setOffset: (value: OffsetRange) => void;
  selectedTargetYear: number;
  setSelectedTargetYear: (year: number) => void;
}

const MandarinTreeAgeChange = ({ autoplay, setAutoplay, offset, setOffset, selectedTargetYear, setSelectedTargetYear }: MandarinTreeAgeChangeProps) => (
  <div className="flex flex-col gap-2 rounded-lg bg-[#43516D] p-5">
    <div className="flex items-center justify-between">
      <p className="text-[18px] font-semibold text-white">나무수령 시뮬레이션</p>
    </div>
    <div className="flex flex-col">
      <div className="mx-1 flex items-center justify-between">
        <div className="flex items-center">
          <p className="mr-2 text-[16px]">자동재생</p>
          <Switch checked={autoplay} onChange={(e) => setAutoplay(e)} />
        </div>
        <p className="text-[24px]">
          +{offset}년 : {selectedTargetYear}
        </p>
      </div>
      <Slider
        min={0}
        max={10}
        step={1}
        value={parseInt(offset)}
        onChange={(x) => {
          setOffset(x.toString() as OffsetRange);
          setSelectedTargetYear(2025 + x);
        }}
      />
    </div>
  </div>
);

export default MandarinTreeAgeChange;
