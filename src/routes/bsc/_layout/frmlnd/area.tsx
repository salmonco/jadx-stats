import { createFileRoute } from "@tanstack/react-router";
import Area from "~/pages/statistics/farmland/Area";

export const Route = createFileRoute("/bsc/_layout/frmlnd/area")({
  component: RouteComponent,
});

// 경지면적
function RouteComponent() {
  return <Area />;
}
