import { createFileRoute } from "@tanstack/react-router";
import AgingStatus from "~/pages/visualization/production/AgingStatus";

export const Route = createFileRoute("/spc/_layout/prod/aging")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AgingStatus />;
}
