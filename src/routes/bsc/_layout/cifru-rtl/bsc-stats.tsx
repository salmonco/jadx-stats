import { createFileRoute } from "@tanstack/react-router";
import BasicStatistics from "~/pages/statistics/citrusFruitRetail/BasicStatistics";

export const Route = createFileRoute("/bsc/_layout/cifru-rtl/bsc-stats")({
  component: RouteComponent,
});

// 감귤기본통계
function RouteComponent() {
  return <BasicStatistics />;
}
