import { createFileRoute, Outlet } from "@tanstack/react-router";
import SideMenu from "~/components/SideMenu";
import { menuItems } from "~/components/TopNavbar";

export const Route = createFileRoute("/bsc/_layout")({
  component: Layout,
});

function Layout() {
  const filteredMenuItems = menuItems.find((item) => item.key === "bsc")?.children || [];

  return (
    <div className="flex flex-1 overflow-hidden">
      <SideMenu menuItems={filteredMenuItems} />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
