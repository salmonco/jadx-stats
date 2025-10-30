import Draggable from "react-draggable";
import CropLegend from "~/features/visualization/components/common/CropLegend";

interface FloatingCropLegendProps {
  title: string;
  subtitle?: string;
  excludeCrops?: string[];
  position?: {
    x: number;
    y: number;
  };
}

// (드론재배면적조사 '22&rarr;'23)
const FloatingCropLegend = ({ title, subtitle, excludeCrops, position = { x: 15, y: 15 } }: FloatingCropLegendProps) => {
  return (
    <Draggable grid={[10, 10]} defaultPosition={{ x: position.x, y: position.y }} bounds="parent">
      <div className="pointer-events-auto absolute left-0 top-0 h-[170px] cursor-grabbing rounded-xl bg-[rgba(255,255,255,0.65)] px-4 py-2">
        <span className="flex justify-between">
          <p className="font-sans-kr text-[18px] font-bold">{title}</p>
          {subtitle && <p className="font-sans-kr text-[16px]">{subtitle}</p>}
        </span>
        <div className="mb-4 flex flex-col items-center justify-center pt-1">
          <CropLegend excludeCrops={excludeCrops} />
        </div>
      </div>
    </Draggable>
  );
};

export default FloatingCropLegend;
