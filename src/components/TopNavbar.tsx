import { Link, useNavigate } from "@tanstack/react-router";
import { Avatar, Button, Dropdown, type MenuProps } from "antd";
import { ChevronDown, LogIn, LogOut } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import logo from "~/assets/logo.png";
import menuImage from "~/assets/menu-dropdown-image.png";
import menuLogo from "~/assets/menu-logo.png";
import { useAuth } from "~/contexts/AuthContext";
import { ADMIN_AUTH, PRIV_AUTH } from "~/utils/common";

export interface MenuItem {
  label: string;
  key: string;
  parentKey?: string;
  children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    label: "데이터로 본 제주 농업",
    key: "jeju-agri",
    children: [
      { label: "농가인구", key: "농가인구" },
      { label: "농가경제", key: "농가경제" },
      { label: "경지이용", key: "경지이용" },
      { label: "감귤", key: "감귤" },
      { label: "생산요소", key: "생산요소" },
      { label: "농가경영", key: "농가경영" },
      { label: "농업생산", key: "농업생산" },
      { label: "토양", key: "토양" },
      { label: "식품", key: "식품" },
    ],
  },
  {
    label: "일반 통계",
    key: "bsc",
    children: [
      {
        label: "농가 및 농가인구",
        key: "frmhs",
        children: [
          { label: "농가 및 인구", key: "ppltn" },
          { label: "연령별 농가인구", key: "age-ppltn" },
          { label: "연령별 귀농/귀촌 가구 및 세대원", key: "age-rtfrm" },
          { label: "경지규모별 농가", key: "frmlnd-scl" },
        ],
      },
      {
        label: "경지 및 경지이용",
        key: "frmlnd",
        children: [
          { label: "경지면적", key: "area" },
          { label: "경지이용", key: "utztn" },
        ],
      },
      {
        label: "농업생산자재",
        key: "prdctn-mtrl",
        children: [
          { label: "농기계 보유 현황", key: "frmcn-hld" },
          { label: "농약, 비료 판매 현황", key: "agrchm-frtlzr-ntsl" },
        ],
      },
      {
        label: "작물 재배면적/생산량",
        key: "cltvar-yield",
        children: [
          { label: "식량작물-정곡", key: "mldgrn" },
          { label: "식량작물-맥류(정곡)", key: "whtbrl-mldgrn" },
          { label: "식량작물-맥류(조곡)", key: "whtbrl-rghgrn" },
          { label: "식량작물-잡곡", key: "miscgrn" },
          { label: "식량작물-두류", key: "pls" },
          { label: "식량작물-서류", key: "rtcrp" },
          { label: "채소류-과채류", key: "frtvgt" },
          { label: "채소류-엽채류", key: "lfyvgt" },
          { label: "채소류-근채류", key: "rtvgt" },
          { label: "채소류-조미채소", key: "cnvgt" },
          { label: "특용작물", key: "indcrp" },
          { label: "과실류-성과수+미과수", key: "adlfrt-imtfrt" },
          { label: "과실류-성과수", key: "adlfrt" },
        ],
      },
      {
        label: "농가경제",
        key: "ecnm",
        children: [
          // { label: "농가경제 주요지표", key: "key-idct" },
          { label: "농업 총(조) 수입", key: "grsincm" },
          { label: "농업 경영비", key: "mngmt-cost" },
          { label: "농가소득", key: "earn" },
          { label: "농가부채", key: "lblt" },
          { label: "농가자산", key: "ast" },
          // { label: "농가 유동자산", key: "crast" },
          { label: "농업 생산성지표", key: "prdtv-idct" },
          { label: "농가 노동투하량", key: "lbrinp" },
        ],
      },
    ],
  },
  {
    label: "특화 통계",
    key: "spc",
    children: [
      {
        label: "생산",
        key: "prod",
        children: [
          { label: "고령화 통계", key: "aging" },
          { label: "감귤 재배정보", key: "rgn-cifru-cltvtn" },
          { label: "월동채소 재배면적 변화", key: "cltvar-chag" },
          { label: "작물 재배지도", key: "crop-cltvtn-map" },
          { label: "지역별 재배면적 및 수확현황", key: "rgn-cltvtn-harv" },
        ],
      },
      {
        label: "관측",
        key: "obsrvn",
        children: [
          { label: "감귤 수령분포", key: "cifru-trage-dist" },
          { label: "감귤 개화기", key: "flnt" },
          { label: "감귤 관측조사", key: "obsrvn-info-cmp" },
          { label: "감귤 품질분석 결과 조회", key: "qlty" },
        ],
      },
      {
        label: "농업환경",
        key: "agrclt-env",
        children: [
          { label: "노지감귤 생육과 기상 변수 연계 분석", key: "wethr" },
          { label: "농업재해 발생정보", key: "agrclt-dstdmg" },
          { label: "지하수 관정별 수질변화", key: "gwt-wtrqlty-chag" },
          { label: "관정별 지하수 분석 대시보드", key: "gwt-anls-dsbrd" },
          { label: "제주 품목별 피해액 및 피해원인", key: "item-dam-cs" },
          { label: "농업재해 연도별 현황", key: "yrly-agrclt-dstdmg" },
          { label: "농업재해 유형별 과거통계", key: "dstdmg-type-stats" },
        ],
      },
      {
        label: "유통",
        key: "rtl",
        children: [
          { label: "도매시장 출하 점유율", key: "whlsl-mrkt-share" },
          { label: "주요품목 도매시장 거래정보", key: "crop-trade" },
          { label: "제주 감귤 연도별, 국가별 수출정보", key: "exp" },
          { label: "가격 예측", key: "prc-predc" },
          { label: "가격 대시보드", key: "prc-dsbrd" },
          { label: "가락시장 농산물 가격 현황", key: "garak-prc" },
        ],
      },
    ],
  },
  { label: "지리 정보 시스템", key: "gis" },
];

