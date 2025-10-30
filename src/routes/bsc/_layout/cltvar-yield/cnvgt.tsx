import { createFileRoute } from "@tanstack/react-router";
import CondimentVegetables from "~/pages/statistics/cultivationAreaAndYield/CondimentVegetables";

export const Route = createFileRoute("/bsc/_layout/cltvar-yield/cnvgt")({
  component: RouteComponent,
});

// 채소류 - 조미채소
function RouteComponent() {
  return <CondimentVegetables />;
}
