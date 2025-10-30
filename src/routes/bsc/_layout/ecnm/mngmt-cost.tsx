import { createFileRoute } from "@tanstack/react-router";
import ManagementCost from "~/pages/statistics/farmEconomy/ManagementCost";

export const Route = createFileRoute("/bsc/_layout/ecnm/mngmt-cost")({
  component: RouteComponent,
});

// 농업 경영비
function RouteComponent() {
  return <ManagementCost />;
}
