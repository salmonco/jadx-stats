import { createFileRoute } from "@tanstack/react-router";
import Utilization from "~/pages/statistics/farmland/Utilization";

export const Route = createFileRoute("/bsc/_layout/frmlnd/utztn")({
  component: RouteComponent,
});

// 경지이용
function RouteComponent() {
  return <Utilization />;
}
