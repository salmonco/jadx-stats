import { createFileRoute } from "@tanstack/react-router";
import AdultAndImmatureFruitTree from "~/pages/statistics/cultivationAreaAndYield/AdultAndImmatureFruitTree";

export const Route = createFileRoute("/bsc/_layout/cltvar-yield/adlfrt-imtfrt")({
  component: RouteComponent,
});

// 과실류 - 성과수 + 미과수
function RouteComponent() {
  return <AdultAndImmatureFruitTree />;
}
