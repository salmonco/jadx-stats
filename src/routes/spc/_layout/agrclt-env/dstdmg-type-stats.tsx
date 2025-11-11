import { createFileRoute } from "@tanstack/react-router";
import { DisasterTypeHistoryStats } from "~/pages/visualization";

export const Route = createFileRoute("/spc/_layout/agrclt-env/dstdmg-type-stats")({
  component: RouteComponent,
});

function RouteComponent() {
  return <DisasterTypeHistoryStats />;
}
