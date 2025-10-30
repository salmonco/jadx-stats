import { createFileRoute } from "@tanstack/react-router";
import { GarakPriceStatus } from "~/pages/visualization";

export const Route = createFileRoute("/spc/_layout/rtl/garak-prc")({
  component: RouteComponent,
});

function RouteComponent() {
  return <GarakPriceStatus />;
}
