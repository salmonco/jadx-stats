import { createFileRoute } from "@tanstack/react-router";
import Hibernation from "~/pages/statistics/citrusFruitRetail/Hibernation";

export const Route = createFileRoute("/bsc/_layout/cifru-rtl/hinat-cifru")({
  component: RouteComponent,
});

// 월동감귤(온주) 재배 현황
function RouteComponent() {
  return <Hibernation />;
}
