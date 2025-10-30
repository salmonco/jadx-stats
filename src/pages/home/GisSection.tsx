import banner from "~/assets/home-banner.png";
import gisInfo from "~/assets/gis-info.png";
import { Map, MapPin, MoveUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

const GisSection = () => {
  return (
    <div className="relative flex min-h-[700px] w-full items-center overflow-hidden bg-white 3xl:min-h-[760px]">
      <img src={banner} alt="background" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[#002872] opacity-[80%]" />
      <div className="relative mx-auto flex w-full max-w-[1400px] px-16 py-24 3xl:max-w-[1600px] 4xl:max-w-[1900px]">
        <div className="relative w-[55%] pr-[24px]">
          <img src={gisInfo} alt="gis-info" className="w-[100%] max-w-[960px]" />
          <div className="absolute right-[-34%] top-[38%] flex w-full flex-col items-center justify-center gap-2 3xl:right-[-36%] 3xl:top-[40%]">
            <div className="flex w-[170px] items-center justify-center gap-2 rounded-xl bg-[#008BFE] p-3 text-white">
              <Map className="h-4 w-4" />
              지도 시각화 표출
            </div>
            <div className="flex w-[170px] items-center justify-center gap-2 rounded-xl bg-black p-3 text-white">
              <MapPin className="h-4 w-4" />
              GIS 통합 솔루션
            </div>
          </div>
        </div>
        <div className="flex w-[45%] flex-col justify-center gap-1 pl-[16px]">
          <div className="text-[20px] text-[#ADF1FF]">지도 기반으로 살펴보는 제주 농업 공간 정보</div>
          <div className="text-[48px] font-semibold text-white">지리 정보 시스템</div>
          <div className="text-[18px] text-white">재배 작물, 토양, 면적, IoT 등 제주 농업 정보를 지도 위에서 확인할 수 있습니다.</div>
          <Link to="/gis" onClick={() => window.scrollTo({ top: 0 })}>
            <button className="mt-[16px] flex w-fit items-center gap-2 rounded-full border border-white px-4 py-2 text-white transition-all duration-200 hover:bg-white hover:text-[#003A8A] hover:shadow-lg">
              바로가기 <MoveUpRight className="h-[16px] w-[16px]" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GisSection;
