import { Link, useLocation } from "@tanstack/react-router";
import { Menu } from "antd";
import { ChartLine, Map, MenuIcon, X } from "lucide-react";
import { useMemo, useState } from "react";
import { MenuItem } from "~/components/TopNavbar";

import { useAuth } from "~/contexts/AuthContext";
import { ADMIN_AUTH, PRIV_AUTH } from "~/utils/common";

interface Props {
  menuItems: MenuItem[];
}

const filterMenuByAuth = (items: MenuItem[], auth: string | null): MenuItem[] => {
  const privileged = !!auth && PRIV_AUTH.has(auth);
  const isAdmin = !!auth && ADMIN_AUTH.has(auth);

  // 권한 없을 때 숨길 자식 키 규칙 (부모 섹션 키별)
  const HIDE_CHILDREN_BY_PARENT: Record<string, Set<string>> = {
    // 특화통계 > 생산
    "prod": new Set(["rgn-cltvtn-harv"]), // 지역별 재배면적 및 수확현황
    "obsrvn": new Set(["qlty"]),
    // 특화통계 > 유통
    "rtl": new Set(["prc-predc", "prc-dsbrd", "garak-prc"]), // 가격예측/대시보드/가락시장
    // 특화통계 > 농업환경 (연도별 현황 외 5개 숨김)
    "agrclt-env": new Set(["wethr", "agrclt-dstdmg", "gwt-wtrqlty-chag", "gwt-anls-dsbrd", "item-dam-cs"]),
  };

  const clone = (n: MenuItem): MenuItem => ({
    ...n,
    children: n.children ? n.children.map(clone) : undefined,
  });

  const prune = (nodes: MenuItem[]): MenuItem[] => {
    return (
      nodes
        .map(clone)
        .map((node) => {
          // 먼저 재귀적으로 자식 필터링
          let children = node.children ? prune(node.children) : undefined;

          if (!isAdmin) {
            // 어디에 있든 gis는 관리자만 접근 가능 -> null 표시
            if (node.key === "gis") return null as unknown as MenuItem;
          }

          if (!privileged && !isAdmin) {
            // 섹션 키별로 자식 중 숨길 항목 제거
            const hideSet = HIDE_CHILDREN_BY_PARENT[node.key];
            if (hideSet && children?.length) {
              children = children.filter((c) => !hideSet.has(c.key));
            }
          }

          return { ...node, children };
        })
        // null(숨김) 제거
        .filter((n): n is MenuItem => !!n)
        // 자식이 없어진 섹션은 감춤
        .filter((n) => !n.children || n.children.length > 0)
    );
  };

  return prune(items);
};

const SideMenu = ({ menuItems }: Props) => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const fullKey = pathSegments.slice(2).join("/");
  const openKeys = pathSegments.slice(2, -1).map((_, i, arr) => arr.slice(0, i + 1).join("/"));
  const currentKey = pathSegments[1];
  const [collapsed, setCollapsed] = useState(false);

  const { auth } = useAuth();

  // URL에 따라 메뉴 타이틀 결정
  const getMenuTitle = () => {
    const secondSegment = pathSegments[1];
    if (secondSegment === "spc") return "특화통계";
    if (secondSegment === "bsc") return "일반통계";
    return "통계"; // 기본값
  };

  // URL에 따라 아이콘 결정
  const getMenuIcon = () => {
    const secondSegment = pathSegments[1];
    if (secondSegment === "spc") return <Map strokeWidth={2} size={20} />;
    if (secondSegment === "bsc") return <ChartLine strokeWidth={2} size={20} />;
    return <Map strokeWidth={2} size={22} />;
  };

  const visibleMenuItems = useMemo(() => filterMenuByAuth(menuItems, auth), [menuItems, auth]);

  const renderMenuItems = (items: MenuItem[], parentKey?: string) => {
    return items.map((item) => {
      const fullKey = parentKey ? `${parentKey}/${item.key}` : item.key;

      if (item.children && item.children.length > 0) {
        return (
          <Menu.SubMenu key={fullKey} title={item.label}>
            {renderMenuItems(item.children, fullKey)}
          </Menu.SubMenu>
        );
      }

      return (
        <Menu.Item key={fullKey} className="side-menu-item">
          <Link to={`/${currentKey}/${fullKey}`}>{item.label}</Link>
        </Menu.Item>
      );
    });
  };

  return (
    <div className="relative h-full">
      {!collapsed && (
        <div className="flex h-full min-h-full w-[215px] flex-col overflow-y-auto bg-white shadow-md">
          <div className="bg-white pl-[20px] pr-[18px] pt-[18px]">
            <div className="flex justify-between">
              <div className="flex items-center gap-[6px] text-[18px] font-semibold text-[#011E58]">
                {getMenuIcon()}
                {getMenuTitle()}
              </div>
              <button onClick={() => setCollapsed(true)} className="text-lg text-[#011E58]">
                <X strokeWidth={1.5} size={19} />
              </button>
            </div>
            <div className="mt-[12px] border-b-[1px] border-[#80899c]"></div>
          </div>
          <Menu className="flex flex-col text-[17px]" mode="inline" rootClassName="side-sub-menu" selectedKeys={[fullKey]} defaultOpenKeys={openKeys}>
            {/* {renderMenuItems(menuItems)} */}
            {renderMenuItems(visibleMenuItems)}
          </Menu>
        </div>
      )}
      {collapsed && (
        <button onClick={() => setCollapsed(false)} className="absolute left-[8px] top-[8px] z-10 rounded bg-white p-2 text-lg text-[#011E58] hover:bg-gray-100">
          <MenuIcon strokeWidth={1.5} size={22} />
        </button>
      )}
    </div>
  );
};

export default SideMenu;
