import { createFileRoute } from "@tanstack/react-router";
import PopulationByAge from "~/pages/statistics/farmhouse/PopulationByAge";

export const Route = createFileRoute("/bsc/_layout/frmhs/age-ppltn")({
  component: RouteComponent,
});

// 연령별 농가인구
function RouteComponent() {
  return <PopulationByAge />;
}
