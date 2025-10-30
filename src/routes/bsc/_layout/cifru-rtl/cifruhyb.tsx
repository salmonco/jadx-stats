import { createFileRoute } from "@tanstack/react-router";
import Hybrid from "~/pages/statistics/citrusFruitRetail/Hybrid";

export const Route = createFileRoute("/bsc/_layout/cifru-rtl/cifruhyb")({
  component: RouteComponent,
});

// 만감류 재배 현황
function RouteComponent() {
  return <Hybrid />;
}
