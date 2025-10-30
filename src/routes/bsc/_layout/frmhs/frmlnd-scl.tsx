import { createFileRoute } from "@tanstack/react-router";
import PopulationByFarmlandScale from "~/pages/statistics/farmhouse/PopulationByFarmlandScale";

export const Route = createFileRoute("/bsc/_layout/frmhs/frmlnd-scl")({
  component: RouteComponent,
});

// 경지규모별 농가
function RouteComponent() {
  return <PopulationByFarmlandScale />;
}
