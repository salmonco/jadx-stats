import { createFileRoute } from "@tanstack/react-router";
import FruitVegetable from "~/pages/statistics/cultivationAreaAndYield/FruitVegetables";

export const Route = createFileRoute("/bsc/_layout/cltvar-yield/frtvgt")({
  component: RouteComponent,
});

// 채소류 - 과채류
function RouteComponent() {
  return <FruitVegetable />;
}
