import { createFileRoute } from "@tanstack/react-router";
import OpenField from "~/pages/statistics/citrusFruitRetail/OpenField";

export const Route = createFileRoute("/bsc/_layout/cifru-rtl/opf-cifru")({
  component: RouteComponent,
});

// 노지감귤(온주) 재배 현황
function RouteComponent() {
  return <OpenField />;
}
