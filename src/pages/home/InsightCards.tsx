import { Link } from "@tanstack/react-router";
import { InsightItem } from "./InsightsSection";

const InsightCards = ({ item }: { item: InsightItem }) => {
  return (
    <Link
      to={item.url}
      onClick={() => window.scrollTo({ top: 0 })}
      className="w-full cursor-pointer rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
    >
      <div className="h-[270px] w-full 3xl:h-[350px]">{item.chart}</div>
      <div className="mt-2">
        <div className="flex flex-col gap-2">
          <div className="text-[22px] font-semibold">{item.title}</div>
          <div className="line-clamp-4 text-[16px] leading-[1.5] text-[#4a4a4a]">{item.description}</div>
        </div>
      </div>
    </Link>
  );
};

export default InsightCards;
