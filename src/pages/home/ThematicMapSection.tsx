import { useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import thematicMap1 from "~/assets/thematic-map-1.jpg";
import thematicMap2 from "~/assets/thematic-map-2.jpg";
import thematicMap3 from "~/assets/thematic-map-3.jpg";
import thematicMap4 from "~/assets/thematic-map-4.jpg";

const ThematicMapSection = () => {
  const navigate = useNavigate();

  const data = [
    {
      src: thematicMap1,
      title: "생산",
      description: "생산 현황 및 분포를 확인하세요!",
      link: "/spc/prod/rgn-cifru-cltvtn",
    },
    {
      src: thematicMap2,
      title: "관측",
      description: "관측 현황 및 분포를 확인하세요!",
      link: "/spc/obsrvn/obsrvn-info-cmp",
    },
    {
      src: thematicMap3,
      title: "농업환경",
      description: "농업환경 현황 및 분포를 확인하세요!",
      link: "/spc/agrclt-env/gwt-anls-dsbrd",
    },
    {
      src: thematicMap4,
      title: "유통",
      description: "유통 현황 및 분포를 확인하세요!",
      link: "/spc/rtl/whlsl-mrkt-share",
    },
  ];

  return (
    <div className="flex min-h-[530px] w-full items-center bg-[#f0f6ff]">
      <div className="relative mx-auto flex h-full w-full max-w-[1300px] flex-col gap-2 px-16 py-20 2xl:max-w-[1400px] 3xl:max-w-[1600px] 3xl:py-28 4xl:max-w-[1900px]">
        <span className="text-[36px] font-semibold">주제별 지도</span>
        <span className="text-[20px] text-[#4a4a4a]">제주 농업 관련 다양한 지도를 확인하세요.</span>
        <div className="mt-7 grid w-full grid-cols-2 gap-6">
          {data.map(({ src, title, description, link }, idx) => (
            <div className="relative h-[350px] overflow-hidden rounded-xl shadow-xl transition-all duration-200 hover:scale-[1.01] hover:shadow-md 3xl:h-[420px]">
              <img src={src} alt={`thematic-map-${idx + 1}`} className="h-full w-full" />
              <div className="absolute bottom-0 left-0 flex w-full items-center justify-between gap-3 bg-black/10 px-6 py-4 text-white backdrop-blur-md">
                <div className="flex flex-col gap-0">
                  <div className="text-xl font-semibold">{title}</div>
                  <div className="text-md">{description}</div>
                </div>
                <button
                  className="flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#1D3A8A] shadow-sm hover:bg-gray-100"
                  onClick={() => {
                    navigate({ to: link });
                    window.scrollTo({ top: 0, behavior: "instant" });
                  }}
                >
                  자세히 <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThematicMapSection;
