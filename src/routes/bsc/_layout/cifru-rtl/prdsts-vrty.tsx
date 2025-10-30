import { createFileRoute } from "@tanstack/react-router";
import ProductionStatusByVariety from "~/pages/statistics/citrusFruitRetail/ProductionStatusByVariety";

export const Route = createFileRoute("/bsc/_layout/cifru-rtl/prdsts-vrty")({
  component: RouteComponent,
});

// 품종별 생산 현황
function RouteComponent() {
  return <ProductionStatusByVariety />;
}
