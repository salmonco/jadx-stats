import { createFileRoute } from "@tanstack/react-router";
import CurrentAssets from "~/pages/statistics/farmEconomy/CurrentAssets";

export const Route = createFileRoute("/bsc/_layout/ecnm/crast")({
  component: RouteComponent,
});

// 농가 유동자산
function RouteComponent() {
  return <CurrentAssets />;
}
