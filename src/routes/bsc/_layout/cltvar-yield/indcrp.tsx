import { createFileRoute } from "@tanstack/react-router";
import IndustrialCrops from "~/pages/statistics/cultivationAreaAndYield/IndustrialCrops";

export const Route = createFileRoute("/bsc/_layout/cltvar-yield/indcrp")({
  component: RouteComponent,
});

// 특용작물
function RouteComponent() {
  return <IndustrialCrops />;
}
