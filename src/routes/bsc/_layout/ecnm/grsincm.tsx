import { createFileRoute } from "@tanstack/react-router";
import GrossIncome from "~/pages/statistics/farmEconomy/GrossIncome";

export const Route = createFileRoute("/bsc/_layout/ecnm/grsincm")({
  component: RouteComponent,
});

// 농업 총(조) 수입
function RouteComponent() {
  return <GrossIncome />;
}
