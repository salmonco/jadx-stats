import { createFileRoute } from "@tanstack/react-router";
import AdultFruitTree from "~/pages/statistics/cultivationAreaAndYield/AdultFruitTree";

export const Route = createFileRoute("/bsc/_layout/cltvar-yield/adlfrt")({
  component: RouteComponent,
});

// 과실류 - 성과수
function RouteComponent() {
  return <AdultFruitTree />;
}
