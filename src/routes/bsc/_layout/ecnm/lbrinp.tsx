import { createFileRoute } from "@tanstack/react-router";
import LaborInput from "~/pages/statistics/farmEconomy/LaborInput";

export const Route = createFileRoute("/bsc/_layout/ecnm/lbrinp")({
  component: RouteComponent,
});

// 농가 노동투하량
function RouteComponent() {
  return <LaborInput />;
}
