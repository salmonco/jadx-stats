import { createFileRoute } from "@tanstack/react-router";
import RootVegetables from "~/pages/statistics/cultivationAreaAndYield/RootVegetables";

export const Route = createFileRoute("/bsc/_layout/cltvar-yield/rtvgt")({
  component: RouteComponent,
});

// 채소류 - 근채류
function RouteComponent() {
  return <RootVegetables />;
}
