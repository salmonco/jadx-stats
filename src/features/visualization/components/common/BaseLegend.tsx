import { Check } from "lucide-react";

export interface BaseLegendItem {
  label: string;
  color: string;
}

interface Props {
  title: string;
  items: BaseLegendItem[];
  direction?: "horizontal" | "vertical";
  itemsPerRow?: number;
}

const BaseLegend = ({ title, items, direction = "vertical", itemsPerRow = 4 }: Props) => {
  return (
    <div className="flex flex-col gap-[8px] rounded-lg bg-[#43516D] p-5">
      <p className="text-[18px] font-semibold text-white">{title}</p>
      <div className={`grid ${direction === "horizontal" ? `grid-cols-${itemsPerRow}` : "grid-cols-1"} gap-[6px] rounded-lg py-[4px]`}>
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-[6px]">
            <div
              className="relative flex h-[18px] w-[18px] items-center justify-center rounded-full"
              style={{
                backgroundColor: item.color,
                border: `1px solid ${item.color}`,
              }}
            >
              <span className="text-[12px] font-bold leading-none text-white">
                <Check size={12} strokeWidth={3} />
              </span>
            </div>
            <span className="text-[16px] text-white">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BaseLegend;