// 임시 권한 기반 메뉴 노출 제어
// auth "농협" 또는 "수급관리센터"일 때만 특정 메뉴 노출
const filterMenuByAuth = (items: MenuItem[], auth: string | null): MenuItem[] => {
  const privileged = !!auth && PRIV_AUTH.has(auth);
  const isAdmin = !!auth && ADMIN_AUTH.has(auth);

  console.log(privileged, isAdmin);

  // 깊은 복사 (children 포함)
  const deepClone = (it: MenuItem): MenuItem => ({
    ...it,
    children: it.children ? it.children.map(deepClone) : undefined,
  });
  let cloned = items.map(deepClone);

  if (isAdmin) return cloned;

  // 비권한 사용자의 경우 특정 항목 숨기기
  if (!privileged) {
    cloned = cloned.map((top) => {
      if (top.key === "spc" && top.children) {
        top = { ...top };
        top.children = top.children.map((sec) => {
          if (!sec.children) return sec;

          // // 특화통계 > 생산 > 감귤 재배정보만 숨기기
          // if (sec.key === "prod") {
          //   const hideProd = new Set(["rgn-cifru-cltvtn"]);
          //   return {
          //     ...sec,
          //     children: sec.children.filter((c) => !hideProd.has(c.key)),
          //   };
          // }

          if (sec.key === "obsrvn") {
            const hideObsrvn = new Set(["qlty", "obsrvn-info-cmp"]);
            return {
              ...sec,
              children: sec.children.filter((c) => !hideObsrvn.has(c.key)),
            };
          }

          // 특화통계 > 유통 > 가격예측/가격대시보드/가락시장
          if (sec.key === "rtl") {
            const hideRtl = new Set(["prc-predc", "prc-dsbrd", "garak-prc"]);
            return {
              ...sec,
              children: sec.children.filter((c) => !hideRtl.has(c.key)),
            };
          }

          // 특화통계 > 농업환경 > 농업재해 연도별 현황만 숨기기
          if (sec.key === "agrclt-env") {
            const hideAgrcltEnv = new Set(["yrly-agrclt-dstdmg"]);
            return {
              ...sec,
              children: sec.children.filter((c) => !hideAgrcltEnv.has(c.key)),
            };
          }

          return sec;
        });
      }
      return top;
    });
  }

  // 지리 정보 시스템 - 관리자만 접근 가능
  cloned = cloned.filter((top) => top.key !== "gis");

  return cloned;
};

