import { createFileRoute } from "@tanstack/react-router";
import LeafyVegetables from "~/pages/statistics/cultivationAreaAndYield/LeafyVegetables";

export const Route = createFileRoute("/bsc/_layout/cltvar-yield/lfyvgt")({
  component: RouteComponent,
});

// 채소류 - 엽채류
function RouteComponent() {
  return <LeafyVegetables />;
}
