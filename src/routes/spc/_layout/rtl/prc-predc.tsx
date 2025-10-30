import { createFileRoute } from "@tanstack/react-router";
import { PricePrediction } from "~/pages/visualization";

export const Route = createFileRoute("/spc/_layout/rtl/prc-predc")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PricePrediction />;
}