export default function TopNavbar() {
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  // const hoveredMenu = menuItems.find((m) => m.key === hoverKey);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  const { user, auth, logout } = useAuth();

  const visibleMenus = useMemo(() => filterMenuByAuth(menuItems, auth), [auth]);

  const hoveredMenu = useMemo(() => visibleMenus.find((m) => m.key === hoverKey) ?? null, [visibleMenus, hoverKey]);

  useEffect(() => {
    if (hoveredMenu?.children?.length) {
      setSelectedMenu(hoveredMenu.children[0].key);
    }
  }, [hoveredMenu]);

  const handleLoginClick = () => {
    setHoverKey(null);
    navigate({
      to: "/login",
      // 타입 안전성을 위해선 라우트의 search 스키마를 정의하면 좋지만,
      // 지금은 간단히 무시
    });
  };

  const handleLogoutClick = () => {
    setHoverKey(null);
    logout();
    // 보호 라우트였다면 자동으로 /login으로 튕기겠지만, 홈으로 보내도 OK
    navigate({ to: "/" });
  };

  return (
    <div className="relative z-[999] w-full bg-white shadow-md" onMouseLeave={() => setHoverKey(null)}>
      <div className="mx-auto flex h-[75px] w-full max-w-[1300px] items-center justify-between px-16 2xl:max-w-[1400px] 3xl:max-w-[1600px] 4xl:max-w-[1900px]">
        {/* 로고 */}
        <div className="flex w-[210px] items-center">
          <Link to="/">
            <img src={logo} alt="JASIS" className="h-[43px]" />
          </Link>
        </div>

        {/* 중앙 메뉴 */}
        <div className="flex h-full items-center gap-5 text-[20px]">
          {/* {menuItems.map((menu) => ( */}
          {visibleMenus.map((menu) => (
            <div
              key={menu.key}
              onMouseEnter={() => menu.children && setHoverKey(menu.key)}
              className="relative cursor-pointer px-4 py-2 font-medium hover:font-semibold hover:text-blue-900"
            >
              {menu.children ? (
                menu.label
              ) : (
                <Link to={`/${menu.key}`} onClick={() => setHoverKey(null)}>
                  {menu.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* 우측 (빈 영역) */}
        {/* <div className="flex w-[210px] justify-end px-10"></div> */}

        {/* 우측 영역: 로그인/로그아웃 */}
        <div className="flex w-[210px] items-center justify-end px-10">
          {!auth ? (
            <Button type="primary" size="middle" onClick={handleLoginClick} className="flex h-9 items-center rounded-full px-4" icon={<LogIn size={16} />}>
              로그인
            </Button>
          ) : (
            <Dropdown
              trigger={["click"]}
              menu={{
                onClick: ({ key }) => {
                  if (key === "logout") handleLogoutClick();
                },
                items: [
                  {
                    key: "logout",
                    icon: <LogOut size={14} />,
                    label: "로그아웃",
                  },
                ] as MenuProps["items"],
              }}
            >
              <button
                className="group flex items-center gap-3 rounded-full border border-[#e5e7eb] bg-white px-3 py-1.5 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900"
                onClick={(e) => e.preventDefault()}
              >
                <Avatar size={28} style={{ background: "#37445E" }}>
                  {(user?.name?.[0] ?? "U").toUpperCase()}
                </Avatar>
                <div className="hidden max-w-[110px] flex-col items-start text-left leading-tight md:flex">
                  <span className="truncate text-[13px] font-medium text-gray-900">{user?.name ?? "사용자"}</span>
                  <span className="truncate text-[12px] text-gray-500">{auth}</span>
                </div>
                <ChevronDown className="size-4 text-gray-400 group-hover:text-gray-600" />
              </button>
            </Dropdown>
          )}
        </div>
      </div>

      {/* 드롭다운 메뉴 */}
      {hoverKey && hoveredMenu?.children && (
        <div className="absolute left-0 top-full w-full border-t bg-white shadow-xl">
          <div className="mx-auto flex max-w-[1300px] gap-10 px-16 py-10 2xl:max-w-[1400px] 3xl:max-w-[1600px] 4xl:max-w-[1900px]">
            {/* 좌측 이미지 */}
            <div
              className="flex h-[240px] w-[400px] flex-shrink-0 items-center justify-center gap-10 rounded-xl bg-cover bg-center 3xl:h-[280px] 3xl:w-[520px]"
              style={{ backgroundImage: `url(${menuImage})` }}
              onClick={() => setHoverKey(null)}
            >
              <div className="flex h-full flex-col items-center justify-center gap-5 pt-8">
                <img src={menuLogo} alt="logo" className="h-[50px]" />
                <p className="text-[18px] font-semibold text-white">위대한 도민 시대, 사람과 자연이 행복한 제주</p>
              </div>
            </div>

            {/* 중앙 탭 버튼 영역 */}
            <div className="my-1 flex flex-col gap-4">
              <div className="flex flex-wrap gap-3">
                {hoveredMenu.children.map((section) =>
                  hoveredMenu.key === "jeju-agri" ? (
                    <button
                      key={section.key}
                      onClick={() => {
                        setHoverKey(null);
                        navigate({
                          to: "/jeju-agri",
                          // @ts-ignore
                          search: { category: section.key },
                        });
                      }}
                      className={`min-w-[120px] rounded-lg border border-[#aeaeae] px-4 py-2 text-[18px] text-[#606060] hover:bg-blue-900 hover:text-white`}
                    >
                      {section.label}
                    </button>
                  ) : (
                    <button
                      key={section.key}
                      onClick={() => setSelectedMenu(section.key)}
                      className={`min-w-[120px] rounded-lg border px-4 py-2 text-[18px] ${
                        selectedMenu === section.key
                          ? "bg-blue-900 font-medium text-white"
                          : "border-[#aeaeae] bg-white text-[#606060] hover:border-blue-900 hover:text-blue-900"
                      }`}
                    >
                      {section.label}
                    </button>
                  )
                )}
              </div>

              {/* 선택된 탭의 2뎁스 메뉴 */}
              <div className="mt-5 flex flex-wrap gap-4 text-[18px] text-[#606060]">
                {hoveredMenu.children
                  .find((section) => section.key === selectedMenu)
                  ?.children?.map((item) => (
                    <Link key={item.key} to={`/${hoveredMenu.key}/${selectedMenu}/${item.key}`} onClick={() => setHoverKey(null)} className="hover:text-blue-900">
                      · {item.label}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
