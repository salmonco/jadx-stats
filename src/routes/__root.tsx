import { createRootRoute, Outlet } from "@tanstack/react-router";
import Footer from "~/components/Footer";
import TopNavbar from "~/components/TopNavbar";

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen w-full min-w-[1400px] flex-col">
      <TopNavbar />
      <div className="flex flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  ),
});
