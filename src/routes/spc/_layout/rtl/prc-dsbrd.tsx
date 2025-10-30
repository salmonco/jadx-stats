import { createFileRoute } from "@tanstack/react-router";
import { PriceDashboard } from "~/pages/visualization";

export const Route = createFileRoute("/spc/_layout/rtl/prc-dsbrd")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PriceDashboard />;
}
