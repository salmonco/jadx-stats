import { createFileRoute } from "@tanstack/react-router";
import Greenhouse from "~/pages/statistics/citrusFruitRetail/Greenhouse";

export const Route = createFileRoute("/bsc/_layout/cifru-rtl/house-cifru")({
  component: RouteComponent,
});

// 하우스감귤(온주) 재배 현황
function RouteComponent() {
  return <Greenhouse />;
}
