import { createFileRoute } from "@tanstack/react-router";
import ReturningToFarmByAge from "~/pages/statistics/farmhouse/ReturningToFarmByAge";

export const Route = createFileRoute("/bsc/_layout/frmhs/age-rtfrm")({
  component: RouteComponent,
});

// 연령별 귀농 가구 및 세대원
function RouteComponent() {
  return <ReturningToFarmByAge />;
}
