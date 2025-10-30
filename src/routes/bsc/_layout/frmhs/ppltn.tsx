import { createFileRoute } from "@tanstack/react-router";
import Population from "~/pages/statistics/farmhouse/Population";

export const Route = createFileRoute("/bsc/_layout/frmhs/ppltn")({
  component: RouteComponent,
});

// 농가 및 농가인구
function RouteComponent() {
  return <Population />;
}
