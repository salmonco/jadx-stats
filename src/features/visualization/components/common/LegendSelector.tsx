import { Check } from "lucide-react";
import clsx from "clsx";
import { Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";

interface SelectableLegendProps {
  title: string;
  items: { label: string; color: string }[];
  selectedValues: string[];
  setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
  direction?: "horizontal" | "vertical";
  itemsPerRow?: number;
}

const LegendSelector = ({ title, items, selectedValues, setSelectedValues, direction = "vertical", itemsPerRow = 4 }: SelectableLegendProps) => {
  const [overflowMap, setOverflowMap] = useState<Record<number, boolean>>({});

  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const newOverflowMap: Record<number, boolean> = {};
    textRefs.current.forEach((el, index) => {
      if (!el) return;
      newOverflowMap[index] = el.scrollWidth > el.clientWidth;
    });
    setOverflowMap(newOverflowMap);
  }, [items]);

  const toggle = (label: string) => {
    setSelectedValues((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]));
  };

  return (
    <div className="flex flex-col gap-[8px] rounded-lg bg-[#43516D] p-5">
      <p className="text-[18px] font-semibold text-white">{title}</p>
      <div className={clsx("grid gap-[6px] rounded-lg py-[4px]", direction === "horizontal" ? `grid-cols-${itemsPerRow}` : "grid-cols-1")}>
        {items.map((item, index) => {
          const isSelected = selectedValues.includes(item.label);

          const labelSpan = (
            <span
              ref={(el: HTMLSpanElement | null) => {
                textRefs.current[index] = el;
              }}
              className={clsx(
                "w-[80px] overflow-hidden text-ellipsis whitespace-nowrap text-[16px] 3xl:w-[110px] 4xl:w-[140px]",
                isSelected ? "font-medium text-white" : "text-[#bebebe]"
              )}
            >
              {item.label}
            </span>
          );

          return (
            <button key={index} onClick={() => toggle(item.label)} className="flex items-center gap-[6px] text-left">
              <div
                className="relative flex h-[18px] w-[18px] items-center justify-center rounded-full"
                style={{
                  backgroundColor: item.color,
                  border: `1px solid ${item.color}`,
                  opacity: isSelected ? 1 : 0.3,
                }}
              >
                {isSelected && (
                  <span className="text-[12px] font-bold leading-none text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </div>
              {overflowMap[index] ? (
                <Tooltip title={item.label} placement="topLeft">
                  {labelSpan}
                </Tooltip>
              ) : (
                labelSpan
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LegendSelector;
