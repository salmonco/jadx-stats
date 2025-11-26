import { createFileRoute, Outlet } from "@tanstack/react-router";
import SideMenu from "~/components/SideMenu";
import { menuItems } from "~/components/TopNavbar";

export const Route = createFileRoute("/spc/_layout")({
  component: Layout,
});

const SECTION_KEY = "spc";

function Layout() {
  const filteredMenuItems = menuItems.find((item) => item.key === SECTION_KEY)?.children || [];

  return (
    <div className="flex flex-1">
      <SideMenu menuItems={filteredMenuItems} sectionKey={SECTION_KEY} />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
