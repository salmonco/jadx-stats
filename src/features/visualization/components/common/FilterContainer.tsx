import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Props {
  width?: number;
  isFixed?: boolean;
  children: React.ReactNode;
}

const FilterContainer = ({ children, isFixed = false }: Props) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`${isFixed && isExpanded ? "flex-[2]" : ""} scrollbar-hide flex flex-col gap-3 overflow-y-auto rounded-lg bg-white opacity-90`}>
      <div className="relative flex items-center justify-center bg-[#2170E6] px-4 py-3">
        <h3 className="font-bold text-white">선택필터</h3>
        <button onClick={() => setIsExpanded(!isExpanded)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
          <ChevronDown className={`h-5 w-5 transform text-white transition-transform duration-200 ${isExpanded ? "rotate-180" : "rotate-0"}`} />
        </button>
      </div>
      {isExpanded && <div className="px-4 py-3">{children}</div>}
    </div>
  );
};

export default FilterContainer;
