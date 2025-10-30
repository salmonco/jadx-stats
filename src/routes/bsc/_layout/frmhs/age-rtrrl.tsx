import { createFileRoute } from "@tanstack/react-router";
import ReturningToRuralByAge from "~/pages/statistics/farmhouse/ReturningToRuralByAge";

export const Route = createFileRoute("/bsc/_layout/frmhs/age-rtrrl")({
  component: RouteComponent,
});

// 연령별 귀촌 가구 및 세대원
function RouteComponent() {
  return <ReturningToRuralByAge />;
}
