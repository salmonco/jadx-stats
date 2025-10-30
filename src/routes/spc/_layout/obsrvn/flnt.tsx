import { createFileRoute } from "@tanstack/react-router";
import { MandarinFlowering } from "~/pages/visualization";

export const Route = createFileRoute("/spc/_layout/obsrvn/flnt")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MandarinFlowering />;
}
