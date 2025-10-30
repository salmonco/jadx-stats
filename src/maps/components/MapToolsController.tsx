import { useState } from "react";
import { MapPinIcon, RulerIcon, PentagonIcon, RadiusIcon, RefreshCwIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";

interface MapToolsControllerProps {
  toggleTool: (tool: string | null) => void;
}

const MapToolsController = ({ toggleTool }: MapToolsControllerProps) => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const handleToolSelect = (tool: string) => {
    const nextTool = tool === selectedTool ? null : tool;
    setSelectedTool(nextTool);
    toggleTool(nextTool);
  };

  const zoomConfigurations = [
    {
      key: "zoomIn",
      icon: ZoomInIcon,
      label: "확대",
    },
    {
      key: "zoomOut",
      icon: ZoomOutIcon,
      label: "축소",
    },
  ];

  const toolConfigurations = [
    {
      key: "point",
      icon: MapPinIcon,
      label: "포인트",
    },
    {
      key: "distance",
      icon: RulerIcon,
      label: "거리 측정",
    },
    {
      key: "area",
      icon: PentagonIcon,
      label: "면적 측정",
    },
    {
      key: "radius",
      icon: RadiusIcon,
      label: "반경 측정",
    },
    {
      key: "reset",
      icon: RefreshCwIcon,
      label: "초기화",
    },
  ];

  return (
    <div className="absolute right-[13px] top-[200px] flex flex-col gap-[12px]">
      {/* Zoom 그룹 */}
      <div className="flex flex-col overflow-hidden rounded-md bg-white shadow">
        {zoomConfigurations.map(({ key, icon: Icon, label }, index) => (
          <button
            key={key}
            onClick={() => toggleTool(key)}
            className={`flex h-[60px] w-[52px] flex-col items-center justify-center transition-all hover:bg-[#f0f0f0] ${index !== 0 ? "border-t border-gray-200" : ""}`}
          >
            <Icon size={20} strokeWidth={1.75} />
            <span className="mt-1 text-[11px] text-gray-700">{label}</span>
          </button>
        ))}
      </div>

      {/* Tool 그룹 */}
      <div className="flex flex-col overflow-hidden rounded-md bg-white shadow">
        {toolConfigurations.map(({ key, icon: Icon, label }, index) => (
          <button
            key={key}
            onClick={() => handleToolSelect(key)}
            className={`flex h-[60px] w-[52px] flex-col items-center justify-center transition-all ${
              selectedTool === key && key !== "reset" ? "bg-[#37445E] text-white" : "bg-white text-gray-800 hover:bg-[#f0f0f0]"
            } ${index !== 0 ? "border-t border-gray-200" : ""}`}
          >
            <Icon size={20} strokeWidth={1.75} />
            <span className="mt-1 text-[11px]">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MapToolsController;
