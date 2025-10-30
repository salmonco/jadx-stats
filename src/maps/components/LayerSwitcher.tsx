import { useEffect, useMemo, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { LayerManager } from "~/maps/hooks/useLayerManager";
import { Button, Checkbox, Dropdown } from "antd";
import { UpOutlined } from "@ant-design/icons";

interface LayerSwitcherProps {
  layerManager: LayerManager;
}

const usePollingCounter = (intervalMs = 500) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCounter((prevCounter) => prevCounter + 1), intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);

  return { counter, setCounter };
};

interface OrderUpDownProps {
  onUp?: () => void;
  onDown?: () => void;
}

const OrderUpDown = ({ onUp, onDown }: OrderUpDownProps) => (
  <div className="flex flex-col items-center justify-center">
    <ChevronUp className="h-[14px] cursor-pointer hover:text-blue-600" onClick={onUp} />
    <ChevronDown className="h-[14px] cursor-pointer hover:text-blue-600" onClick={onDown} />
  </div>
);

const LayerSwitcher = ({ layerManager }: LayerSwitcherProps) => {
  const { counter, setCounter } = usePollingCounter();
  const rerender = () => setCounter((prevCounter) => prevCounter + 1);

  const toggleLayerVisibility = (name: string, visible: boolean) => {
    layerManager.setLayerVisibility(name, visible);
    rerender();
  };

  const handleLayerMove = (name: string, direction: "up" | "down") => {
    if (direction === "up") layerManager.moveLayerUp(name);
    if (direction === "down") layerManager.moveLayerDown(name);
    rerender();
  };

  const layerControls = useMemo(() => {
    const states = new Map<string, boolean>();
    layerManager.layers.forEach((layer, name) => states.set(name, layer.getLayer().getVisible()));

    return layerManager
      .getOrderedLayers()
      .reverse()
      .filter(([name]) => name !== "tile" && name !== "highlightLayer")
      .map(([name, layer], idx) => {
        const displayName = layer.verboseName || name;

        return {
          key: name,
          label: (
            <div key={idx} className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center">
                <Checkbox checked={states.get(name)} onChange={(e) => toggleLayerVisibility(name, e.target.checked)} />
                <p className="ml-2">{displayName}</p>
              </div>
              {/* ▲▼ 매핑 반전 */}
              <OrderUpDown
                onUp={() => handleLayerMove(name, "down")} // ▲ : 실제로는 아래로 인덱스 +1
                onDown={() => handleLayerMove(name, "up")} // ▼ : 실제로는 위로 인덱스 -1
              />
            </div>
          ),
        };
      });
  }, [layerManager, counter]);

  return (
    <Dropdown
      menu={{ items: layerControls }}
      trigger={["click"]}
      placement="topRight"
      className="absolute bottom-3 right-[110px] flex transform gap-[15px]"
      dropdownRender={(menu) => <div style={{ width: "fit-content", minWidth: "180px" }}>{menu}</div>}
    >
      <Button className="bg-white">
        레이어 <UpOutlined />
      </Button>
    </Dropdown>
  );
};

export default LayerSwitcher;
