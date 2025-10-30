import { createFileRoute } from "@tanstack/react-router";
import Earnings from "~/pages/statistics/farmEconomy/Earnings";

export const Route = createFileRoute("/bsc/_layout/ecnm/earn")({
  component: RouteComponent,
});

// 농가소득
function RouteComponent() {
  return <Earnings />;
}
