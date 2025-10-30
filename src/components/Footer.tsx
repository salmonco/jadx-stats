import logo from "~/assets/logo.png";

const Footer = () => {
  return (
    <div className="z-0 flex w-full items-center overflow-hidden border-t border-[#cecece] bg-[#F2F2F2] text-white">
      <div className="relative mx-auto flex h-full w-full max-w-[1300px] flex-col justify-center gap-7 px-16 py-10 2xl:max-w-[1400px] 3xl:max-w-[1600px] 4xl:max-w-[1900px]">
        <div className="flex items-center gap-2">
          <img src={logo} alt="제주농업통계시스템" className="h-[55px]" />
        </div>
        <hr className="border-t border-[#c6c6c6]" />
        <div className="flex flex-col gap-1 text-[16px] text-[#666666]">
          <div className="flex justify-between">
            <div className="leading-[1.6]">(63122) 제주특별자치도 제주시 선덕로 23</div>
            <div className="flex flex-wrap gap-4">
              <div className="cursor-pointer" onClick={() => window.open("https://agri.jeju.go.kr/agri/help/lastpolicy.htm", "_blank")}>
                개인정보처리방침
              </div>
              <span>|</span>
              <div className="cursor-pointer" onClick={() => window.open("https://www.jeju.go.kr/help/policy/clause.htm", "_blank")}>
                이용약관
              </div>
              <span>|</span>
              <div className="cursor-pointer" onClick={() => window.open("https://www.jeju.go.kr/help/policy/copyright.htm", "_blank")}>
                저작권보호정책
              </div>
              <span>|</span>
              <div className="cursor-pointer" onClick={() => window.open("https://www.jeju.go.kr/help/viewer.htm", "_blank")}>
                뷰어프로그램
              </div>
            </div>
          </div>
          <div className="">TEL : 064-760-7252</div>
          <div className="">COPYRIGHT © 2024 제주특별자치도 농업기술원. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
