import { createFileRoute } from "@tanstack/react-router";
import Liabilities from "~/pages/statistics/farmEconomy/Liabilities";

export const Route = createFileRoute("/bsc/_layout/ecnm/lblt")({
  component: RouteComponent,
});

// 농가 부채
function RouteComponent() {
  return <Liabilities />;
}
